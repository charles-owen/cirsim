
import CircuitRef from '../../../src/Cirsim/Component/CircuitRef.js';

xdescribe('CircuitRef', function() {
    it('Construct', function() {
        var c = new CircuitRef('U1');
        expect(c.naming).toBe('U1');
    });
});
