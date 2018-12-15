
import Cirsim from '../../src/Cirsim/Cirsim.js';
import Circuit from '../../src/Cirsim/Circuit.js';

describe('Circuit', function() {
   it('Construct', function() {
       var cirsim = new Cirsim('#cirsim');
       var circuit = new Circuit('circuit1');

       expect(circuit.name).toBe('circuit1');
   });
});