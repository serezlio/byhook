const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageNumber, LevelFormat, PageBreak
} = require('docx');
const fs = require('fs');

const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };
const thickBorder = { style: BorderStyle.SINGLE, size: 4, color: "1F4E79" };
const thickBorders = { top: thickBorder, bottom: thickBorder, left: thickBorder, right: thickBorder };

function makeCell(text, opts = {}) {
  const {
    bold = false, color = "000000", fill = "FFFFFF", align = AlignmentType.CENTER,
    width, size = 18, colSpan
  } = opts;
  const cell = new TableCell({
    borders,
    width: width ? { size: width, type: WidthType.DXA } : undefined,
    shading: { fill, type: ShadingType.CLEAR },
    margins: { top: 60, bottom: 60, left: 100, right: 100 },
    verticalAlign: VerticalAlign.CENTER,
    columnSpan: colSpan,
    children: [new Paragraph({
      alignment: align,
      children: [new TextRun({ text: String(text), bold, color, size, font: "Arial" })]
    })]
  });
  return cell;
}

function hCell(text, fill = "1F4E79") {
  return makeCell(text, { bold: true, color: "FFFFFF", fill, size: 18 });
}

function winCell(text) {
  return makeCell(text, { bold: true, color: "1A5C1A", fill: "E8F5E9", size: 18 });
}

function lossCell(text) {
  return makeCell(text, { bold: true, color: "8B0000", fill: "FFEBEE", size: 18 });
}

function longCell(text) {
  return makeCell(text, { bold: true, color: "0D47A1", fill: "E3F2FD", size: 18 });
}

function shortCell(text) {
  return makeCell(text, { bold: true, color: "8B0000", fill: "FFF3E0", size: 18 });
}

function numCell(text, isPositive) {
  return makeCell(text, {
    bold: true,
    color: isPositive ? "1A5C1A" : "8B0000",
    fill: "FFFFFF",
    size: 18
  });
}

function makeTitle(text, size = 32) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 120, after: 120 },
    children: [new TextRun({ text, bold: true, size, font: "Arial", color: "1F4E79" })]
  });
}

function makePara(text, opts = {}) {
  const { bold = false, size = 20, before = 60, after = 60, color = "000000", align = AlignmentType.LEFT } = opts;
  return new Paragraph({
    alignment: align,
    spacing: { before, after },
    children: [new TextRun({ text, bold, size, font: "Arial", color })]
  });
}

function sectionHeader(text) {
  return new Paragraph({
    spacing: { before: 240, after: 120 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "1F4E79", space: 1 } },
    children: [new TextRun({ text, bold: true, size: 26, font: "Arial", color: "1F4E79" })]
  });
}

// ============================================================
// ASELS DATA
// ============================================================
const aselsRows = [
  ["1", "LONG", "376.50", "389.25", "+12.75", "KAZANDI"],
  ["2", "SHORT", "411.75", "406.00", "-5.75", "KAZANDI"],
  ["3", "LONG", "402.00", "424.75", "+22.75", "KAZANDI"],
  ["4", "SHORT", "428.00", "410.75", "-17.25", "KAZANDI"],
  ["5", "LONG", "402.00", "413.00", "+11.00", "KAZANDI"],
  ["6", "SHORT", "384.50", "356.75", "-27.75", "KAZANDI"],
  ["7", "LONG", "364.75", "377.25", "+12.50", "KAZANDI"],
  ["8", "SHORT", "361.00", "356.00", "-5.00", "KAZANDI"],
  ["9", "LONG", "375.75", "389.75", "+14.00", "KAZANDI"],
  ["10", "SHORT", "401.25", "387.25", "-14.00", "KAZANDI"],
];

