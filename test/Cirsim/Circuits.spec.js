import Cirsim from '../../src/Cirsim/Cirsim.js';
import Model from '../../src/Cirsim/Model.js';
import Circuits from '../../src/Cirsim/Circuits.js';

describe('Circuit', function() {
   it('Construct', function() {
       var cirsim = new Cirsim('#cirsim');
       var model = new Model(cirsim);
       var circuits = new Circuits(model);

       expect(circuits.model).toBe(model);
   });
});