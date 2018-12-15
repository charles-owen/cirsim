import Fixture from '../Support/Fixture.js'
import Or from '../../../src/Cirsim/Component/Or.js';

describe('Or', function() {
    beforeEach(function() {
        jasmine.addMatchers(Fixture.matcher);
    });

    it('Fixture Test', function() {
        var component = new Or('U1');
        expect(component.naming).toBe('U1');

        var fixture = new Fixture(component);
        expect(fixture).toPassTest([
            [undefined, undefined, undefined],
            [true, undefined, true],
            [undefined, true, true],
            [false, false, false],
            [true, false, true],
            [false, true, true],
            [true, true, true]
        ]);

    });
});


