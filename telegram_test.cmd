@echo off
chcp 65001 > nul
set TOKEN=8997947154:AAGYl3AxGLLYp0rrQOavt-wBlrRT0hzKoOo
set CHAT=1021566586

powershell -Command "$token='%TOKEN%'; $body = @{chat_id='%CHAT%'; text='BY HOOK TEST - Sistem aktif. CERN-1 + CERN-3 hazir. Pazartesi tum robotlar calisiyor.'; parse_mode='HTML'} | ConvertTo-Json -Compress; $bytes = [System.Text.Encoding]::UTF8.GetBytes($body); Invoke-RestMethod -Uri \"https://api.telegram.org/bot$token/sendMessage\" -Method Post -ContentType 'application/json; charset=utf-8' -Body $bytes"

echo Gonderildi.
pause
