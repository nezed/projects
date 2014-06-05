var cp = require('child_process');

for( var i = 0; i < 10; i++ ) {
	var child = cp.fork('slow-post.js');
	child.kill();
}

var proc = 0,
max_proc = 15,
p_list = [];

var conns = 0;


var codes = {};

message_handler = function(data) {
	if( data[0] === 'code' ) {
		if (!codes[ data[1] ])
			codes[ data[1] ] = 1;
		else
			codes[ data[1] ]++;
	} else if( data[0] === 'conns' ) {
		conns += data[1];
	}
};

var spawn = function(){
	if( p_list.length < max_proc ) {
		var p = cp.fork('slow-post.js');
		p.conns = 0;
		p.on('message', function(data){
			if( data[0] === 'conns' )
				p.conns += data[1];
			message_handler(data);
		});
		p_list.push( p );
	} else {
		clearInterval(st);
	}
}

var respawn = function(){
	if( p_list[0] ) {
		conns -= p_list[0].conns;
	process.stdout.write('\u001B[2J\u001B[0;0f');
		console.log(p_list[0].conns + ' downed');
		p_list[0].kill();
		p_list = p_list.slice(1, p_list.length);
	}
	spawn();
}

spawn();

var st = setInterval(spawn, 20000);
setInterval(respawn, 90000);

setInterval(function(){
//	console.log('\033[2J');
	process.stdout.write('\u001B[2J\u001B[0;0f');
	console.log('Processes: ' + p_list.length + '\nConnections: ' + conns + '\nCodes: ');
	console.dir( codes );
	console.log('	');
	for( var i = 0; i < p_list.length; i++ )
		console.log('	Process ' + i + ': ' + p_list[i].conns + ' connections');
}, 1000)
