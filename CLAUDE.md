# BY HOOK — Claude Hafıza Dosyası
Son güncelleme: 2026-07-03

Bu dosya her oturumda ilk okunacak referanstır. Buradaki bilgileri varsay, yeniden keşfetme.

---

## KESİN KURALLAR (HİÇ BOZMA)

- **KESİN YASAK:** BTC, kripto, XAGUSD, altın, döviz sinyali gönderme
- **Emoji kullanma** — hiçbir mesajda, hiçbir dosyada
- **Sayılar Türk formatı:** Nokta = binlik ayraç, virgül = ondalık (örn: 1.234,56)
- **PowerShell çalışmıyor** → Telegram için `mcp__tradingview__ui_evaluate` ile JS fetch kullan
- **Bash disk dolu** → `mcp__workspace__bash` çalışmıyor, dosya araçları kullan

---

## TELEGRAM KONFİGÜRASYON

Asıl token ve chat_id gizli tutulur — git'te saklanmaz.
Lokal dosya: `C:\Users\Administrator\REPO\telegram_config.json` (gitignore'da)

Yeni oturumda token gerekirken: `telegram_config.json` dosyasını oku veya kullanıcıdan iste.

Telegram gönderme kodu (ui_evaluate ile):
```javascript
const r = await fetch("https://api.telegram.org/bot[BOT_TOKEN]/sendMessage",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({chat_id:"[CHAT_ID]",text:"MESAJ"})});(await r.json()).ok
```

[BOT_TOKEN] ve [CHAT_ID] için: C:\Users\Administrator\REPO\telegram_config.json oku

---

## BY HOOK PWA SİSTEMİ

### Dosya Yapısı
```
C:\Users\Administrator\REPO\
├── byhook.html          — Ana PWA dashboard (91KB+), tüm mantık burada
├── byhook.webmanifest   — PWA manifest
├── byhook_icon.svg      — SVG ikon
├── byhook_robots.js     — Robot simülasyon verileri (window.BYHOOK_ROBOTS=[])
├── byhook_market.js     — Canlı fiyat verileri (window.BYHOOK_MARKET={})
├── byhook_news.js       — Haber/brifing verileri (window.BYHOOK_NEWS={})
├── start_byhook.bat     — Firewall + Python sunucu başlat (Admin olarak çalıştır)
├── start_server.py      — Python HTTP server (port 8080, 0.0.0.0)
├── push_github.bat      — GitHub Pages'e push (serezlio/byhook)
└── CLAUDE.md            — Bu dosya
```

### Erişim URL'leri
- **Yerel (PC açıkken):** `http://192.168.1.101:8080/byhook.html`
  - WiFi IP: `192.168.1.101` (Wireless LAN adapter Wi-Fi 2)
  - VPN IP: `172.16.0.2` (CloudflareWARP — bu IP ile bağlanma)
- **GitHub Pages (PC kapalıyken):** `https://serezlio.github.io/byhook/byhook.html`
  - Repo: `https://github.com/serezlio/byhook`
  - Source: main branch / (root)

### byhook.html Veri Yapısı

**Manuel işlem:**
```javascript
{
  id: string, tip: 'manuel', sistem: 'MANUEL',
  sembol: 'ASELS', yon: 'LONG'|'SHORT',
  giris: number, cikis: number|null,
  kontrat: number, durum: 'acik'|'kapali',
  giris_zaman: ISO_UTC, cikis_zaman: ISO_UTC|null,
  pnl: number|null, not: string
}
```

**Robot simülasyon işlemi (byhook_robots.js):**
```javascript
{
  id: string,               // 'cern1_ASELS_20260703T1030'
  tip: 'robot',
  sistem: 'CERN-1'|'CERN-2'|'S4'|'VIOP-FLIP',
  sembol: string,           // ASELS|AKBNK|THYAO|KRDMD|TCELL
  yon: 'LONG'|'SHORT',
  giris: number,            // giriş fiyatı
  sl: number,               // LONG→S1, SHORT→R1
  tp: number,               // LONG→R1, SHORT→S1
  puan: number,             // sinyal puanı (1-10)
  giris_izni: boolean,      // puan >= 6 ise true
  kontrat: 1,
  durum: 'acik'|'kapali',
  sonuc: 'TP'|'SL'|null,
  giris_zaman: ISO_UTC,
  cikis_zaman: ISO_UTC|null,
  cikis: number|null,
  pnl: number|null,         // puan_fark * 100 * 1
  puan_fark: number|null,   // LONG: cikis-giris, SHORT: giris-cikis
  not: string
}
```

**byhook_robots.js dosya formatı:**
```javascript
// Bu dosya byhook-robot-takip gorevi tarafindan otomatik guncellenir.
// Son guncelleme: [TARIH]
window.BYHOOK_ROBOTS = [...];
```

**byhook_market.js dosya formatı:**
```javascript
window.BYHOOK_MARKET = {
  updated: 'ISO_TIMESTAMP',
  hisseler: {
    ASELS: { fiyat: 360.50, degisim: 1.2 },
    AKBNK: { fiyat: 77.80, degisim: -0.3 },
    THYAO: { fiyat: 328.00, degisim: 0.8 },
    KRDMD: { fiyat: 40.20, degisim: 0.5 },
    TCELL: { fiyat: 108.10, degisim: -0.1 }
  }
};
```

**byhook_news.js dosya formatı:**
```javascript
window.BYHOOK_NEWS = {
  updated: 'ISO_TIMESTAMP',
  briefing: { /* sabah brifing nesnesi - DEĞİŞTİRME */ },
  haberler: [
    { kaynak: 'KAP', baslik: 'Max 80 karakter', zaman: 'ISO', etki: 'pozitif' }
  ]
};
```

### S/R Seviyeleri
```
ASELS: S2=340,00 | S1=354,00 | R1=367,50 | R2=379,00
AKBNK: S2=73,00  | S1=75,50  | R1=78,50  | R2=81,85
THYAO: S2=307,75 | S1=322,00 | R1=333,25 | R2=341,00
KRDMD: S2=37,50  | S1=39,30  | R1=41,50  | R2=42,80
TCELL: S2=102,70 | S1=106,50 | R1=109,50 | R2=113,10
```

**Genişletilmiş S/R (sr-alarm için):**
```
ASELS: S3-MAJOR=320 | S2=340 | S1=354 | R1=367,50 | R2=379 | R3=389 | R4-MAJOR=410
THYAO: S4-MAJOR=271,50 | S3=294 | S2=307,75 | S1=322 | R1=333,25 | R2=341 | R3-MAJOR=352,50
AKBNK: S4-MAJOR=65,60 | S3=69,25 | S2=73 | S1=75,50 | R1=78,50 | R2=81,85 | R3-MAJOR=91
KRDMD: S4-MAJOR=34 | S3=36,50 | S2=37,50 | S1=39,30 | R1=41,50 | R2=42,80 | R3=44,50 | R4-MAJOR=47
TCELL: S3-MAJOR=100,80 | S2=102,70 | S1=106,50 | R1=109,50 | R2=113,10 | R3=116,30 | R4-MAJOR=123,40
EREGL: S4-MAJOR=34 | S3=36 | S2=38 | S1=39,66 | R1=42 | R2=43,72 | R3=45 | R4-MAJOR=47
```

---

## ROBOT SİSTEMLERİ

### CERN-1 Sinyal Kuralı
- LONG: F > Bias VE F > ST
- SHORT: F < Bias VE F < ST
- TF: 15 dakika

### CERN-2 Sinyal Kuralı
- LONG: EMA1 > EMA2 VE F > EMA1 VE Haz- = 0
- SHORT: EMA1 < EMA2 VE F < EMA1 VE Haz+ = 0
- TF: 15 dakika

### S4 Sinyal Kuralı
- Bullish BOS (color=6, textColor=14) → LONG
- Bearish BOS (color=7, textColor=12) → SHORT
- TF: 5 dakika
- İndikatör entity: l130Af
- İndikatör adı: "VIOP S4 — SMC Scalp [30dk+5dk]"

### VIOP-FLIP Sinyal Kuralı
- SuperTrend yön değiştirdiyse (flip) VE toplam puan >= 6 ise sinyal
- TF: 15 dakika

### Puan Sistemi (CERN-1 ve CERN-2)
| Kriter | Puan |
|--------|------|
| Ana sistem uyumlu | +2 |
| Çapraz sistem uyumlu | +2 |
| Vadeli (XU030DM2I) uyumlu | +2 |
| XU100 uyumlu | +1 |
| EMA yönü | +1 |
| S/R mesafe > %1,5 | +1 |
| Hacim ortalamanın üstünde | +1 |

Eşik: **>= 6 = GİRİŞ İZNİ VAR**

### Simülasyon SL/TP Kuralı
- LONG: SL = S1, TP = R1
- SHORT: SL = R1, TP = S1
- P&L: puan_fark * 100 (carpan) * 1 (kontrat)

### Robot ID Formatları
- CERN-1: `cern1_SEMBOL_YILAYGUNTSAATDAKİKA`
- CERN-2: `cern2_SEMBOL_YILAYGUNTSAATDAKİKA`
- S4: `s4_SEMBOL_YILAYGUNTSAATDAKİKA`
- VIOP-FLIP: `flip_SEMBOL_YILAYGUNTSAATDAKİKA`

---

## SCHEDULED TASK DİZİNİ

### Tam Task Listesi (Task ID | Path | Cron | Açıklama)

| Task ID | SKILL.md Path | Cron | Açıklama |
|---------|--------------|------|----------|
| `byhook-robot-takip` | `C:\Users\Administrator\claude\Scheduled\byhook-robot-takip\SKILL.md` | `*/30 10-18 * * 1-5` | SL/TP kontrol + pozisyon kapat + GitHub push |
| `byhook-sabah-brifing` | `C:\Users\Administrator\claude\Scheduled\byhook-sabah-brifing\SKILL.md` | `15 9 * * 1-5` | XU100+5 hisse → byhook_news.js güncelle |
| `byhook-canli-fiyat` | `C:\Users\Administrator\claude\Scheduled\byhook-canli-fiyat\SKILL.md` | `*/15 10-18 * * 1-5` | 5 hisse canlı fiyat → byhook_market.js güncelle |
| `cern1-canli-tarayici` | `C:\Users\Administrator\Claude\Scheduled\cern1-canli-tarayici\SKILL.md` | `15,30,45 10-17 * * 1-5` | CERN-1 sinyal + sim kayıt |
| `cern2-canli-tarayici` | `C:\Users\Administrator\Claude\Scheduled\cern2-canli-tarayici\SKILL.md` | `16,31,46 10-17 * * 1-5` | CERN-2 sinyal + sim kayıt |
| `fib-altin-oran-tarayici` | `C:\Users\Administrator\Claude\Scheduled\fib-altin-oran-tarayici\SKILL.md` | `17,32,47 10-17 * * 1-5` | S4 BOS sinyal + sim kayıt |
| `viop-flip-tarayici` | `C:\Users\Administrator\Claude\Scheduled\viop-flip-tarayici\SKILL.md` | `18,33,48 10-17 * * 1-5` | SuperTrend flip + sim kayıt |
| `seans-izleyici` | `C:\Users\Administrator\Claude\Scheduled\seans-izleyici\SKILL.md` | `5,20,35,50 10-17 * * 1-5` | Seans içi 5 hisse + CERN-1 değişim izle |
| `sr-alarm` | `C:\Users\Administrator\Claude\Scheduled\sr-alarm\SKILL.md` | `10,25,40,55 10-18 * * 1-5` | S/R kırılım alarmı |
| `tarama-10-30` | `C:\Users\Administrator\Claude\Scheduled\tarama-10-30\SKILL.md` | `30 10 * * 1-5` | Açılış taraması |
| `tarama-11-30` | `C:\Users\Administrator\Claude\Scheduled\tarama-11-30\SKILL.md` | `30 11 * * 1-5` | Seans ortası tarama |
| `telkin-gunluk` | `C:\Users\Administrator\Claude\Scheduled\telkin-gunluk\SKILL.md` | `35 7 * * *` | Sabah motivasyon mesajı |
| `gunluk-kitap-dersi` | `C:\Users\Administrator\Claude\Scheduled\gunluk-kitap-dersi\SKILL.md` | `25 8 * * *` | Kitap prensibi |
| `viop-makro-radar` | `C:\Users\Administrator\Claude\Scheduled\viop-makro-radar\SKILL.md` | `30 8 * * 1-4` | Makro erken uyarı (Pzt-Perş) |
| `koordinator-08-45` | `C:\Users\Administrator\Claude\Scheduled\koordinator-08-45\SKILL.md` | `45 8 * * 1-5` | TV başlat + streak kontrol |
| `bist-sabah-raporu` | `C:\Users\Administrator\Claude\Scheduled\bist-sabah-raporu\SKILL.md` | `0 9 * * 1-5` | BIST sektör + global sabah |
| `viop-sabah-brifing` | `C:\Users\Administrator\Claude\Scheduled\viop-sabah-brifing\SKILL.md` | `30 9 * * 1-5` | XU30+XU100 sabah taraması |
| `relatif-guc-tarayici` | `C:\Users\Administrator\Claude\Scheduled\relatif-guc-tarayici\SKILL.md` | `45 9 * * 1-5` | 7 sembol güç sıralaması |
| `viop-seans-sonu` | `C:\Users\Administrator\Claude\Scheduled\viop-seans-sonu\SKILL.md` | `45 17 * * 1-5` | Kapanış analizi + 2 aday |
| `bist-aksam-raporu` | `C:\Users\Administrator\Claude\Scheduled\bist-aksam-raporu\SKILL.md` | `30 18 * * 1-5` | Ertesi gün setup listesi |
| `haber-tarama` | `C:\Users\Administrator\Claude\Scheduled\haber-tarama\SKILL.md` | `0 8-23 * * *` | KAP + TR/global haber saatlik |
| `zihin-oyunu` | `C:\Users\Administrator\Claude\Scheduled\zihin-oyunu\SKILL.md` | `10 21 * * *` | Mental egzersiz |
| `gece-ozeti` | `C:\Users\Administrator\Claude\Scheduled\gece-ozeti\SKILL.md` | `30 22 * * *` | ABD kapanış + Asya özeti |
| `viop-haftalik-harita` | `C:\Users\Administrator\Claude\Scheduled\viop-haftalik-harita\SKILL.md` | `0 20 * * 0` | Haftalık Pivot+CPR (Pazar) |

**NOT:** Uppercase `C:\Users\Administrator\Claude\Scheduled\` path'i Read tool ile erişilebilir.
Lowercase `C:\Users\Administrator\claude\Scheduled\` (3 byhook görevi) Read tool ile erişilemiyor — promptları aşağıya yazıldı.

---

## BYHOOK TASK PROMPTLARI (dosyadan okunamıyor, buraya kaydedildi)

### byhook-robot-takip (Her 30 dk, Hafta içi 10-18)
```
Sen By Hook'sun — BIST VİOP trading asistanısın.

GÖREV: Robot simülasyon pozisyonlarını takip et, SL/TP vuruldu mu kontrol et.

ADIMLAR:

1. C:\Users\Administrator\REPO\byhook_robots.js dosyasını oku.
   window.BYHOOK_ROBOTS array'ini parse et.

2. durum='acik' olan her pozisyon için:
   - mcp__tradingview__quote_get ile anlık fiyatı al (BIST:SEMBOL)
   - LONG ise:
       fiyat >= tp → KAPALI, sonuc='TP'
       fiyat <= sl → KAPALI, sonuc='SL'
   - SHORT ise:
       fiyat <= tp → KAPALI, sonuc='TP'
       fiyat >= sl → KAPALI, sonuc='SL'

3. Kapanan her pozisyon için güncelle:
   durum = 'kapali'
   sonuc = 'TP' veya 'SL'
   cikis = vurulan fiyat (tp veya sl)
   cikis_zaman = su_an_ISO_UTC
   puan_fark = LONG: (cikis - giris) | SHORT: (giris - cikis)
   pnl = puan_fark * 100 * 1

4. Kapanan pozisyon varsa Telegram mesajı gönder:
   SIM KAPANDI | SISTEM | SEMBOL | TP/SL
   Giris: [giris] -> Cikis: [cikis]
   P&L: [puan_fark] puan | [pnl] TL
   Toplam acik: [kalan_acik_sayisi]

   Telegram gönder (ui_evaluate ile):
   const r = await fetch("https://api.telegram.org/botBOTTOKEN_GIZLI/sendMessage",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({chat_id:"CHATID_GIZLI",text:"MESAJ"})});(await r.json()).ok

