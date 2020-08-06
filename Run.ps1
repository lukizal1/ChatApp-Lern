function Remove-ProcessTree {
	Param([int]$ppid)
	Get-CimInstance Win32_Process | Where-Object { $_.ParentProcessId -eq $ppid } | ForEach-Object { Remove-ProcessTree $_.ProcessId }
	"removed process with id " + $ppid
	try {
	Stop-Process -Id $ppid
	}
	catch {}
}

$ErrorActionPreferences = "Stop"
$currentLocation = Get-Location

try
{
	"Swtich to ChatApp and do npm install for backend"
	Set-Location ".\ChatApp"
	npm install
	
	
	"Start ChatApp Backend in DEV-Mode in another console window (process)"
	$backendProcess = Start-Process "npm" "run dev" -PassThru
	
	"Wait for 5 seconds to ensure the backend is started before the testcases execution starts ..."
	for ($i - 1; $i -lt 6; $i++) {
	Start-Sleep -seconds 1
	"$i ..."
	}
	
	"running newman testcases"
	Set-Location "..\Tests"
	newman run ChatAppTestCases.json
	
	#"start a browser session "
	#Start-Process "chrome.exe" "http://mychat.htl-vil.informatik:2604/api/users"
	
	if ($backendProcess)
	{
		$backendProcess
		Remove-ProcessTree $backendProcess.Id
		"backend process terminated"
	}
}
finally
{
	Set-Location $currentLocation
}