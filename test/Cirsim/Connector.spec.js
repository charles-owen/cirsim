
import Connector from '../../src/Cirsim/Connector.js';

describe('Connector', function() {
    it('Construct', function() {
        var con = new Connector(null, 12, 72, 10, 'XX');

        expect(con.x).toBe(12);
    });
});