thread_regex = /(cyb|diy|drg|lam|λ|layer|lit|rpg|r|tech|w|zzz)/i

function do_babble(forum_dirty, cb) {
    forum_clean = forum_dirty.toLowerCase();
    exec('python babble/babble.py babble ' + forum_clean,
        function(error, stdout, stderr) {
            if (error === null) {
                cb(stdout);
            } else {
                cb('OUCH! ' + error)
            }
    });
}

exports.register = function(bot) {
  bot.addListener('message', function(from, to, message){
    if(result = thread_regex.exec(message)) {
      do_babble(result[1], function(babble_txt) {
          bot.say(to, babble_txt);
      });
    }
  });
}
