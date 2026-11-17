# Pulls the newest unmerged origin/pack-* (or origin/claude/pack-*, from cloud sessions) branch, tests it, rebuilds the compendium when needed and notifies.
# When the pack branch it is on has been merged (and no newer pack waits), it goes back to main the same way.
# When changed files stop it, it says so once with a notification (until the list changes).
# Run it by double-clicking "Update Foundry.cmd" in the project folder (-Interactive: a window shows each step and waits for Foundry
# to be closed), or from Task Scheduler (tools/register-sync-task.ps1, optional). No Claude involved.
#   powershell -File tools\sync-pack.ps1 -Interactive  what the .cmd runs
#   powershell -File tools\sync-pack.ps1 -DryRun       show what it would do now, change nothing (no log, no state)
#   powershell -File tools\sync-pack.ps1 -TestNotify   only show a test notification
param([switch]$DryRun, [switch]$TestNotify, [switch]$Interactive)

$ErrorActionPreference = "Continue"
$Repo = "D:\Minha Pasta\RPG\2d12-project"
$FoundryProcess = "Foundry Virtual Tabletop"
# (2026-11-11, Lucas) Foundry is started when the window's update is done. Empty: found by itself (Program Files, then the Start Menu's shortcut).
# If it isn't found, write the full path of "Foundry Virtual Tabletop.exe" here.
$FoundryExe = ""
$LogFile = Join-Path $Repo "sync.log"
$StateFile = Join-Path $Repo ".sync-state"
$SummaryFile = Join-Path $Repo "pack-sync\latest.md"

function Log($msg) {
    $line = "{0}  {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $msg
    if ($DryRun) { Write-Host $line } else { Add-Content -Path $LogFile -Value $line -Encoding UTF8 }
    if ($Interactive) { Write-Host $msg }
}

# In the window (-Interactive): Foundry must be closed before anything changes; wait for Lucas to close it.
function WaitForFoundryClosed {
    while (Get-Process -Name $FoundryProcess -ErrorAction SilentlyContinue) {
        Write-Host ""
        Write-Host "Foundry is running. Close it (the packs can't be rebuilt while it is open), then press Enter." -ForegroundColor Yellow
        [void](Read-Host)
    }
}

