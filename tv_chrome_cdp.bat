@echo off
echo === TradingView Chrome CDP Baslat ===
echo.
echo [1] Tum Chrome surecleri kapatiliyor...
taskkill /F /IM chrome.exe 2>nul
timeout /t 3 /nobreak >nul
echo Bitti.
echo.
echo [2] Port 9222 temizleniyor...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :9222 ^| findstr LISTENING') do (
    taskkill /F /PID %%a 2>nul
)
timeout /t 1 /nobreak >nul
echo.
echo [3] Chrome + TradingView baslatiliyor (CDP port 9222)...
set CHROME=""
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" set CHROME="C:\Program Files\Google\Chrome\Application\chrome.exe"
if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" set CHROME="C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
if exist "%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe" set CHROME="%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"
echo Chrome yolu: %CHROME%
echo.
start "" %CHROME% --remote-debugging-port=9222 --user-data-dir="%LOCALAPPDATA%\TradingViewCDP" "https://www.tradingview.com/chart/"
echo.
echo Bekleniyor (5 sn)...
timeout /t 5 /nobreak >nul
echo.
echo [4] Port 9222 kontrol:
netstat -ano | findstr :9222
echo.
echo [5] Chrome surecleri:
tasklist | findstr /i "chrome"
echo.
echo TAMAMLANDI - Bu pencereyi acik birak
pause
