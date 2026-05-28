@echo off
:: Check for administrator privileges
net session >nul 2>&1
if %errorLevel% == 0 (
    goto :admin
) else (
    echo =========================================================================
    echo CANH BAO: Can quyen Administrator de dang ky tac vu sao luu he thong.
    echo Vui long NHAP CHUOT PHAI vao file nay va chon "Run as Administrator"!
    echo =========================================================================
    echo.
    pause
    exit /b
)

:admin
echo Dang tien hanh cau hinh lich sao luu tu dong vao luc 16:30 hang ngay...
echo.
powershell.exe -ExecutionPolicy Bypass -File "%~dp0scripts\setup_scheduled_task.ps1"
echo.
echo Cai dat hoan tat! Nhan phim bat ky de dong cua so nay.
pause
