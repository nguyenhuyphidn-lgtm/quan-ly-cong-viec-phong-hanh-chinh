@echo off
chcp 65001 >nul
:: Check for administrator privileges
net session >nul 2>&1
if %errorLevel% == 0 (
    goto :admin
) else (
    echo =========================================================================
    echo CẢNH BÁO: Cần quyền Administrator để đăng ký tác vụ sao lưu hệ thống.
    echo Vui lòng NHẤP CHUỘT PHẢI vào file này và chọn "Run as Administrator"!
    echo =========================================================================
    echo.
    pause
    exit /b
)

:admin
echo Đang tiến hành cấu hình lịch sao lưu tự động vào lúc 16:30 hàng ngày...
echo.
powershell.exe -ExecutionPolicy Bypass -File "%~dp0scripts\setup_scheduled_task.ps1"
echo.
echo Cài đặt hoàn tất! Nhấn phím bất kỳ để đóng cửa sổ này.
pause
