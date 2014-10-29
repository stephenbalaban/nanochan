love_regex =/I love you/i;

responses =['I love you too, ',
            'Our love can never be ;_; ',
            'I\'ll always be your waifu :3 ',
            'Y-you too ',
            'B-but I poop from there ',]

exports.register = function(bot) {
  bot.addListener('message', function(from, to, message){
    if(love_regex.exec(message)) {
      bot.say(to, responses[Math.floor(Math.random()*responses.length)] + from + "!");
    }
  });
}
