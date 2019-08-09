const BadgeListener = require('./badge_listener.js');
const FrontendServer = require('./frontend_server.js');
const fs = require('fs');

console.log('Welcome to badgecon server!!');

let listener = new BadgeListener();
let server = new FrontendServer();

let data = JSON.parse(fs.readFileSync('./data.json'));
server.setData(data);

setInterval(() => {
  fs.writeFileSync('./data.json', JSON.stringify(data));
}, 5000);

listener.on('badge_packet', (packet) => {
  let id = packet.splice(0, 1)[0];
  let time = +(new Date());

  let obj = {
    id: id,
    time: time
  };

  packet.forEach((line) => {
    let matches = line.match(/-> (.*)\:(.*)/);
    let key = matches[1].toLowerCase().replace(' ', '_');
    let val = matches[2];

    obj[key] = val;
  });

  if(!data[id]) data[id] = [];
  data[id].push(obj);
  server.setData(data);

  console.log(data);
});
