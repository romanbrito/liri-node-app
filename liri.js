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
    var writeInfile = "";
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
        writeInfile = writeInfile + key + " : " + obj[key] + '\n';
    }
    console.log(writeInfile);
    logfile("movie-this\n", writeInfile);
}

// spotify log function
const logSong = (data) => {
    var writeInfile = "";
    for (var i = 0; i < data.tracks.items.length; i++) {
        writeInfile = writeInfile + "Artist: ";
        for (var j = 0; j < data.tracks.items[i].artists.length; j++) {
            writeInfile = writeInfile + data.tracks.items[i].artists[j].name + " ";
        }
        writeInfile = writeInfile + "Song: " + data.tracks.items[i].name + " ";
        writeInfile = writeInfile + "Preview url:" + data.tracks.items[i].preview_url + " ";
        writeInfile = writeInfile + "Album: " + data.tracks.items[i].album.name + '\n';
    }
    console.log(writeInfile);
    logfile("spotify-this-song\n", writeInfile);
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

// print function
const logfile = (arg, writeInfile) => {
    fs.appendFile("log.txt", arg + writeInfile);
}

// main function
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
            var writeInfile = "";
            var client = new Twitter({
                consumer_key: twitterParams.consumer_key,
                consumer_secret: twitterParams.consumer_secret,
                access_token_key: twitterParams.access_token_key,
                access_token_secret: twitterParams.access_token_secret
            });
            client.get('statuses/user_timeline', {
                count: '20'
            }, function(error, tweets, response) {
                if (error) throw error;
                for (var i = 0; i < tweets.length; i++) {
                  writeInfile = writeInfile + tweets[i].text + " "; // text
                  writeInfile = writeInfile + tweets[i].created_at + '\n'; // when
                }
                console.log(writeInfile);
                logfile(arg, writeInfile);
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
                switchFunc(data[0], data[1]);
            });
            break;
    } //end switch
} //end switch function

switchFunc(nodeArgs[2], argument); // call the main function
