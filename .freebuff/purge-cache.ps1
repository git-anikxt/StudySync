$pids = Get-NetTCPConnection -State Listen -ErrorAction SilentlyContinue | Where-Object { $_.LocalPort -eq 3000 } | Select-Object -ExpandProperty OwningProcess -Unique
foreach ($p in $pids) { Write-Output "killing frontend pid $p"; taskkill /PID $p /F }
Start-Sleep -Seconds 2
Write-Output "deleting .next cache..."
Remove-Item -Recurse -Force 'C:\Projects\StudySync\frontend\.next'
Write-Output ".next deleted"
