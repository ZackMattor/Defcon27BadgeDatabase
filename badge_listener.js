const EventEmitter = require('events');
const mqtt = require('mqtt')

class BadgeListener extends EventEmitter {
  constructor() {
    super();

    this.buffer = [];
    var client  = mqtt.connect(`mqtt://${process.env.MQTT_URL}/`)

    client.on('connect', () => {
      client.subscribe('scanner', (err) => {
        if (!err) {
          console.log('Connected!');
        }
      })
    })

    client.on('message', this.onMessage.bind(this));
  }

  processes() {
    let id_index = this.buffer.findIndex((line) => line.match(/^0x/));
    let ending_index = this.buffer.findIndex((line) => line == '');

    if(id_index != -1 && ending_index != -1) {
      let packet = this.buffer.splice(id_index, ending_index-id_index);
      this.buffer.splice(0, id_index);

      if(packet.length != 0) this.emit('badge_packet', packet);

      // recurse to see if there is more we can decode this loop
      this.processes();
    }
  }

  onMessage(topic, message) {
    this.buffer.push(message.toString().replace('\r', ''));
    this.processes();
  }
}

module.exports = BadgeListener;
