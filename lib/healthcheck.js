#!/usr/bin/env node

const http = require('http');
const https = require('https');
const get = require('lodash.get');

const RESPONSE = 'OK';

const TYPE_STATUS = 'status';
const TYPE_HEADER = 'header';
// const TYPE_HTLM = 'html';
const TYPE_JSON = 'json';

const DEFAULT_URL = 'localhost';
const DEFAULT_METHOD = 'GET';
const DEFAULT_TIMEOUT = 800;
const DEFAULT_TYPE = TYPE_STATUS;

/**
 * Monitor the health of your web applications, web servers, and other resources
 * 
 * @param {Object} options healthcheck options
 * @param {String} options.host request host (default: localhost)
 * @param {Number} options.port request port (default: 80)
 * @param {String} options.path request path (default: '/test')
 * @param {String} options.method request port (default: 'GET')
 * @param {Number} options.timeout request timeout in milliseconds (default: 800)
 * @param {String} options.type type of healthcheck either status, header, html or json (default: status)
 * @param {String|RegExp} options.search search string to find in the body of the response.
 *		if type is html a string or Regular Expression is allowed. If type is JSON
 *		provide a key and value as an array e.g.: [key, value].
 * @return {Promise<String>} promise
 * @async
*/
function healthcheck (options) {
	
	options = Object.assign({
		url: DEFAULT_URL,
		method: DEFAULT_METHOD,
		timeout: DEFAULT_TIMEOUT,
		type: DEFAULT_TYPE,
	}, options);

	let url = new URL(options.url);
	delete options.url;

	if (options.verbose) {
		console.log('URL:', url.toString());
		console.log('Options:', options);
	}

	return new Promise(function(resolve, reject){

		const httpAgent = url.protocol === 'https:' ? https : http;

		const request = httpAgent['request'](url, options, (res) => {

			if (res.statusCode > 399 ) {
				return reject( 
					new Error(`Request restuned a status code of ${res.statusCode}`) 
				);
			}

			if (options.type === TYPE_STATUS ) {

				if (options.verbose) {
					console.log('Status Code:', res.statusCode);
				}
				
				if ( !isNaN(options.search) ){

					if (Number(options.search) === res.statusCode) {
						return resolve(RESPONSE);
					} else {
						return reject( 
							new Error(`Expected status code ${options.search}, received ${res.statusCode}`) 
						);
					}

				} else {
					return resolve(RESPONSE);
				}
	
			}

			if (options.type === TYPE_HEADER) {

				if(options.verbose) {
					console.log(options.search);
					console.log('Headers:', res.headers);
				}
	
				if ( Array.isArray(options.search) && options.search.length) {

					if (
						options.search.length > 1
						&& options.search[0] in res.headers
						&& res.headers[options.search[0]] == options.search[1]
					) {
						return resolve(RESPONSE);
					} else {

						return reject( new Error(`Could not find header property ${options.search[0]} with value ${options.search[1]}`) );
					}
				} else {
					return resolve(RESPONSE);
				}
			}
	
			if (res.statusCode === 200) {
				
				res.setEncoding('utf8');
		
				let body = '';
				
				res.on( 'data', (chunk) => {
					body += chunk;
				});
		
		
				res.on( 'end', () => {

					if (!body || !body.length) {
						return reject( new Error('Body is empty.') );
					}

					if(options.verbose) {
						console.log(body);
					}		

					if (options.search && options.search.length) {
						
						let success = false;

						if (options.type === TYPE_JSON) {
							body = JSON.parse(body);
						}

						if (options.type === TYPE_JSON) {

							if (options.search.length > 1) {
								success = get(body, options.search[0]) == options.search[1];
							} else {
								success = body == body[options.search[0]];
							}

						} else {
							let regex = new RegExp(options.search);

							if(options.verbose) {
								console.log('Search', regex);
							}

							success = regex.test(body);
						}

						if (success) {
							return resolve(RESPONSE);
						} else {
							return reject( new Error('Search failed.') );
						}
	
					} else {
						resolve(RESPONSE);
					}
		
				});
		
		
		
			} else {
				resolve(RESPONSE);
			}
		
		});
		
		request.on('error', (err) => {
			reject(err);
		});
		
		request.end();
	
	});



};

module.exports = healthcheck;