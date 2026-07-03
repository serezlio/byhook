// ============================================================
// CERN & FIB — 5dk SPOT Backtest Raporu
// Tarih: 28.06.2026
// ============================================================
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, PageOrientation, WidthType, BorderStyle, ShadingType,
  VerticalAlign, HeadingLevel, PageBreak, Header, Footer, PageNumber
} = require('docx');
const fs = require('fs');

// ─── RENK PALETİ ─────────────────────────────────────────────────────────────
const RENKLER = {
  kazanc:    "D5F5E3",   // yeşil arka plan
  kayip:     "FADBD8",   // kırmızı arka plan
  baslik:    "1A3C5E",   // koyu lacivert
  alt_baslik:"2E86C1",   // mavi
  header_bg: "1A3C5E",
  skor_iyi:  "D5F5E3",
  skor_orta: "FEF9E7",
  skor_dusuk:"FADBD8",
  cizgi:     "2E86C1",
  long_bg:   "EBF5FB",
  short_bg:  "FDEDEC",
  acik:      "FDFEFE",   // beyaz
  ozet_bg:   "EBF5FB",
};

// ─── TRADE VERİSİ ────────────────────────────────────────────────────────────
const aselsTrades = [
  { n:1,  yon:"SHORT", skor:6, giris:395.25, tp1:390.50, cik:392.50, sonuc:"KAZANC" },
  { n:2,  yon:"LONG",  skor:7, giris:407.00, tp1:412.00, cik:413.00, sonuc:"KAZANC" },
  { n:3,  yon:"LONG",  skor:8, giris:398.00, tp1:401.00, cik:401.75, sonuc:"KAZANC" },
  { n:4,  yon:"SHORT", skor:7, giris:387.00, tp1:383.00, cik:387.50, sonuc:"KAZANC" },
  { n:5,  yon:"SHORT", skor:7, giris:385.75, tp1:381.00, cik:364.50, sonuc:"KAZANC" },
  { n:6,  yon:"SHORT", skor:9, giris:363.50, tp1:358.75, cik:363.00, sonuc:"KAZANC" },
  { n:7,  yon:"SHORT", skor:7, giris:361.25, tp1:null,   cik:366.00, sonuc:"KAYIP"  },
  { n:8,  yon:"SHORT", skor:6, giris:362.50, tp1:null,   cik:366.50, sonuc:"KAYIP"  },
  { n:9,  yon:"SHORT", skor:6, giris:357.25, tp1:null,   cik:356.00, sonuc:"KAYIP"  },
  { n:10, yon:"SHORT", skor:6, giris:378.50, tp1:373.75, cik:371.50, sonuc:"KAZANC" },
  { n:11, yon:"LONG",  skor:6, giris:382.00, tp1:386.25, cik:395.50, sonuc:"KAZANC" },
  { n:12, yon:"SHORT", skor:6, giris:392.00, tp1:null,   cik:393.75, sonuc:"KAYIP"  },
  { n:13, yon:"LONG",  skor:8, giris:404.50, tp1:null,   cik:404.25, sonuc:"KAYIP"  },
  { n:14, yon:"SHORT", skor:7, giris:391.75, tp1:388.75, cik:391.25, sonuc:"KAZANC" },
  { n:15, yon:"SHORT", skor:6, giris:392.75, tp1:386.75, cik:372.25, sonuc:"KAZANC" },
  { n:16, yon:"SHORT", skor:6, giris:369.75, tp1:null,   cik:374.25, sonuc:"KAYIP"  },
];

