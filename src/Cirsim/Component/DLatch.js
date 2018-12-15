/**
 * Component: D-Latch gate
 */
import Component from '../Component.js';

var DLatch = function(name) {
    Component.call(this, name);

    this.height = 90;
    this.width = 64;
    var w2 = this.width / 2;
    var h2 = this.height / 2;

    // Two inputs, two outputs
    this.addIn(-w2, 0, 16, "D");
    this.addIn(0, -h2, 11, "CLK").orientation = 'n';
    this.addOut(w2, -32, 16, "Q");
    this.addOutInv(w2, 32, 16, "Q", true);

    this.outs[0].set(false);
    this.outs[1].set(false);
};

DLatch.prototype = Object.create(Component.prototype);
DLatch.prototype.constructor = DLatch;

DLatch.type = "DLatch";            ///< Name to use in files
DLatch.label = "D Latch";           ///< Label for the palette
DLatch.desc = "D Latch";       ///< Description for the palette
DLatch.img = "d.png";         ///< Image to use for the palette
DLatch.order = 19;               ///< Order of presentation in the palette
DLatch.description = `<h2>D Latch</h2>
<p>A D latch passes the input D to the outputs Q and Q' when the clock input CLK is true, but
latches the value when CLK is false.</p>`;

/**
 * Compute the gate result
 * @param state
 */
DLatch.prototype.compute = function(state) {
    if(state[1]) {
        var q = state[0];
        this.outs[0].set(q);
        this.outs[1].set(q);
    }
};

/**
 * Clone this component object.
 * @returns {DLatch}
 */
DLatch.prototype.clone = function() {
    var copy = new DLatch();
    copy.copyFrom(this);
    return copy;
};


export default DLatch;