5. Hiçbir pozisyon kapanmadıysa Telegram gönderme (spam olmasın).

6. Güncellenmiş array'i byhook_robots.js'e yaz:
   // Bu dosya byhook-robot-takip gorevi tarafindan otomatik guncellenir.
   // Son guncelleme: [TARIH]
   window.BYHOOK_ROBOTS = [JSON_ARRAY];

7. Git push:
   cd /d "C:\Users\Administrator\REPO"
   git add byhook_robots.js
   git commit -m "Robot sim guncelleme [TARIH]"
   git push origin main

KESİN YASAK: BTC, kripto, XAGUSD, altın, döviz sinyali gönderme.
Emoji kullanma. Sayılar Türk formatı.
```

### byhook-sabah-brifing (Hafta içi 09:15)
```
Sen By Hook'sun — BIST VİOP trading asistanısın.

GÖREV: Sabah brifing verilerini çek, byhook_news.js güncelle.

ADIMLAR:

1. TradingView MCP ile BIST:XU100 günlük grafik — trend yönü, seviye
2. 5 hisse (ASELS, AKBNK, THYAO, KRDMD, TCELL) için:
   - Günlük açılış/kapanış fiyatı
   - EMA(22) ve EMA(50) pozisyonu
   - CERN-1 yönü (F > Bias VE F > ST mi?)
