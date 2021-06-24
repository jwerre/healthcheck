#!/usr/bin/env node

const healthcheck = require('../lib/healthcheck');
const argv = require('minimist')(process.argv.slice(2));

if (argv.h || argv.help) {

	console.log(`
Monitor the health of your web applications, web servers, and other resources

Usage: 
healthcheck https://www.example.com
healthcheck --type html --search "^<\!doctype html.*" https://www.example.com
healthcheck --type header --search "content-type=text/html; charset=UTF-8" https://www.example.com
healthcheck --type json --search key=value http://echo.jsontest.com/key/value
healthcheck --type json --search author.name.first=brian https://example.com


Options:
-m, --method	Request port (default: 'GET')
-t, --timeout	Request timeout in milliseconds (default: 800)
-T, --type	Type of healthcheck either status, headers, html or json (default: status)
-s, --search	Search string to find in the response. If type is 'status' provide the status code you expect. If type is 'html' use a string or Regular Expression. If type is 'header' or 'json' provide a key and value as an array [key, value]. For nested values use dot syntax for the key e.g.: ['author.name.first', 'brian']
-h, --help	Show help.
-v, --verbose	Verbose output.
`);

	process.exit(0);

}

const url = argv.url || argv.u || argv._[0];
const method = argv.method || argv.m;
const timeout = argv.timeout || argv.t;
const type = argv.type || argv.T;
const search = argv.search || argv.s;
const verbose = argv.verbose || argv.v;

( async () => {
	
	if (!url || !url.length) {
		return Promise.reject( new Error('Must provide a valid url') );
	}
	
	let options = { 
		url,
		verbose
	};

	if(method && method.length){
		options.method = method;
	}

	if(timeout){
		options.timeout = timeout;
	}

	if(type && type.length){
		options.type = type;
	}

	if(search){
		options.search = search;
	}

	if ( Object.prototype.toString.call(options.search) === '[object String]' && options.search.includes('=') ) {
		options.search = options.search.split(/=(.+)/);
	}

	return healthcheck(options);

})()
	.then( (result) => {
		console.log(result);
		process.exit(0);
	})
	.catch( (err) => {
		console.error(err);
		process.exit(1);
	});