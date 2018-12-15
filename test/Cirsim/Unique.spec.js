import Unique from '../../src/Cirsim/Utility/Unique.js';

describe('Unique', function() {
    it('Unique', function() {

        var a = Unique.uniqueId();
        var b = Unique.uniqueId();

        expect(a).not.toBe(b);

    });
});
