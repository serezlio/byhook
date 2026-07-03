@echo off
echo === TEAMVIEWER FIREWALL TEMIZLE ===
netsh advfirewall firewall delete rule name="Teamviewer Remote Control Application"
echo.
echo Dogrulama - TeamViewer kurallari kalmali mi:
netsh advfirewall firewall show rule name=all | findstr /i "teamviewer"
echo (Yukaridaki bos ise kural silindi)
echo.
echo TAMAMLANDI
pause
