function register(bot) {
  bot.addListener('error', function(message){
    console.error(message);
  });
}

module.exports = {"register": register};
