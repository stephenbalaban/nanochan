var redis = require("redis");

tells = {}

tell_regex = /^\.tell (?!nanochan)([\w|-]+) (.+)/i

var client = redis.createClient();
client.get('tells', function(e,r) {
  tells = JSON.parse(r);
});

function register(bot) {
  bot.addListener('message', function(from, to, message){
    name = from.toLowerCase();
    if(name in tells) {
      bot.say(to, "Hey " + from + ", I have messages for you!");
      tells[name].forEach(function(element, index, array) {
        bot.say(from, element[0] + " says \"" + element[1] + "\"");
      });
      delete tells[name];
      client.set('tells', JSON.stringify(tells));
    }

    if(result = tell_regex.exec(message)) {
      name = result[1].toLowerCase();
      if (!(name in tells)){
        tells[name] = [];
      }
      tells[name].push([from, result[2]]);
      bot.say(to, "Alright " + from + " I'll tell " + name + " next time I see them!");
      client.set('tells', JSON.stringify(tells));
    }
  });
}

module.exports = {'register': register};
