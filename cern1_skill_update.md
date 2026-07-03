## CERN-1 SKILL.MD GÜNCELLEMESİ
Bu metni C:\Users\Administrator\Claude\Scheduled\cern1-canli-tarayici\SKILL.md dosyasına ekle
(## ADIMLAR bölümünü ve altına şunu ekle):

---

## ADIMLAR
1. TradingView MCP ile her sembol için 15m grafiğe geç
2. CERN-1 indikatörünü oku: F, Bias, ST değerlerini al
3. LONG veya SHORT koşulu oluşuyorsa devam et
4. State kontrolü: C:\Users\Administrator\.claude\cern1_state.json → aynı sembol için son 30 dakikada sinyal gönderdiysen atla
5. PUAN HESAPLA (aşağıya bak)
6. Telegram'a formatlanmış mesaj gönder
7. SADECE GİRİŞ İZNİ VAR ise → byhook_robots.js güncelle (aşağıya bak)
8. State dosyasını güncelle

## BYHOOK ROBOT TRADE YAZMA (Adım 7)
GİRİŞ İZNİ VAR olan sinyaller için C:\Users\Administrator\REPO\byhook_robots.js dosyasını güncelle:

1. Mevcut dosyayı Read tool ile oku
2. window.BYHOOK_ROBOTS = [...] array'ini parse et
3. Aynı sembol için zaten açık (durum="acik") robot trade varsa:
   - Ters yönde sinyal: o trade'i kapat → cikis_zaman=simdi, durum="kapali", pnl:null bırak
   - Aynı yönde sinyal: atla, trade zaten açık
4. Yeni trade ekle:
   {
     "id": "c1_SEMBOL_TIMESTAMP",
     "sistem": "CERN-1",
     "sembol": "SEMBOL",
     "yon": "LONG veya SHORT",
     "giris": F_degeri,
     "cikis": null,
     "kontrat": 2,
     "durum": "acik",
     "giris_zaman": "ISO_ZAMAN",
     "cikis_zaman": null,
     "pnl": null,
     "puan": PUAN_DEGERI,
     "giris_izni": true,
     "not": "kisa_not_metni"
   }
5. Dosyayı Write tool ile yaz:
   // Bu dosya CERN-1 ve CERN-2 gorevleri tarafindan otomatik guncellenir.
   window.BYHOOK_ROBOTS = [ARRAY_ICERIGI];
