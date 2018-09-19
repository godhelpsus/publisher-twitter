var PubNub = require('pubnub')
var kafka = require('kafka-node')
var Producer = kafka.Producer
var client = new kafka.Client("10.40.99.51:2181,10.40.99.52:2181,10.40.99.53:2181")
var roducerReady = false ;
var producer = new Producer(client);

producer.on('ready', function () {
  console.log("Producer for countries is ready");
  roducerReady = true;
});

producer.on('error', function (err) {
  console.error("Problem with producing Kafka message "+err);
})

var pubnub = new PubNub({
  subscribeKey: 'sub-c-78806dd4-42a6-11e4-aed8-02ee2ddab7fe'
});

pubnub.addListener({
  message: function(message) {

    if (roducerReady) {
      payloads = [{ topic: 'twitter', messages: JSON.stringify(message), partition: 0 }];
      producer.send(payloads, function (err, data) {
        console.log(err, data);
      });
    }

  }
});


pubnub.subscribe({
  channels: ['pubnub-twitter']
});
