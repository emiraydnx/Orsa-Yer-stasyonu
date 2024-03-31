const electron = require ("electron");
const {ipcRenderer} = electron;

document.querySelector("#minimize").addEventListener("click", () => {
  ipcRenderer.send("manualMinimize");
});
document.querySelector("#maximize").addEventListener("click", () => {
  ipcRenderer.send("manualMaximize");
})
document.querySelector("#close").addEventListener("click", () =>{
  ipcRenderer.send("manualClose");
})

var irtifa_chart = new Chart(document.getElementById('irtifa'),{
type: 'line',
data: {
  labels:[0],
  datasets: [{
  label:'irtifa',
  data: [0],
  borderWidth: 1,  
  },
{ label:'görev yükü irtifa',
  data:[0],
  borderWidth:1,
    
}],
},
options: {
  scales: {
  y: {
    beginAtZero: true
    }
  }
}
});

var hiz_chart = new Chart(document.getElementById('hiz'),{
  type: 'line',
  data: {
  labels:[0],
  datasets: [{
  label:'hiz',
  data: [0],
  borderWidth: 1,    
    },
    {label:'görev yükü hız',
    data: [0],
    borderWidth:1,    
  }],
  },
  options: {
  scales: {
  y: {
      beginAtZero: true
      }
    }
  }
  });

var ivme_chart = new Chart(document.getElementById('ivme'),{
  type: 'line',
  data: {
  labels:[0],
  datasets: [{
        label:'ivme',
        data: [0],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
    });

var sicaklik_chart = new Chart(document.getElementById('sicaklik'),{
  type: 'line',
  data: {
  labels:[0],
  datasets: [{
    label:'sıcaklık',
    data: [0],
    borderWidth: 1
},
{
    label:'görev yükü sıcaklık',
    data:[0],
    borderWidth: 1
}]
  },
    options: {
    scales: {
      y: {
      beginAtZero: true
        }
      }
  }
});
       
var basinc_chart = new Chart(document.getElementById('basinc'),{
  type: 'line',
  data: {
  labels:[0],
  datasets: [{
    label:'basınç',
    data: [0],
    borderWidth: 1
},{
  label:'görev yükü basınç',
  data: [0],
  borderWidth: 1
}]
},
  options: {
  scales: {
    y: {
      beginAtZero: true
}
}
}
});
        
var nem_chart = new Chart(document.getElementById('nem'),{
  type: 'line',
  data: {
    labels:[0],
    datasets: [{
      label:'nem',
      data: [0],
      borderWidth: 1
    }]
    },
      options: {
        scales: {
          y: {
          beginAtZero: true
}
}
}
});

let raw_datas = [];
let irtifa_datas = [];
let payload_irtifa_datas = [];
let basinc_datas = [];
let payload_basinc_datas = [];
let hiz_datas = [];
let payload_hiz_datas = [];
let sicaklik_datas = [];
let payload_sicaklik_datas = [];
let payload_nem_datas = [];

ipcRenderer.on('data-received', (event, data) => {
  let datas = data.split(',');
  raw_datas.push(datas);
  irtifa_datas.push(datas[0]);
  basinc_datas.push(datas[1]);
  hiz_datas.push(datas[2]);
  sicaklik_datas.push(datas[3]);

//irtifa grafiği
  window.setInterval(irtifa_grafik,10000);
function irtifa_grafik(){
var x = new Date();
x= x.getHours()+'.'+x.getMinutes()+'.'+x.getSeconds();
var irtifa1 = (irtifa_datas[irtifa_datas.length-1]);
irtifa_chart.data.labels.push(x);
irtifa_chart.data.datasets[0].data.push(irtifa1);
irtifa_chart.update();
}

//basınç grafiği
window.setInterval(basinc_grafik,10000);
function basinc_grafik(){
var x = new Date();
x= x.getHours()+'.'+x.getMinutes()+'.'+x.getSeconds();
var basinc1 = (basinc_datas[basinc_datas.length-1]);
basinc_chart.data.labels.push(x);
basinc_chart.data.datasets[0].data.push(basinc1);
basinc_chart.update();
}
 
//hız grafiği
window.setInterval(hiz_grafik,10000);
function hiz_grafik(){
var x = new Date();
x= x.getHours()+'.'+x.getMinutes()+'.'+x.getSeconds();
var hiz1 = (hiz_datas[hiz_datas.length-1]);
hiz_chart.data.labels.push(x);
hiz_chart.data.datasets[0].data.push(hiz1);
hiz_chart.update();
}

//sıcaklık grafiği
window.setInterval(sicaklik_grafik,10000);
function sicaklik_grafik(){
var x = new Date();
x= x.getHours()+'.'+x.getMinutes()+'.'+x.getSeconds();
var sicaklik1 = (sicaklik_datas[sicaklik_datas.length-1]);
sicaklik_chart.data.labels.push(x);
sicaklik_chart.data.datasets[0].data.push(sicaklik1);
sicaklik_chart.update();
}


});

ipcRenderer.on('data-received-payload', (event, data) => {
  let datas = data.split(',');
  raw_datas.push(datas);
  payload_irtifa_datas.push(datas[0]);
  payload_basinc_datas.push(datas[1]);
  payload_hiz_datas.push(datas[2]);
  payload_sicaklik_datas.push(datas[3]);
  payload_nem_datas.push(datas[3]);

// görev yükü irtifa grafiği
window.setInterval(payload_irtifa_grafik,10000);
function payload_irtifa_grafik(){
var x = new Date();
x= x.getHours()+'.'+x.getMinutes()+'.'+x.getSeconds();
var irtifa2 = (payload_irtifa_datas[payload_irtifa_datas.length-1]);
irtifa_chart.data.labels.push(x);
irtifa_chart.data.datasets[1].data.push(irtifa2);
irtifa_chart.update();
}

//görev yükü basınç grafiği
window.setInterval(payload_basinc_grafik,10000);
function payload_basinc_grafik(){
var x = new Date();
x= x.getHours()+'.'+x.getMinutes()+'.'+x.getSeconds();
var basinc2 = (payload_basinc_datas[payload_basinc_datas.length-1]);
basinc_chart.data.labels.push(x);
basinc_chart.data.datasets[1].data.push(basinc2);
basinc_chart.update();
}

//görev yükü hiz grafiği
window.setInterval(payload_hiz_grafik,10000);
function payload_hiz_grafik(){
var x = new Date();
x= x.getHours()+'.'+x.getMinutes()+'.'+x.getSeconds();
var hiz2 = (payload_hiz_datas[payload_hiz_datas.length-1]);
hiz_chart.data.labels.push(x);
hiz_chart.data.datasets[1].data.push(hiz2);
hiz_chart.update();
}

//görev yükü sıcaklık grafiği
window.setInterval(payload_sicaklik_grafik,10000);
function payload_sicaklik_grafik(){
var x = new Date();
x= x.getHours()+'.'+x.getMinutes()+'.'+x.getSeconds();
var sicaklik2 = (payload_sicaklik_datas[payload_sicaklik_datas.length-1]);
sicaklik_chart.data.labels.push(x);
sicaklik_chart.data.datasets[1].data.push(sicaklik2);
sicaklik_chart.update();
}

//nem grafiği
window.setInterval(payload_nem_grafik,10000);
function payload_nem_grafik(){
var x = new Date();
x= x.getHours()+'.'+x.getMinutes()+'.'+x.getSeconds();
var nem = (payload_nem_datas[payload_nem_datas.length-1]);
nem_chart.data.labels.push(x);
nem_chart.data.datasets[0].data.push(nem);
nem_chart.update();
}

});

          