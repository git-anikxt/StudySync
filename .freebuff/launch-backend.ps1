$env:PORT = '5000'
$p = Start-Process -FilePath 'npm.cmd' -ArgumentList 'run','dev' -WorkingDirectory 'C:\Projects\StudySync\backend' -RedirectStandardOutput 'C:\Projects\StudySync\.freebuff\backend.log' -RedirectStandardError 'C:\Projects\StudySync\.freebuff\backend.log.err' -WindowStyle Hidden -PassThru
Write-Output $p.Id
