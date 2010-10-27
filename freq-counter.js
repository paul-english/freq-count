// PE - quick & dirty analysis of a _very_ large codebase I'm working on
// with the goal of pointing out the parts that shouldn't be so large.

var fs = require('fs');
var sys = require('sys');

var frequency_dictionary = {};

function word_frequency(filename) {
    fs.readFile(filename, 'utf8', function(err, data) {
        //console.log(data);
        data = data.replace(/(\.|\<|\>|\"|\'|\:|\,|\(|\)|\=|\\|\/|\;|\}|\{|\[|\]|\?|\&|\%)/g, ' \0 ') // remove junk
                   .replace(/\s+/g, ' ') // remove unadulterated whitespace
                   .toLowerCase()
                   .split(' ');

        data.forEach(function (token) {
            if (token !== '\u0000') {
                if(frequency_dictionary[token]) {
                    frequency_dictionary[token] ++;
                } else {
                    frequency_dictionary[token] = 1;
                }
            }
        });
        --queue;
        console.log(queue);
        if(queue === 0) {
            write_dictionary();
        }
    });
}

function write_dictionary() {
    console.log('sort the obj first');
    var sortable = [];
    for (var count in frequency_dictionary) {
        sortable.push([count, frequency_dictionary[count]]);
    }
    sortable.sort(function(a, b) {return b[1] - a[1]});

    console.log('write it');
    fs.writeFileSync(path.replace(/\//g, '-') + '.txt', sys.inspect(sortable), 'utf8');
}

var queue = 0;

function walk(filename, callback){
    fs.stat(filename, function(err, stats) {
        if(stats.isFile() && filename.match(/\.(js|txt|asp|cs|less|css)$/)) {
            console.log(filename);
            queue++;
            callback(filename);
        } else if(stats.isDirectory()) {
            //console.log('Directory - walk recursive');
            fs.readdir(filename, function(err, files) {
                for(var i = 0; i < files.length; i++) {
                    walk(filename + '/' + files[i], callback);
                }
            });
        }
    });
}

var path = process.argv[2] || __dirname;

walk(path, word_frequency);