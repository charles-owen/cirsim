
import {Cirsim} from '../../src/Cirsim/Cirsim';
import {Model} from '../../src/Cirsim/Model';

describe('Model', function() {
   it('Construct', function() {
       var cirsim = new Cirsim('#cirsim');
       var main = cirsim.startNow();
       var model = new Model(main);

       expect(model.main).toBe(main);
   });
});