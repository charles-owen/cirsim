import {Fixture} from '../Support/Fixture'
import {Inverter} from '../../../src/Cirsim/Component/Inverter';

describe('Or', function() {
    beforeEach(function() {
        jasmine.addMatchers(Fixture.matcher);
    });

    it('Fixture Test', function() {
        const component = new Inverter();
        component.naming = 'U1';
        expect(component.naming).toBe('U1');

        const fixture = new Fixture(component);
        expect(fixture).toPassTest([
            [undefined, undefined],
            [true, false],
            [false, true]
        ]);

    });
});


