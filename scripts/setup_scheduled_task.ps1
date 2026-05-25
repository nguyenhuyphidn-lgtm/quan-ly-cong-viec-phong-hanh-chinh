# setup_scheduled_task.ps1
# Thiet lap tu dong sao luu du an luc 16h30 hang ngay qua Task Scheduler

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$BatPath = Join-Path $ScriptDir "run_backup.bat"
$TaskName = "BackupQuanLyCongViecPHC"
$Time = "16:30"

# Lay duong dan tuyet doi
$AbsoluteBatPath = (Get-Item $BatPath).FullName

Write-Host "Dang dang ky tac vu tu dong sao luu..."
Write-Host "BAT Path: $AbsoluteBatPath"

# Dinh dang lenh cho schtasks qua cmd.exe /c de giu nguyen dau nhay kep escape
# schtasks yeu cau /tr phai co nhay kep bao quanh duong dan chua khoang trang
$Command = "schtasks.exe /create /tn `"$TaskName`" /tr `"\`"$AbsoluteBatPath\`"`" /sc daily /st $Time /f"

Write-Host "Lenh thuc thi: $Command"

# Chay qua cmd.exe đe bao dam nhay kep khong bi powershell tuoc bo
cmd.exe /c $Command

if ($LASTEXITCODE -eq 0) {
    Write-Host "--------------------------------------------------------"
    Write-Host "DANG KY THANH CONG!"
    Write-Host "He thong se tu dong sao luu vao luc $Time hang ngay."
    Write-Host "--------------------------------------------------------"
} else {
    Write-Error "Dang ky that bai. Vui long kiem tra quyen han Windows."
}
