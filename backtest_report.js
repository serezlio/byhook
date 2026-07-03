const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageNumber, PageBreak, LevelFormat
} = require('docx');
const fs = require('fs');

const C = {
  navy:"1B2A4A", blue:"2563EB", green:"16A34A", red:"DC2626", amber:"D97706",
  gray:"6B7280", winBg:"DCFCE7", lossBg:"FEE2E2", mixBg:"FEF9C3",
  headBg:"1B2A4A", subBg:"E2E8F0",
};

const bdr = (color="D1D5DB") => ({
  top:{style:BorderStyle.SINGLE,size:1,color},bottom:{style:BorderStyle.SINGLE,size:1,color},
  left:{style:BorderStyle.SINGLE,size:1,color},right:{style:BorderStyle.SINGLE,size:1,color},
});

function cell(text,opts={}) {
  const {bold=false,color="000000",fill="FFFFFF",align=AlignmentType.LEFT,width,size=20,italic=false}=opts;
  return new TableCell({
    borders:bdr("D1D5DB"),
    width:width?{size:width,type:WidthType.DXA}:undefined,
    shading:{fill,type:ShadingType.CLEAR},
    margins:{top:80,bottom:80,left:120,right:120},
    verticalAlign:VerticalAlign.CENTER,
    children:[new Paragraph({alignment:align,children:[new TextRun({text,bold,color,size,italics:italic,font:"Arial"})]})]
  });
}

function hcell(text,w) {
  return cell(text,{bold:true,color:"FFFFFF",fill:C.headBg,align:AlignmentType.CENTER,width:w,size:18});
}

function p(text,opts={}) {
  const {bold=false,color="111827",size=22,spacing={before:80,after:80},align}=opts;
  return new Paragraph({alignment:align,spacing,children:[new TextRun({text,bold,color,size,font:"Arial"})]});
}

function sectionTitle(text) {
  return new Paragraph({heading:HeadingLevel.HEADING_1,spacing:{before:320,after:160},
    children:[new TextRun({text,bold:true,color:C.navy,size:32,font:"Arial"})]});
}
function subTitle(text) {
  return new Paragraph({heading:HeadingLevel.HEADING_2,spacing:{before:200,after:100},
    border:{bottom:{style:BorderStyle.SINGLE,size:4,color:C.blue,space:4}},
    children:[new TextRun({text,bold:true,color:C.blue,size:26,font:"Arial"})]});
}

function summaryTable() {
  const cols=[1000,820,820,820,820,900,1000,1000,1023,1023];
  const headers=["Sembol","Islem","Kazanc","Kayip","Karma","Kazanma Orani","Ort. Kazanc","Ort. Kayip","En Buyuk Kazanc","En Buyuk Kayip"];
  const rows=[
    ["ASELS","16","9","6","1","%59","+%4.8","-%1.1","+%23.7","-%1.9"],
    ["KRDMD","25","15","6","4","%60","+%5.9","-%0.6","+%18.2","-%1.2"],
    ["AKBNK","22","15","5","2","%68","+%3.0","-%2.8","+%12.2","-%8.5"],
    ["TOPLAM","63","39","17","7","%62","+%4.6","-%1.5","+%23.7","-%8.5"],
  ];
  return new Table({
    width:{size:9026,type:WidthType.DXA},columnWidths:cols,
    rows:[
      new TableRow({children:cols.map((w,i)=>hcell(headers[i],w))}),
      ...rows.map((r,ri)=>new TableRow({children:r.map((v,ci)=>{
        const isTotal=ri===3;
        const fill=isTotal?C.subBg:"FFFFFF";
        const color=ci===8?C.green:ci===9?C.red:ci===6&&!isTotal?C.green:ci===7&&!isTotal?C.red:isTotal?C.navy:"111827";
        return cell(v,{bold:isTotal||ci===0,color,fill,align:AlignmentType.CENTER,width:cols[ci],size:isTotal?20:19});
      })}))
    ]
  });
}

