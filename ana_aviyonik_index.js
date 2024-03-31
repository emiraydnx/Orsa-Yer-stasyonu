const electron = require ("electron");
const {ipcRenderer} = electron;
const justgage = require('justgage');

//uygulama butonları 
document.querySelector("#minimize").addEventListener("click", () => {
  ipcRenderer.send("manualMinimize");
});
document.querySelector("#maximize").addEventListener("click", () => {
  ipcRenderer.send("manualMaximize");
})
document.querySelector("#close").addEventListener("click", () =>{
  ipcRenderer.send("manualClose");
})


let loc = { lat: 32.847612, lng: 8.226442 };

async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");

    let map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: loc,
    });
    let marker = new google.maps.marker.AdvancedMarkerElement({
        map: map,
        position: loc, 
        title:'roket', 
    });
    setInterval(() => {
        marker.setPosition(loc);
        map.setCenter(loc);
    }, 1000);
}

window.initMap = initMap;

var sicaklik_gosterge = new JustGage({
  id: "sicaklik_gauge", // the id of the html element
  value: 0,
  min: 0,
  max: 50,
  decimals: 2,
  gaugeWidthScale: 0.5,
  donut: false,
  valueFontColor:"white",
  titleFontColor: "white",
  title:"SICAKLIK",
  label:"°C",
  
});

var basinc_gosterge = new JustGage({
  id: "basinc_gauge", // the id of the html element
  value: 0,
  min: 0,
  max: 100,
  decimals: 2,
  gaugeWidthScale: 0.5,
  donut: false,
  valueFontColor:"white",
  titleFontColor: "white",
  title:"BASINÇ",
  label:"hPa",
  
});

var hiz_gosterge = new JustGage({
id: "hiz_gauge", // the id of the html element
value: 0,
min: 0,
max: 1123,
decimals: 2,
gaugeWidthScale: 0.5,
donut: false,
valueFontColor:"white",
titleFontColor: "white",
title:"HIZ",
label:"m/s"
});

var irtifa_gosterge = new JustGage({
id: "yükseklik_gauge", // the id of the html element
value: 0,
min: 0,
max: 5000,
decimals: 2,
gaugeWidthScale: 0.5,
donut: false,
valueFontColor:"white",
titleFontColor: "white",
title:"İRTİFA",
label:"m"
});

let raw_datas = [];
let kurtarma_1_datas = [];
let kurtarma_2_datas = [];
let irtifa_datas = [];
let basinc_datas = [];
let hiz_datas = [];
let aci_datas = [];
let sicaklik_datas = [];
let gyro_x_datas = [];
let gyro_y_datas = [];
let gyro_z_datas = [];
let ivme_x_datas = [];
let ivme_y_datas = [];
let ivme_z_datas = [];
let gps_enlem_datas = [];
let gps_boylam_datas = [];
let gps_irtifa_datas = [];

//HYİ kabul edlien 78 bytelık paket yapısı bozulmaması için payload verileri de işlenecek ancak ekrana yazdırılmayacak
let payload_irtifa_datas = [];
let payload_enlem_datas = [];
let payload_boylam_datas = [];


let kurtarmaa_1 = document.getElementById('kurtarma-1')
let kurtarmaa_2 = document.getElementById('kurtarma-2')
let irtifa = document.getElementById('irtifa')
let basinc = document.getElementById('basinc')
let hiz = document.getElementById('hiz')
let aci = document.getElementById('aci')
let sicaklik = document.getElementById('sicaklik')
let gyro_x = document.getElementById('gyro_x')
let gyro_y = document.getElementById('gyro_y')
let gyro_z = document.getElementById('gyro_z')
let ivme_x = document.getElementById('ivme_x')
let ivme_y = document.getElementById('ivme_y')
let ivme_z = document.getElementById('ivme_z')
let gps_enlem = document.getElementById('roket_enlem')
let gps_boylam = document.getElementById('roket_boylam')
let gps_irtifa = document.getElementById('roket_GPS_irtifa')


let sayac = 0;

