@echo off
echo === BY HOOK SUNUCU KURULUM ===
echo.
echo [1] Firewall kurali ekleniyor...
netsh advfirewall firewall delete rule name="By Hook Server" >nul 2>&1
netsh advfirewall firewall add rule name="By Hook Server" dir=in action=allow protocol=TCP localport=8080
echo     Tamam.
echo.
echo [2] Eski Python sunucu kapatiliyor...
taskkill /f /im python.exe /t >nul 2>&1
ping -n 2 127.0.0.1 >nul
echo     Tamam.
echo.
echo [3] Sunucu baslatiliyor...
echo.
python "C:\Users\Administrator\REPO\start_server.py"
pause
