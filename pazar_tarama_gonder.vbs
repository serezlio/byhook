Dim token, chatId, msg, psCmd
token = "8997947154:AAGYl3AxGLLYp0rrQOavt-wBlrRT0hzKoOo"
chatId = "1021566586"

msg = "PAZAR TARAMASI | 29 Haziran 2026" & Chr(10) & _
      "━━━━━━━━━━━━━━━━━━━━━" & Chr(10) & _
      "GLOBAL (gecen hafta kapanIs)" & Chr(10) & _
      "S&P500  : 7.354 | Haftalik: -2,0%" & Chr(10) & _
      "Nasdaq  : 25.297 | Haftalik: -4,6%" & Chr(10) & _
      "Dow     : +0,6% (savunmaci rotasyon)" & Chr(10) & _
      "Not: Chip/teknoloji satisi suruyor" & Chr(10) & _
      "─────────────────────" & Chr(10) & _
      "BIST HAFTALIK" & Chr(10) & _
      "XU100   : 14.729 | Haftalik: -2,97%" & Chr(10) & _
      "XU030   : 17.019" & Chr(10) & _
      "Destek  : 14.402 / 13.938" & Chr(10) & _
      "Direnc  : 14.876 / 15.100" & Chr(10) & _
      "─────────────────────" & Chr(10) & _
      "HiSSE SON DURUMU" & Chr(10) & _
      "ASELS : 394-407 bolgesi -- haftayi zayif kapatti" & Chr(10) & _
      "AKBNK : haftalik +0,56% -- en guclu" & Chr(10) & _
      "THYAO : haftalik -0,08% -- yatay" & Chr(10) & _
      "KRDMD : haftalik +1,50% -- nisbeten guclu" & Chr(10) & _
      "TCELL : haftalik -0,54%" & Chr(10) & _
      "─────────────────────" & Chr(10) & _
      "MAKRO" & Chr(10) & _
      "TCMB  : Faiz sabit %37 (11 Haz karari)" & Chr(10) & _
      "─────────────────────" & Chr(10) & _
      "PAZARTESi BEKLENTiSi" & Chr(10) & _
      "Global zayiflik BIST uzerinde baski yaratabilir" & Chr(10) & _
      "Banka hisseleri one cikabilir (savunmaci)" & Chr(10) & _
      "ASELS 394 altinda risk yukse" & Chr(10) & _
      "KRDMD en guclu momentum" & Chr(10) & _
      "─────────────────────" & Chr(10) & _
      "[BY HOOK -- Pazar Tarama / Pazartesi Hazirlik]"

psCmd = "powershell -NoProfile -Command """ & _
    "$token='" & token & "'; " & _
    "$msg='" & Replace(msg, "'", "''") & "'; " & _
    "$body = @{chat_id='" & chatId & "'; text=$msg} | ConvertTo-Json -Compress; " & _
    "$bytes = [System.Text.Encoding]::UTF8.GetBytes($body); " & _
    "Invoke-RestMethod -Uri ('https://api.telegram.org/bot' + $token + '/sendMessage') " & _
    "-Method Post -ContentType 'application/json; charset=utf-8' -Body $bytes" & _
    """"

CreateObject("WScript.Shell").Run psCmd, 0, True
MsgBox "Pazar tarama gonderildi!", 64, "By Hook"
