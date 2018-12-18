
import {Or} from './Or';

/**
 * Component: NOR gate
 */
export const Nor = function(name) {
    Or.call(this, name);

    // Replace the regular output with an inverse output
    this.outs = [];
    this.addOutInv(32, 0, 16);
};

Nor.prototype = Object.create(Or.prototype);
Nor.prototype.constructor = Nor;

Nor.type = "Nor";            ///< Name to use in files
Nor.label = "NOR";           ///< Label for the palette
Nor.desc = "NOR gate";       ///< Description for the palette
Nor.img = "nor.png";         ///< Image to use for the palette
Nor.order = 16;               ///< Order of presentation in the palette
Nor.description = `<h2>NOR Gate</h2><p>The output of a NOR gate is <em>false</em> if either or both 
 inputs are true. Otherwise, it is true.</p>`;
Nor.help = 'nor';

/**
 * Clone this component object.
 * @returns {Nor}
 */
Nor.prototype.clone = function() {
    var copy = new Nor();
    copy.copyFrom(this);
    return copy;
};
