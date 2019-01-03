
import {Cirsim} from '../../src/Cirsim/Cirsim';
import {Circuit} from '../../src/Cirsim/Circuit';

describe('Circuit', function() {
   it('Construct', function() {
       var cirsim = new Cirsim('#cirsim');
       var circuit = new Circuit('circuit1');

       expect(circuit.name).toBe('circuit1');
   });
});