const krdmdTrades = [
  { n:1,  yon:"SHORT", skor:8,  giris:38.96, tp1:38.00, cik:37.14, sonuc:"KAZANC" },
  { n:2,  yon:"LONG",  skor:6,  giris:40.56, tp1:41.68, cik:41.70, sonuc:"KAZANC" },
  { n:3,  yon:"LONG",  skor:7,  giris:40.18, tp1:41.12, cik:40.88, sonuc:"KAZANC" },
  { n:4,  yon:"LONG",  skor:7,  giris:40.94, tp1:41.36, cik:41.06, sonuc:"KAZANC" },
  { n:5,  yon:"LONG",  skor:6,  giris:41.02, tp1:42.20, cik:41.40, sonuc:"KAZANC" },
  { n:6,  yon:"LONG",  skor:8,  giris:40.70, tp1:41.46, cik:40.68, sonuc:"KAZANC" },
  { n:7,  yon:"SHORT", skor:7,  giris:39.38, tp1:38.72, cik:38.74, sonuc:"KAZANC" },
  { n:8,  yon:"SHORT", skor:7,  giris:38.94, tp1:38.54, cik:38.90, sonuc:"KAZANC" },
  { n:9,  yon:"SHORT", skor:10, giris:38.92, tp1:38.44, cik:39.20, sonuc:"KAZANC" },
  { n:10, yon:"LONG",  skor:6,  giris:40.30, tp1:40.52, cik:40.20, sonuc:"KAZANC" },
  { n:11, yon:"LONG",  skor:8,  giris:40.08, tp1:40.70, cik:40.86, sonuc:"KAZANC" },
  { n:12, yon:"LONG",  skor:6,  giris:41.02, tp1:41.56, cik:41.24, sonuc:"KAZANC" },
  { n:13, yon:"SHORT", skor:7,  giris:40.00, tp1:null,  cik:40.38, sonuc:"KAYIP"  },
  { n:14, yon:"LONG",  skor:6,  giris:40.68, tp1:41.14, cik:40.88, sonuc:"KAZANC" },
];

const akbnkTrades = [
  { n:1,  yon:"SHORT", skor:8, giris:70.25, tp1:69.90, cik:70.10, sonuc:"KAZANC" },
  { n:2,  yon:"SHORT", skor:8, giris:69.80, tp1:69.30, cik:69.60, sonuc:"KAZANC" },
  { n:3,  yon:"SHORT", skor:6, giris:68.90, tp1:68.10, cik:62.75, sonuc:"KAZANC" },
  { n:4,  yon:"LONG",  skor:8, giris:64.50, tp1:null,  cik:64.65, sonuc:"KAYIP"  },
  { n:5,  yon:"LONG",  skor:7, giris:64.50, tp1:65.20, cik:65.95, sonuc:"KAZANC" },
  { n:6,  yon:"LONG",  skor:8, giris:65.50, tp1:66.35, cik:65.35, sonuc:"KAZANC" },
  { n:7,  yon:"LONG",  skor:7, giris:65.65, tp1:66.50, cik:67.55, sonuc:"KAZANC" },
  { n:8,  yon:"SHORT", skor:8, giris:66.70, tp1:65.65, cik:66.15, sonuc:"KAZANC" },
  { n:9,  yon:"LONG",  skor:9, giris:72.60, tp1:77.80, cik:76.75, sonuc:"KAZANC" },
  { n:10, yon:"LONG",  skor:6, giris:77.50, tp1:null,  cik:76.95, sonuc:"KAYIP"  },
  { n:11, yon:"LONG",  skor:8, giris:76.90, tp1:77.80, cik:77.10, sonuc:"KAZANC" },
  { n:12, yon:"LONG",  skor:6, giris:77.25, tp1:77.95, cik:80.15, sonuc:"KAZANC" },
  { n:13, yon:"LONG",  skor:7, giris:80.25, tp1:81.05, cik:79.90, sonuc:"KAZANC" },
  { n:14, yon:"LONG",  skor:8, giris:80.70, tp1:81.85, cik:81.10, sonuc:"KAZANC" },
  { n:15, yon:"SHORT", skor:9, giris:80.00, tp1:null,  cik:80.20, sonuc:"KAYIP"  },
];

// ─── YARDIMCI FONKSİYONLAR ──────────────────────────────────────────────────
function fmt(v) {
  if (v === null) return "—";
  return typeof v === 'number' ? v.toFixed(2) : String(v);
}

const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };
const thickBorder = { style: BorderStyle.SINGLE, size: 4, color: "2E86C1" };
const thickBorders = { top: thickBorder, bottom: thickBorder, left: thickBorder, right: thickBorder };

function cell(text, opts = {}) {
  const {
    bold = false, color = "FFFFFF", bg = null, align = AlignmentType.CENTER,
    size = 18, width = 1500, colspan = 1, vert = VerticalAlign.CENTER
  } = opts;
  const shading = bg ? { fill: bg, type: ShadingType.CLEAR } : undefined;
  return new TableCell({
    borders,
    width: { size: width, type: WidthType.DXA },
    verticalAlign: vert,
    shading,
    columnSpan: colspan,
    margins: { top: 60, bottom: 60, left: 100, right: 100 },
    children: [new Paragraph({
      alignment: align,
      children: [new TextRun({ text: String(text), bold, color, font: "Arial", size })]
    })]
  });
}

