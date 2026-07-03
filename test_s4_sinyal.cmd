@echo off
chcp 65001 > nul
set TOKEN=8997947154:AAGYl3AxGLLYp0rrQOavt-wBlrRT0hzKoOo
set CHAT=1021566586

powershell -Command "$token='%TOKEN%'; $msg = \"S4 | THYAO | SHORT`nBOS: Bearish | Fiyat: 287,40`nVadeli: ters | XU100: ters`nHacim: yuksek`n─────────────────────`nCERN-1 : ters`nCERN-2 : ters`n─────────────────────`n[TEST MESAJI - sistem canli]\"; $body = @{chat_id='%CHAT%'; text=$msg} | ConvertTo-Json -Compress; $bytes = [System.Text.Encoding]::UTF8.GetBytes($body); Invoke-RestMethod -Uri \"https://api.telegram.org/bot$token/sendMessage\" -Method Post -ContentType 'application/json; charset=utf-8' -Body $bytes"

echo Gonderildi.
pause
