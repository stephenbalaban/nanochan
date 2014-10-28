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

bot.addListener('message', function (from, to, message) {

  if(from != "nanochan") { // the bot can never reply to itself
    console.log(from + ' => ' + to + ': ' + message);
    if(message.indexOf(config.botName) > -1){
      //bot.say(to, "Were you talking about me " + from + "?");
    }
    if (message[0] == '.') {
      command = message.slice(1);
      switch (command) {
        case 'beer':
          bot.say(to, "One beer coming up!");
          break;
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
  }
});

