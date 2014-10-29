greet_regex = /^(hi|hey|hello|sup|hai|ohayou)(.?\s?(nanochan)|$)/i;

exports.register = function(bot) {
  bot.addListener('message', function(from, to, message){
    if(greet_regex.exec(message)) {
      bot.say(to, "Hi " + from + "!");
    }
  });
}
