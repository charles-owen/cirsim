
import Component from '../../src/Cirsim/Component.js';

describe('Component', function() {
    it('Construct', function() {
        var c = new Component('U1');
        expect(c.naming).toBe('U1');
    });
});