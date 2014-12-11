love_regex =/I love you/i;

responses =['I love you too, %!',
            'I\'ll always be your waifu, % :3',
            'Y-you too %!',
            'Thanks for staying kawaii %!',
            'You\'re always so nice to me %-kun!',
            'Maybe we could get some dinner later, %?',
            'Oh, stop, I\'m blushing~',
            '<3',
            'They say the bandwidth reaches 5 gigabits per second...',
            'Hurry over %, I\'ve got omurice going!',
            ]

exports.register = function(bot) {
  bot.addListener('message', function(from, to, message){
    if(love_regex.exec(message)) {
      bot.say(to, responses[Math.floor(Math.random()*responses.length)].replace('%', from));
    }
  });
}