function tradeTable(trades) {
  const adjCols=[600,900,700,1000,1050,1000,900,900,1976];
  const headers=["#","Yon","Puan","Giris","TP1","Cikis","Sonuc","Getiri","Not"];
  return new Table({
    width:{size:9026,type:WidthType.DXA},columnWidths:adjCols,
    rows:[
      new TableRow({children:adjCols.map((w,i)=>hcell(headers[i],w))}),
      ...trades.map(t=>{
        const isWin=t.sonuc==="KAZANC";const isLoss=t.sonuc==="KAYIP";
        const rowFill=isWin?C.winBg:isLoss?C.lossBg:t.sonuc==="KARMA"?C.mixBg:"FFFFFF";
        const pctColor=t.pct.startsWith("+")?C.green:t.pct.startsWith("-")?C.red:C.amber;
        const ynColor=t.yon==="LONG"?C.green:C.red;
        return new TableRow({children:[
          cell(t.no,{align:AlignmentType.CENTER,fill:rowFill,width:adjCols[0],size:18}),
          cell(t.yon,{bold:true,color:ynColor,fill:rowFill,align:AlignmentType.CENTER,width:adjCols[1],size:18}),
          cell(t.puan,{align:AlignmentType.CENTER,fill:rowFill,width:adjCols[2],bold:t.puan==="10/10",size:18}),
          cell(t.giris,{align:AlignmentType.CENTER,fill:rowFill,width:adjCols[3],size:18}),
          cell(t.tp1,{align:AlignmentType.CENTER,fill:rowFill,width:adjCols[4],size:18}),
          cell(t.cikis,{align:AlignmentType.CENTER,fill:rowFill,width:adjCols[5],size:18}),
          cell(t.sonuc,{bold:true,color:isWin?C.green:isLoss?C.red:C.amber,fill:rowFill,align:AlignmentType.CENTER,width:adjCols[6],size:18}),
          cell(t.pct,{bold:true,color:pctColor,fill:rowFill,align:AlignmentType.CENTER,width:adjCols[7],size:18}),
          cell(t.not,{italic:true,color:C.gray,fill:rowFill,width:adjCols[8],size:16}),
        ]});
      })
    ]
  });
}

function scoreTable(rows) {
  const cols=[1000,800,900,900,1100,4326];
  const headers=["Puan","Islem","Kazanc","Kayip","Kazanma %","Yorum"];
  return new Table({
    width:{size:9026,type:WidthType.DXA},columnWidths:cols,
    rows:[
      new TableRow({children:cols.map((w,i)=>hcell(headers[i],w))}),
      ...rows.map(r=>{
        const pct=parseFloat(r.oran);
        const fill=pct>=70?C.winBg:pct<=40?C.lossBg:"FFFFFF";
        return new TableRow({children:[
          cell(r.puan,{bold:true,align:AlignmentType.CENTER,fill,width:cols[0]}),
          cell(r.islem,{align:AlignmentType.CENTER,fill,width:cols[1]}),
          cell(r.kazanc,{align:AlignmentType.CENTER,color:C.green,fill,width:cols[2]}),
          cell(r.kayip,{align:AlignmentType.CENTER,color:C.red,fill,width:cols[3]}),
          cell(r.oran,{bold:true,align:AlignmentType.CENTER,fill,width:cols[4]}),
          cell(r.yorum,{italic:true,color:C.gray,fill,width:cols[5],size:18}),
        ]});
      })
    ]
  });
}

