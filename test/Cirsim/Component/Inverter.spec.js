import Fixture from '../Support/Fixture.js'
import Inverter from '../../../src/Cirsim/Component/Inverter.js';

describe('Or', function() {
    beforeEach(function() {
        jasmine.addMatchers(Fixture.matcher);
    });

    it('Fixture Test', function() {
        var component = new Inverter('U1');
        expect(component.naming).toBe('U1');

        var fixture = new Fixture(component);
        expect(fixture).toPassTest([
            [undefined, undefined],
            [true, false],
            [false, true]
        ]);

    });
});


