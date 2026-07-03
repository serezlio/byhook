@echo off
echo === TEAMVIEWER DURUM KONTROLU === > "C:\Users\Administrator\REPO\tv_durum.txt"
echo. >> "C:\Users\Administrator\REPO\tv_durum.txt"
echo [TeamViewer Servis Durumu] >> "C:\Users\Administrator\REPO\tv_durum.txt"
sc query TeamViewer >> "C:\Users\Administrator\REPO\tv_durum.txt" 2>&1
echo. >> "C:\Users\Administrator\REPO\tv_durum.txt"
echo [TeamViewer Baslangic Turu] >> "C:\Users\Administrator\REPO\tv_durum.txt"
sc qc TeamViewer >> "C:\Users\Administrator\REPO\tv_durum.txt" 2>&1
echo. >> "C:\Users\Administrator\REPO\tv_durum.txt"
echo [Firewall TeamViewer Kurallari] >> "C:\Users\Administrator\REPO\tv_durum.txt"
netsh advfirewall firewall show rule name=all | findstr /i "teamviewer" >> "C:\Users\Administrator\REPO\tv_durum.txt" 2>&1
echo. >> "C:\Users\Administrator\REPO\tv_durum.txt"
echo KONTROL TAMAMLANDI >> "C:\Users\Administrator\REPO\tv_durum.txt"
type "C:\Users\Administrator\REPO\tv_durum.txt"
pause