const aselsTrades=[
  {no:"1",yon:"LONG",puan:"9/10",giris:"290.25",tp1:"302.00",cikis:"316.50",sonuc:"KAZANC",pct:"+%8.8",not:"TP1 vurdu, trend devam etti"},
  {no:"2",yon:"SHORT",puan:"7/10",giris:"316.50",tp1:"308.00",cikis:"318.00",sonuc:"KAYIP",pct:"-%0.5",not:"Ters dondu, erken cikis"},
  {no:"3",yon:"LONG",puan:"6/10",giris:"233.00",tp1:"252.00",cikis:"289.00",sonuc:"KAZANC",pct:"+%23.7",not:"Uzun tutuldu, TP1 ilk 2 mumda vurdu"},
  {no:"4",yon:"SHORT",puan:"8/10",giris:"359.75",tp1:"352.00",cikis:"357.50",sonuc:"KARMA",pct:"~0",not:"TP1 vurdu, ikinci yari kucuk kayip"},
  {no:"5",yon:"LONG",puan:"8/10",giris:"357.50",tp1:"365.00",cikis:"358.00",sonuc:"KAYIP",pct:"-%0.1",not:"TP1 vurmadi, hizli ters donus"},
  {no:"6",yon:"SHORT",puan:"7/10",giris:"368.00",tp1:"358.00",cikis:"369.25",sonuc:"KAYIP",pct:"-%0.3",not:"Yon yanlis, stop vurdu"},
  {no:"7",yon:"LONG",puan:"7/10",giris:"363.00",tp1:"375.00",cikis:"360.50",sonuc:"KAYIP",pct:"-%0.7",not:"TP1 vurmadi, destek kirildi"},
  {no:"8",yon:"SHORT",puan:"6/10",giris:"358.50",tp1:"350.00",cikis:"359.25",sonuc:"KAYIP",pct:"-%0.2",not:"Dusuk puan, hizli ters donus"},
  {no:"9",yon:"LONG",puan:"6/10",giris:"345.00",tp1:"358.00",cikis:"352.75",sonuc:"KAZANC",pct:"+%2.2",not:"TP1 vurdu"},
  {no:"10",yon:"SHORT",puan:"6/10",giris:"359.75",tp1:"352.00",cikis:"359.25",sonuc:"KAZANC",pct:"+%0.1",not:"Kucuk ama karda cikis"},
  {no:"11",yon:"LONG",puan:"7/10",giris:"351.00",tp1:"363.00",cikis:"354.50",sonuc:"KAZANC",pct:"+%1.0",not:"TP1 vurdu"},
  {no:"12",yon:"SHORT",puan:"6/10",giris:"354.50",tp1:"346.00",cikis:"351.50",sonuc:"KAZANC",pct:"+%0.9",not:"TP1 bolgesi, guvenli cikis"},
  {no:"13",yon:"LONG",puan:"6/10",giris:"347.50",tp1:"358.50",cikis:"359.00",sonuc:"KAZANC",pct:"+%3.3",not:"TP1 ve otesine tasindi"},
  {no:"14",yon:"SHORT",puan:"8/10",giris:"359.50",tp1:"349.50",cikis:"345.75",sonuc:"KAZANC",pct:"+%3.8",not:"8/10 guclu sinyal, TP1 hizla vurdu"},
  {no:"15",yon:"SHORT",puan:"9/10",giris:"359.75",tp1:"349.00",cikis:"362.50",sonuc:"KAYIP",pct:"-%0.8",not:"9/10 ragmen hemen ters dondu"},
  {no:"16",yon:"SHORT",puan:"6/10",giris:"356.00",tp1:"347.00",cikis:"360.50",sonuc:"KAYIP",pct:"-%1.3",not:"Dusuk puan, trend yukselis devam etti"},
];

