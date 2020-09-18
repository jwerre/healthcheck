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


Options:
-m, --method	Request port (default: 'GET')
-t, --timeout	Request timeout in milliseconds (default: 800)
-T, --type	Type of healthcheck either status, headers, html or json (default: status)
-s, --search	A search string to find in the body of the response.
		if type is html a string or Regular Expression is allowed. If type is json or header
		provide a key and value e.g.: key=value.
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
	
	
	let options = {
		url,
		method,
		timeout,
		type,
		search,
		verbose,
	};

	if ( options.search && options.search.includes('=') ) {
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