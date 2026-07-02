// Bu dosya byhook-robot-takip ve sinyal tarayici gorevleri tarafindan otomatik guncellenir.
// Elle duzenlemeyiniz.
// Son guncelleme: 2026-07-03
//
// Veri yapisi:
// {
//   id: string            — benzersiz kimlik (robot_sembol_tarih_saat)
//   tip: 'robot'
//   sistem: string        — 'CERN-1' | 'CERN-2' | 'S4' | 'VIOP-FLIP'
//   sembol: string        — 'ASELS' | 'AKBNK' | 'THYAO' | 'KRDMD' | 'TCELL'
//   yon: string           — 'LONG' | 'SHORT'
//   giris: number         — giris fiyati
//   sl: number            — stop loss fiyati (LONG: S1, SHORT: R1)
//   tp: number            — hedef fiyati (LONG: R1, SHORT: S1)
//   puan: number          — sinyal puani (1-10)
//   giris_izni: boolean   — puan >= 6 ise true
//   kontrat: number       — simülasyon kontrat sayisi (her zaman 1)
//   durum: string         — 'acik' | 'kapali'
//   sonuc: string|null    — 'TP' | 'SL' | null (acik ise null)
//   giris_zaman: string   — ISO 8601 UTC
//   cikis_zaman: string|null
//   cikis: number|null    — cikis fiyati
//   pnl: number|null      — kar/zarar TL (puan_fark * 100 * 1)
//   puan_fark: number|null — fiyat farki (puan cinsinden)
//   not: string           — sinyal notu
// }
//
// Simülasyon P&L hesabi:
//   LONG : puan_fark = cikis - giris
//   SHORT: puan_fark = giris - cikis
//   pnl  = puan_fark * 100 (carpan) * 1 (kontrat)
//
window.BYHOOK_ROBOTS = [
];
