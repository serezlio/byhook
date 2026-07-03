@echo off
chcp 65001 > nul
set TOKEN=8997947154:AAGYl3AxGLLYp0rrQOavt-wBlrRT0hzKoOo
set CHAT=1021566586

powershell -Command "$token='%TOKEN%'; $msg = 'PAZAR TARAMASI | 29 Haziran 2026`n━━━━━━━━━━━━━━━━━━━━━`nGLOBAL (gecen hafta kapanıs)`nS&P500 : 7.354 | Haftalık: -2,0%`nNasdaq : 25.297 | Haftalık: -4,6%`nDow    : +0,6% (savunmacı rotasyon)`nNot: Chip/teknoloji satısı sürüyor`n─────────────────────`nBIST HAFTALIK`nXU100  : 14.729 | Haftalık: -2,97%`nXU030  : 17.019`nDestek: 14.402 / 13.938`nDirenç: 14.876 / 15.100`n─────────────────────`nHİSSE SON DURUMU`nASELS : 394-407 bölgesi — haftayı zayıf kapattı`nAKBNK : haftalık +0,56% — en güçlü`nTHYAO : haftalık -0,08% — yatay`nKRDMD : haftalık +1,50% — nisbeten güçlü`nTCELL : haftalık -0,54%`n─────────────────────`nMAKRO`nTCMB  : Faiz sabit %37 (11 Haz kararı)`nEnflasyon yönelimi gerileme süreciyle`n─────────────────────`nPAZARTESI BEKLENTISI`nGlobal zayıflık (Nasdaq -4,6%) BIST`nuzerinde baskı yaratabilir`nBanka hisseleri öne çıkabilir (savunmacı)`nASELS 394 altında risk yüksek`nKRDMD en güçlü momentum`n─────────────────────`n[BY HOOK — Pazar Tarama / Pazartesi Hazırlık]'; $body = @{chat_id='%CHAT%'; text=$msg} | ConvertTo-Json -Compress; $bytes = [System.Text.Encoding]::UTF8.GetBytes($body); Invoke-RestMethod -Uri \"https://api.telegram.org/bot$token/sendMessage\" -Method Post -ContentType 'application/json; charset=utf-8' -Body $bytes"

echo Pazar tarama gonderildi.
pause
