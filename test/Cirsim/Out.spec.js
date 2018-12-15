
import Out from '../../src/Cirsim/Out.js';

describe('Out', function() {
    it('Construct', function() {
        var con = new Out(null, 23, 18, 9, 'A');

        expect(con.x).toBe(23);
    });
});