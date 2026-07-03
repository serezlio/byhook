@echo off
echo TradingView debug modunda baslatiliyor...
echo.

taskkill /f /im TradingView.exe >nul 2>&1
timeout /t 2 /nobreak >nul

start "" "C:\Program Files\WindowsApps\TradingView.Desktop_3.2.0.7916_x64__n534cwy3pjxzj\TradingView.exe" --remote-debugging-port=9222

echo TradingView debug modunda baslatildi (port 9222)
echo Birkaç saniye bekle, sonra Claude Code'da tv_health_check yaz.
pause