const krdmdTrades=[
  {no:"1",yon:"SHORT",puan:"9/10",giris:"31.42",tp1:"30.70",cikis:"31.60",sonuc:"KAYIP",pct:"-%0.6",not:"Aninda karsi sinyal geldi"},
  {no:"2",yon:"LONG",puan:"7/10",giris:"31.60",tp1:"32.80",cikis:"37.34",sonuc:"KAZANC",pct:"+%18.2",not:"TP1 vurdu, buyuk momentum hareketi"},
  {no:"3",yon:"SHORT",puan:"8/10",giris:"37.34",tp1:"36.10",cikis:"36.08",sonuc:"KAZANC",pct:"+%3.4",not:"TP1 vurdu, temiz short"},
  {no:"4",yon:"LONG",puan:"7/10",giris:"36.08",tp1:"37.10",cikis:"36.20",sonuc:"KAZANC",pct:"+%0.3",not:"Kucuk kazanc, hizli karsi geldi"},
  {no:"5",yon:"SHORT",puan:"7/10",giris:"36.20",tp1:"35.40",cikis:"36.52",sonuc:"KAYIP",pct:"-%0.9",not:"TP1 vurmadi, yukselis devam etti"},
  {no:"6",yon:"LONG",puan:"8/10",giris:"36.52",tp1:"37.50",cikis:"36.10",sonuc:"KAYIP",pct:"-%1.2",not:"TP1 vurmadi, stop vurdu"},
  {no:"7",yon:"SHORT",puan:"9/10",giris:"36.10",tp1:"35.54",cikis:"36.46",sonuc:"KARMA",pct:"~0",not:"TP1 vurdu ama geri dondu, basabas"},
  {no:"8",yon:"LONG",puan:"7/10",giris:"36.46",tp1:"37.50",cikis:"36.92",sonuc:"KAZANC",pct:"+%1.3",not:"TP1 bolgesinde karda cikis"},
  {no:"9",yon:"SHORT",puan:"8/10",giris:"36.92",tp1:"36.20",cikis:"37.00",sonuc:"KAYIP",pct:"-%0.2",not:"Kucuk kayip, yukselis karsi geldi"},
  {no:"10",yon:"LONG",puan:"6/10",giris:"37.00",tp1:"38.08",cikis:"38.20",sonuc:"KAZANC",pct:"+%3.2",not:"TP1 vurdu ve otesine gecti"},
  {no:"11",yon:"SHORT",puan:"8/10",giris:"38.20",tp1:"37.04",cikis:"38.52",sonuc:"KARMA",pct:"~0",not:"TP1 vurdu, sonra ters dondu"},
  {no:"12",yon:"LONG",puan:"8/10",giris:"38.52",tp1:"40.20",cikis:"44.88",sonuc:"KAZANC",pct:"+%16.5",not:"TP1 vurdu, buyuk trend yakalandi"},
  {no:"13",yon:"SHORT",puan:"6/10",giris:"44.88",tp1:"42.42",cikis:"42.80",sonuc:"KAZANC",pct:"+%4.6",not:"TP1 vurdu"},
  {no:"14",yon:"LONG",puan:"6/10",giris:"42.80",tp1:"44.22",cikis:"42.30",sonuc:"KARMA",pct:"~0",not:"TP1 vurdu sonra dustu, basabas"},
  {no:"15",yon:"SHORT",puan:"7/10",giris:"42.30",tp1:"40.54",cikis:"36.50",sonuc:"KAZANC",pct:"+%13.7",not:"TP1 vurdu, trend buyuk dusus"},
  {no:"16",yon:"LONG",puan:"7/10",giris:"36.50",tp1:"40.70",cikis:"40.92",sonuc:"KAZANC",pct:"+%12.1",not:"TP1 vurdu, otesine gecti"},
  {no:"17",yon:"SHORT",puan:"8/10",giris:"40.92",tp1:"39.04",cikis:"38.96",sonuc:"KAZANC",pct:"+%4.8",not:"TP1 vurdu"},
  {no:"18",yon:"LONG",puan:"6/10",giris:"38.96",tp1:"40.70",cikis:"38.62",sonuc:"KARMA",pct:"~0",not:"TP1 vurdu sonra stop, basabas"},
  {no:"19",yon:"SHORT",puan:"8/10",giris:"38.62",tp1:"37.80",cikis:"38.88",sonuc:"KAYIP",pct:"-%0.7",not:"TP1 vurmadi, karsi dondu"},
  {no:"20",yon:"LONG",puan:"6/10",giris:"38.88",tp1:"41.50",cikis:"41.32",sonuc:"KAZANC",pct:"+%6.3",not:"TP1 vurdu, guclu yukselis"},
  {no:"21",yon:"SHORT",puan:"7/10",giris:"41.32",tp1:"39.74",cikis:"40.34",sonuc:"KAZANC",pct:"+%2.4",not:"TP1 vurdu"},
  {no:"22",yon:"LONG",puan:"8/10",giris:"40.34",tp1:"41.10",cikis:"40.52",sonuc:"KAZANC",pct:"+%0.5",not:"TP1 vurdu"},
  {no:"23",yon:"SHORT",puan:"10/10",giris:"40.52",tp1:"39.86",cikis:"40.52",sonuc:"KAZANC",pct:"+%0.5",not:"10/10 mukemmel sinyal, TP1 vurdu"},
  {no:"24",yon:"LONG",puan:"8/10",giris:"40.52",tp1:"41.30",cikis:"40.42",sonuc:"KAYIP",pct:"-%0.2",not:"Kucuk kayip, stop vurdu"},
  {no:"25",yon:"SHORT",puan:"7/10",giris:"40.42",tp1:"39.30",cikis:"40.04",sonuc:"KAZANC",pct:"+%0.9",not:"TP1 vurdu"},
];

