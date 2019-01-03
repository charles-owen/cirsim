import Fixture from '../Support/Fixture.js'
import {InPin} from '../../../src/Cirsim/Component/InPin';

describe('InPin', function() {
    it('Construct', function() {
        var c = new InPin();
        c.naming = 'U1';
        expect(c.naming).toBe('U1');
    });
});
