# backup.ps1
# Tu dong sao luu du an Quan ly Cong viec Phong Hanh chinh

# Lay thu muc chua file script hien tai
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
# Lay thu muc goc cua du an (cha cua thu muc scripts)
$ProjectDir = Split-Path -Parent $ScriptDir
$BackupDir = Join-Path $ProjectDir "backups"
$TempDir = Join-Path $env:TEMP "project_backup_temp"

# Tao thu muc sao luu neu chua ton tai
if (-not (Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Path $BackupDir | Out-Null
}

# Tao thu muc tam de copy du lieu
if (Test-Path $TempDir) {
    Remove-Item -Recurse -Force $TempDir -ErrorAction SilentlyContinue
}
New-Item -ItemType Directory -Path $TempDir | Out-Null

Write-Host "Chuan bi sao luu du an..."

# Copy cac tep tin, loai tru cac thu muc khong can thiet
Get-ChildItem -Path $ProjectDir -Exclude "node_modules", "dist", ".git", "backups", ".vercel" | ForEach-Object {
    $DestPath = Join-Path $TempDir $_.Name
    Copy-Item -Path $_.FullName -Destination $DestPath -Recurse -Force -ErrorAction SilentlyContinue
}

# Tao ten file backup voi ngay gio hien tai
$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$ZipName = "backup_QLCV_$Timestamp.zip"
$ZipPath = Join-Path $BackupDir $ZipName

Write-Host "Dang tien hanh nen du an..."
# Nen thu muc tam thanh file .zip
Compress-Archive -Path "$TempDir\*" -DestinationPath $ZipPath -Force

# Xoa thu muc tam sau khi nen xong
Remove-Item -Recurse -Force $TempDir -ErrorAction SilentlyContinue

Write-Host "Sao luu thanh cong! Tep tin duoc luu tai: $ZipPath"
