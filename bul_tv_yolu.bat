@echo off
echo === TradingView WindowsApps Yolu Bul ===
echo.
dir "C:\Program Files\WindowsApps\TradingView.Desktop_*" /b /ad > "C:\Users\Administrator\REPO\tv_yolu.txt" 2>&1
type "C:\Users\Administrator\REPO\tv_yolu.txt"
echo.
echo TAMAMLANDI
pause
