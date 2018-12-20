import {Component} from '../Component';

/**
 * Component: D Flip-Flop with Set and Reset
 * @param name Component name
 * @constructor
 */
export const DFFsr = function(name) {
    Component.call(this, name);

    this.height = 90;
    this.width = 64;
    var w2 = this.width / 2;
    var h2 = this.height / 2;

    this.lastClk = false;

    // Four inputs, two outputs
    this.addIn(-w2, -32, 16, "D");
    this.addIn(-w2, 32, 16).clock = true;

    var s = this.addIn(0, -h2, 11, "S");
    s.orientation = 'n';
    var r = this.addIn(0, h2, 11, "R");
    r.orientation = 's';

    this.addOut(w2, -32, 16, "Q");
    this.addOutInv(w2, 32, 16, "Q", true);

    this.outs[0].set(undefined);
    this.outs[1].set(undefined);
};

DFFsr.prototype = Object.create(Component.prototype);
DFFsr.prototype.constructor = DFFsr;

DFFsr.type = "DFFsr";            ///< Name to use in files
DFFsr.label = "D Flip-Flop SR";           ///< Label for the palette
DFFsr.desc = "D Flip-Flop with Set/Reset";       ///< Description for the palette
DFFsr.img = "dffsr.png";         ///< Image to use for the palette
DFFsr.order = 20.5;               ///< Order of presentation in the palette
DFFsr.description = '<h2>D Flip-Flop with Set/Reset</h2><p>D Flip-Flop with Set and Reset.' +
    ' Set and Reset can be safely left unconnected.</p>';

/**
 * Compute the gate result
 * @param state
 */
DFFsr.prototype.compute = function(state) {
    // Inputs:
    // 0: D
    // 1: CLK
    // 2: Set
    // 3: Reset
    var d = state[0];
    var c = state[1];
    var s = state[2];
    var r = state[3];

    var q = this.outs[0];
    var qn = this.outs[1];

    if(s === true && r === true) {
        q.set(undefined);
        qn.set(undefined);
    } else if(s === true) {
        q.set(true);
        qn.set(true);
    } else if(r === true) {
        q.set(false);
        qn.set(false);
    } else if(c && !this.lastClk) {
        q.set(d);
        qn.set(d);
    }

    this.lastClk = c;
};

/**
 * Clone this component object.
 * @returns {DFFsr}
 * @memberof DFFsr
 */
DFFsr.prototype.clone = function() {
    var copy = new DFFsr();
    copy.copyFrom(this);
    return copy;
};
