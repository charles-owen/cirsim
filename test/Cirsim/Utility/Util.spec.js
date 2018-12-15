
import Util from '../../../src/Cirsim/Utility/Util.js';

describe('Util', function() {
    it('Hex conversions', function() {

        expect(Util.toHex(0xa823, 4)).toBe('a823');
        expect(Util.toHex(0xa823, 6)).toBe('00a823');
    });
});
