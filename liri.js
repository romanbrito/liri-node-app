var request = require("request");
var nodeArgs = process.argv;
var Twitter = require('twitter');
var keys = require("./keys.js");
var spotify = require('spotify');

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
// Artist, song name, preview link, album.
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

switch (nodeArgs[2]) {
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
        client.get('followers/list', {
            count: '2'
        }, function(error, tweets, response) {
            if (error) throw error;
            console.log(tweets); // The favorites.
            // console.log(response);
            // Raw response object.
        });
        break;
    case "spotify-this-song":
        console.log("spotify-this-song");
        spotify.search({
            type: 'track',
            query: 'dancing in the moonlight'
        }, function(err, data) {
            if (err) {
                console.log('Error occurred: ' + err);
                return;
            }
            logSong(data);
        });
        break;
    case "do-what-it-says":
        console.log("do-what-it-says");
        break;
} //end switch
