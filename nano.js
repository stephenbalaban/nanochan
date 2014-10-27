#!/usr/bin/node
var config = {
  channels: ["#nanochan","#lainchan"],
  server: "irc.freenode.net",
  botName: "nanochan"
};

var irc = require("irc");
var youtube = require("youtube-node");
var https = require("https");
var sys = require("sys");
var redis = require("redis");

tells = {};

var stdin = process.openStdin();

stdin.addListener("data", function(d) {
  // note:  d is an object, and when converted to a string it will
  // end with a linefeed.  so we (rather crudely) account for that  
  // with toString() and then substring() 
    bot.say("#lainchan", d.toString().substring(0, d.length-1));
});

youtube.setKey('AIzaSyB70sBWjcC5oG6dZ9AsJcDvUQVDS4bKlQw');

var bot = new irc.Client(config.server, config.botName, {
  channels: config.channels
});

lainchan_regex = /(lainchan\.org\/[\w|%]+\/res\/\d+)/;  

var client = redis.createClient();
client.get('tells', function(e,r) {
  tells = JSON.parse(r);
});

bot.addListener('message', function (from, to, message) {
  if(from in tells) {
    bot.say(to, "Hey " + from + ", I have messages for you!");
    tells[from].forEach(function(element, index, array) {
      bot.say(from, element[0] + " says \"" + element[1] + "\"");
    });
    delete tells[from];
    client.set('tells', JSON.stringify(tells));
  }

  if(from != "nanochan") { // the bot can never reply to itself
    console.log(from + ' => ' + to + ': ' + message);
    if(message.indexOf(config.botName) > -1){
      //bot.say(to, "Were you talking about me " + from + "?");
    } else if (message[0] == '.') {
      tell = message.split(' ');
      if(tell[0] == '.tell'){
        if (!(tell[1] in tells)){
          tells[tell[1]] = [];
        }
        tells[tell[1]].push([from, tell.slice(2).join(' ')]);
        bot.say(to, "Alright " + from + " I'll tell " + tell[1] + " next time I see them!");
        client.set('tells', JSON.stringify(tells));
      } else {
        command = message.slice(1);
        switch (command) {
          case 'beer':
            bot.say(to, "One beer coming up!");
            break;
        }
      }
    } else if (message.indexOf("?v=") > -1) {
      url = message.split(/\W+/);
      url = url[url.indexOf('v') + 1];
      youtube.getById(url, function(resultData) {
        bot.say(to, "Video: " + resultData.items[0].snippet.title);
      });
    } else if (message.toLowerCase() == "hi" || message.toLowerCase() == "hey" || message.toLowerCase() == "hello"){
      bot.say(to, "Hi " + from + "!");
    }
    if ((result = lainchan_regex.exec(message))) {
      url = 'https://'+result[0]+'.json';
      threadTeaser(url, function(teaser){
        bot.say(to, "Thread: " + teaser);
      });
    }
  }
});

function threadTeaser(url, callback) {
  https.get(url, function(res) {
    var body = '';

    res.on('data', function(chunk) {
      body += chunk;
    });

    res.on('end', function() {
      var lain = JSON.parse(body).posts[0]
      callback("sub" in lain ? lain.sub : lain.com.slice(0,60));
    });
  })
}
