
import In from '../../src/Cirsim/In.js';

describe('In', function() {
    it('Construct', function() {
        var con = new In(null, 23, 18, 9, 'A');

        expect(con.x).toBe(23);
    });
});