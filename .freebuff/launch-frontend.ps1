$env:PORT = '3000'
$p = Start-Process -FilePath 'npm.cmd' -ArgumentList 'run','dev' -WorkingDirectory 'C:\Projects\StudySync\frontend' -RedirectStandardOutput 'C:\Projects\StudySync\.freebuff\preview-babd296b-2930-4e42-9785-f498ce502185.log' -RedirectStandardError 'C:\Projects\StudySync\.freebuff\preview-babd296b-2930-4e42-9785-f498ce502185.log.err' -WindowStyle Hidden -PassThru
Write-Output $p.Id