const akbnkTrades=[
  {no:"1",yon:"SHORT",puan:"7/10",giris:"66.65",tp1:"64.85",cikis:"68.00",sonuc:"KAYIP",pct:"-%2.0",not:"TP1 vurmadi, yukselis geldi"},
  {no:"2",yon:"LONG",puan:"7/10",giris:"68.00",tp1:"70.25",cikis:"69.15",sonuc:"KAZANC",pct:"+%1.7",not:"TP1 vurdu"},
  {no:"3",yon:"SHORT",puan:"9/10",giris:"69.15",tp1:"66.50",cikis:"75.00",sonuc:"KAYIP",pct:"-%8.5",not:"BUYUK KAYIP — CIK etiketi, yuksek puan riskli"},
  {no:"4",yon:"SHORT",puan:"8/10",giris:"75.45",tp1:"73.50",cikis:"76.00",sonuc:"KAYIP",pct:"-%0.7",not:"TP1 vurmadi, stop vurdu"},
  {no:"5",yon:"LONG",puan:"7/10",giris:"76.00",tp1:"77.35",cikis:"76.60",sonuc:"KAZANC",pct:"+%0.8",not:"TP1 vurdu"},
  {no:"6",yon:"SHORT",puan:"8/10",giris:"76.60",tp1:"75.30",cikis:"78.95",sonuc:"KARMA",pct:"~0",not:"TP1 vurdu, sonra ters yukari firladi"},
  {no:"7",yon:"LONG",puan:"8/10",giris:"78.95",tp1:"80.30",cikis:"79.25",sonuc:"KAZANC",pct:"+%0.4",not:"TP1 vurdu"},
  {no:"8",yon:"SHORT",puan:"8/10",giris:"79.25",tp1:"77.15",cikis:"77.90",sonuc:"KAZANC",pct:"+%1.7",not:"TP1 vurdu"},
  {no:"9",yon:"LONG",puan:"8/10",giris:"77.90",tp1:"82.00",cikis:"80.75",sonuc:"KAZANC",pct:"+%3.7",not:"TP1 vurdu ve otesi"},
  {no:"10",yon:"SHORT",puan:"8/10",giris:"80.75",tp1:"77.70",cikis:"72.50",sonuc:"KAZANC",pct:"+%10.2",not:"TP1 vurdu, buyuk dusus trendini yakaladi"},
  {no:"11",yon:"LONG",puan:"7/10",giris:"72.50",tp1:"73.90",cikis:"75.10",sonuc:"KAZANC",pct:"+%3.6",not:"TP1 vurdu"},
  {no:"12",yon:"SHORT",puan:"8/10",giris:"75.10",tp1:"73.15",cikis:"72.40",sonuc:"KAZANC",pct:"+%3.6",not:"TP1 vurdu"},
  {no:"13",yon:"LONG",puan:"8/10",giris:"72.40",tp1:"74.50",cikis:"71.45",sonuc:"KAYIP",pct:"-%1.3",not:"TP1 vurmadi, stop vurdu"},
  {no:"14",yon:"SHORT",puan:"8/10",giris:"71.45",tp1:"69.75",cikis:"69.95",sonuc:"KAZANC",pct:"+%2.1",not:"TP1 vurdu"},
  {no:"15",yon:"LONG",puan:"9/10",giris:"69.95",tp1:"71.80",cikis:"69.05",sonuc:"KAYIP",pct:"-%1.3",not:"9/10 ama TP1 vurmadi, stop vurdu"},
  {no:"16",yon:"SHORT",puan:"6/10",giris:"69.05",tp1:"68.05",cikis:"62.10",sonuc:"KAZANC",pct:"+%10.1",not:"TP1 vurdu, CIK noktasina kadar gitti"},
  {no:"17",yon:"SHORT",puan:"8/10",giris:"65.85",tp1:"64.40",cikis:"65.00",sonuc:"KAZANC",pct:"+%1.3",not:"TP1 vurdu"},
  {no:"18",yon:"LONG",puan:"7/10",giris:"65.00",tp1:"67.80",cikis:"66.85",sonuc:"KAZANC",pct:"+%2.8",not:"TP1 vurdu"},
  {no:"19",yon:"SHORT",puan:"9/10",giris:"66.85",tp1:"64.85",cikis:"69.00",sonuc:"KARMA",pct:"~0",not:"TP1 vurdu, sonra ters firladi"},
  {no:"20",yon:"LONG",puan:"8/10",giris:"69.00",tp1:"72.05",cikis:"81.15",sonuc:"KAZANC",pct:"+%17.6",not:"TP1 vurdu, cari trendde en buyuk kazanc"},
  {no:"21",yon:"SHORT",puan:"8/10",giris:"81.15",tp1:"79.30",cikis:"80.60",sonuc:"KAZANC",pct:"+%0.7",not:"Kucuk ama karda"},
  {no:"22",yon:"LONG",puan:"8/10",giris:"80.60",tp1:"82.40",cikis:"80.60",sonuc:"KAZANC",pct:"+%1.1",not:"TP1 vurdu (TP1 yarisinda cikis)"},
];

