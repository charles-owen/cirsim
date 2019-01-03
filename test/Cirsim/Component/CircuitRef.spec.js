
import {CircuitRef} from '../../../src/Cirsim/Component/CircuitRef';

xdescribe('CircuitRef', function() {
    it('Construct', function() {
        var c = new CircuitRef();
        c.naming = 'U1';
        expect(c.naming).toBe('U1');
    });
});
