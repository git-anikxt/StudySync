$procs = Get-CimInstance Win32_Process -Filter "Name='node.exe'"
foreach ($p in $procs) {
  if ($p.CommandLine -match 'next dev|ts-node-dev') {
    Write-Output ("killing {0}: {1}" -f $p.ProcessId, $p.CommandLine.Substring(0, [Math]::Min(100, $p.CommandLine.Length)))
    Stop-Process -Id $p.ProcessId -Force
  }
}
Start-Sleep -Seconds 1
Get-NetTCPConnection -State Listen -ErrorAction SilentlyContinue | Where-Object { $_.LocalPort -in 3000,5000,59229 } | Select-Object LocalPort,OwningProcess | Format-Table -AutoSize
