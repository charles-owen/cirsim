import Fixture from '../Support/Fixture.js'
import And from '../../../src/Cirsim/Component/And.js';

describe('And', function() {
    beforeEach(function() {
        jasmine.addMatchers(Fixture.matcher);
    });

    it('Fixture Test', function() {
        var component = new And('U2');
        expect(component.naming).toBe('U2');

        var fixture = new Fixture(component);
        expect(fixture).toPassTest([
            [undefined, undefined, undefined],
            [true, undefined, undefined],
            [undefined, true, undefined],
            [false, false, false],
            [true, false, false],
            [false, true, false],
            [true, true, true]
        ]);

    });
});