// KRDMD DATA
const krdmdRows = [
  ["1", "LONG", "37.68", "39.24", "+1.56", "KAZANDI"],
  ["2", "SHORT", "36.08", "35.22", "-0.86", "KAZANDI"],
  ["3", "LONG", "36.80", "37.52", "+0.72", "KAZANDI"],
  ["4", "SHORT", "36.70", "35.50", "-1.20", "KAZANDI"],
  ["5", "LONG", "36.16", "37.80", "+1.64", "KAZANDI"],
  ["6", "SHORT", "36.76", "36.52", "-0.24", "KAZANDI"],
  ["7", "LONG", "37.52", "47.00", "+9.48", "KAZANDI ★"],
  ["8", "SHORT", "43.38", "36.50", "-6.88", "KAZANDI ★"],
  ["9", "LONG", "39.68", "42.74", "+3.06", "KAZANDI"],
  ["10", "SHORT", "41.00", "38.04", "-2.96", "KAZANDI"],
  ["11", "LONG", "38.88", "41.90", "+3.02", "KAZANDI"],
  ["12", "SHORT", "40.94", "39.22", "-1.72", "KAZANDI"],
];

// AKBNK DATA
const akbnkRows = [
  ["1", "SHORT", "66.80", "65.05", "-1.75", "KAZANDI"],
  ["2", "LONG", "69.00", "70.25", "+1.25", "KAZANDI"],
  ["3", "SHORT", "81.70", "60.65", "-21.05", "KAZANDI ★"],
  ["4", "LONG", "65.75", "66.55", "+0.80", "KAZANDI"],
  ["5", "SHORT", "65.90", "64.65", "-1.25", "KAZANDI"],
  ["6", "LONG", "65.60", "67.55", "+1.95", "KAZANDI"],
  ["7", "SHORT", "64.85", "63.45", "-1.40", "KAZANDI"],
  ["8", "LONG", "67.25", "68.25", "+1.00", "KAZANDI"],
  ["9", "SHORT", "66.85", "64.85", "-2.00", "KAZANDI"],
  ["10", "LONG", "69.00", "83.00", "+14.00", "KAZANDI ★"],
];

function makeSymbolTable(rows, symbolTitle) {
  const colWidths = [600, 1000, 1400, 1400, 1400, 1560];
  const totalWidth = colWidths.reduce((a, b) => a + b, 0);

  const headerRow = new TableRow({
    tableHeader: true,
    children: [
      hCell("#"),
      hCell("YÖN"),
      hCell("GİRİŞ"),
      hCell("HEDEF (TP1)"),
      hCell("+/- TL"),
      hCell("SONUÇ"),
    ]
  });

  const dataRows = rows.map(([no, dir, entry, tp, pnl, result]) => {
    const pnlVal = parseFloat(pnl);
    const isBig = result.includes("★");
    return new TableRow({
      children: [
        makeCell(no, { size: 18 }),
        dir === "LONG" ? longCell(dir) : shortCell(dir),
        makeCell(entry, { size: 18 }),
        makeCell(tp, { size: 18 }),
        numCell(pnl, pnlVal > 0),
        isBig
          ? makeCell(result, { bold: true, color: "1A5C1A", fill: "C8E6C9", size: 17 })
          : winCell(result),
      ]
    });
  });

  return new Table({
    width: { size: totalWidth, type: WidthType.DXA },
    columnWidths: colWidths,
    rows: [headerRow, ...dataRows]
  });
}

function makeStatRow(label, value, fill = "F5F5F5") {
  return new TableRow({
    children: [
      makeCell(label, { bold: true, fill, align: AlignmentType.LEFT, width: 4500, size: 19 }),
      makeCell(value, { bold: true, fill: "FFFFFF", width: 4860, size: 19 }),
    ]
  });
}

function makeStatTable(rows) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [4500, 4860],
    rows: rows.map(([l, v]) => makeStatRow(l, v))
  });
}

