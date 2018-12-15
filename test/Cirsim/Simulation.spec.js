
import Simulation from '../../src/Cirsim/Simulation.js';

describe('Simulation', function() {
    it('Construct', function() {
        var c = new Simulation();
        expect(c.time).toBe(1);
    });
});