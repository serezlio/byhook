@echo off
taskkill /f /im TradingView.exe >nul 2>&1
timeout /t 2 /nobreak >nul
start "" "C:\Program Files\WindowsApps\TradingView.Desktop_3.3.0.7992_x64__n534cwy3pjxzj\TradingView.exe" --remote-debugging-port=9222
echo TV yeniden baslatildi
timeout /t 5 /nobreak >nul
echo Hazir
