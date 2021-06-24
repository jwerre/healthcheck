const assert = require('assert');
const healthcheck = require('../lib/healthcheck');

describe('Healthcheck', function () {
	
	// because example.com can be slow sometimes
	this.timeout(8000);

	it('should do a status check', async function () {

		let res;
		try {
			res = await healthcheck({
				url: 'http://example.com',
			});
	
		} catch (err) {
			assert.fail(err);
		}
	
		assert.ok(res);
	
	});

	it('should do a status check with search', async function () {

		let res;
		try {
			res = await healthcheck({
				url: 'http://example.com',
				search: 200,
			});
	
		} catch (err) {
			assert.fail(err);
		}
	
		assert.ok(res);
	
	});

	it('should do a status check and error because search was not satisfied', async function () {

		let error;
		try {
			await healthcheck({
				url: 'http://example.com',
				search: 300,
			});
	
		} catch (err) {
			error = err;
		}

		assert.ok(error);
		assert.ok(error instanceof Error);
	
	});

	it('should do a header check', async function () {

		let res;
		try {
			res = await healthcheck({
				url: 'http://example.com',
				type: 'header',
			});
	
		} catch (err) {
			assert.fail(err);
		}
	
		assert.ok(res);
	
	});

	it('should do a header check with search', async function () {

		let res;
		try {
			res = await healthcheck({
				url: 'http://example.com',
				type: 'header',
				search: ['content-type', 'text/html; charset=UTF-8'],
			});

		} catch (err) {
			assert.fail(err);
		}

		assert.ok(res);
	
	});

	it('should do a header check and error because search was not satisfied', async function () {

		let error;
		try {
			await healthcheck({
				url: 'http://example.com',
				type: 'header',
				search: ['yep', 'nope'],
				// verbose: true,
			});
	
		} catch (err) {
			error = err;
		}

		assert.ok(error);
		assert.ok(error instanceof Error);
	
	});


	it('should do a json check', async function () {

		let res;
		try {
			res = await healthcheck({
				url: 'http://echo.jsontest.com/apple/red',
				type: 'json',
			});
	
		} catch (err) {
			assert.fail(err);
		}
	
		assert.ok(res);
	
	});

	it('should do a json check with search', async function () {

		let res;
		try {
			res = await healthcheck({
				url: 'http://echo.jsontest.com/apple/red',
				type: 'json',
				search: ['apple', 'red'],
			});

		} catch (err) {
			assert.fail(err);
		}
	
		assert.ok(res);
	
	});

	it.skip('should do a json check with a deep search [no great way to test this]', async function () {

		let res;
		try {
			res = await healthcheck({
				url: 'some nested api',
				type: 'json',
				search: ['data.success', true],
			});

		} catch (err) {
			assert.fail(err);
		}
	
		assert.ok(res);
	
	});

	it('should do a json check and error because search was not satisfied', async function () {

		let error;
		try {
			await healthcheck({
				url: 'http://echo.jsontest.com/apple/red',
				type: 'json',
				search: ['nope', 0],
			});
	
		} catch (err) {
			error = err;
		}

		assert.ok(error);
		assert.ok(error instanceof Error);
	
	});

	it('should do an html check', async function () {

		let res;
		try {
			res = await healthcheck({
				url: 'https://example.com',
				type: 'html',
				verbose: false,
			});
	
		} catch (err) {
			assert.fail(err);
		}
	
		assert.ok(res);
	
	});

	it('should do an html check with search', async function () {

		let res;
		try {
			res = await healthcheck({
				url: 'https://example.com',
				type: 'html',
				search: 'Example Domain',
			});

		} catch (err) {
			assert.fail(err);
		}
	
		assert.ok(res);
	
	});

	it('should do an html check with regex search', async function () {

		let res;
		try {
			res = await healthcheck({
				url: 'https://example.com',
				type: 'html',
				search: /^!DOCTYPE\sHTML/i,
			});

		} catch (err) {
			assert.fail(err);
		}
	
		assert.ok(res);
	
	});

	it('should do an html check and error because search was not satisfied', async function () {

		let error;
		try {
			await healthcheck({
				url: 'https://example.com',
				type: 'html',
				search: 'eXample doMain',
			});
	
		} catch (err) {
			error = err;
		}

		assert.ok(error);
		assert.ok(error instanceof Error);
	
	});

	
});