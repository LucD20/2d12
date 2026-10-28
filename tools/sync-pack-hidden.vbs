' Starts sync-pack.ps1 with no window at all (powershell -WindowStyle Hidden still flashes a console for a moment).
Set shell = CreateObject("WScript.Shell")
dir = CreateObject("Scripting.FileSystemObject").GetParentFolderName(WScript.ScriptFullName)
shell.Run "powershell.exe -NoProfile -ExecutionPolicy Bypass -File """ & dir & "\sync-pack.ps1""", 0, False
