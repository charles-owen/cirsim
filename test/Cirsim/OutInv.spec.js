
import {OutInv} from '../../src/Cirsim/OutInv';

describe('OutInv', function() {
    it('Construct', function() {
        var con = new OutInv(null, 23, 18, 9, 'A');

        expect(con.x).toBe(23);
    });
});