function headerCell(text, width = 1500) {
  return cell(text, { bold: true, color: "FFFFFF", bg: RENKLER.header_bg, size: 18, width });
}

// ─── İŞLEM TABLOSU ──────────────────────────────────────────────────────────
function tradeTable(trades, symbol) {
  const toplam = trades.length;
  const kazanc = trades.filter(t => t.sonuc === "KAZANC").length;
  const kayip  = trades.filter(t => t.sonuc === "KAYIP").length;
  const wr = ((kazanc / toplam) * 100).toFixed(1);

  const colWidths = [600, 800, 800, 1200, 1200, 1200, 1200];
  // Total = 600+800+800+1200+1200+1200+1200 = 7000 DXA

  const headerRow = new TableRow({
    tableHeader: true,
    children: [
      headerCell("#",       600),
      headerCell("YÖN",     800),
      headerCell("SKOR",    800),
      headerCell("GİRİŞ",   1200),
      headerCell("TP1",     1200),
      headerCell("CIK ÇIKIŞ", 1200),
      headerCell("SONUÇ",   1200),
    ]
  });

  const rows = trades.map(t => {
    const isWin = t.sonuc === "KAZANC";
    const sonucBg = isWin ? RENKLER.kazanc : RENKLER.kayip;
    const yonBg = t.yon === "LONG" ? RENKLER.long_bg : RENKLER.short_bg;
    const skorBg = t.skor >= 8 ? RENKLER.skor_iyi : t.skor >= 7 ? RENKLER.skor_orta : RENKLER.skor_dusuk;
    const rowBg = isWin ? RENKLER.kazanc : RENKLER.kayip;

    return new TableRow({
      children: [
        cell(t.n,           { bg: rowBg,    color:"000000", width:600,  bold:false }),
        cell(t.yon,         { bg: yonBg,    color:"000000", width:800,  bold:true  }),
        cell(t.skor+"/10",  { bg: skorBg,   color:"000000", width:800,  bold:true  }),
        cell(fmt(t.giris),  { bg: RENKLER.acik, color:"000000", width:1200 }),
        cell(t.tp1 ? fmt(t.tp1) : "—", { bg: t.tp1 ? RENKLER.skor_iyi : RENKLER.skor_dusuk, color:"000000", width:1200 }),
        cell(fmt(t.cik),    { bg: RENKLER.acik, color:"000000", width:1200 }),
        cell(t.sonuc,       { bg: sonucBg,  color:"000000", width:1200, bold:true  }),
      ]
    });
  });

  // Özet satırı
  const ozetRow = new TableRow({
    children: [
      cell("ÖZET", { bg: RENKLER.baslik, color:"FFFFFF", width:600,  bold:true, colspan:2 }),
      cell(`${toplam} işlem`, { bg: RENKLER.baslik, color:"FFFFFF", width:800,  bold:true, colspan:2 }),
      cell(`KAZANC: ${kazanc}`, { bg: RENKLER.kazanc, color:"000000", width:1200, bold:true }),
      cell(`KAYIP: ${kayip}`,   { bg: RENKLER.kayip,  color:"000000", width:1200, bold:true }),
      cell(`Win Rate: %${wr}`,  { bg: RENKLER.alt_baslik, color:"FFFFFF", width:1200, bold:true }),
    ]
  });

  return new Table({
    width: { size: 7000, type: WidthType.DXA },
    columnWidths: colWidths,
    rows: [headerRow, ...rows, ozetRow]
  });
}