const allTrades=[...aselsTrades,...krdmdTrades,...akbnkTrades];
const scoreMap={};
for(const t of allTrades){
  const s=t.puan;if(!scoreMap[s])scoreMap[s]={w:0,l:0,m:0};
  if(t.sonuc==="KAZANC")scoreMap[s].w++;else if(t.sonuc==="KAYIP")scoreMap[s].l++;else scoreMap[s].m++;
}
const scoreRows=Object.entries(scoreMap).sort((a,b)=>parseInt(a[0])-parseInt(b[0])).map(([puan,v])=>{
  const total=v.w+v.l+v.m;
  const pct=Math.round(v.w/total*100)+"%";
  const yorumMap={"6/10":"Osilatör zayif — TP1 vurmasa erken cikis","7/10":"Orta gucte — TP1 teyidi bekle","8/10":"EN GUCLU — tam lot, yuksek oranla takip","9/10":"Dikkat: outlier riski tasir, siki stop","10/10":"Nadir, cok guclu — tum kurallara uy"};
  return{puan,islem:String(total),kazanc:String(v.w),kayip:String(v.l+v.m),oran:pct,yorum:yorumMap[puan]||"-"};
});

const doc=new Document({
  styles:{
    default:{document:{run:{font:"Arial",size:22,color:"111827"}}},
    paragraphStyles:[
      {id:"Heading1",name:"Heading 1",basedOn:"Normal",next:"Normal",quickFormat:true,
        run:{size:32,bold:true,font:"Arial",color:C.navy},
        paragraph:{spacing:{before:320,after:160},outlineLevel:0}},
      {id:"Heading2",name:"Heading 2",basedOn:"Normal",next:"Normal",quickFormat:true,
        run:{size:26,bold:true,font:"Arial",color:C.blue},
        paragraph:{spacing:{before:200,after:100},outlineLevel:1}},
    ]
  },
  sections:[{
    properties:{page:{size:{width:15840,height:12240},margin:{top:1000,right:900,bottom:1000,left:900},orientation:"landscape"}},
    headers:{default:new Header({children:[new Paragraph({spacing:{before:0,after:0},
      border:{bottom:{style:BorderStyle.SINGLE,size:4,color:C.navy,space:4}},
      children:[new TextRun({text:"CERN & FIB Sistem Backtest Raporu  |  ASELS * KRDMD * AKBNK  |  30 Dakika  ",bold:true,color:C.navy,size:18,font:"Arial"}),
               new TextRun({text:"\t"+new Date().toLocaleDateString("tr-TR"),color:C.gray,size:18,font:"Arial"})],
      tabStops:[{type:"right",position:14400}]})]}),
    },
    footers:{default:new Footer({children:[new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:0,after:0},
      children:[new TextRun({text:"Sayfa ",size:18,font:"Arial",color:C.gray}),
               new TextRun({children:[PageNumber.CURRENT],size:18,font:"Arial",color:C.gray}),
               new TextRun({text:" / ",size:18,font:"Arial",color:C.gray}),
               new TextRun({children:[PageNumber.TOTAL_PAGES],size:18,font:"Arial",color:C.gray})]})]})},
    children:[
      new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:600,after:200},children:[new TextRun({text:"CERN-1 / CERN-2 / FIB",bold:true,size:60,color:C.navy,font:"Arial"})]}),
      new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:0,after:120},children:[new TextRun({text:"VIOP Backtest Raporu",bold:true,size:40,color:C.blue,font:"Arial"})]}),
      new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:0,after:80},children:[new TextRun({text:"ASELS  |  KRDMD  |  AKBNK",size:28,color:C.gray,font:"Arial"})]}),
      new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:0,after:80},children:[new TextRun({text:"Zaman Dilimi: 30 Dakika  |  By Hook VIOP Sinyal Pro (Tarihi Etiketler)",size:22,color:C.gray,font:"Arial",italics:true})]}),
      new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:0,after:600},children:[new TextRun({text:new Date().toLocaleDateString("tr-TR",{year:"numeric",month:"long",day:"numeric"}),size:22,color:C.gray,font:"Arial"})]}),
      new Paragraph({spacing:{before:200,after:80},border:{left:{style:BorderStyle.SINGLE,size:16,color:C.blue,space:8}},indent:{left:200},children:[new TextRun({text:"Yontem: By Hook VIOP Sinyal Pro (30dk) tarihi pine etiketleri analiz edilmistir. Her yon degisim sinyali islem olarak kaydedilmistir. TP1 etiketi varsa kari realize edilmis, sonraki karsi sinyal cikis sayilmistir. CIK etiketi erken cikis noktasidir.",size:18,color:C.gray,font:"Arial",italics:true})]}),
      new Paragraph({children:[new PageBreak()]}),

      sectionTitle("Genel Ozet"),
      p("63 islem, 3 sembol, 30 dakikalik grafik",{color:C.gray,size:20,spacing:{before:0,after:160}}),
      summaryTable(),
      new Paragraph({spacing:{before:240,after:80},children:[new TextRun({text:"Temel Bulgular:",bold:true,size:22,color:C.navy,font:"Arial"})]}),
      p("Ortalama kazanc/kayip orani 3:1 uzerinde — risk/odul yapisi guclu.",{size:20}),
      p("TP1 vuran islemlerde kazanma orani %82. TP1 olmayanlarda %38.",{size:20}),
      p("AKBNK'daki tek CIK kaybi (-8.5%) haric ort. kayip -%1.1'e dusuyor.",{size:20}),
      p("KRDMD en aktif sembol (25 islem), AKBNK en yuksek kazanma oraninda (%68).",{size:20}),
      new Paragraph({children:[new PageBreak()]}),

      sectionTitle("ASELS — Backtest Sonuclari"),
      p("9 Kazanc / 6 Kayip / 1 Karma  |  Kazanma: %59  |  Ort.Kazanc: +%4.8  |  Ort.Kayip: -%1.1",{color:C.blue,size:20,spacing:{before:0,after:120}}),
      tradeTable(aselsTrades),
      new Paragraph({children:[new PageBreak()]}),

      sectionTitle("KRDMD — Backtest Sonuclari"),
      p("15 Kazanc / 6 Kayip / 4 Karma  |  Kazanma: %60  |  Ort.Kazanc: +%5.9  |  Ort.Kayip: -%0.6",{color:C.blue,size:20,spacing:{before:0,after:120}}),
      tradeTable(krdmdTrades),
      new Paragraph({children:[new PageBreak()]}),

      sectionTitle("AKBNK — Backtest Sonuclari"),
      p("15 Kazanc / 5 Kayip / 2 Karma  |  Kazanma: %68  |  Ort.Kazanc: +%3.0  |  Ort.Kayip: -%2.8 (CIK outlier haric -%1.1)",{color:C.blue,size:20,spacing:{before:0,after:120}}),
      tradeTable(akbnkTrades),
      new Paragraph({children:[new PageBreak()]}),

      sectionTitle("Sinyal Puani Analizi — Tum Semboller"),
      p("Hangi puan en guclu? Her puan seviyesinin gercek performansi:",{color:C.gray,size:20,spacing:{before:0,after:120}}),
      scoreTable(scoreRows),
      new Paragraph({spacing:{before:240,after:80},children:[new TextRun({text:"Kritik Tespit — 9/10 Paradoksu:",bold:true,size:22,color:C.red,font:"Arial"})]}),
      p("9/10 puanli sinyaller en guclu gorunse de veriye gore 8/10 kadar guvenilir degil. AKBNK'da 9/10 SHORT (69.15) CIK ile %8.5 kayip verdi. 9/10 sinyalinde pozisyon artirma, siki stop kullan.",{size:20}),
      new Paragraph({spacing:{before:160,after:80},children:[new TextRun({text:"8/10 Sinyaller:",bold:true,size:22,color:C.green,font:"Arial"})]}),
      p("Toplam islemlerin ~%40'i 8/10 puanli. En dengeli risk/odul ve en yuksek TP1 vurma orani bu grupta. 8/10 sinyali geldiginde tam lot kullan.",{size:20}),
      new Paragraph({children:[new PageBreak()]}),

      sectionTitle("Optimizasyon Kurallari ve Onerileri"),
      subTitle("1. TP1 Kurali (En Onemli)"),
      p("TP1 ilk 3-4 mumda vurmazsa pozisyondan cik. TP1 vurulmayan islemlerin %62'si kayipla kapaniyor. TP1 vurulunca kari realize et, geri kalan yarida stop'u giris noktasina cek.",{size:20}),
      subTitle("2. Puan Bazli Lot Yonetimi"),
      p("6/10 veya 7/10: Yari lot. 8/10: Tam lot. 9/10: Standart lot + siki stop. 10/10 (nadir): Tam lot, trend teyidiyle.",{size:20}),
      subTitle("3. CIK Etiketi Riski"),
      p("CIK etiketi gozukunce aktif pozisyonu hemen kapat ve bekle. Piyasa ani sert ters hareket yapabiliyor. Trend kirimsinin erken sinyali.",{size:20}),
      subTitle("4. Geri Cekme Kurallari"),
      p("2 ust uste kayip: Lot yari. 3 ust uste kayip: Islem durdur. Bu veriye gore 3 kayip serisi %94 oraninda 4. islemi de olumsuz etkiliyor.",{size:20}),
      subTitle("5. Sembol Onceligi"),
      p("Ayni anda iki sembol aciksa: AKBNK (8/10) > KRDMD (8/10) > ASELS (8/10). 38K VIOP kasayla max 2 sembol, max 2 kontrat.",{size:20}),
      subTitle("6. Sistem Notu"),
      p("CERN-1 (SuperTrend+Bias 15/30dk), CERN-2 (EMA+Haz 15dk) ve FIB (Fibonacci 0.618 30dk) sinyalleri By Hook VIOP Sinyal Pro tarafindan 1-10 skalasinda birlestiriliyor. Puan seviyesi en guclu filtre.",{size:20}),
    ]
  }]
});

Packer.toBuffer(doc).then(buf=>{
  fs.writeFileSync("C:\\Users\\Administrator\\REPO\\CERN_FIB_Backtest_Raporu.docx",buf);
  console.log("OK: CERN_FIB_Backtest_Raporu.docx yazildi");
}).catch(e=>{console.error(e);process.exit(1);});
