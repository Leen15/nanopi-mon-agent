let cron = require('node-cron');
let fs = require('fs');
let mac = require('getmac');
var request = require('request');

let SERVER_URL = process.env.SERVER_URL;
let AGENT_INTERVAL = process.env.AGENT_INTERVAL || '*/5 * * * * *';
let ETH_INTERFACE = process.env.ETH_INTERFACE || 'eth0';
let mac_address = "";

mac.getMac({iface: ETH_INTERFACE},function(err, macAddress){
    if (err)  throw err
    mac_address = macAddress.replace(/:/g, '');
})

cron.schedule(AGENT_INTERVAL, () => {
  //console.log('running a task every X seconds');

  let uptime = fs.readFileSync('/proc/uptime', 'utf8');
  let uptime_array = uptime.split(" ");

  let loadavg = fs.readFileSync('/proc/loadavg', 'utf8');
  let loadavg_array = loadavg.split(" ");

  let temp = 0;
  if (fs.existsSync('/sys/devices/virtual/thermal/thermal_zone0/temp')) {
   temp = fs.readFileSync('/sys/devices/virtual/thermal/thermal_zone0/temp', 'utf8');
   temp_array = temp.split("\n");
   temp = parseInt(temp_array[0]) / 1000;
  }

  var propertiesObject = { mac: mac_address, uptime: uptime_array[0], load: loadavg_array[0], temperature: temp };

  let url = SERVER_URL + "/save-data";

  request({url:url, qs:propertiesObject}, function(err, response, body) {
    if(err) { console.log(err); return; }
    console.log("Get response: " + response.statusCode);
    console.log(body);
  });

  //console.log("Mac: " + mac_address + "\t" + "Uptime: " + uptime_array[0] + "\t" + "LoadAVG: " + loadavg_array[0] + "\t" + "TEMP: " + temp);

});