ipcRenderer.on('data-received', (event, data) => {
  let datas = data.split(',');
  raw_datas.push(datas);
  kurtarma_1_datas.push(datas[0][0]);
  kurtarma_2_datas.push(datas[0][1]);
  irtifa_datas.push(datas[1]);
  basinc_datas.push(datas[2]);
  hiz_datas.push(datas[3]);
  aci_datas.push(datas[4]);
  sicaklik_datas.push(datas[5]);
  gyro_x_datas.push(datas[6]);
  gyro_y_datas.push(datas[7]);
  gyro_z_datas.push(datas[8]);
  ivme_x_datas.push(datas[9]);
  ivme_y_datas.push(datas[10]);
  ivme_z_datas.push(datas[11]);
  gps_enlem_datas.push(datas[12]);
  gps_boylam_datas.push(datas[13]);
  gps_irtifa_datas.push(datas[14]);

  if(kurtarma_1_datas[kurtarma_1_datas.length-1] =='-'){
    kurtarmaa_1.innerText = 'Tetiklenmedi'
  }else{
    kurtarmaa_1.innerText ='Tetiklendi'
  }
  if(kurtarma_2_datas[kurtarma_2_datas.length-1] == '-'){
    kurtarmaa_2.innerText = 'Tetiklenmedi'
  }else{
    kurtarmaa_2.innerText = 'Tetiklendi'
  }
  irtifa.innerText = irtifa_datas[irtifa_datas.length-1] + 'm';
  basinc.innerText = basinc_datas[basinc_datas.length-1] + 'hPa';
  hiz.innerText = hiz_datas[hiz_datas.length-1] + 'm/s';
  aci.innerText = aci_datas[aci_datas.length-1] + '°';
  sicaklik.innerText = sicaklik_datas[sicaklik_datas.length-1] + '°C';
  gyro_x.innerText ='Jiroskop x:' + gyro_x_datas[gyro_x_datas.length-1] +'dps';
  gyro_y.innerText = 'Jiroskop y:'+gyro_y_datas[gyro_y_datas.length-1] +'dps';
  gyro_z.innerText = 'Jirosokp z:'+gyro_z_datas[gyro_z_datas.length-1] +'dps';
  ivme_x.innerText = 'ivme x:'+ ivme_x_datas[ivme_x_datas.length-1] + 'g';
  ivme_y.innerText = 'ivme y:'+ ivme_y_datas[ivme_y_datas.length-1] + 'g';
  ivme_z.innerText = 'ivme z:'+ ivme_z_datas[ivme_z_datas.length-1] + 'g';
  gps_enlem.innerText = 'gps_enlem:'+gps_enlem_datas[gps_enlem_datas.length-1];
  gps_boylam.innerText = 'gps_boylam:'+gps_boylam_datas[gps_boylam_datas.length-1];
  gps_irtifa.innerText = 'gps_irtifa:'+gps_irtifa_datas[gps_irtifa_datas.length-1];
  
  loc.gps_enlem = parseFloat(gps_enlem_datas[gps_enlem.length-1]);
  loc.gps_boylam = parseFloat(gps_boylam_datas[gps_boylam.length-1]);

  //göstergeler
  irtifa_gosterge.refresh(irtifa_datas[irtifa_datas.length-1]);
  sicaklik_gosterge.refresh(sicaklik_datas[sicaklik_datas.length-1]);
  hiz_gosterge.refresh(hiz_datas[hiz_datas.length-1]);
  basinc_gosterge.refresh(basinc_datas[basinc_datas.length-1]);

//HYİ gönderilecek ve kabul edilen veriler
  let byte_data = convert_to_bytes(
    sayac++,
    parseFloat(irtifa_datas[irtifa_datas.length-1]),
    parseFloat(gps_enlem_datas[gps_enlem_datas.length-1]),
    parseFloat(gps_boylam_datas[gps_boylam_datas.length-1]),
    parseFloat(gps_irtifa_datas[gps_irtifa_datas.length-1]),
    parseFloat(payload_irtifa_datas[payload_irtifa_datas.length-1]),
    parseFloat(payload_enlem_datas[payload_enlem_datas.length-1]),
    parseFloat(payload_boylam_datas[payload_boylam_datas.length-1]),
    parseFloat(gyro_x_datas[gyro_x_datas.length-1]),
    parseFloat(gyro_y_datas[gyro_y_datas.length-1]),
    parseFloat(gyro_z_datas[gyro_z_datas.length-1]),
    parseFloat(ivme_x_datas[ivme_x_datas.length-1]),
    parseFloat(ivme_y_datas[ivme_y_datas.length-1]),
    parseFloat(ivme_z_datas[ivme_z_datas.length-1]),
    parseFloat(aci_datas[aci_datas.length-1]),
    5,
  );
  ipcRenderer.send('send-hyi', byte_data);

});

  function convert_to_bytes(
    sayac = 0,
    irtifa = 0.0,
    enlem = 0.0,
    boylam = 0.0,
    gpss_irtifa = 0.0,
    faydali_enlem = 0.0,
    faydali_boylam = 0.0,
    faydali_irtifa = 0.0,
    gyr_x = 0.0,
    gyr_y = 0.0,
    gyr_z = 0.0,
    ivm_x = 0.0,
    ivm_y = 0.0,
    ivm_z = 0.0,
    acci = 0.0,
    durum = 0,
) 

