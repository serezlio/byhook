const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        AlignmentType, HeadingLevel, BorderStyle, WidthType, ShadingType,
        VerticalAlign, PageBreak } = require('docx');
const fs = require('fs');

const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };

function hdr(text, lvl = HeadingLevel.HEADING_1) {
  return new Paragraph({ heading: lvl, children: [new TextRun({ text, bold: true })] });
}
function para(text, opts = {}) {
  return new Paragraph({
    alignment: opts.center ? AlignmentType.CENTER : AlignmentType.LEFT,
    spacing: { after: 60 },
    children: [new TextRun({ text, ...opts })]
  });
}
function emptyLine() { return new Paragraph({ children: [] }); }

function cell(text, opts = {}) {
  const { bg = "FFFFFF", bold = false, color = "000000", center = false, width } = opts;
  return new TableCell({
    borders,
    width: width ? { size: width, type: WidthType.DXA } : undefined,
    shading: { fill: bg, type: ShadingType.CLEAR },
    margins: { top: 60, bottom: 60, left: 120, right: 120 },
    verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({
      alignment: center ? AlignmentType.CENTER : AlignmentType.LEFT,
      children: [new TextRun({ text: String(text), bold, color, size: 18 })]
    })]
  });
}

function makeTable(data, cols, widths) {
  const total = widths.reduce((a,b)=>a+b, 0);
  const headerRow = new TableRow({
    children: cols.map((c,i) => cell(c, { bg:"1F4E79", bold:true, color:"FFFFFF", center:true, width: widths[i] }))
  });
  const rows = data.map(row => new TableRow({
    children: row.map((v, i) => {
      const s = String(v);
      let bg = "FFFFFF";
      if (s.startsWith('+')) bg = "E8F5E9";
      if (s.startsWith('-') && s !== '-') bg = "FFEBEE";
      if (i === 0 && isNaN(s)) bg = "F0F4F8";
      return cell(v, { bg, width: widths[i] });
    })
  }));
  return new Table({
    width: { size: total, type: WidthType.DXA },
    columnWidths: widths,
    rows: [headerRow, ...rows]
  });
}

// ============ TRADE DATA ============
const cern1_asels = [
  ['L',119.7,115.8],['S',115.8,118.8],['L',118.8,127.2],['S',127.2,134.9],
  ['L',134.9,132.3],['S',132.3,146.5],['L',146.5,137.0],['S',137.0,134.1],
  ['L',134.1,140.5],['S',140.5,150.9],['L',150.9,179.2],['S',179.2,172.6],
  ['L',172.6,179.4],['S',179.4,185.0],['L',185.0,179.1],['S',179.1,176.3],
  ['L',176.3,213.8],['S',213.8,175.4],['L',175.4,182.5],['S',182.5,184.9],
  ['L',184.9,209.3],['S',209.3,215.7],['L',215.7,295.0],['S',295.0,312.5],
  ['L',312.5,307.5],['S',307.5,304.25],['L',304.25,294.25],['S',294.25,312.25],
  ['L',312.25,335.5],['S',335.5,325.0],['L',325.0,413.5],['S',413.5,423.75],
  ['L',423.75,411.5],['S',411.5,385.75],['L',385.75,382.25],['S',382.25,383.0],
  ['L',383.0,387.75]
];
const cern1_krdmd = [
  ['L',29.06,28.22],['S',28.22,28.98],['L',28.98,28.46],['S',28.46,30.26],
  ['L',30.26,31.08],['S',31.08,32.74],['L',32.74,30.60],['S',30.60,32.06],
  ['L',32.06,31.14],['S',31.14,32.56],['L',32.56,30.20],['S',30.20,30.34],
  ['L',30.34,28.62],['S',28.62,29.70],['L',29.70,30.46],['S',30.46,31.04],
  ['L',31.04,29.20],['S',29.20,29.34],['L',29.34,31.48],['S',31.48,34.92],
  ['L',34.92,36.10],['S',36.10,36.48],['L',36.48,36.34],['S',36.34,37.26],
  ['L',37.26,35.98],['S',35.98,36.76],['L',36.76,36.82],['S',36.82,37.66],
  ['L',37.66,42.40],['S',42.40,40.86],['L',40.86,40.74],['S',40.74,41.38],
  ['L',41.38,40.46],['S',40.46,39.68],['L',39.68,38.32],['S',38.32,40.58],
  ['L',40.58,39.48],['S',39.48,40.36],['L',40.36,39.84],['S',39.84,40.82],
  ['L',40.82,39.62]
];
const cern1_akbnk = [
  ['L',53.55,51.20],['S',51.20,52.00],['L',52.00,52.30],['S',52.30,53.10],
  ['L',53.10,59.00],['S',59.00,58.75],['L',58.75,68.25],['S',68.25,68.50],
  ['L',68.50,66.95],['S',66.95,63.30],['L',63.30,66.50],['S',66.50,59.80],
  ['L',59.80,57.90],['S',57.90,61.65],['L',61.65,59.80],['S',59.80,58.90],
  ['L',58.90,73.70],['S',73.70,79.20],['L',79.20,88.45],['S',88.45,92.00],
  ['L',92.00,90.85],['S',90.85,72.65],['L',72.65,66.65],['S',66.65,75.00],
  ['L',75.00,76.60],['S',76.60,80.65],['L',80.65,77.75],['S',77.75,72.50],
  ['L',72.50,74.60],['S',74.60,63.65],['L',63.65,63.85],['S',63.85,72.60],
  ['L',72.60,80.40]
];
const s4_asels = [
  ['S',320.75,327.00],['L',327.00,412.50],['S',412.50,415.75],['L',415.75,414.75],
  ['S',414.75,418.00],['L',418.00,413.00],['S',413.00,429.50],['L',429.50,429.00],
  ['S',429.00,431.75],['L',431.75,412.50],['S',412.50,407.00],['L',407.00,397.00],
  ['S',397.00,387.25],['L',387.25,384.50],['S',384.50,364.75],['L',364.75,362.50],
  ['S',362.50,363.25],['L',363.25,401.25]
];
const s4_akbnk = [
  ['S',77.90,72.50],['L',72.50,75.00],['S',75.00,72.40],['L',72.40,71.30],
  ['S',71.30,70.50],['L',70.50,69.75],['S',69.75,64.25],['L',64.25,64.80],
  ['S',64.80,66.15],['L',66.15,65.15],['S',65.15,66.05],['L',66.05,66.70],
  ['S',66.70,69.00],['L',69.00,76.55],['S',76.55,77.35],['L',77.35,81.15],
  ['S',81.15,80.15],['L',80.15,80.10]
];

