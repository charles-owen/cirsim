
import Rect from '../../../src/Cirsim/Utility/Rect.js';

describe('Rect', function() {
    it('Should construct', function() {
        var r = new Rect();

        expect(r.left).toBe(0);
        expect(r.right).toBe(0);
        expect(r.top).toBe(0);
        expect(r.bottom).toBe(0);
        expect(r.isEmpty()).toBeTruthy();

        r = new Rect(12, 18, 52, 100);
        expect(r.left).toBe(12);
        expect(r.right).toBe(52);
        expect(r.top).toBe(18);
        expect(r.bottom).toBe(100);
        expect(r.isEmpty()).not.toBeTruthy();
    });
});