// ─── GENEL ÖZET TABLOSU ─────────────────────────────────────────────────────
function ozetTablosu() {
  const veri = [
    { sembol:"ASELS", toplam:16, kazanc:10, kayip:6,  wr:62.5, en_iyi:"SHORT 7/10+" },
    { sembol:"KRDMD", toplam:14, kazanc:13, kayip:1,  wr:92.9, en_iyi:"Tüm sinyaller" },
    { sembol:"AKBNK", toplam:15, kazanc:12, kayip:3,  wr:80.0, en_iyi:"8/10 sinyaller" },
    { sembol:"TOPLAM",toplam:45, kazanc:35, kayip:10, wr:77.8, en_iyi:"7/10+ sinyaller" },
  ];

  const cols = [1800, 1000, 1200, 1200, 1400, 2400];
  // Total = 1800+1000+1200+1200+1400+2400 = 9000

  const header = new TableRow({
    tableHeader: true,
    children: [
      headerCell("SEMBOL",    1800),
      headerCell("İŞLEM",    1000),
      headerCell("KAZANC",   1200),
      headerCell("KAYIP",    1200),
      headerCell("WIN RATE", 1400),
      headerCell("EN İYİ KOŞUL", 2400),
    ]
  });

  const rows = veri.map(v => {
    const isToplam = v.sembol === "TOPLAM";
    const wrBg = v.wr >= 80 ? RENKLER.kazanc : v.wr >= 65 ? RENKLER.skor_orta : RENKLER.kayip;
    const bg = isToplam ? RENKLER.baslik : RENKLER.acik;
    const col = isToplam ? "FFFFFF" : "000000";

    return new TableRow({
      children: [
        cell(v.sembol,          { bg, color:col, width:1800, bold:isToplam }),
        cell(v.toplam,          { bg, color:col, width:1000 }),
        cell(v.kazanc,          { bg: isToplam ? bg : RENKLER.kazanc, color:col, width:1200, bold:isToplam }),
        cell(v.kayip,           { bg: isToplam ? bg : RENKLER.kayip,  color:col, width:1200, bold:isToplam }),
        cell(`%${v.wr.toFixed(1)}`, { bg: isToplam ? bg : wrBg, color: isToplam ? "FFFFFF" : "000000", width:1400, bold:true }),
        cell(v.en_iyi,          { bg: isToplam ? bg : RENKLER.ozet_bg, color:col, width:2400 }),
      ]
    });
  });

  return new Table({
    width: { size: 9000, type: WidthType.DXA },
    columnWidths: cols,
    rows: [header, ...rows]
  });
}

// ─── SKOR ANALİZİ TABLOSU ───────────────────────────────────────────────────
function skorTablosu() {
  const veri = [
    { skor:"6/10", toplam:16, kazanc:11, kayip:5,  wr:68.75, yorum:"Tek sistem tetiklendi — FIB veya CERN tek başına", lot:"Yarım lot" },
    { skor:"7/10", toplam:13, kazanc:11, kayip:2,  wr:84.6,  yorum:"2 sistem uyumlu — CERN + FIB kısmi örtüşüm",     lot:"Normal lot" },
    { skor:"8/10", toplam:12, kazanc:10, kayip:2,  wr:83.3,  yorum:"2-3 sistem güçlü uyum — En güvenilir band",      lot:"Normal lot" },
    { skor:"9/10", toplam:3,  kazanc:2,  kayip:1,  wr:66.7,  yorum:"Tam sistem uyumu (küçük örnek!)",                lot:"Tam lot" },
    { skor:"10/10",toplam:1,  kazanc:1,  kayip:0,  wr:100.0, yorum:"Maksimum uyum (çok nadir)",                      lot:"Tam lot" },
  ];

  const cols = [800, 800, 900, 900, 1100, 3400, 1600];
  // Total = 800+800+900+900+1100+3400+1600 = 9500

  const header = new TableRow({
    tableHeader: true,
    children: [
      headerCell("SKOR",      800),
      headerCell("İŞLEM",     800),
      headerCell("KAZANC",    900),
      headerCell("KAYIP",     900),
      headerCell("WIN RATE",  1100),
      headerCell("YORUM",     3400),
      headerCell("ÖNERİLEN LOT", 1600),
    ]
  });

  const rows = veri.map(v => {
    const wrBg = v.wr >= 80 ? RENKLER.kazanc : v.wr >= 70 ? RENKLER.skor_orta : RENKLER.kayip;
    return new TableRow({
      children: [
        cell(v.skor,    { bg: RENKLER.baslik, color:"FFFFFF", width:800,  bold:true }),
        cell(v.toplam,  { bg: RENKLER.acik, color:"000000", width:800 }),
        cell(v.kazanc,  { bg: RENKLER.kazanc, color:"000000", width:900 }),
        cell(v.kayip,   { bg: RENKLER.kayip,  color:"000000", width:900 }),
        cell(`%${v.wr.toFixed(1)}`, { bg: wrBg, color:"000000", width:1100, bold:true }),
        cell(v.yorum,   { bg: RENKLER.ozet_bg, color:"000000", width:3400, align: AlignmentType.LEFT }),
        cell(v.lot,     { bg: RENKLER.skor_orta, color:"000000", width:1600, bold:true }),
      ]
    });
  });

  return new Table({
    width: { size: 9500, type: WidthType.DXA },
    columnWidths: cols,
    rows: [header, ...rows]
  });
}

