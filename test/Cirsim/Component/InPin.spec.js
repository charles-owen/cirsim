import Fixture from '../Support/Fixture.js'
import InPin from '../../../src/Cirsim/Component/InPin.js';

describe('InPin', function() {
    it('Construct', function() {
        var c = new InPin('U1');
        expect(c.naming).toBe('U1');
    });
});
