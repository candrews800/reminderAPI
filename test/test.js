const assert = require('assert');
const request = require('request-promise');

describe('API', () => {
	describe('/', () => {
		it('should return Hello World!', async () => {
			const results = await request({
				uri: "http://localhost:3000"
			});
		
			assert.equal(results, "Hello World!");
		});
	});	
});
