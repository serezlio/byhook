@echo off
echo === BY HOOK - TradingView CDP Baslat ===
echo.
echo [1] Mevcut TradingView kapatiliyor...
taskkill /F /IM TradingView.exe 2>nul
taskkill /F /IM TradingView.Desktop.exe 2>nul
timeout /t 2 /nobreak >nul
echo.
echo [2] Chrome ile TradingView aciliyor (CDP port 9222)...

REM Chrome yollarini dene
set CHROME=""
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" set CHROME="C:\Program Files\Google\Chrome\Application\chrome.exe"
if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" set CHROME="C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
if exist "%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe" set CHROME="%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"

if %CHROME%=="" (
    echo HATA: Chrome bulunamadi!
    echo Chrome'u yukle: https://www.google.com/chrome
    pause
    exit /b 1
)

echo Kullanilan: %CHROME%
echo.
echo [3] Mevcut debug portunu temizle...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :9222 ^| findstr LISTENING') do (
    taskkill /F /PID %%a 2>nul
)
timeout /t 1 /nobreak >nul

echo [4] Chrome + TradingView baslatiliyor...
start "" %CHROME% --remote-debugging-port=9222 --user-data-dir="%LOCALAPPDATA%\TradingViewCDP" "https://www.tradingview.com/chart/"
echo.
echo ================================================
echo BY HOOK - TradingView CDP Aktif
echo CDP Port: 9222
echo.
echo Tarayicida TradingView actiktan sonra:
echo - Hesabina giris yap (ilk seferde)
echo - Dogru layout'u sec
echo ================================================
echo.
echo Bu pencereyi KAPAMA - kapatirsan CDP duruyor!
echo Ctrl+C ile kapat gerekirse.
echo.
pause
