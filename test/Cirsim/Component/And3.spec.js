import Fixture from '../Support/Fixture.js'
import And3 from '../../../src/Cirsim/Component/And3.js';

describe('And3', function() {
    beforeEach(function() {
        jasmine.addMatchers(Fixture.matcher);
    });

    it('Fixture Test', function() {
        var component = new And3('U7');
        expect(component.naming).toBe('U7');

        var fixture = new Fixture(component);
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


