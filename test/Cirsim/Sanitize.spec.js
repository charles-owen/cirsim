/**
 * Tests for the Sanitize object
 */

import Sanitize from '../../src/Cirsim/Utility/Sanitize.js';

describe('Sanitize', function() {

    it('should sanitize booleans', function() {
        expect(Sanitize.boolean(true)).toBe(true);
        expect(Sanitize.boolean(false)).toBe(false);
        expect(Sanitize.boolean('anything')).toBe(false);

    });
});

