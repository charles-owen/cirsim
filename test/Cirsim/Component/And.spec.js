import Fixture from '../Support/Fixture'
import {And} from '../../../src/Cirsim/Component/And';

describe('And', function() {
    beforeEach(function() {
        jasmine.addMatchers(Fixture.matcher);
    });

    it('Fixture Test', function() {
        const component = new And();
        component.naming = 'U2';
        expect(component.naming).toBe('U2');

        const fixture = new Fixture(component);
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


