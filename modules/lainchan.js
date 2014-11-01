var https = require("https");
var http = require("http");
var request = require("request");

lainchan_regex = /(https:\/\/lainchan\.org\/[\w|%|\u03BB]+\/res\/\d+)|(https?:\/\/(.+))/;
title_regex = /(<\s*title[^>]*>(.+?)<\s*\/\s*title)>/gi; // >parsing HTML with a regex

function register(bot){
  bot.addListener('message', function(from, to, message){
    result = lainchan_regex.exec(message);
    if (result && result[1]) { // Lainchan URLs
      url = result[0]+'.json';
      threadTeaser(url, function(teaser){
        bot.say(to, "Thread: " + teaser);
      });
    } else if(result && result[2]){ // any other URL
      linkTeaser(result[2], function(teaser){
        bot.say(to, "Link: " + teaser);
      });
    }
  });
}

function threadTeaser(url, callback) {
  https.get(url, function(res) {
    var body = '';

    res.on('data', function(chunk) {
      body += chunk;
    });

    res.on('end', function() {
      try {
        var lain = JSON.parse(body).posts[0];
        callback("sub" in lain ? lain.sub : lain.com.slice(0,60));
      } catch (e) {
        console.error("Failed to parse page " + url + ": " + e);
      }
    });
  })
}

function linkTeaser(url, callback) {
  request(url, function(err, res, body) {
    try {
      var lain = title_regex.exec(body);
      if(lain){
        callback(lain[2]);
      } else {
        throw Error("no <title>");
      }
    } catch (e) {
      console.error("Failed to parse page " + url + ": " + e);
    }
  })
}

module.exports = {"register": register};
