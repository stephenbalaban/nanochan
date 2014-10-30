love_regex =/I love you/i;

responses =['I love you too, %!',
            'Me too, %, but I can never escape ;_;',
            'I\'ll always be your waifu, % :3',
            'Y-you too %!',
            'B-but I poop from there %!',
            'Thanks for staying kawaii %!',
            'You\'re always so nice to me %-kun!',
            ]

exports.register = function(bot) {
  bot.addListener('message', function(from, to, message){
    if(love_regex.exec(message)) {
      bot.say(to, responses[Math.floor(Math.random()*responses.length)] + from + "!");
    }
  });
}