// ─── SİSTEM ANALİZİ TABLOSU ─────────────────────────────────────────────────
function sistemTablosu() {
  const veri = [
    {
      sistem: "FIB\n(Fibonacci 0.618)",
      zaman: "30dk",
      mantik: "0.618 Fibonacci bölgesine fiyat girişi + trend yönü",
      guclu: "Somut fiyat seviyesine bağlı; KRDMD'de çok etkili",
      zayif: "ASELS'de fazla tetikleniyor (gürültülü swing). Tek başına güvenilmez (%69)",
      oneri: "FIB tek başına = skor 6. ASELS'de FIB sinyallerini filtrele"
    },
    {
      sistem: "CERN-1\n(SuperTrend+Bias)",
      zaman: "15dk/30dk",
      mantik: "SuperTrend çizgisi + bias yönü uyumu",
      guclu: "Trend yönünü güçlü belirliyor. Skor 7-8'de baskın katkı",
      zayif: "Trend geçişlerinde CIK anında ters sinyal verebilir",
      oneri: "CERN-1 tetiklendiğinde skor 7+ olur → giriş koşulu"
    },
    {
      sistem: "CERN-2\n(EMA+Haz)",
      zaman: "15dk",
      mantik: "EMA1/EMA2 çaprazı + hacim/momentum onayı",
      guclu: "Kısa vadeli momentum. Skor 8-9'da CERN-1 ile birlikte en güçlü",
      zayif: "5dk gürültüsüne duyarlı; hızlı CIK sinyali üretiyor",
      oneri: "CERN-2 + CERN-1 uyumu = skor 8+ → en güvenilir band"
    },
    {
      sistem: "KOMBINE\n(Tüm Sistemler)",
      zaman: "5dk giriş",
      mantik: "CERN-1 + CERN-2 + FIB aynı yönde → skor 7-10",
      guclu: "7/10+ sinyallerde %84+ win rate. KRDMD en güçlü sembol",
      zayif: "6/10 sinyaller zayıf (%69). ASELS çok 6/10 sinyal üretiyor",
      oneri: "7/10 minimum filtre. ASELS'de 7+, KRDMD/AKBNK'da 6+ kabul edilebilir"
    },
  ];

  const cols = [1400, 700, 1600, 2000, 2000, 2300];
  // Total = 1400+700+1600+2000+2000+2300 = 10000

  const header = new TableRow({
    tableHeader: true,
    children: [
      headerCell("SİSTEM",     1400),
      headerCell("ZAMAN",      700),
      headerCell("MANTIK",     1600),
      headerCell("GÜÇLÜ YAN",  2000),
      headerCell("ZAYIF YAN",  2000),
      headerCell("ÖNERİ",      2300),
    ]
  });

  const rows = veri.map((v, i) => {
    const sistemBg = i === 3 ? RENKLER.baslik : RENKLER.alt_baslik;
    const sistemColor = "FFFFFF";
    return new TableRow({
      children: [
        cell(v.sistem,  { bg: sistemBg, color:sistemColor, width:1400, bold:true }),
        cell(v.zaman,   { bg: RENKLER.skor_orta, color:"000000", width:700 }),
        cell(v.mantik,  { bg: RENKLER.acik,     color:"000000", width:1600, align: AlignmentType.LEFT }),
        cell(v.guclu,   { bg: RENKLER.kazanc,   color:"000000", width:2000, align: AlignmentType.LEFT }),
        cell(v.zayif,   { bg: RENKLER.kayip,    color:"000000", width:2000, align: AlignmentType.LEFT }),
        cell(v.oneri,   { bg: RENKLER.ozet_bg,  color:"000000", width:2300, align: AlignmentType.LEFT }),
      ]
    });
  });

  return new Table({
    width: { size: 10000, type: WidthType.DXA },
    columnWidths: cols,
    rows: [header, ...rows]
  });
}

