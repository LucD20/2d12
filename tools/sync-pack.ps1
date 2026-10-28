# Pulls the newest unmerged origin/pack-* branch, tests it, rebuilds the compendium when needed and notifies.
# Runs from Task Scheduler (see tools/register-sync-task.ps1). No Claude involved.
#   powershell -File tools\sync-pack.ps1 -DryRun      show what it would do now, change nothing (no log, no state)
#   powershell -File tools\sync-pack.ps1 -TestNotify  only show a test notification
param([switch]$DryRun, [switch]$TestNotify)

$ErrorActionPreference = "Continue"
$Repo = "D:\Minha Pasta\RPG\2d12-project"
$FoundryProcess = "Foundry Virtual Tabletop"
$LogFile = Join-Path $Repo "sync.log"
$StateFile = Join-Path $Repo ".sync-state"
$SummaryFile = Join-Path $Repo "pack-sync\latest.md"

function Log($msg) {
    $line = "{0}  {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $msg
    if ($DryRun) { Write-Host $line } else { Add-Content -Path $LogFile -Value $line -Encoding UTF8 }
}

function Notify($title, $message) {
    if ($DryRun) { Log "(dry run) would notify: $title - $message"; return }
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

if ($TestNotify) { Notify "2d12 sync test" "If you see this, notifications work."; exit 0 }

Set-Location $Repo
if ($DryRun) { Log "DRY RUN: nothing will be checked out, built, written or notified (git fetch still updates remote refs)" } else { Log "run started" }

# 2. uncommitted changes other than notes.txt (and the sync's own files, which a pack branch does not gitignore)
$dirty = @(G status --porcelain | Where-Object { $_ -and $_.Substring(3).Trim('"') -notmatch '^(notes\.txt|sync\.log|\.sync-state|pack-sync/)$' })
if ($dirty.Count) { Log "uncommitted changes besides notes.txt, stopping: $($dirty -join '; ')"; exit 0 }

# 3. newest unmerged pack branch that differs from the saved one
[void](G fetch origin --prune)
if ($GitExit -ne 0) { Log "git fetch failed, stopping"; exit 1 }
$state = if (Test-Path $StateFile) { Get-Content $StateFile -Raw | ConvertFrom-Json } else { $null }
$pick = $null
foreach ($line in (G for-each-ref --sort=-committerdate "--format=%(refname:short) %(objectname)" "refs/remotes/origin/pack-*")) {
    $ref, $hash = $line -split " "
    [void](G merge-base --is-ancestor $ref origin/main)
    if ($GitExit -eq 0) { continue }                       # already merged into main
    if ($state -and $state.hash -eq $hash) { continue }    # already synced
    $pick = @{ ref = $ref; branch = $ref -replace "^origin/", ""; hash = $hash }
    break
}
if (-not $pick) { if ($DryRun) { Log "nothing to sync (no new unmerged origin/pack-* branch)" }; exit 0 }
$branch = $pick.branch
Log "candidate: $branch @ $($pick.hash.Substring(0, 7))"

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

$sysDir = Join-Path $Repo "foundry\twod12"
Set-Location $sysDir
$tests = Run "tests" { node tools/tests/run.mjs }
$testsOk = ($RunExit -eq 0)
$testLines = @($tests | Where-Object { $_ -match "^(FAIL|CHANGED)" -or $_ -match "^\d+ tests:" })
$testSummary = if ($testLines.Count) { $testLines -join "`n" } else { "no test output" }
Log "tests: $(($tests | Select-Object -Last 1))"

$buildNote = "not needed (content.mjs and system.json unchanged vs main)"
if ($needBuild) {
    Set-Location (Join-Path $Repo "foundry")
    if (-not (Test-Path "node_modules\@foundryvtt\foundryvtt-cli")) { [void](Run "npm install" { npm install @foundryvtt/foundryvtt-cli }) }
    [void](Run "build-packs" { node twod12/tools/build-packs.mjs })
    $buildNote = if ($RunExit -eq 0) { "rebuilt" } else { "FAILED (see sync.log)" }
    Log "compendium packs: $buildNote"
}
Set-Location $Repo

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
$msg = "$branch v$version is ready: reload Foundry and test"
if (-not $testsOk) { $msg += " (tests FAILED, see pack-sync\latest.md)" }
Notify "2d12 sync" $msg
Log "done"