3. Bugünün takvimi (web search): önemli TCMB/TÜİK/Fed verisi var mı?
4. KAP son bildirimler (site:kap.org.tr web search)
5. byhook_news.js dosyasını oku, briefing nesnesini güncelle:
   - tarih, xu100_yonu, hisseler[5], takvim, kap_bildiri

Dosyayı yaz:
window.BYHOOK_NEWS = {
  updated: 'ISO_TIMESTAMP',
  briefing: {
    tarih: 'YYYY-MM-DD',
    xu100_yonu: 'yukari|asagi|yatay',
    hisseler: {
      ASELS: { yon: 'LONG|SHORT|NOTR', ema_durum: 'uzerinde|altinda' },
      AKBNK: { ... }, THYAO: { ... }, KRDMD: { ... }, TCELL: { ... }
    },
    takvim: 'Onemli veri veya Veri yok',
    kap: 'Son bildiri ozeti veya Yok'
  },
  haberler: [/* MEVCUT HABERLERI AYNEN KOR */]
};

Telegram gönderme (ui_evaluate):
const r = await fetch("https://api.telegram.org/botBOTTOKEN_GIZLI/sendMessage",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({chat_id:"CHATID_GIZLI",text:"SABAH BRİFİNG | [tarih]\nXU100: [yon]\nASELS:[yon] AKBNK:[yon] THYAO:[yon] KRDMD:[yon] TCELL:[yon]\nTakvim: [ozet]"})});(await r.json()).ok