function calcStats(trades) {
  let wins=0, losses=0, gp=0, gl=0;
  const rows = trades.map(([dir,entry,exit]) => {
    const pnl = dir==='L' ? exit-entry : entry-exit;
    const win = pnl > 0;
    if(win){wins++;gp+=pnl;}else{losses++;gl+=Math.abs(pnl);}
    return [dir==='L'?'LONG':'SHORT', entry, exit, (pnl>=0?'+':'')+pnl.toFixed(2), win?'KAR':'ZARAR'];
  });
  const tot = wins+losses;
  const wr = tot>0?((wins/tot)*100).toFixed(1):'0';
  const net = (gp-gl).toFixed(2);
  const avg_win = wins>0?(gp/wins).toFixed(2):'0';
  const avg_loss = losses>0?(gl/losses).toFixed(2):'0';
  const rr = avg_loss>0?(parseFloat(avg_win)/parseFloat(avg_loss)).toFixed(2):'N/A';
  return {wins,losses,tot,wr,net,avg_win,avg_loss,rr,rows,gp:gp.toFixed(2),gl:gl.toFixed(2)};
}

const c1a=calcStats(cern1_asels), c1k=calcStats(cern1_krdmd), c1ak=calcStats(cern1_akbnk);
const s4a=calcStats(s4_asels), s4ak=calcStats(s4_akbnk);

function tradeSection(stats, label) {
  const numbered = stats.rows.map((r,i)=>[(i+1).toString(),...r]);
  return makeTable(numbered, ['#','Yön','Giriş','Çıkış','P&L','Sonuç'], [500,900,1100,1100,1300,900]);
}

function statBox(s) {
  return makeTable([
    ['Toplam İşlem', s.tot, 'Kazanan', s.wins, 'Kaybeden', s.losses],
    ['Kazanma Oranı', s.wr+'%', 'Ort. Kazanç', '+'+s.avg_win+' TL', 'Ort. Kayıp', '-'+s.avg_loss+' TL'],
    ['Net P&L', (s.net>=0?'+':'')+s.net+' TL', 'Brüt Kâr', '+'+s.gp+' TL', 'Brüt Zarar', '-'+s.gl+' TL'],
    ['R:R Oranı', s.rr, '', '', '', ''],
  ], ['Metrik','Değer','Metrik','Değer','Metrik','Değer'], [1600,1100,1600,1100,1600,1100]);
}

