var request = require("request");
var nodeArgs = process.argv;
var Twitter = require('twitter');
var keys = require("./keys.js");
var spotify = require('spotify');
var fs = require("fs");

// read arguments
var argument = "";
for (var i = 3; i < nodeArgs.length; i++) {
    if (i > 3 && i < nodeArgs.length) {
        argument = argument + "+" + nodeArgs[i];
    } else {
        argument += nodeArgs[i];
    }
}

// movie log function
const logMovie = (body) => {
    var obj = JSON.parse(body);
    var output = {
        Title: null,
        Year: null,
        imdbRating: null,
        Country: null,
        Language: null,
        Plot: null,
        Actors: null,
        tomatoRating: null,
        tomatoURL: null
    };
    for (var key in output) {
        console.log(key + " : " + obj[key]);
    }
}

// spotify log function
const logSong = (data) => {
    for (var i = 0; i < data.tracks.items.length; i++) {
      console.log("Artists: ");
        for (var j = 0; j < data.tracks.items[i].artists.length; j++) {
            console.log(data.tracks.items[i].artists[j].name); //artists
        }
        console.log("Song: " + data.tracks.items[i].name); // song name
        console.log("Preview url" + data.tracks.items[i].preview_url); //preview
        console.log("Album: "  + data.tracks.items[i].album.name); //album
    }
}

// spotify search Song
const searchSong = (songName) => {
spotify.search({
    type: 'track',
    query: songName
}, function(err, data) {
    if (err) {
        console.log('Error occurred: ' + err);
        return;
    }
    logSong(data);
});
}

const switchFunc = (arg, argument) => {

switch (arg) {
    case "movie-this":
        // movies
        var movieName = "";
        if (argument) {
            movieName = argument;
        } else {
            movieName = "Mr.+Nobody";
        }
        var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&r=json&tomatoes=true";
        request(queryUrl, function(error, response, body) {
            if (!error && response.statusCode === 200) {
                logMovie(body);
            }
        });
        break;
        // twitter
    case "my-tweets":
        var twitterParams = keys.twitterKeys;
        // console.log("consumer key "+ twitterParams.consumer_key);
        var client = new Twitter({
            consumer_key: twitterParams.consumer_key,
            consumer_secret: twitterParams.consumer_secret,
            access_token_key: twitterParams.access_token_key,
            access_token_secret: twitterParams.access_token_secret
        });
        client.get('statuses/user_timeline', {
            count: '2'
        }, function(error, tweets, response) {
            if (error) throw error;
            console.log(tweets[0].text); // text
            console.log(tweets[0].created_at); // when
        });
        break;
    case "spotify-this-song":
    var songName = "";
    if (argument) {
        songName = argument;
    } else {
        songName = "the sign ace of base";
    }
        console.log("spotify-this-song");
        searchSong(songName);
        break;
    case "do-what-it-says":
        console.log("do-what-it-says");
        fs.readFile("random.txt", "utf8", (err, data) => {
          data = data.split(",");
          console.log(data[0]);
          switchFunc(data[0], data[1]);
        });
        break;
} //end switch
} //end switch function

switchFunc(nodeArgs[2], argument); // call the main function
