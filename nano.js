#!/usr/bin/node
var config = require('./config')

var irc = require("irc");

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

bot.addListener('message', function (from, to, message) {

  if(from != "nanochan") { // the bot can never reply to itself
    console.log(from + ' => ' + to + ': ' + message);
    if(message.indexOf(config.botName) > -1){
      //bot.say(to, "Were you talking about me " + from + "?");
    }
  if (message.toLowerCase() == "hi" || message.toLowerCase() == "hey" || message.toLowerCase() == "hello"){
      bot.say(to, "Hi " + from + "!");
    }
  }
});