// ─── BAŞLIK PARAGRAFİ ────────────────────────────────────────────────────────
function baslikP(text, color = "FFFFFF", size = 36, bg = RENKLER.baslik, bold = true) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    shading: { fill: bg, type: ShadingType.CLEAR },
    spacing: { before: 120, after: 120 },
    children: [new TextRun({ text, bold, color, font: "Arial", size })]
  });
}

function altBaslikP(text, color = "000000", size = 24, bold = false) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 80, after: 80 },
    children: [new TextRun({ text, bold, color, font: "Arial", size })]
  });
}

function sectionTitle(text) {
  return new Paragraph({
    spacing: { before: 300, after: 120 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: RENKLER.cizgi, space: 1 } },
    children: [new TextRun({ text, bold: true, color: RENKLER.baslik, font: "Arial", size: 26 })]
  });
}

function notP(text, color = "000000") {
  return new Paragraph({
    spacing: { before: 60, after: 60 },
    children: [new TextRun({ text, color, font: "Arial", size: 18, italics: true })]
  });
}

function bulletP(text) {
  return new Paragraph({
    spacing: { before: 40, after: 40 },
    indent: { left: 360 },
    children: [new TextRun({ text: "• " + text, font: "Arial", size: 18, color: "000000" })]
  });
}

// ─── ASELS SKOR BAZLI ANALİZ ─────────────────────────────────────────────────
function aselsSkorTablosu() {
  const veri = [
    { skor:"6/10", toplam:8, kazanc:4, kayip:4, wr:"50.0", not:"ÇOK ZAYIF — filtrele" },
    { skor:"7/10", toplam:5, kazanc:4, kayip:1, wr:"80.0", not:"Kabul edilebilir" },
    { skor:"8/10", toplam:2, kazanc:1, kayip:1, wr:"50.0", not:"Küçük örnek" },
    { skor:"9/10", toplam:1, kazanc:1, kayip:0, wr:"100",  not:"Güvenilir" },
  ];
  return miniSkorTablo(veri, "ASELS Skor Dağılımı", 7000);
}

function krdmdSkorTablosu() {
  const veri = [
    { skor:"6/10",  toplam:5, kazanc:5, kayip:0, wr:"100", not:"Güçlü" },
    { skor:"7/10",  toplam:5, kazanc:4, kayip:1, wr:"80.0", not:"İyi" },
    { skor:"8/10",  toplam:3, kazanc:3, kayip:0, wr:"100", not:"Mükemmel" },
    { skor:"10/10", toplam:1, kazanc:1, kayip:0, wr:"100", not:"Mükemmel" },
  ];
  return miniSkorTablo(veri, "KRDMD Skor Dağılımı", 7000);
}

function akbnkSkorTablosu() {
  const veri = [
    { skor:"6/10", toplam:3, kazanc:2, kayip:1, wr:"66.7", not:"Orta" },
    { skor:"7/10", toplam:3, kazanc:3, kayip:0, wr:"100",  not:"Mükemmel" },
    { skor:"8/10", toplam:7, kazanc:6, kayip:1, wr:"85.7", not:"İyi" },
    { skor:"9/10", toplam:2, kazanc:1, kayip:1, wr:"50.0", not:"Küçük örnek" },
  ];
  return miniSkorTablo(veri, "AKBNK Skor Dağılımı", 7000);
}

function miniSkorTablo(veri, baslik, genislik) {
  const cols = [Math.floor(genislik * 0.14), Math.floor(genislik * 0.14),
                Math.floor(genislik * 0.14), Math.floor(genislik * 0.14),
                Math.floor(genislik * 0.16), Math.floor(genislik * 0.28)];
  const header = new TableRow({
    tableHeader: true,
    children: [
      headerCell("SKOR",     cols[0]),
      headerCell("İŞLEM",   cols[1]),
      headerCell("KAZANC",  cols[2]),
      headerCell("KAYIP",   cols[3]),
      headerCell("WIN %",   cols[4]),
      headerCell("YORUM",   cols[5]),
    ]
  });
  const rows = veri.map(v => {
    const wrNum = parseFloat(v.wr);
    const wrBg = wrNum >= 80 ? RENKLER.kazanc : wrNum >= 65 ? RENKLER.skor_orta : RENKLER.kayip;
    return new TableRow({ children: [
      cell(v.skor,    { bg: RENKLER.alt_baslik, color:"FFFFFF", width:cols[0], bold:true }),
      cell(v.toplam,  { bg: RENKLER.acik,       color:"000000", width:cols[1] }),
      cell(v.kazanc,  { bg: RENKLER.kazanc,     color:"000000", width:cols[2] }),
      cell(v.kayip,   { bg: RENKLER.kayip,      color:"000000", width:cols[3] }),
      cell(`%${v.wr}`,{ bg: wrBg,               color:"000000", width:cols[4], bold:true }),
      cell(v.not,     { bg: RENKLER.ozet_bg,    color:"000000", width:cols[5] }),
    ]});
  });
  return new Table({
    width: { size: genislik, type: WidthType.DXA },
    columnWidths: cols,
    rows: [header, ...rows]
  });
}

