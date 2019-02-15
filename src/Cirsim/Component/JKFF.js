
import {Component} from '../Component';

/**
 * Component: JK Flip-Flop
 * @constructor
 */
export const JKFF = function() {
    Component.call(this);

    this.height = 90;
    this.width = 64;
    var w2 = this.width / 2;
    var h2 = this.height / 2;

    this.lastClk = false;

    // Three inputs, two outputs
    this.addIn(-w2, -32, 16, "J");
    this.addIn(-w2, 32, 16, "K");
    this.addIn(-w2, 0, 16).clock = true;

    var s = this.addIn(0, -h2, 11, "S");
    s.orientation = 'n';
    var r = this.addIn(0, h2, 11, "R");
    r.orientation = 's';

    this.addOut(w2, -32, 16, "Q");
    this.addOutInv(w2, 32, 16, "Q", true);

    this.outs[0].set(undefined);
    this.outs[1].set(undefined);
};

JKFF.prototype = Object.create(Component.prototype);
JKFF.prototype.constructor = JKFF;

JKFF.type = "JKFF";            ///< Name to use in files
JKFF.label = "JK Flip-Flop";           ///< Label for the palette
JKFF.desc = "JK Flip-Flop";       ///< Description for the palette
JKFF.img = "jk.png";         ///< Image to use for the palette
JKFF.order = 208;               ///< Order of presentation in the palette
JKFF.description = '<h2>JK Flip-Flop</h2><p>JK Flip-Flop.</p>';

/**
 * Compute the gate result
 * @param state
 */
JKFF.prototype.compute = function(state) {
    var s = state[3];
    var r = state[4];

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
    } else if(state[2] && !this.lastClk) {
        var j = state[0];
        var k = state[1];

        if(j && k) {
            var v = !this.outs[0].get();
            q.set(v);
            qn.set(v);
        } else if(j) {
            v = true;
            q.set(v);
            qn.set(v);
        } else if(k) {
            v = false;
            q.set(v);
            qn.set(v);
        }
    }

    this.lastClk = state[2];
};

/**
 * Clone this component object.
 * @returns {JKFF}
 */
JKFF.prototype.clone = function() {
    var copy = new JKFF();
    copy.copyFrom(this);
    return copy;
};