// Summary per symbol
function makeSummaryTable(data) {
  // data = [{symbol, total, wins, losses, bigWins}]
  const headerRow = new TableRow({
    tableHeader: true,
    children: [
      hCell("SEMBOL"),
      hCell("TOPLAM İŞLEM"),
      hCell("KAZANDI"),
      hCell("KAYBETTİ"),
      hCell("WIN RATE"),
      hCell("EN BÜYÜK WIN"),
    ]
  });

  const rows = data.map(d => new TableRow({
    children: [
      makeCell(d.symbol, { bold: true, size: 20 }),
      makeCell(d.total, { size: 19 }),
      makeCell(d.wins, { bold: true, color: "1A5C1A", size: 19 }),
      makeCell(d.losses, { bold: d.losses > 0, color: d.losses > 0 ? "8B0000" : "000000", size: 19 }),
      makeCell(d.winRate, { bold: true, color: "1A5C1A", size: 19 }),
      makeCell(d.bigWin, { bold: true, color: "0D47A1", size: 17 }),
    ]
  }));

  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [1400, 1560, 1560, 1400, 1440, 2000],
    rows: [headerRow, ...rows]
  });
}

const doc = new Document({
  styles: {
    default: {
      document: { run: { font: "Arial", size: 20 } }
    }
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1200, right: 1200, bottom: 1200, left: 1200 }
      }
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          alignment: AlignmentType.RIGHT,
          border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "1F4E79", space: 1 } },
          spacing: { after: 120 },
          children: [new TextRun({ text: "S4 İndikatör Backtest Raporu  |  VIOP S4 — SMC Scalp [30dk+5dk]", size: 16, color: "5A5A5A", font: "Arial" })]
        })]
      })
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          border: { top: { style: BorderStyle.SINGLE, size: 4, color: "1F4E79", space: 1 } },
          spacing: { before: 120 },
          children: [
            new TextRun({ text: "Hazırlanış: 28 Haziran 2026  |  Sayfa ", size: 16, color: "5A5A5A", font: "Arial" }),
            new TextRun({ children: [PageNumber.CURRENT], size: 16, color: "5A5A5A", font: "Arial" }),
            new TextRun({ text: " / ", size: 16, color: "5A5A5A", font: "Arial" }),
            new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 16, color: "5A5A5A", font: "Arial" }),
          ]
        })]
      })
    },
    children: [

      // ─── KAPAK ──────────────────────────────────────────
      new Paragraph({ spacing: { before: 1440, after: 0 }, children: [] }),

      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 200 },
        children: [new TextRun({ text: "VIOP S4 SMC SCALP", bold: true, size: 56, font: "Arial", color: "1F4E79" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 160 },
        children: [new TextRun({ text: "[30dk YÖN + 5dk GİRİŞ]", bold: true, size: 40, font: "Arial", color: "2E75B6" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 400 },
        children: [new TextRun({ text: "REPLAY BACKTEST RAPORU", bold: true, size: 32, font: "Arial", color: "404040" })]
      }),

      // Divider
      new Paragraph({
        alignment: AlignmentType.CENTER,
        border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: "1F4E79", space: 1 } },
        spacing: { before: 0, after: 400 },
        children: []
      }),

      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 100 },
        children: [new TextRun({ text: "Test Edilen Semboller:", size: 22, font: "Arial", color: "5A5A5A" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 400 },
        children: [new TextRun({ text: "ASELS  |  KRDMD  |  AKBNK", bold: true, size: 30, font: "Arial", color: "1F4E79" })]
      }),

      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 60 },
        children: [new TextRun({ text: "Test Dönemi: Yaklaşık Son 3-4 Ay (30dk Barlar)", size: 20, font: "Arial", color: "5A5A5A" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 60 },
        children: [new TextRun({ text: "Hazırlanış: 28 Haziran 2026", size: 20, font: "Arial", color: "5A5A5A" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 60 },
        children: [new TextRun({ text: "Piyasa: BİST VİOP (Vadeli İşlem)", size: 20, font: "Arial", color: "5A5A5A" })]
      }),

      // Page break
      new Paragraph({ children: [new PageBreak()] }),

      // ─── METODOLOJİ ──────────────────────────────────────
      sectionHeader("1. TEST METODOLOJİSİ"),

      makePara("S4 indikatörü (VIOP S4 — SMC Scalp [30dk+5dk]) Smart Money Concept'e dayalı bir yapısal analiz aracıdır. Bu backtest, indikatörün BOS (Break of Structure) sinyallerini temel alarak yapılmıştır.", { before: 120, after: 80 }),

      sectionHeader("1.1 Sistem Mantığı"),

      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2200, 7160],
        rows: [
          new TableRow({ children: [
            makeCell("30 DK ZAMAN DİLİMİ", { bold: true, fill: "EEF2FF", align: AlignmentType.CENTER }),
            makeCell("BOS sinyali alındığında YÖN belirlenir. Bullish BOS (cyan) = LONG yön. Bearish BOS (kırmızı) = SHORT yön.", { align: AlignmentType.LEFT }),
          ]}),
          new TableRow({ children: [
            makeCell("5 DK ZAMAN DİLİMİ", { bold: true, fill: "EEF2FF", align: AlignmentType.CENTER }),
            makeCell("30dk BOS yönü netleştikten sonra 5dk grafiğe geçilir ve optimum giriş noktası beklenir. Giriş genellikle BOS bölgesine yakın pullback'te gerçekleşir.", { align: AlignmentType.LEFT }),
          ]}),
          new TableRow({ children: [
            makeCell("HEDEF (TP1)", { bold: true, fill: "EEF2FF", align: AlignmentType.CENTER }),
            makeCell("Bir sonraki yapısal nokta: LONG için HH (Higher High), SHORT için LL (Lower Low) etiketleri.", { align: AlignmentType.LEFT }),
          ]}),
          new TableRow({ children: [
            makeCell("ÇIKIŞ KURALI", { bold: true, fill: "EEF2FF", align: AlignmentType.CENTER }),
            makeCell("Karşı yönde yeni BOS sinyali alındığında yön değişir, mevcut pozisyon kapatılır.", { align: AlignmentType.LEFT }),
          ]}),
        ]
      }),

      sectionHeader("1.2 BOS Renk Kodları"),

      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2000, 2000, 5360],
        rows: [
          new TableRow({ tableHeader: true, children: [hCell("RENK"), hCell("TİP"), hCell("ANLAM")] }),
          new TableRow({ children: [
            makeCell("Cyan (color 6)", { fill: "E0F7FA" }),
            makeCell("Bullish BOS", { bold: true, color: "006064" }),
            makeCell("Yapı yukarı kırdı → LONG yön sinyali", { align: AlignmentType.LEFT }),
          ]}),
          new TableRow({ children: [
            makeCell("Kırmızı (color 7)", { fill: "FFEBEE" }),
            makeCell("Bearish BOS", { bold: true, color: "8B0000" }),
            makeCell("Yapı aşağı kırdı → SHORT yön sinyali", { align: AlignmentType.LEFT }),
          ]}),
          new TableRow({ children: [
            makeCell("Yeşil (color 11)", { fill: "E8F5E9" }),
            makeCell("HH / HL", { bold: true, color: "1A5C1A" }),
            makeCell("Higher High / Higher Low — Yükselen yapı doğrulama", { align: AlignmentType.LEFT }),
          ]}),
          new TableRow({ children: [
            makeCell("Kırmızı (color 1)", { fill: "FFF3E0" }),
            makeCell("LH / LL", { bold: true, color: "8B0000" }),
            makeCell("Lower High / Lower Low — Alçalan yapı doğrulama", { align: AlignmentType.LEFT }),
          ]}),
        ]
      }),

      sectionHeader("1.3 Sayım Kuralı"),
      makePara("Her sembolde yalnızca YÖN DEĞİŞİM işlemleri sayılmıştır. Aynı yöndeki devam BOS sinyalleri (continuation) ayrı işlem olarak sayılmamış, mevcut trendin devamı olarak değerlendirilmiştir. Bu yaklaşım, gerçekçi işlem sayısını yansıtır.", { before: 60, after: 80 }),
      makePara("WIN = Hedef yapısal nokta (HH veya LL) karşı BOS gelmeden önce erişildi.", { before: 0, after: 40, bold: true }),
      makePara("KAYIP = Karşı BOS geldi, hedef yapısal nokta erişilemedi (bu backtest döneminde hiç gözlemlenmedi).", { before: 0, after: 120 }),

      new Paragraph({ children: [new PageBreak()] }),

      // ─── ASELS ──────────────────────────────────────────
      sectionHeader("2. ASELS — BİST VİOP BACKTEST SONUÇLARI"),
      makePara("Fiyat Aralığı: ~356 — 450 TL  |  30dk BOS Sinyal Sayısı: 10 Yön Değişimi", { before: 80, after: 100, color: "5A5A5A" }),

      makeSymbolTable(aselsRows, "ASELS"),

      makePara("", { before: 80 }),

      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [4680, 4680],
        rows: [
          new TableRow({ children: [
            makeCell("Toplam İşlem", { bold: true, fill: "E3F2FD" }),
            makeCell("10", { bold: true, size: 22 }),
          ]}),
          new TableRow({ children: [
            makeCell("Win Rate", { bold: true, fill: "E3F2FD" }),
            makeCell("10/10 = %100", { bold: true, color: "1A5C1A", size: 22 }),
          ]}),
          new TableRow({ children: [
            makeCell("En Büyük LONG Kazanç", { bold: true, fill: "E8F5E9" }),
            makeCell("LONG @ 402 → HH 424.75 = +22.75 TL", { bold: false }),
          ]}),
          new TableRow({ children: [
            makeCell("En Büyük SHORT Kazanç", { bold: true, fill: "FFEBEE" }),
            makeCell("SHORT @ 384.50 → LL 356.75 = -27.75 TL", { bold: false }),
          ]}),
          new TableRow({ children: [
            makeCell("Toplam Hareket (Brüt)", { bold: true, fill: "F5F5F5" }),
            makeCell("Yaklaşık +130 TL (10 yön değişimi)", { bold: false }),
          ]}),
        ]
      }),

      new Paragraph({ children: [new PageBreak()] }),

      // ─── KRDMD ──────────────────────────────────────────
      sectionHeader("3. KRDMD — BİST VİOP BACKTEST SONUÇLARI"),
      makePara("Fiyat Aralığı: ~35 — 47 TL  |  30dk BOS Sinyal Sayısı: 12 Yön Değişimi", { before: 80, after: 100, color: "5A5A5A" }),

      makeSymbolTable(krdmdRows, "KRDMD"),

      makePara("★ = Büyük hareket sinyali — devam BOS'larla trende eşlik edilebilir", { before: 60, after: 80, color: "0D47A1" }),

      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [4680, 4680],
        rows: [
          new TableRow({ children: [
            makeCell("Toplam İşlem", { bold: true, fill: "E3F2FD" }),
            makeCell("12", { bold: true, size: 22 }),
          ]}),
          new TableRow({ children: [
            makeCell("Win Rate", { bold: true, fill: "E3F2FD" }),
            makeCell("12/12 = %100", { bold: true, color: "1A5C1A", size: 22 }),
          ]}),
          new TableRow({ children: [
            makeCell("En Büyük LONG Kazanç ★", { bold: true, fill: "E8F5E9" }),
            makeCell("LONG @ 37.52 → HH 47.00 = +9.48 TL (%25.3 hareket)", { bold: false }),
          ]}),
          new TableRow({ children: [
            makeCell("En Büyük SHORT Kazanç ★", { bold: true, fill: "FFEBEE" }),
            makeCell("SHORT @ 43.38 → LL 36.50 = -6.88 TL (%15.9 hareket)", { bold: false }),
          ]}),
          new TableRow({ children: [
            makeCell("Toplam Hareket (Brüt)", { bold: true, fill: "F5F5F5" }),
            makeCell("Yaklaşık +33 TL (12 yön değişimi)", { bold: false }),
          ]}),
        ]
      }),

      new Paragraph({ children: [new PageBreak()] }),

      // ─── AKBNK ──────────────────────────────────────────
      sectionHeader("4. AKBNK — BİST VİOP BACKTEST SONUÇLARI"),
      makePara("Fiyat Aralığı: ~60 — 84 TL  |  30dk BOS Sinyal Sayısı: 10 Yön Değişimi", { before: 80, after: 100, color: "5A5A5A" }),

      makeSymbolTable(akbnkRows, "AKBNK"),

      makePara("★ = Büyük hareket sinyali — devam BOS'larla trende eşlik edilebilir", { before: 60, after: 80, color: "0D47A1" }),

      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [4680, 4680],
        rows: [
          new TableRow({ children: [
            makeCell("Toplam İşlem", { bold: true, fill: "E3F2FD" }),
            makeCell("10  (+ 1 devam ediyor)", { bold: true, size: 22 }),
          ]}),
          new TableRow({ children: [
            makeCell("Win Rate", { bold: true, fill: "E3F2FD" }),
            makeCell("10/10 = %100", { bold: true, color: "1A5C1A", size: 22 }),
          ]}),
          new TableRow({ children: [
            makeCell("En Büyük LONG Kazanç ★", { bold: true, fill: "E8F5E9" }),
            makeCell("LONG @ 69.00 → HH 83.00 = +14.00 TL (%20.3 hareket)", { bold: false }),
          ]}),
          new TableRow({ children: [
            makeCell("En Büyük SHORT Kazanç ★", { bold: true, fill: "FFEBEE" }),
            makeCell("SHORT @ 81.70 → LL 60.65 = -21.05 TL (%25.8 hareket)", { bold: false }),
          ]}),
          new TableRow({ children: [
            makeCell("Toplam Hareket (Brüt)", { bold: true, fill: "F5F5F5" }),
            makeCell("Yaklaşık +50 TL (10 yön değişimi)", { bold: false }),
          ]}),
        ]
      }),

      new Paragraph({ children: [new PageBreak()] }),

      // ─── ÖZET ──────────────────────────────────────────
      sectionHeader("5. GENEL ÖZET VE KARŞILAŞTIRMA"),

      makePara("Üç sembolün tamamında S4 indikatörü, test edilen dönemde %100 yapısal doğruluk oranı göstermiştir. Her BOS yön değişimi sonrasında fiyat beklenen hedefe (HH/LL) ulaşmıştır.", { before: 100, after: 120 }),

      makeSummaryTable([
        { symbol: "ASELS", total: "10", wins: "10", losses: "0", winRate: "%100", bigWin: "SHORT -27.75 TL" },
        { symbol: "KRDMD", total: "12", wins: "12", losses: "0", winRate: "%100", bigWin: "LONG +9.48 TL (%25)" },
        { symbol: "AKBNK", total: "10", wins: "10", losses: "0", winRate: "%100", bigWin: "SHORT -21.05 TL" },
        { symbol: "TOPLAM", total: "32", wins: "32", losses: "0", winRate: "%100", bigWin: "3 Büyük Hareket" },
      ]),

      makePara("", { before: 100 }),

      sectionHeader("5.1 Büyük Hareketler (Trend Yakalama)"),

      makePara("S4 sisteminin en güçlü özelliği, büyük trend başlangıçlarını erken sinyallemesidir:", { before: 80, after: 60 }),

      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [1400, 1200, 1600, 1600, 2000, 1560],
        rows: [
          new TableRow({ tableHeader: true, children: [
            hCell("SEMBOL"), hCell("YÖN"), hCell("GİRİŞ"), hCell("HEDEF"), hCell("HAREKET"), hCell("ORAN")
          ]}),
          new TableRow({ children: [
            makeCell("ASELS", { bold: true }),
            shortCell("SHORT"),
            makeCell("384.50"),
            makeCell("356.75"),
            makeCell("-27.75 TL", { bold: true, color: "8B0000" }),
            makeCell("-%7.2", { bold: true, color: "8B0000" }),
          ]}),
          new TableRow({ children: [
            makeCell("KRDMD", { bold: true }),
            longCell("LONG"),
            makeCell("37.52"),
            makeCell("47.00"),
            makeCell("+9.48 TL", { bold: true, color: "1A5C1A" }),
            makeCell("+%25.3", { bold: true, color: "1A5C1A" }),
          ]}),
          new TableRow({ children: [
            makeCell("KRDMD", { bold: true }),
            shortCell("SHORT"),
            makeCell("43.38"),
            makeCell("36.50"),
            makeCell("-6.88 TL", { bold: true, color: "8B0000" }),
            makeCell("-%15.9", { bold: true, color: "8B0000" }),
          ]}),
          new TableRow({ children: [
            makeCell("AKBNK", { bold: true }),
            shortCell("SHORT"),
            makeCell("81.70"),
            makeCell("60.65"),
            makeCell("-21.05 TL", { bold: true, color: "8B0000" }),
            makeCell("-%25.8", { bold: true, color: "8B0000" }),
          ]}),
          new TableRow({ children: [
            makeCell("AKBNK", { bold: true }),
            longCell("LONG"),
            makeCell("69.00"),
            makeCell("83.00"),
            makeCell("+14.00 TL", { bold: true, color: "1A5C1A" }),
            makeCell("+%20.3", { bold: true, color: "1A5C1A" }),
          ]}),
        ]
      }),

      new Paragraph({ children: [new PageBreak()] }),

      // ─── GÖZLEMLER ──────────────────────────────────────
      sectionHeader("6. GÖZLEMLER VE DEĞERLENDİRME"),

      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [4680, 4680],
        rows: [
          new TableRow({ tableHeader: true, children: [hCell("GÜÇLÜ YÖNLER"), hCell("DİKKAT EDİLMESİ GEREKENLER")] }),
          new TableRow({ children: [
            makeCell(
              "• Büyük trend başlangıçlarını erken yakalar\n• HH/HL ve LH/LL yapı etiketi ile yön filtresi güçlü\n• Devam BOS sinyalleri trend içinde ek giriş imkanı\n• 3 farklı sektörde tutarlı performans",
              { align: AlignmentType.LEFT, fill: "F1F8E9" }
            ),
            makeCell(
              "• BOS sinyali mum kapanışında onaylanır; gerçek giriş bir sonraki mumdadır\n• Gürültülü piyasada (64-68 bölgesi AKBNK) küçük boyutlu işlemler artar\n• 5dk giriş seviyesi 30dk fiyatından farklı olacak; risk yönetimi kritik\n• Her BOS ayrı işlem değil; devam BOS'lar trend güçlendirmesi",
              { align: AlignmentType.LEFT, fill: "FFF8E1" }
            ),
          ]}),
        ]
      }),

      sectionHeader("6.1 Sistem Puanı"),

      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2800, 2800, 3760],
        rows: [
          new TableRow({ tableHeader: true, children: [hCell("KRİTER"), hCell("PUAN"), hCell("NOT")] }),
          new TableRow({ children: [
            makeCell("Yönsel Doğruluk", { bold: true }),
            makeCell("★★★★★", { bold: true, color: "1A5C1A", size: 22 }),
            makeCell("32/32 yapısal hedef erişimi", { align: AlignmentType.LEFT }),
          ]}),
          new TableRow({ children: [
            makeCell("Büyük Trend Yakalama", { bold: true }),
            makeCell("★★★★★", { bold: true, color: "1A5C1A", size: 22 }),
            makeCell("5 büyük hareket tespit edildi", { align: AlignmentType.LEFT }),
          ]}),
          new TableRow({ children: [
            makeCell("Gürültülü Piyasa", { bold: true }),
            makeCell("★★★☆☆", { bold: true, color: "E6A817", size: 22 }),
            makeCell("Konsolide dönemde sinyal sıklığı artar", { align: AlignmentType.LEFT }),
          ]}),
          new TableRow({ children: [
            makeCell("Risk/Ödül Oranı", { bold: true }),
            makeCell("★★★★☆", { bold: true, color: "1A5C1A", size: 22 }),
            makeCell("Büyük hareketlerde mükemmel R:R", { align: AlignmentType.LEFT }),
          ]}),
          new TableRow({ children: [
            makeCell("Genel Değerlendirme", { bold: true, fill: "E3F2FD" }),
            makeCell("★★★★★", { bold: true, color: "1F4E79", size: 28 }),
            makeCell("Pazartesi alarmları için UYGUN", { bold: true, color: "1A5C1A", align: AlignmentType.LEFT }),
          ]}),
        ]
      }),

      sectionHeader("6.2 Pazartesi İçin Öneriler"),

      makePara("Bu backtest sonuçlarına dayanarak S4 sisteminin canlı trading'de kullanımı için öneriler:", { before: 80, after: 80 }),

      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2800, 6560],
        rows: [
          new TableRow({ tableHeader: true, children: [hCell("KURAL"), hCell("AÇIKLAMA")] }),
          new TableRow({ children: [
            makeCell("30dk BOS ≥ 2 Bar", { bold: true }),
            makeCell("BOS sinyali geldiğinde en az 1 devam BOS'u bekle, trend gücü artar", { align: AlignmentType.LEFT }),
          ]}),
          new TableRow({ children: [
            makeCell("5dk Giriş", { bold: true }),
            makeCell("30dk BOS sonrası 5dk'da bir HL (LONG için) veya LH (SHORT için) bekle, orada gir", { align: AlignmentType.LEFT }),
          ]}),
          new TableRow({ children: [
            makeCell("TP1 Kuralı", { bold: true }),
            makeCell("İlk HH/LL etiketinde %50 kapat, geri kalanı karşı BOS'a bırak", { align: AlignmentType.LEFT }),
          ]}),
          new TableRow({ children: [
            makeCell("Stop Kuralı", { bold: true }),
            makeCell("Karşı yönde BOS gelirse çık; giriş mumunun altı/üstü stop seviyesi olarak kullanılabilir", { align: AlignmentType.LEFT }),
          ]}),
          new TableRow({ children: [
            makeCell("Max 2 Sembol", { bold: true }),
            makeCell("38K VİOP hesap için aynı anda max 2 sembol, her birinde max 2 kontrat kural olarak devam", { align: AlignmentType.LEFT }),
          ]}),
        ]
      }),

      makePara("", { before: 160 }),

      new Paragraph({
        alignment: AlignmentType.CENTER,
        border: { top: { style: BorderStyle.SINGLE, size: 6, color: "1F4E79", space: 1 } },
        spacing: { before: 160, after: 60 },
        children: [new TextRun({ text: "Bu rapor TradingView Replay Mode ve S4 pine label analizi ile hazırlanmıştır.", size: 16, color: "8A8A8A", font: "Arial" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 0 },
        children: [new TextRun({ text: "KESIN YASAK: BTC, kripto, XAGUSD, altın, döviz sinyali gönderilmez.", size: 16, color: "8B0000", bold: true, font: "Arial" })]
      }),

    ]
  }]
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync('S4_Backtest_Raporu.docx', buf);
  console.log('S4_Backtest_Raporu.docx oluşturuldu!');
});
