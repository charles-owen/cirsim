import Connection from '../../src/Cirsim/Connection.js';

describe('Connection', function() {
    it('Construct', function() {
        var con = new Connection(null, null);

        expect(con.from).toBe(null);
    });
});