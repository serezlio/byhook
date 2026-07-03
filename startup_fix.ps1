# By Hook - Claude Desktop App Otomatik Baslatma
# Bu scripti bir kez calistir, Windows her basladiginda Claude otomatik acilir

$claudePath = ""

# Claude Desktop App yolunu bul (oncelikli)
$olasiYollar = @(
    "$env:LOCALAPPDATA\Programs\Claude\Claude.exe",
    "$env:LOCALAPPDATA\Programs\claude\Claude.exe",
    "C:\Users\Administrator\AppData\Local\Programs\Claude\Claude.exe",
    "$env:LOCALAPPDATA\Programs\claude-code\claude-code.exe",
    "$env:APPDATA\npm\claude.cmd",
    "C:\Users\Administrator\AppData\Roaming\npm\claude.cmd"
)

foreach ($yol in $olasiYollar) {
    if (Test-Path $yol) {
        $claudePath = $yol
        Write-Host "Bulundu: $yol"
        break
    }
}

if (-not $claudePath) {
    $claudePath = (Get-Command claude -ErrorAction SilentlyContinue).Source
    if ($claudePath) { Write-Host "PATH'den bulundu: $claudePath" }
}

if (-not $claudePath) {
    Write-Host "HATA: Claude bulunamadi."
    Write-Host "Ornek yol: C:\Users\Administrator\AppData\Local\Programs\Claude\Claude.exe"
    $claudePath = Read-Host "Claude.exe tam yolunu girin"
}

if (-not (Test-Path $claudePath)) {
    Write-Host "HATA: Girilen yol gecersiz: $claudePath"
    pause
    exit 1
}

Write-Host "Kullanilacak yol: $claudePath"

# Windows Task Scheduler - her gun 09:00'da Claude'u ac (piyasa oncesi)
$action = New-ScheduledTaskAction -Execute $claudePath
$trigger = New-ScheduledTaskTrigger -Daily -At "09:00AM"
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -RunOnlyIfNetworkAvailable -MultipleInstances IgnoreNew

Register-ScheduledTask `
    -TaskName "ByHook-Claude-Otomatik" `
    -Action $action `
    -Trigger $trigger `
    -Settings $settings `
    -RunLevel Highest `
    -Force

Write-Host ""
Write-Host "TAMAMLANDI: Claude her gun 09:00'da otomatik basliyor."
Write-Host "Gorev adi: ByHook-Claude-Otomatik"
Write-Host ""
pause
