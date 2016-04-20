console.log('The bot is starting');

// import twit
var Twit = require('twit');
//import keys and tokens
var config = require('./config');
//make a Twit object for connection
var T = new Twit(config);

//require child_process for triggering image
var exec = require('child_process').exec;

//require fs
var fs = require('fs');

function searchIt() {
    //get tweet by searching the key word ""
    var params = {
        q: 'rash',
        count: 2
    };

    T.get('search/tweets', params, gotData);

    function gotData(err, data, response) {
        var tweets = data.statuses;
        for (var i = 0; i < tweets.length; i++) {
            console.log(tweets[i].text);
        }

    }
}

//set posting frequency
//setInterval(tweetIt, 1000*20);
var text = 'testing';
tweetIt(text);

function tweetIt(text) {
    var rm = Math.floor(Math.random()*100);
    var tweet = {
        status: text + rm
        //for uploading images
        //media_ids: [id]
    }

    //post tweets
    T.post('statuses/update', tweet, tweeted);

    function tweeted(err, data, response) {
        if (err) {
            consold.log("Somthing went wrong!");
        } else {
            console.log("It worked!");
        }
    }
}

//setting up a user stream
var stream = T.stream('user');

//anytime someone follows me
//stream.on('follow', followed);
//trigger response for being followed
function followed(eventMsg) {
    var name = eventMsg.source.name;
    var screenName = eventMsg.source.screen_name;
    console.log('I was followed by: ' + name);
    tweetIt('@' + screenName + 'Thank you for following me');
}

//execute command line argument
// var cmd = 'processing-java --sketch=`pwd`/rainbow --run';
// exec(cmd, processing);

function processing() {
    var filename = 'rainbow/ouput.png';
    var params = {
        encoding: 'base64'
    }
    var b64content = fs.readFileSync(filename, params);
    T.post('media/upload', { media_data: b64content }, uploaded);

    function uploaded(err, data, response) {
        var id = data.media_id_string;
    }
    console.log('finished');

}

//reply function
//stream.on('tweet', tweetEvent);

function tweetEvent(eventMsg) {
    //see tweets documentation
    // var json = JSON.stringify(eventMsg, null, 2);
    // fs.writeFile("tweet.json", json);

    var replyto = eventMsg.in_reply_to_screen_name;
    var text = eventMsg.text;
    var from = eventMsg.user.screen_name;

    if (replyto == 'sherlockjjj') {
        var newtweet = '@' + from + 'thank you for tweeting me!';
        tweetIt(newtweet);
    }
}
