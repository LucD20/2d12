# Registers the "2d12-sync-pack" task for the current user (no admin): at logon and every 10 minutes, hidden, only while logged on.
# Remove it with: schtasks /delete /tn 2d12-sync-pack /f
# The scripts run from a copy in %LOCALAPPDATA%d12-sync, because the repo is switched to pack branches that may not contain them.
# Run this again after changing tools/sync-pack.ps1 to refresh the copy.
$dest = Join-Path $env:LOCALAPPDATA "2d12-sync"
New-Item -ItemType Directory -Force $dest | Out-Null
Copy-Item (Join-Path $PSScriptRoot "sync-pack.ps1"), (Join-Path $PSScriptRoot "sync-pack-hidden.vbs") $dest -Force
$vbs = Join-Path $dest "sync-pack-hidden.vbs"
$user = "$env:USERDOMAIN\$env:USERNAME"
$start = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss")
$xml = @"
<?xml version="1.0" encoding="UTF-16"?>
<Task version="1.2" xmlns="http://schemas.microsoft.com/windows/2004/02/mit/task">
  <Triggers>
    <LogonTrigger><Enabled>true</Enabled><UserId>$user</UserId></LogonTrigger>
    <TimeTrigger>
      <StartBoundary>$start</StartBoundary>
      <Enabled>true</Enabled>
      <Repetition><Interval>PT10M</Interval></Repetition>
    </TimeTrigger>
  </Triggers>
  <Principals>
    <Principal id="Author"><UserId>$user</UserId><LogonType>InteractiveToken</LogonType><RunLevel>LeastPrivilege</RunLevel></Principal>
  </Principals>
  <Settings>
    <MultipleInstancesPolicy>IgnoreNew</MultipleInstancesPolicy>
    <DisallowStartIfOnBatteries>false</DisallowStartIfOnBatteries>
    <StopIfGoingOnBatteries>false</StopIfGoingOnBatteries>
    <StartWhenAvailable>true</StartWhenAvailable>
    <ExecutionTimeLimit>PT30M</ExecutionTimeLimit>
    <Hidden>true</Hidden>
  </Settings>
  <Actions Context="Author">
    <Exec><Command>wscript.exe</Command><Arguments>//B //Nologo "$vbs"</Arguments></Exec>
  </Actions>
</Task>
"@
$file = Join-Path $env:TEMP "2d12-sync-pack.xml"
$xml | Set-Content -Path $file -Encoding Unicode
schtasks /create /tn "2d12-sync-pack" /xml $file /f
Remove-Item $file
