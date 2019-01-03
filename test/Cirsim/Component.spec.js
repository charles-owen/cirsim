
import {Component} from '../../src/Cirsim/Component';

describe('Component', function() {
    it('Construct', function() {
        var c = new Component();
        c.naming = 'U1';
        expect(c.naming).toBe('U1');
    });
});