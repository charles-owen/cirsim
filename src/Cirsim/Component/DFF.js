/**
 * Component: D Flip-Flop
 */

import Component from '../Component.js';

var DFF = function(name) {
    Component.call(this, name);

    this.height = 90;
    this.width = 64;
    var w2 = this.width / 2;
    var h2 = this.height / 2;

    this.lastClk = false;

    // Two inputs, two outputs
    this.addIn(-w2, 0, 16, "D");
    var clk = this.addIn(0, -h2, 11);
    clk.orientation = 'n';
    clk.clock = true;
    this.addOut(w2, -32, 16, "Q");
    this.addOutInv(w2, 32, 16, "Q", true);

    this.outs[0].set(false);
    this.outs[1].set(false);
};

DFF.prototype = Object.create(Component.prototype);
DFF.prototype.constructor = DFF;

DFF.type = "DFF";            ///< Name to use in files
DFF.label = "D Flip-Flop";           ///< Label for the palette
DFF.desc = "D Flip-Flop";       ///< Description for the palette
DFF.img = "dff.png";         ///< Image to use for the palette
DFF.order = 20;               ///< Order of presentation in the palette
DFF.description = '<h2>D Flip-Flop</h2><p>D Flip-Flop.</p>';

/**
 * Compute the gate result
 * @param state
 */
DFF.prototype.compute = function(state) {
    if(state[1] && !this.lastClk) {
        var q = state[0];
        this.outs[0].set(q);
        this.outs[1].set(q);
    }

    this.lastClk = state[1];
};

/**
 * Clone this component object.
 * @returns {DFF}
 */
DFF.prototype.clone = function() {
    var copy = new DFF();
    copy.copyFrom(this);
    return copy;
};

export default DFF;