const children = [
  // ---- KAPAK ----
  emptyLine(),emptyLine(),emptyLine(),
  new Paragraph({ alignment:AlignmentType.CENTER, children:[new TextRun({text:"VİOP TİCARET SİSTEMLERİ",bold:true,size:56,color:"1F4E79",font:"Calibri"})]}),
  new Paragraph({ alignment:AlignmentType.CENTER, children:[new TextRun({text:"BACKTEST RAPORU",bold:true,size:44,color:"2E75B6",font:"Calibri"})]}),
  emptyLine(),
  new Paragraph({ alignment:AlignmentType.CENTER, children:[new TextRun({text:"S4   |   CERN-1   |   CERN-2",size:32,color:"44546A"})]}),
  new Paragraph({ alignment:AlignmentType.CENTER, children:[new TextRun({text:"ASELS  |  KRDMD  |  AKBNK",size:28,color:"666666"})]}),
  emptyLine(),emptyLine(),
  new Paragraph({ alignment:AlignmentType.CENTER, children:[new TextRun({text:"Tarih: 28 Haziran 2026",size:22,color:"888888"})]}),
  new Paragraph({ alignment:AlignmentType.CENTER, children:[new TextRun({text:"Metodoloji: Yön Degisimi (BOS/ST Flip) — Giris kapanisda, cikis karsi sinyal",size:18,color:"AAAAAA"})]}),
  new Paragraph({ children:[new PageBreak()] }),

  // ---- METODOLOJI ----
  hdr("1. METODOLOJI"),
  para("Bu rapor uc VİOP ticaret sisteminin performansini dogru metodoloji ile sunmaktadir. Her islem gircildiginde kar veya zarar hesaplanmistir. Onceki 100% kazanc orani raporunun gercek olmadigi dogrulanmistir."),
  emptyLine(),
  makeTable([
    ["Giris","İlk yon degisimi sinyali kapanisinda"],
    ["Cikis","Karsi yon ilk sinyalinde (ters sinyal geldiginde)"],
    ["Ardisik sinyaller","Ayni yonde ardisik sinyaller YOK SAYILIR"],
    ["Fiyat","SPOT (VİOP'ta kaldirac ile carpilir)"],
  ],["Kural","Aciklama"],[2000,7300]),
  emptyLine(),
  makeTable([
    ["CERN-1","SuperTrend (ATR10, Faktor 3.0) 15dk","30dk bias filtresi","label.new() — okunabilir"],
    ["S4","SMC BOS 15dk (Renk 6=LONG / Renk 7=SHORT)","SMC yapisi","label.new() — okunabilir"],
    ["CERN-2","EMA capraz + HAZ bolgesi 15dk","VIOP Sinyal Pro","plotshape — okunamaz*"],
  ],["Sistem","Ana Sinyal","Filtre","Kaynak"],[1200,3200,2200,2700]),
  emptyLine(),
  para("* CERN-2 plotshape kullandigindan label API ile okunamiyor. TradingView Replay ile manuel test gerekir."),
  new Paragraph({ children:[new PageBreak()] }),

  // ---- CERN-1 GENEL ----
  hdr("2. CERN-1 — SuperTrend+Bias [15dk+30dk]"),
  para("Durum: KURULDU ve aktif TradingView'da (HWjLVJ)"),
  emptyLine(),
  hdr("2.1 Ozet Performans", HeadingLevel.HEADING_2),
  makeTable([
    ["ASELS",c1a.tot,c1a.wins+" W / "+c1a.losses+" L",c1a.wr+"%","+"+c1a.gp+" TL","-"+c1a.gl+" TL",(c1a.net>=0?"+":"")+c1a.net+" TL",c1a.rr],
    ["KRDMD",c1k.tot,c1k.wins+" W / "+c1k.losses+" L",c1k.wr+"%","+"+c1k.gp+" TL","-"+c1k.gl+" TL",(c1k.net>=0?"+":"")+c1k.net+" TL",c1k.rr],
    ["AKBNK",c1ak.tot,c1ak.wins+" W / "+c1ak.losses+" L",c1ak.wr+"%","+"+c1ak.gp+" TL","-"+c1ak.gl+" TL",(c1ak.net>=0?"+":"")+c1ak.net+" TL",c1ak.rr],
  ],["Sembol","Islem","W/L","WR%","Brut Kar","Brut Zarar","Net P&L","R:R"],
  [900,700,1200,700,1200,1200,1200,700]),
  emptyLine(),
  para("Yorum: ASELS'de cok buyuk trend kazanclari (+37.5, +79.3, +88.5 TL). KRDMD dar bantta cok kirildigi icin zarar. AKBNK dengeli."),
  emptyLine(),

  hdr("2.2 CERN-1 — ASELS", HeadingLevel.HEADING_2),
  tradeSection(c1a,"ASELS"), emptyLine(), statBox(c1a),
  new Paragraph({ children:[new PageBreak()] }),

  hdr("2.3 CERN-1 — KRDMD", HeadingLevel.HEADING_2),
  tradeSection(c1k,"KRDMD"), emptyLine(), statBox(c1k),
  new Paragraph({ children:[new PageBreak()] }),

  hdr("2.4 CERN-1 — AKBNK", HeadingLevel.HEADING_2),
  tradeSection(c1ak,"AKBNK"), emptyLine(), statBox(c1ak),
  new Paragraph({ children:[new PageBreak()] }),

  // ---- S4 ----
  hdr("3. S4 — VIOP SMC Scalp [30dk+5dk]"),
  para("Sistem: SMC Break of Structure (BOS). Renk 6 (cyan) = Bullish BOS = LONG. Renk 7 (kirmizi) = Bearish BOS = SHORT. Not: Analiz en guncel 200 label uzerinden; KRDMD icin ayrica veri toplanmasi gerekir."),
  emptyLine(),
  hdr("3.1 Ozet Performans", HeadingLevel.HEADING_2),
  makeTable([
    ["ASELS",s4a.tot,s4a.wins+" W / "+s4a.losses+" L",s4a.wr+"%","+"+s4a.gp+" TL","-"+s4a.gl+" TL",(s4a.net>=0?"+":"")+s4a.net+" TL",s4a.rr],
    ["AKBNK",s4ak.tot,s4ak.wins+" W / "+s4ak.losses+" L",s4ak.wr+"%","+"+s4ak.gp+" TL","-"+s4ak.gl+" TL",(s4ak.net>=0?"+":"")+s4ak.net+" TL",s4ak.rr],
    ["KRDMD","-","-","-","-","-","Toplanmadi","-"],
  ],["Sembol","Islem","W/L","WR%","Brut Kar","Brut Zarar","Net P&L","R:R"],
  [900,700,1200,700,1200,1200,1200,700]),
  emptyLine(),
  para("Yorum: S4 dusuk WR yuksek R:R (trendle git sistemi). ASELS'de tek islemde +85.5 TL. AKBNK son donemde dengeli."),
  emptyLine(),

  hdr("3.2 S4 — ASELS", HeadingLevel.HEADING_2),
  tradeSection(s4a,"ASELS"), emptyLine(), statBox(s4a),
  new Paragraph({ children:[new PageBreak()] }),

  hdr("3.3 S4 — AKBNK", HeadingLevel.HEADING_2),
  tradeSection(s4ak,"AKBNK"), emptyLine(), statBox(s4ak),
  new Paragraph({ children:[new PageBreak()] }),

  // ---- CERN-2 ----
  hdr("4. CERN-2 — VIOP Sinyal Pro (EMA+HAZ)"),
  para("Durum: TradingView'da MEVCUT — By Hook VIOP Sinyal Pro (fpcJ2Z)"),
  emptyLine(),
  makeTable([
    ["Ana Bilesen","EMA1 (hizli) + EMA2 (yavas) caprazlama"],
    ["Filtre","HAZ+ (boga bolgesi) / HAZ- (ayi bolgesi)"],
    ["Timeframe","15 dakika ana sinyal"],
    ["Sinyal Formati","plotshape() — TradingView'da ok/sekil"],
    ["API Durumu","Okunamiyor — gorsel test gerekli"],
    ["Test Yontemi","TradingView Replay modu ile manuel gozlem"],
    ["Alert","alertcondition() ile kurulabilir"],
  ],["Parametre","Deger"],[2200,7100]),
  emptyLine(),
  para("Test icin: TradingView Replay modunda ASELS 15dk geri alin. Her okta fiyati not edin, karsi oka kadar P&L hesaplayin."),
  new Paragraph({ children:[new PageBreak()] }),

  // ---- KARSILASTIRMA ----
  hdr("5. KARSILASTIRMALI OZET"),
  makeTable([
    ["CERN-1","ASELS",c1a.tot,c1a.wr+"%",(c1a.net>=0?"+":"")+c1a.net+" TL",c1a.rr,"Trendli piyasada guclu"],
    ["CERN-1","KRDMD",c1k.tot,c1k.wr+"%",(c1k.net>=0?"+":"")+c1k.net+" TL",c1k.rr,"Dar bantta zayif — normal"],
    ["CERN-1","AKBNK",c1ak.tot,c1ak.wr+"%",(c1ak.net>=0?"+":"")+c1ak.net+" TL",c1ak.rr,"Dengeli"],
    ["S4","ASELS",s4a.tot,s4a.wr+"%",(s4a.net>=0?"+":"")+s4a.net+" TL",s4a.rr,"Dusuk WR yuksek R:R"],
    ["S4","AKBNK",s4ak.tot,s4ak.wr+"%",(s4ak.net>=0?"+":"")+s4ak.net+" TL",s4ak.rr,"Son donem iyi"],
    ["CERN-2","3 Sembol","-","-","Test edilmedi","-","Replay test gerekli"],
  ],["Sistem","Sembol","Islem","WR%","Net P&L","R:R","Not"],
  [1100,1000,700,700,1200,700,3800]),
  emptyLine(),

  hdr("Ana Bulgular", HeadingLevel.HEADING_2),
  para("1. Her iki sistem de 'dusuk WR, yuksek R:R' karakteri gostermektedir. Buyuk kazanclar trend donemlerinde geliyor."),
  para("2. CERN-1 daha cok islem uretiyor (ASELS: 37 vs S4: 18). Daha aktif, daha fazla maruz kalma."),
  para("3. KRDMD dar bantta (28-45 TL) cok dalgali; her iki sistem de bu sembole zor donem yasadi."),
  para("4. ASELS CERN-1 en buyuk tek kazanc: +88.5 TL (LONG 325→413.5). S4: +85.5 TL (LONG 327→412.5)."),
  para("5. VİOP'ta kaldirac faktoru uygulanirsa bu TL degerleri sozlesme buyukluguyle carpilir."),
  emptyLine(),

  hdr("Pazartesi Aksiyon Listesi", HeadingLevel.HEADING_2),
  makeTable([
    ["1","CERN-1","Aktif TradingView'da","ASELS/KRDMD/AKBNK 15dk"],
    ["2","S4","Aktif TradingView'da","BOS yonu hazir"],
    ["3","CERN-2","Aktif TradingView'da","VIOP Sinyal Pro acik"],
    ["4","KRDMD S4","Toplanacak","S4 BOS verisi ayrica cekile"],
    ["5","Alert","Kurulacak","Her sistem icin alert ayarla"],
  ],["#","Sistem","Durum","Not"],[500,1500,2500,4900]),
  emptyLine(),

  hdr("6. UYARILAR"),
  para("Gecmis performans gelecegi garanti etmez. VİOP islemleri kaldirac icerir. SPOT fiyatlar kullanilmistir. Bu analiz yatirim tavsiyesi degildir."),
  emptyLine(),
  para("KESIN YASAK: BTC, kripto, XAGUSD, altin, doviz sinyali GONDERILMEZ.", {bold:true, color:"CC0000"}),
];

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Calibri", size: 20 } } },
    paragraphStyles: [
      { id:"Heading1", name:"Heading 1", basedOn:"Normal", next:"Normal", quickFormat:true,
        run:{size:36,bold:true,font:"Calibri",color:"1F4E79"},
        paragraph:{spacing:{before:360,after:180},outlineLevel:0} },
      { id:"Heading2", name:"Heading 2", basedOn:"Normal", next:"Normal", quickFormat:true,
        run:{size:28,bold:true,font:"Calibri",color:"2E75B6"},
        paragraph:{spacing:{before:240,after:120},outlineLevel:1} },
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 15840, height: 12240 },
        margin: { top: 720, right: 720, bottom: 720, left: 720 },
        orientation: 'landscape'
      }
    },
    children
  }]
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync('C:\\Users\\Administrator\\REPO\\VIOP_Backtest_Raporu_Final.docx', buf);
  console.log('BASARILI: VIOP_Backtest_Raporu_Final.docx olusturuldu');
}).catch(err => {
  console.error('HATA:', err.message);
  process.exit(1);
});