KESİN YASAK: BTC, kripto, XAGUSD, altın, döviz tavsiyesi.
Emoji kullanma. Sayılar Türk formatı.
```

### byhook-canli-fiyat (Her 15 dk, Hafta içi 10-18)
```
Sen By Hook'sun — BIST VİOP trading asistanısın.

GÖREV: 5 hissenin anlık fiyatlarını çek, byhook_market.js güncelle.

ADIMLAR:

1. TradingView MCP ile mcp__tradingview__quote_get kullan:
   BIST:ASELS, BIST:AKBNK, BIST:THYAO, BIST:KRDMD, BIST:TCELL

2. Her hisse için: anlık fiyat, günlük değişim (%)

3. byhook_market.js dosyasını yaz:
   window.BYHOOK_MARKET = {
     updated: 'ISO_TIMESTAMP',
     hisseler: {
       ASELS: { fiyat: [anlık], degisim: [%] },
       AKBNK: { fiyat: [anlık], degisim: [%] },
       THYAO: { fiyat: [anlık], degisim: [%] },
       KRDMD: { fiyat: [anlık], degisim: [%] },
       TCELL: { fiyat: [anlık], degisim: [%] }
     }
   };

4. Git push:
   cd /d "C:\Users\Administrator\REPO"
   git add byhook_market.js
   git commit -m "Canli fiyat guncelleme [TARIH]"
   git push origin main

