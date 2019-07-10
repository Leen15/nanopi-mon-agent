let cron = require('node-cron');
let fs = require('fs');
let mac = require('getmac');
var request = require('request');
var os = require( 'os' );
var networkInterfaces = os.networkInterfaces( );

let SERVER_URL = process.env.SERVER_URL;
let AGENT_INTERVAL = process.env.AGENT_INTERVAL || '*/5 * * * * *';
let ETH_INTERFACE = process.env.ETH_INTERFACE || 'eth0';
let VPN_INTERFACE = process.env.VPN_INTERFACE || ETH_INTERFACE;
let mac_address = "";

mac.getMac({iface: ETH_INTERFACE},function(err, macAddress){
    if (err)  throw err
    mac_address = macAddress.replace(/:/g, '');
})

cron.schedule(AGENT_INTERVAL, () => {
  //console.log('running a task every X seconds');

  let uptime = fs.readFileSync('/proc/uptime', 'utf8').split(" ")[0];
  let loadavg = fs.readFileSync('/proc/loadavg', 'utf8').split(" ")[0];

  let temp = 0;
  if (fs.existsSync('/sys/devices/virtual/thermal/thermal_zone0/temp')) {
   temp = fs.readFileSync('/sys/devices/virtual/thermal/thermal_zone0/temp', 'utf8').split("\n")[0];
   temp = parseInt(temp) / 1000;
  }

  let hostname = fs.readFileSync('/etc/hostname', 'utf8').split("\n")[0];

  let local_ip = networkInterfaces[ETH_INTERFACE][0]['address'];
  let vpn_ip = networkInterfaces[VPN_INTERFACE][0]['address'];

  var propertiesObject = { mac: mac_address, uptime: uptime, load: loadavg,
    temperature: temp, hostname: hostname, local_ip: local_ip, vpn_ip: vpn_ip };

  let url = SERVER_URL + "/save-data";

  request({url:url, qs:propertiesObject}, function(err, response, body) {
    if(err) { console.log(err); return; }
    console.log("Get response: " + response.statusCode);
    console.log(body);
  });

  //console.log("Mac: " + mac_address + "\t" + "Uptime: " + uptime_array[0] + "\t" + "LoadAVG: " + loadavg_array[0] + "\t" + "TEMP: " + temp);

});
