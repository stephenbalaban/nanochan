#!/usr/bin/node
var config = require('./config')

var irc = require("irc");
var youtube = require("youtube-node");
var https = require("https");
var sys = require("sys");
var redis = require("redis");

var modules = [];

// load modules
config.modules.forEach(function (module) {
  modules.push(require('./modules/'+module)); 
});

// connect to IRC
var bot = new irc.Client(config.server, config.botName, {
  channels: config.channels
});

// register modules
modules.forEach(function (module) {
  module.register(bot);
});

tells = {};

var stdin = process.openStdin();

stdin.addListener("data", function(d) {
  // note:  d is an object, and when converted to a string it will
  // end with a linefeed.  so we (rather crudely) account for that  
  // with toString() and then substring() 
    bot.say("#lainchan", d.toString().substring(0, d.length-1));
});

youtube.setKey('AIzaSyB70sBWjcC5oG6dZ9AsJcDvUQVDS4bKlQw');


lainchan_regex = /(lainchan\.org\/[\w|%]+\/res\/\d+)/;  

var client = redis.createClient();
client.get('tells', function(e,r) {
  tells = JSON.parse(r);
});

bot.addListener('message', function (from, to, message) {
  name = from.toLowerCase();
  if(name in tells) {
    bot.say(to, "Hey " + from + ", I have messages for you!");
    tells[name].forEach(function(element, index, array) {
      bot.say(from, element[0] + " says \"" + element[1] + "\"");
    });
    delete tells[name];
    client.set('tells', JSON.stringify(tells));
  }

  if(from != "nanochan") { // the bot can never reply to itself
    console.log(from + ' => ' + to + ': ' + message);
    if(message.indexOf(config.botName) > -1){
      //bot.say(to, "Were you talking about me " + from + "?");
    }
    if (message[0] == '.') {
      tell = message.split(' ');
      if(tell[0] == '.tell' && tell.length >= 3){
        name = tell[1].toLowerCase();
        if (!(name in tells)){
          tells[name] = [];
        }
        tells[name].push([from, tell.slice(2).join(' ')]);
        bot.say(to, "Alright " + from + " I'll tell " + name + " next time I see them!");
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