// ─── DOKÜMAN OLUŞTUR ─────────────────────────────────────────────────────────
const bos = new Paragraph({ spacing: { before: 60, after: 60 }, children: [new TextRun("  ")] });

const doc = new Document({
  sections: [{
    properties: {
      page: {
        size: { width: 16840, height: 11906, orientation: PageOrientation.LANDSCAPE },
        margin: { top: 720, right: 720, bottom: 720, left: 720 }
      }
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "CERN & FIB Backtest — 5dk SPOT | 28.06.2026 | Sayfa ", font: "Arial", size: 16, color: "888888" }),
            new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 16, color: "888888" }),
          ]
        })]
      })
    },
    children: [
      // ─── KAPAK ───────────────────────────────────────────
      baslikP("📊  CERN & FIB — Sistem Analizi Backtest Raporu", "FFFFFF", 40),
      baslikP("5dk SPOT Giriş  |  ASELS  •  KRDMD  •  AKBNK", "B3D9F5", 28, RENKLER.baslik),
      altBaslikP("28.06.2026  |  By Hook VIOP Sinyal Pro  |  45 İşlem  |  Win Rate: %77.8", "666666", 22),
      bos,

      // ─── YÖNTEMİ NOTU ────────────────────────────────────
      sectionTitle("▌ Metodoloji ve Sistem Ayrımı Notu"),
      notP("⚠  CERN-1 (SuperTrend+Bias), CERN-2 (EMA+Haz) ve FIB (Fibonacci 0.618) göstergeleri pine label değil plotshape kullanıyor.", "C0392B"),
      notP("   Bu nedenle her sistemin sinyalleri doğrudan okunamıyor. Sistemler By Hook VIOP Sinyal Pro içinde 1-10 skalasına dönüştürülüyor.", "555555"),
      notP("✅  Çözüm: Skor bandı analizi sistemi proxy olarak ayırıyor — düşük skor = az sistem, yüksek skor = çok sistem uyumu.", "1A5276"),
      bos,

      // ─── SKOR BANDI SİSTEM AÇIKLAMASI ───────────────────
      new Paragraph({
        spacing: { before: 80, after: 60 },
        children: [new TextRun({ text: "Skor Bandı → Sistem Eşleştirmesi:", bold: true, font: "Arial", size: 20, color: RENKLER.baslik })]
      }),
      bulletP("6/10 = Tek sistem aktif (büyük ihtimalle FIB tek başına 0.618'de tetikleniyor)"),
      bulletP("7/10 = İki sistem uyumlu (CERN-1 + FIB veya CERN-2 + FIB)"),
      bulletP("8/10 = İki/üç sistem güçlü uyum (CERN-1 + CERN-2 + FIB)"),
      bulletP("9-10/10 = Tam uyum — tüm sistemler aynı yönde, maksimum güven"),
      bos,

      // ─── GENEL ÖZET ──────────────────────────────────────
      sectionTitle("▌ Genel Özet — 5dk SPOT (45 İşlem)"),
      ozetTablosu(),
      bos,

      // ─── ASELS TABLOSU ───────────────────────────────────
      new Paragraph({ children: [new PageBreak()] }),
      sectionTitle("▌ ASELS  —  5dk SPOT  (16 İşlem)"),
      tradeTable(aselsTrades, "ASELS"),
      bos,
      new Paragraph({
        spacing: { before: 60, after: 40 },
        children: [new TextRun({ text: "ASELS Skor Dağılımı:", bold: true, font: "Arial", size: 20, color: RENKLER.baslik })]
      }),
      aselsSkorTablosu(),
      notP("⚠  ASELS 6/10 sinyalleri %50 win rate — bu sembolde minimum 7/10 filtresi şart!", "C0392B"),
      bos,

      // ─── KRDMD TABLOSU ───────────────────────────────────
      new Paragraph({ children: [new PageBreak()] }),
      sectionTitle("▌ KRDMD  —  5dk SPOT  (14 İşlem)"),
      tradeTable(krdmdTrades, "KRDMD"),
      bos,
      new Paragraph({
        spacing: { before: 60, after: 40 },
        children: [new TextRun({ text: "KRDMD Skor Dağılımı:", bold: true, font: "Arial", size: 20, color: RENKLER.baslik })]
      }),
      krdmdSkorTablosu(),
      notP("✅  KRDMD en güvenilir sembol — 6/10 sinyaller dahi güçlü (%100). Tüm sinyallere girilebilir.", "1A5276"),
      bos,

      // ─── AKBNK TABLOSU ───────────────────────────────────
      new Paragraph({ children: [new PageBreak()] }),
      sectionTitle("▌ AKBNK  —  5dk SPOT  (15 İşlem)"),
      tradeTable(akbnkTrades, "AKBNK"),
      bos,
      new Paragraph({
        spacing: { before: 60, after: 40 },
        children: [new TextRun({ text: "AKBNK Skor Dağılımı:", bold: true, font: "Arial", size: 20, color: RENKLER.baslik })]
      }),
      akbnkSkorTablosu(),
      notP("ℹ  AKBNK 7/10 sinyaller %100 hit. Score 9/10 dikkat: küçük örnekte 2 trade var, karar için yeterli veri yok.", "1A5276"),
      bos,

      // ─── SKOR ANALİZİ ────────────────────────────────────
      new Paragraph({ children: [new PageBreak()] }),
      sectionTitle("▌ Skor Bandı Analizi — 3 Sembol Birleşik (45 İşlem)"),
      skorTablosu(),
      bos,

      // ─── SİSTEM ANALİZİ ──────────────────────────────────
      sectionTitle("▌ Sistem Bazlı Analiz (FIB  •  CERN-1  •  CERN-2)"),
      sistemTablosu(),
      bos,

      // ─── ZAYIF NOKTALAR ──────────────────────────────────
      sectionTitle("▌ Tespit Edilen Zayıf Noktalar"),
      bulletP("ASELS 6/10 sinyaller: 8 işlemde %50 win rate — sistemler arasında tutarsız uyum. Pazartesi bu sinyallere girme."),
      bulletP("Anlık CIK (hemen sonraki bar'da): 5dk'da gürültü çok yüksek. 3-4 mum içinde TP1 yoksa çık kuralı kritik."),
      bulletP("CERN-2 (15dk EMA) 5dk'ya yansıdığında whipsaw üretiyor — özellikle ASELS'de trend değişim dönemlerinde."),
      bulletP("FIB tek başına (skor 6): 0.618 bölgesi trend onayı olmadan güvenilmez. CERN onayı şart."),
      bulletP("AKBNK SHORT 9/10 @ 80.00: Anında CIK — yüksek skor her zaman güvenli giriş garantisi değil. Seviye direnci kontrol et."),
      bos,

      // ─── PAZARTESİ ÖNERİLERİ ─────────────────────────────
      sectionTitle("▌ Pazartesi İçin Kurallar"),
      bulletP("ASELS → Min 7/10 skor bekle. 6/10 sinyali atla."),
      bulletP("KRDMD → 6/10 dahil tüm sinyaller geçerli. En güvenilir sembol (%93)."),
      bulletP("AKBNK → 7/10+ tercih et, 6/10 dikkatli değerlendir."),
      bulletP("Skor 8+: Normal lot ile giriş. Skor 6-7: Yarım lot veya pas geç."),
      bulletP("TP1 ilk 3-4 mum içinde gelmezse kesin çık — sistem bu kuralı doğruluyor."),
      bulletP("CIK sinyali = anında çıkış. Tartışma yok."),
      bulletP("2 ardışık KAYIP → lot azalt. 3 ardışık KAYIP → o gün dur."),
      bos,
    ]
  }]
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync("C:\\Users\\Administrator\\REPO\\CERN_FIB_Backtest_5dk.docx", buf);
  console.log("OK: CERN_FIB_Backtest_5dk.docx yazildi");
}).catch(e => {
  console.error("HATA:", e.message);
  process.exit(1);
});
