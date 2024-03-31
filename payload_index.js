const electron = require ("electron");
const {ipcRenderer} = electron;
const justgage = require('justgage');

document.querySelector("#minimize").addEventListener("click", () => {
  ipcRenderer.send("manualMinimize");
});
document.querySelector("#maximize").addEventListener("click", () => {
  ipcRenderer.send("manualMaximize");
})
document.querySelector("#close").addEventListener("click", () =>{
  ipcRenderer.send("manualClose");
})


var nem_gauge = new JustGage({
    id: "nem", // the id of the html element
    value: 0,
    min: 0,
    max: 100,
    decimals: 2,
    gaugeWidthScale: 0.5,
    donut: false,
    valueFontColor:"white",
    titleFontColor: "white",
    title:"NEM",
    label:"%"
});

var hiz_gauge = new JustGage({
  id: "hiz", // the id of the html element
  value: 0,
  min: 0,
  max: 500,
  decimals: 2,
  gaugeWidthScale: 0.5,
  donut: false,
  valueFontColor:"white",
  titleFontColor: "white",
  title:"HIZ",
  label:"m/s"
});

var irtifa_gauge = new JustGage({
  id: "yükseklik", // the id of the html element
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

var basinc_gauge = new JustGage({
    id: "basinc", // the id of the html element
    value: 0,
    min: 0,
    max: 100,
    decimals: 2,
    gaugeWidthScale: 0.5,
    donut: false,
    valueFontColor:"white",
    titleFontColor: "white",
    title:"BASINÇ",
    label:"hPa"
  });

  var sicaklik_gauge = new JustGage({
    id: "sicaklik", // the id of the html element
    value: 0,
    min: 0,
    max: 70,
    decimals: 2,
    gaugeWidthScale: 0.5,
    donut: false,
    valueFontColor:"white",
    titleFontColor: "white",
    title:"SICAKLIK",
    label:"°C"
  });

  let loc = { lat: 10.918346, lng: 20.146423 };

  function initMap() {
      let map = new google.maps.Map(document.getElementById("map"), {
          zoom: 15,
          center: loc,
      });
      let marker = new google.maps.Marker({
          position: loc,
          map: map,
      });
      setInterval(() => {
          marker.setPosition(loc);
          map.setCenter(loc);
      }, 1000);
  }
  
  window.initMap = initMap;

let raw_datas = [];
let payload_irtifa_datas = [];
let payload_basinc_datas = [];
let payload_enlem_datas = [];
let payload_boylam_datas = [];
let payload_nem_datas = [];
let payload_sicaklik_datas = [];
let payload_hiz_datas = [];

let payload_irtifa = document.getElementById('payload_irtifa')
let payload_basinc = document.getElementById('payload_basinc')
let payload_enlem = document.getElementById('payload_enlem')
let payload_boylam = document.getElementById('payload_boylam')
let payload_nem = document.getElementById('payload_nem')
let payload_sicaklik = document.getElementById('payload_sicaklik')
let payload_hiz = document.getElementById('payload_hiz')

ipcRenderer.on('data-received-payload', (event, data) => {
  let datas = data.split(',');
  raw_datas.push(datas);
  payload_irtifa_datas.push(datas[0]);
  payload_basinc_datas.push(datas[1]);
  payload_enlem_datas.push(datas[2]);
  payload_boylam_datas.push(datas[3]);
  payload_nem_datas.push(datas[4]);
  payload_sicaklik_datas.push(datas[5]);
  payload_hiz_datas.push(datas[6])

  payload_irtifa.innerText = payload_irtifa_datas[payload_irtifa_datas.length - 1] + ' m';
  payload_basinc.innerText = payload_basinc_datas[payload_basinc_datas.length - 1] + ' hPa';
  payload_enlem.innerText = payload_enlem_datas[payload_enlem_datas.length - 1];
  payload_boylam.innerText = payload_boylam_datas[payload_boylam_datas.length - 1];
  payload_nem.innerText = payload_nem_datas[payload_nem_datas.length - 1] + ' %';
  payload_sicaklik.innerText = payload_sicaklik_datas[payload_sicaklik_datas.length - 1] + ' °C';
  payload_hiz.innerText = payload_hiz_datas[payload_hiz_datas.length-1] + 'm/s';
  loc.payload_enlem = parseFloat(payload_enlem_datas[payload_enlem_datas.length - 1]);
  loc.payload_boylam = parseFloat(payload_boylam_datas[payload_boylam_datas.length - 1]);

  let byte_data = convert_to_bytes(
    parseFloat(payload_irtifa_datas[payload_irtifa_datas.length-1]),
    parseFloat(payload_basinc_datas[payload_basinc_datas.length-1]),
    parseFloat(payload_enlem_datas[payload_enlem_datas.length-1]),
    parseFloat(payload_boylam_datas[payload_boylam_datas.length-1]),
    parseFloat(payload_nem_datas[payload_nem_datas.length-1]),
    parseFloat(payload_sicaklik_datas[payload_sicaklik_datas.length-1]),
    parseFloat(payload_hiz_datas[payload_hiz_datas.length-1]),
  );
  
});

  function convert_to_bytes(
   irtifa = 0,
   enlem = 0,
   boylam = 0,
   nem = 0,
   sicaklik = 0,
   hiz = 0,
  ){
    let my_bytes = new Uint8Array(33);
    my_bytes[0] = 0xff;
    my_bytes[1] = 0xff;
    my_bytes[2] = 0x54;
    my_bytes[3] = 0x52;
    let enlem_bytes = new Float32Array([enlem]);
    let enlem_uint8 = new Uint8Array(enlem_bytes.buffer);
    let boylam_bytes = new Float32Array([boylam]);
    let boylam_uint8 = new Uint8Array(boylam_bytes.buffer);
    let irtifa_bytes = new Float32Array([irtifa]);
    let irtifa_uint8 = new Uint8Array(irtifa_bytes.buffer);
    my_bytes.set(irtifa_uint8.slice(0, 4), 8);
    my_bytes.set(enlem_uint8.slice(0, 4), 12);
    my_bytes.set(boylam_uint8.slice(0, 4), 16);

    let nem_bytes = new Float32Array([nem]);
    let nem_uint8 = new Uint8Array(nem_bytes.buffer);
    my_bytes.set(nem_uint8.slice(0,4), 20);
    let sicaklik_bytes = new Float32Array([sicaklik]);
    let sicaklik_uint8 = new Uint8Array(sicaklik_bytes.buffer);
    my_bytes.set(sicaklik_uint8.slice(0,4), 24);
    let hiz_bytes = new Float32Array([hiz]);
    let hiz_uint8 = new Uint8Array(hiz_bytes.buffer);
    my_bytes.set(hiz_uint8.slice(0,4), 28)

    my_bytes[32] = 0x0D
    my_bytes[33] = 0x0A

    return my_bytes;
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