/**
 * Component: NAND gate
 */
import And from './And.js';

var Nand = function(name) {
    And.call(this, name);

    // Replace the regular output with an inverse output
    this.outs = [];
    this.addOutInv(32, 0, 16);
};

Nand.prototype = Object.create(And.prototype);
Nand.prototype.constructor = Nand;

Nand.type = "Nand";            ///< Name to use in files
Nand.label = "NAND";           ///< Label for the palette
Nand.desc = "NAND gate";       ///< Description for the palette
// Nand.img = "nand.png";         ///< Image to use for the palette
Nand.order = 12;               ///< Order of presentation in the palette
Nand.description = '<h2>NAND Gate</h2><p>The output of a NAND ' +
    'gate is <em>false</em> if and only if both' +
    ' inputs are true.</p>';
Nand.help = 'nand';

/**
 * Clone this component object.
 * @returns {And}
 */
Nand.prototype.clone = function() {
    var copy = new Nand();
    copy.copyFrom(this);
    return copy;
};

/**
 * Create a PaletteImage object for an And gate
 */
Nand.paletteImage = function() {

    var paletteImage = And.paletteImageBase();
    paletteImage.io(And.leftX, -16, 'w');
    paletteImage.io(And.leftX, +16, 'w');
    paletteImage.io(And.rightX+10, 0, 'e');
    paletteImage.circle(And.rightX+5, 0, 5);

    return paletteImage;
}

export default Nand;
