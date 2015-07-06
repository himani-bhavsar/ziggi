var mqtt = require('mqtt');
var socketio = require('socketio');

client = mqtt.createClient(1883, 'mqtt.beebotte.com',
//Authenticate with your channel token,
{username: 'token:1435762653433_zWO7xP8NP2BeUSpL', password: ''});

 
client.on('message', function (topic, message) {
  console.log('topic: ' + topic + ' payload: ' + message);
  socketio.sendMessage(message.toString());
});
 
client.subscribe('AppTeamDemo/GpsDataUpload');
client.subscribe('AppTeamDemo/EventDataUpload');
client.subscribe('AppTeamDemo/CommToZiggi');
client.subscribe('AppTeamDemo/CommFromZiggi');

