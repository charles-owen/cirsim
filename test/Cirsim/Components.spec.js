/**
 * Components collection
 */

import Components from '../../src/Cirsim/Components.js';
import Or from '../../src/Cirsim/Component/Or.js';

describe('Components', function() {
    it('Construct', function() {
        var con = new Components();

        expect(con.get('Or')).toBe(null);

        con.add(Or);

        expect(con.get('Or')).toBe(Or);
        expect(con.get('And')).toBe(null);

    });
});

