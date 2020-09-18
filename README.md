# Healtcheck

Monitor the health of your web applications, web servers, and other resources

## Why?

I use it like this in my Dockerfile

```Dockerfile
HEALTHCHECK --interval=30s CMD ./node_modules/.bin/healthcheck localhost/liveness:8080
```

Or, perhaps you need a readiness check.

```js
healthcheck localhost/readiness:8080 --type json --search ready=true;
```

## Install

```bash
npm install @jwerre/healthcheck
```

## Usage

```js
const healthcheck = require('healtcheck');

const res = async healthcheck({
	host: 'https://google.com',
	type: 'html',
	search: /^<\!doctype html*/
})
```

## Options

|  Option  | Type | Description |
|-- |-- |-- |
| host | String | Request url (required). |
| method | String | Request port (default: 'GET'). |
| timeout | Number | Request timeout in milliseconds (default: 800). |
| type | String | Type of healthcheck either status, header, html or json (default: status). |
| search | * | Search string, number, or regular expression to find in the body of the response. If type is html a string or Regular Expression is allowed. If type is JSON provide a key and value as an array e.g.: [key, value]. If type is status provide the status code. |


## CLI

```bash
$ healthcheck --help

Monitor the health of your web applications, web servers, and other resources

Usage: 
healthcheck https://www.example.com
healthcheck --type html --search "^<!doctype html.*" https://www.example.com
healthcheck --type header --search "content-type=text/html; charset=UTF-8" https://www.example.com
healthcheck --type json --search key=value http://echo.jsontest.com/key/value


Options:
-m, --method	Request port (default: 'GET')
-t, --timeout	Request timeout in milliseconds (default: 800)
-T, --type		Type of healthcheck either status, headers, html or json (default: status)
-s, --search	A search string to find in the body of the response.
				if type is html a string or Regular Expression is allowed. If type is json or header
				provide a key and value e.g.: key=value.
-h, --help		Show help.
-v, --verbose	Verbose output.


```