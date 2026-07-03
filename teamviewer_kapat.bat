@echo off
echo === TEAMVIEWER GUVENLIK KAPATMA ===
echo.

echo [1] TeamViewer baglanti loglarini kopyalaniyor...
if exist "C:\Program Files (x86)\TeamViewer\Connections_incoming.txt" (
    copy "C:\Program Files (x86)\TeamViewer\Connections_incoming.txt" "C:\Users\Administrator\REPO\tv_incoming_log.txt" /Y
    echo Log kopyalandi: tv_incoming_log.txt
) else (
    echo Connections_incoming.txt bulunamadi - muhtemelen hic giris yapilmamis
    echo TEAMVIEWER INCOMING LOG YOK > "C:\Users\Administrator\REPO\tv_incoming_log.txt"
)

if exist "C:\Users\Administrator\AppData\Roaming\TeamViewer\Connections.txt" (
    copy "C:\Users\Administrator\AppData\Roaming\TeamViewer\Connections.txt" "C:\Users\Administrator\REPO\tv_outgoing_log.txt" /Y
    echo Cikis logu kopyalandi: tv_outgoing_log.txt
) else (
    echo Connections.txt bulunamadi
    echo TEAMVIEWER OUTGOING LOG YOK > "C:\Users\Administrator\REPO\tv_outgoing_log.txt"
)

echo.
echo [2] TeamViewer servisleri durduruluyor...
net stop TeamViewer 2>nul
net stop "TeamViewer Host Service" 2>nul
echo Servisler durduruldu.

echo.
echo [3] TeamViewer servisi Devre Disi yapiliyor (bir daha otomatik baslamasin)...
sc config TeamViewer start= disabled 2>nul
sc config "TeamViewer Host Service" start= disabled 2>nul
echo Devre disi yapildi.

echo.
echo [4] Windows Firewall - TeamViewer kurallari kaldiriliyor...
netsh advfirewall firewall delete rule name=all program="C:\Program Files (x86)\TeamViewer\TeamViewer.exe" 2>nul
netsh advfirewall firewall delete rule name=all program="C:\Program Files (x86)\TeamViewer\TeamViewer_Service.exe" 2>nul
netsh advfirewall firewall delete rule name="TeamViewer Remote Control Service" 2>nul
netsh advfirewall firewall delete rule name="TeamViewer" 2>nul
echo Firewall kurallari temizlendi.

echo.
echo === TAMAMLANDI ===
echo TeamViewer tamamen devre disi:
echo - Servis: DURDURULDU ve Devre Disi
echo - Firewall: Kurallari Silindi
echo - Loglar: REPO klasorune kopyalandi
echo.
pause
