import {Fixture} from '../Support/Fixture'
import {Or} from '../../../src/Cirsim/Component/Or';

describe('Or', function() {
    beforeEach(function() {
        jasmine.addMatchers(Fixture.matcher);
    });

    it('Fixture Test', function() {
        const component = new Or();
        component.naming = 'U1';
        expect(component.naming).toBe('U1');

	    const fixture = new Fixture(component);
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