{
    // 78 bytes size byte array
    let my_bytes = new Uint8Array(78);
    my_bytes[0] = 0xff;
    my_bytes[1] = 0xff;
    my_bytes[2] = 0x54;
    my_bytes[3] = 0x52;
    // TAKIM ID my_bytes[4]
    my_bytes[4] = new Uint8Array([5])[0];
    // paket sayacı
    my_bytes[5] = new Uint8Array([sayac])[0];

    irtifa = typeof irtifa === "number" ? irtifa : 0.0;
    enlem = typeof enlem === "number" ? enlem : 0.0;
    boylam = typeof boylam === "number" ? boylam : 0.0;
    gpss_irtifa = typeof gpss_irtifa === "number" ? gpss_irtifa : 0.0;
    let irtifa_bytes = new Float32Array([irtifa]);
    let enlem_bytes = new Float32Array([enlem]);
    let boylam_bytes = new Float32Array([boylam]);
    let gpss_irtifa_bytes = new Float32Array([gpss_irtifa]);
    let irtifa_uint8 = new Uint8Array(irtifa_bytes.buffer);
    let enlem_uint8 = new Uint8Array(enlem_bytes.buffer);
    let boylam_uint8 = new Uint8Array(boylam_bytes.buffer);
    let gpss_irtifa_uint8 = new Uint8Array(gpss_irtifa_bytes.buffer);
    my_bytes.set(irtifa_uint8.slice(0, 4), 6);
    my_bytes.set(gpss_irtifa_uint8.slice(0, 4), 10);
    my_bytes.set(enlem_uint8.slice(0, 4), 14);
    my_bytes.set(boylam_uint8.slice(0, 4), 18);
    
    let faydali_irtifa_bytes = new Float32Array([faydali_irtifa]);
    let faydali_enlem_bytes = new Float32Array([faydali_enlem]);
    let faydali_boylam_bytes = new Float32Array([faydali_boylam]);
    let faydali_irtifa_uint8 = new Uint8Array(faydali_irtifa_bytes.buffer);
    let faydali_enlem_uint8 = new Uint8Array(faydali_enlem_bytes.buffer);
    let faydali_boylam_uint8 = new Uint8Array(faydali_boylam_bytes.buffer);
    my_bytes.set(faydali_irtifa_uint8.slice(0, 4), 22);
    my_bytes.set(faydali_enlem_uint8.slice(0, 4), 26);
    my_bytes.set(faydali_boylam_uint8.slice(0, 4), 30);
    
    //kademe gps verileri zorlu görev kategorsinde istendiği için veriler boş atanır
    my_bytes[34] = 0xFF
    my_bytes[35] = 0xFF
    my_bytes[36] = 0xFF
    my_bytes[37] = 0xFF
    my_bytes[38] = 0xFF
    my_bytes[39] = 0xFF
    my_bytes[40] = 0xFF
    my_bytes[41] = 0xFF
    my_bytes[42] = 0xFF
    my_bytes[43] = 0xFF
    my_bytes[44] = 0xFF
    my_bytes[45] = 0xFF

    let gyr_x_bytes = new Float32Array([gyr_x]);
    let gyr_y_bytes = new Float32Array([gyr_y]);
    let gyr_z_bytes = new Float32Array([gyr_z]);
    let gyr_x_uint8 = new Uint8Array(gyr_x_bytes.buffer);
    let gyr_y_uint8 = new Uint8Array(gyr_y_bytes.buffer);
    let gyr_z_uint8 = new Uint8Array(gyr_z_bytes.buffer);
    my_bytes.set(gyr_x_uint8.slice(0, 4), 46);
    my_bytes.set(gyr_y_uint8.slice(0, 4), 50);
    my_bytes.set(gyr_z_uint8.slice(0, 4), 54);
    
    let ivm_x_bytes = new Float32Array([ivm_x]);
    let ivm_y_bytes = new Float32Array([ivm_y]);
    let ivm_z_bytes = new Float32Array([ivm_z]);
    let ivm_x_uint8 = new Uint8Array([ivm_x_bytes.buffer]);
    let ivm_y_uint8 = new Uint8Array([ivm_y_bytes.buffer]);
    let ivm_z_uint8 = new Uint8Array([ivm_z_bytes.buffer]);
    my_bytes.set(ivm_x_uint8.slice(0, 4), 58);
    my_bytes.set(ivm_y_uint8.slice(0, 4), 62);
    my_bytes.set(ivm_z_uint8.slice(0, 4), 66);

    let acci_bytes = new Float32Array([acci]);
    let acci_uint8 = new Uint8Array([acci_bytes.buffer]);
    my_bytes.set(acci_uint8.slice(0, 4), 70);
  
    my_bytes[74] = 0xFF//durum

    my_bytes[75] = check_sum_hesapla(my_bytes);

    my_bytes[76] = 0x0D
    my_bytes[77] = 0x0A

    return my_bytes;
}

function check_sum_hesapla(my_bytes) {
    let check_sum = 0;
    for (let i = 4; i < 75; i++) {
        check_sum += my_bytes[i];
    }
    return check_sum % 256;
}


let hours = 0;
let minutes = 0;
let seconds = 0;

// HTML'deki gerekli elementi seçme
const clockElement = document.getElementById('zaman');

// Zamanı güncelleyen fonksiyon
function updateClock() {
  seconds++;

  if (seconds === 60) {
    seconds = 0;
    minutes++;

    if (minutes === 60) {
      minutes = 0;
      hours++;
    }
  }

  const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  clockElement.innerText = formattedTime;
}

// Her saniyede bir zamanı güncelleyen fonksiyonu çağırma
setInterval(updateClock, 1000);

