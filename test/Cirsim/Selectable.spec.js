import Selectable from '../../src/Cirsim/Selectable.js';

describe('Selectable', function() {
   it('Construct', function() {
      var s = new Selectable();
      expect(s.x).toBe(0);
      expect(s.y).toBe(0);

   });
});
