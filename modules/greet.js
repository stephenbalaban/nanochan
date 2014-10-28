greet_regex = /((?=.*(hi|hey|hello|sup))(?=.*nanochan).*)|(^(?=.*(hi|hey|hello|sup)$))/i; 

exports.register = function(bot) {
  bot.addListener('message', function(from, to, message){
    if(greet_regex.exec(message)) {
      bot.say(to, "Hi " + from + "!");
    }
  });
}