Telegram gönderme: SADECE fiyatlarda %3 ve üzeri ani hareket varsa bildir.

KESİN YASAK: BTC, kripto, XAGUSD, altın, döviz tavsiyesi.
Emoji kullanma. Sayılar Türk formatı.
```

---

## STATE DOSYALARI

Görevler arası veri paylaşımı için state dosyaları:

| Dosya | Kullanan Görev | İçerik |
|-------|---------------|--------|
| `C:\Users\Administrator\.claude\cern1_state.json` | cern1-canli-tarayici | Son sinyal: {sembol, yon, zaman} |
| `C:\Users\Administrator\.claude\cern2_state.json` | cern2-canli-tarayici | Son sinyal: {sembol, yon, zaman} |
| `C:\Users\Administrator\.claude\s4_state.json` | fib-altin-oran-tarayici | Son BOS: {sembol, yon, zaman} |
| `C:\Users\Administrator\.claude\viop_flip_state.json` | viop-flip-tarayici | Son flip: {sembol, yon, zaman} |
| `C:\Users\Administrator\.claude\sr_alarm_state.json` | sr-alarm | Son alarm: {sembol, seviye, zaman} — 30 dk cooldown |
| `C:\Users\Administrator\.claude\cern1_state.json` | seans-izleyici | CERN-1 yön takibi |
| `C:\Users\Administrator\.claude\ema_state.json` | seans-izleyici | EMA22/EMA50 kesişim takibi |
| `C:\Users\Administrator\.claude\streak.json` | koordinator-08-45, telkin-gunluk | Gün sayacı |

---

## GİT / GITHUB

```
Kullanıcı: serezlio
Repo: https://github.com/serezlio/byhook
GitHub Pages: https://serezlio.github.io/byhook/byhook.html
Remote: git remote set-url origin https://github.com/serezlio/byhook
Email: omerfarukserezli@gmail.com
```

**Manuel push:** `push_github.bat` çift tıkla (admin gerekmez)

**Robot/veri push komutu (CMD .bat üzerinden):**
```batch
cd /d "C:\Users\Administrator\REPO"
git add byhook_robots.js byhook_market.js byhook_news.js
git commit -m "Guncelleme"
git push origin main
```

**UYARI:** GitHub repo PUBLIC — Telegram token görünür. Repo private yapılması planlanıyor (Task #20).

---

## ARAÇ KISITLAMALARI

| Araç | Durum |
|------|-------|
| Bash / mcp__workspace__bash | ÇALIŞMIYOR (disk dolu) |
| PowerShell | ÇALIŞMIYOR |
| mcp__tradingview__ui_evaluate | Telegram için JS fetch kullan |
| Chrome (computer-use) | Sadece READ tier — tıklama yok |
| CMD / Terminal (computer-use) | CLICK tier — yazma yok, .bat dosyaları kullan |
| Dosya Gezgini (computer-use) | FULL tier — çalışıyor |
| Read tool (Claude\Scheduled uppercase) | ÇALIŞIYOR |
| Read tool (claude\Scheduled lowercase — 3 byhook görevi) | ERIŞILEMIYOR — promptlar yukarıda |

---

## BACKTEST SONUÇLARI (Referans)

### S4 Sistemi (30dk SPOT, BIST)
| Sembol | Toplam | Win Rate | Net P&L |
|--------|--------|----------|---------|
| ASELS  | 23 işlem | %65,2 | +3.890 puan |
| KRDMD  | 18 işlem | %61,1 | +2.140 puan |
| AKBNK  | 21 işlem | %57,1 | +1.680 puan |

### CERN-1 (5dk SPOT)
| Sembol | Win Rate | Ortalama R/R |
|--------|----------|-------------|
| ASELS  | ~%58 | 1:1,4 |
| KRDMD  | ~%55 | 1:1,3 |
| AKBNK  | ~%52 | 1:1,2 |

### CERN-2 (5dk SPOT)
| Sembol | Win Rate | Not |
|--------|----------|-----|
| ASELS  | ~%60 | CERN-1 teyidi ile daha güçlü |
| KRDMD  | ~%57 | |
| AKBNK  | ~%54 | |

---

## TAMAMLANAN BÜYÜK GÖREVLER

1. By Hook PWA dashboard kurulumu (byhook.html)
2. Robot/manuel işlem ayrımı + otomatik giriş sistemi
3. PWA manifest + Claude AI panel
4. 24 scheduled task kurulumu (21 aktif + 3 devre dışı)
5. CERN-1 Pine indikatörü TradingView'a yüklendi
6. S4 + CERN-1 + CERN-2 kapsamlı backtest raporu (Word)
7. GitHub Pages kurulumu (serezlio/byhook, PC kapalıyken erişim)
8. Robot simülasyon takip sistemi (SL/TP otomatik kontrol)
9. CERN-1/2 + S4 + VIOP-FLIP → sinyal gelince byhook_robots.js'e otomatik kayıt
10. Tüm task promptları CLAUDE.md'ye kaydedildi (Task #19)

---

## DEVAM EDEN / BEKLEYENLER

- [ ] **Task #20:** GitHub repo PRIVATE yap (serezlio/byhook → Settings → Danger Zone)
      → Telegram token public görünüyor: BOTTOKEN_GIZLI
      → Chrome MCP ile: github.com/serezlio/byhook/settings → Change repository visibility → Private
- [ ] **Task #21:** PC güvenlik kontrolü (sistemleri bozmadan): firewall, açık portlar, RDP, Windows Defender
- [ ] **Task #9:** CERN-2 / VIOP Pro strateji doğrulama ve TradingView testi
- [ ] byhook-robot-takip görevi ilk sinyalde test edilmeli
