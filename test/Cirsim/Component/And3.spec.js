import {Fixture} from '../Support/Fixture'
import {And3} from '../../../src/Cirsim/Component/And3';

describe('And3', function() {
    beforeEach(function() {
        jasmine.addMatchers(Fixture.matcher);
    });

    it('Fixture Test', function() {
        const component = new And3();
        component.naming = 'U7';
        expect(component.naming).toBe('U7');

        const fixture = new Fixture(component);
        expect(fixture).toPassTest([
            [undefined, undefined, undefined, undefined],
            [true, undefined, undefined, undefined],
            [undefined, true, undefined, undefined],
            [false, false, false, false],
            [false, false, true, false],
            [false, true, false, false],
            [false, true, true, false],
            [true,  false, false, false],
            [true,  false, true, false],
            [true,  true, false, false],
            [true,  true, true, true]
        ]);

    });
});