# (2026-11-11, Lucas: "open Foundry automatically after updating") Only from the window (-Interactive), never from the scheduled task.
# Already running: nothing is started (the message above says to reload). Not found: says where to write its path.
function StartFoundry {
    if (-not $Interactive -or $DryRun) { return }
    if (Get-Process -Name $FoundryProcess -ErrorAction SilentlyContinue) { Write-Host ""; Write-Host "Foundry is already open: reload it (F5)." -ForegroundColor Cyan; return }
    $candidates = @($FoundryExe,
        (Join-Path $env:ProgramFiles "Foundry Virtual Tabletop\Foundry Virtual Tabletop.exe"),
        (Join-Path $env:LOCALAPPDATA "Programs\Foundry Virtual Tabletop\Foundry Virtual Tabletop.exe"),
        (Join-Path $env:LOCALAPPDATA "Programs\foundryvtt\Foundry Virtual Tabletop.exe"))
    if (${env:ProgramFiles(x86)}) { $candidates += (Join-Path ${env:ProgramFiles(x86)} "Foundry Virtual Tabletop\Foundry Virtual Tabletop.exe") }
    $target = $candidates | Where-Object { $_ -and (Test-Path $_) } | Select-Object -First 1
    if (-not $target) {
        $menus = @((Join-Path $env:APPDATA "Microsoft\Windows\Start Menu\Programs"), (Join-Path $env:ProgramData "Microsoft\Windows\Start Menu\Programs"))
        $target = Get-ChildItem -Path $menus -Filter "Foundry*.lnk" -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1 -ExpandProperty FullName
    }
    if (-not $target) {
        Log "Foundry was not found: not started"
        Write-Host ""; Write-Host "Foundry wasn't found, so it wasn't started. Write its path in tools\sync-pack.ps1 (the line `$FoundryExe = `"`")." -ForegroundColor Yellow
        return
    }
    try { Start-Process -FilePath $target -ErrorAction Stop; Log "started Foundry ($target)"; Write-Host ""; Write-Host "Starting Foundry..." -ForegroundColor Cyan }
    catch { Log "Foundry could not be started: $($_.Exception.Message)"; Write-Host "Foundry could not be started: $($_.Exception.Message)" -ForegroundColor Yellow }
}

function Notify($title, $message) {
    if ($DryRun) { Log "(dry run) would notify: $title - $message"; return }
    if ($Interactive) { Write-Host ""; Write-Host "${title}: $message" -ForegroundColor Cyan; return }
    $t = [Security.SecurityElement]::Escape($title)
    $m = [Security.SecurityElement]::Escape($message)
    try {
        [void][Windows.UI.Notifications.ToastNotificationManager, Windows.UI.Notifications, ContentType = WindowsRuntime]
        [void][Windows.Data.Xml.Dom.XmlDocument, Windows.Data.Xml.Dom.XmlDocument, ContentType = WindowsRuntime]
        $xml = New-Object Windows.Data.Xml.Dom.XmlDocument
        $xml.LoadXml("<toast><visual><binding template='ToastGeneric'><text>$t</text><text>$m</text></binding></visual></toast>")
        $appId = '{1AC14E77-02E7-4E5D-B744-2EB1AE5198B7}\WindowsPowerShell\v1.0\powershell.exe'
        [Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier($appId).Show([Windows.UI.Notifications.ToastNotification]::new($xml))
        Log "notified (toast): $title - $message"
        return
    } catch { Log "toast failed: $($_.Exception.Message)" }
    try {
        Add-Type -AssemblyName System.Windows.Forms, System.Drawing
        $icon = New-Object System.Windows.Forms.NotifyIcon
        $icon.Icon = [System.Drawing.SystemIcons]::Information
        $icon.Visible = $true
        $icon.ShowBalloonTip(10000, $title, $message, [System.Windows.Forms.ToolTipIcon]::Info)
        Start-Sleep -Seconds 6
        $icon.Dispose()
        Log "notified (balloon): $title - $message"
    } catch { Log "NO NOTIFICATION METHOD WORKED ($($_.Exception.Message)); only logged: $title - $message" }
}

function G {
    $out = & git @args 2>&1 | ForEach-Object { "$_" }
    $script:GitExit = $LASTEXITCODE
    $out
}

function Run($label, [scriptblock]$cmd) {
    $out = & $cmd 2>&1 | ForEach-Object { "$_" }
    $script:RunExit = $LASTEXITCODE
    if ($script:RunExit -ne 0) { Log "$label failed (exit $script:RunExit): $(($out | Select-Object -Last 8) -join ' | ')" }
    $out
}

function SaveState($h) { if (-not $DryRun) { $h | ConvertTo-Json | Set-Content $StateFile -Encoding UTF8 } }

# The tests and (when asked) the compendium packs; returns @{ ok; summary; build }.
function TestAndBuild([bool]$needBuild) {
    $sysDir = Join-Path $Repo "foundry\twod12"
    Set-Location $sysDir
    $tests = Run "tests" { node tools/tests/run.mjs }
    $ok = ($script:RunExit -eq 0)
    $lines = @($tests | Where-Object { $_ -match "^(FAIL|CHANGED)" -or $_ -match "^\d+ tests:" })
    Log "tests: $(($tests | Select-Object -Last 1))"
    $build = "not needed (content.mjs and system.json unchanged)"
    if ($needBuild) {
        Set-Location (Join-Path $Repo "foundry")
        if (-not (Test-Path "node_modules\@foundryvtt\foundryvtt-cli")) { [void](Run "npm install" { npm install @foundryvtt/foundryvtt-cli }) }
        [void](Run "build-packs" { node twod12/tools/build-packs.mjs })
        $build = if ($script:RunExit -eq 0) { "rebuilt" } else { "FAILED (see sync.log)" }
        Log "compendium packs: $build"
    }
    Set-Location $Repo
    @{ ok = $ok; summary = $(if ($lines.Count) { $lines -join "`n" } else { "no test output" }); build = $build }
}

if ($TestNotify) { Notify "2d12 sync test" "If you see this, notifications work."; exit 0 }

Set-Location $Repo
if ($DryRun) { Log "DRY RUN: nothing will be checked out, built, written or notified (git fetch still updates remote refs)" } else { Log "run started$(if ($Interactive) { ' (Update Foundry.cmd)' })" }

$state = if (Test-Path $StateFile) { Get-Content $StateFile -Raw | ConvertFrom-Json } else { $null }

# 2. uncommitted changes other than notes.txt (and the sync's own files, which a pack branch does not gitignore)
$dirty = @(G status --porcelain | Where-Object { $_ -and $_.Substring(3).Trim('"') -notmatch '^(notes\.txt|sync\.log|\.sync-state|pack-sync/)$' })
if ($dirty.Count) {
    Log "uncommitted changes besides notes.txt, stopping: $($dirty -join '; ')"
    $list = ($dirty | ForEach-Object { $_.Substring(3).Trim('"') }) -join ", "
    if ($Interactive -or -not $state -or $state.dirtyNote -ne $list) {   # once per list of files (from Task Scheduler), always in the window
        Notify "2d12 sync stopped" "Changed files in the project folder: $list. Run 'git stash' there (or commit them) and the sync goes on."
        SaveState @{ branch = $(if ($state) { $state.branch } else { "" }); hash = $(if ($state) { $state.hash } else { "" }); waitingHash = $(if ($state) { $state.waitingHash } else { "" }); dirtyNote = $list }
    }
    exit 0
}

# 3. newest unmerged pack branch that differs from the saved one
[void](G fetch origin --prune)
if ($GitExit -ne 0) { Log "git fetch failed, stopping"; exit 1 }
$pick = $null
foreach ($line in (G for-each-ref --sort=-committerdate "--format=%(refname:short) %(objectname)" "refs/remotes/origin/pack-*" "refs/remotes/origin/claude/pack-*")) {   # cloud sessions push claude/pack-...
    $ref, $hash = $line -split " "
    [void](G merge-base --is-ancestor $ref origin/main)
    if ($GitExit -eq 0) { continue }                       # already merged into main
    if (-not $Interactive -and $state -and $state.hash -eq $hash) { continue }    # already synced (the window always takes the newest pack)
    $pick = @{ ref = $ref; branch = $ref -replace "^origin/", ""; hash = $hash }
    break
}
if (-not $pick) {
    # 3b. back to main: the repo is on a pack branch that was merged (or deleted on GitHub), and no newer pack waits.
    $cur = @(G branch --show-current)[0]
    $merged = $false
    if ($cur -like "pack-*" -or $cur -like "claude/pack-*") {
        [void](G rev-parse --verify --quiet "refs/remotes/origin/$cur")
        if ($GitExit -ne 0) { $merged = $true } else { [void](G merge-base --is-ancestor "origin/$cur" origin/main); $merged = ($GitExit -eq 0) }
    }
    # 3c (2026-11-06): on main already, and main moved on GitHub (a pack merged from a cloud session) or this commit of main was never
    # synced here (the state file says so): pull, test and rebuild like a pack. Before this, the window said "Already up to date" on an old main.
    $mainHash = @(G rev-parse origin/main)[0]
    $mainAhead = $false
    if ($cur -eq "main") { $mainAhead = ((@(G rev-parse HEAD)[0] -ne $mainHash) -or (-not $state) -or ($state.hash -ne $mainHash)) }
    if (-not $merged -and -not $mainAhead) {
        if ($DryRun) { Log "nothing to sync (no new unmerged origin/pack-* or origin/claude/pack-* branch; on $cur)" }
        if ($Interactive) { Notify "Already up to date" "on $cur, v$((Get-Content (Join-Path $Repo 'foundry\twod12\system.json') -Raw | ConvertFrom-Json).version); no newer pack branch" }
        StartFoundry
        exit 0
    }
    if ($Interactive) { WaitForFoundryClosed }
    if (Get-Process -Name $FoundryProcess -ErrorAction SilentlyContinue) {
        if (-not ($state -and $state.waitingHash -eq "main:$mainHash")) {
            Notify "2d12 sync" "$cur was merged: close Foundry to go back to main"
            SaveState @{ branch = $(if ($state) { $state.branch } else { "" }); hash = $(if ($state) { $state.hash } else { "" }); waitingHash = "main:$mainHash" }
        }
        exit 0
    }
    $before = @(G rev-parse HEAD)[0]
    $changedMain = @(G diff --name-only $before origin/main)
    $needMain = ($changedMain -contains "foundry/twod12/tools/content.mjs") -or ($changedMain -contains "foundry/twod12/system.json") -or -not (Test-Path (Join-Path $Repo "foundry\twod12\packs\actions")) -or (-not $state) -or ($state.hash -ne $mainHash)   # never built this main here: rebuild
    $why = if ($mainAhead) { "main moved on GitHub" } else { "$cur was merged" }
    if ($DryRun) { Log "would: go back to main ($why), git pull --ff-only, test, $(if ($needMain) { 'REBUILD' } else { 'NOT rebuild' }) the packs, notify"; exit 0 }
    [void](G checkout main)
    if ($GitExit -ne 0) { Log "checkout of main failed, stopping"; exit 1 }
    [void](G pull --ff-only)
    if ($GitExit -ne 0) { Log "git pull of main failed, stopping"; exit 1 }
    Log "back on main @ $((G rev-parse --short HEAD)) ($why)"
    $r = TestAndBuild $needMain
    $v = (Get-Content (Join-Path $Repo "foundry\twod12\system.json") -Raw | ConvertFrom-Json).version
    SaveState @{ branch = "main"; hash = $mainHash; waitingHash = "" }
    $msg = "Back on main v$v (packs: $($r.build)): $(if ($needMain) { 'restart Foundry' } else { 'reload Foundry (F5)' })"
    if (-not $r.ok) { $msg += " (tests FAILED, see sync.log)" }
    Notify "2d12 sync" $msg
    Log "done"
    StartFoundry
    exit 0
}
$branch = $pick.branch
Log "candidate: $branch @ $($pick.hash.Substring(0, 7))"
# Up to date only when the last sync built this commit: a Claude Code session that commits in this checkout puts HEAD on the pack
# without testing or rebuilding the compendium (2026-11-04: pack-r-core's packs stayed v0.0.232).
if ($Interactive -and (@(G rev-parse HEAD)[0] -eq $pick.hash) -and $state -and $state.hash -eq $pick.hash -and (Test-Path (Join-Path $Repo "foundry\twod12\packs\actions"))) {
    Notify "Already up to date" "on $branch, v$((Get-Content (Join-Path $Repo 'foundry\twod12\system.json') -Raw | ConvertFrom-Json).version)"
    StartFoundry
    exit 0
}
if ($Interactive) { WaitForFoundryClosed }

# 4. Foundry running?
if (Get-Process -Name $FoundryProcess -ErrorAction SilentlyContinue) {
    if ($state -and $state.waitingHash -eq $pick.hash) { Log "Foundry is running; already notified for this pack, waiting" }
    else {
        Notify "2d12 sync" "New pack $branch is ready: close Foundry to sync"
        if (-not $DryRun) {
            $keep = @{ branch = ""; hash = ""; waitingHash = $pick.hash }
            if ($state) { $keep.branch = $state.branch; $keep.hash = $state.hash }
            $keep | ConvertTo-Json | Set-Content $StateFile -Encoding UTF8
        }
    }
    exit 0
}

# 5. sync, test, rebuild
$changed = @(G diff --name-only "origin/main...$($pick.ref)")
$needBuild = ($changed -contains "foundry/twod12/tools/content.mjs") -or ($changed -contains "foundry/twod12/system.json") -or -not (Test-Path (Join-Path $Repo "foundry\twod12\packs\actions"))
if ($DryRun) {
    Log "would: git checkout -B $branch origin/$branch; git pull --ff-only; node tools/tests/run.mjs in foundry/twod12"
    Log "would $(if ($needBuild) { 'REBUILD' } else { 'NOT rebuild' }) the compendium packs (content.mjs/system.json changed vs main: $needBuild)"
    Log "would write pack-sync/latest.md, save .sync-state and notify '$branch v<version> is ready: reload Foundry and test'"
    exit 0
}

[void](G checkout -B $branch "origin/$branch")
if ($GitExit -ne 0) { Log "checkout of $branch failed, stopping"; exit 1 }
[void](G pull --ff-only)
if ($GitExit -ne 0) { Log "git pull failed, stopping"; exit 1 }
Log "on $branch @ $((G rev-parse --short HEAD))"

$r = TestAndBuild $needBuild
$testsOk = $r.ok; $testSummary = $r.summary; $buildNote = $r.build
$sysDir = Join-Path $Repo "foundry\twod12"

# 6. summary, state, notification
$sys = Get-Content (Join-Path $sysDir "system.json") -Raw | ConvertFrom-Json
$version = $sys.version
$ref = Get-Content (Join-Path $sysDir "docs\reference.md") -Encoding UTF8
$i = [array]::IndexOf($ref, "## Changelog")
$entry = if ($i -ge 0) { ($ref[($i + 1)..($ref.Count - 1)] | Where-Object { $_ -match "^- \*\*v" } | Select-Object -First 1) } else { $null }
if (-not $entry) { $entry = "(no changelog entry found in docs/reference.md)" }

New-Item -ItemType Directory -Force (Split-Path $SummaryFile) | Out-Null
@"
# Pack ready: $branch

- **Branch:** $branch ($((G rev-parse --short HEAD)))
- **Version:** v$version
- **Synced:** $(Get-Date -Format "yyyy-MM-dd HH:mm")
- **Compendium packs:** $buildNote

## Tests
$(if ($testsOk) { "Passed." } else { "FAILED." })
``````
$testSummary
``````

## Newest changelog entry (the checklist)
$entry
"@ | Set-Content $SummaryFile -Encoding UTF8

@{ branch = $branch; hash = $pick.hash; waitingHash = "" } | ConvertTo-Json | Set-Content $StateFile -Encoding UTF8
Log "wrote pack-sync\latest.md and .sync-state"
if ($Interactive) { Write-Host ""; Write-Host "What this version changed (test it with this):" -ForegroundColor Cyan; Write-Host $entry }
$msg = "$branch v$version is ready: $(if ($needBuild) { 'start Foundry (the packs were rebuilt)' } else { 'reload Foundry (F5)' }) and test"
if (-not $testsOk) { $msg += " (tests FAILED, see pack-sync\latest.md)" }
Notify "2d12 sync" $msg
Log "done"
StartFoundry
