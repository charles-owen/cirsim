import {Component} from '../Component';
import {PaletteImage} from "../Graphics/PaletteImage";

/**
 * Component: SR-Latch gate
 */
export const SRLatch = function(name) {
    Component.call(this, name);

    this.height = 90;
    this.width = 64;
    var w2 = this.width / 2;

    // Two inputs, two outputs
    this.addIn(-w2, -32, 16, "R");  // R
    this.addIn(-w2, 32, 16, "S");   // S
    this.addOut(w2, -32, 16, "Q");          // Q
    this.addOutInv(w2, 32, 16, "Q", true);  // Q!

    this.outs[0].set(false);
    this.outs[1].set(false);
};

SRLatch.prototype = Object.create(Component.prototype);
SRLatch.prototype.constructor = SRLatch;

SRLatch.type = "SRLatch";            ///< Name to use in files
SRLatch.label = "SR Latch";           ///< Label for the palette
SRLatch.desc = "SR Latch";       ///< Description for the palette
//SRLatch.img = "sr.png";         ///< Image to use for the palette
SRLatch.order = 18;               ///< Order of presentation in the palette
SRLatch.description = '<h2>SR Latch</h2><p>Set/Reset latch. The S input sets the output. The R input resets the output.</p>';

/**
 * Compute the gate result
 * @param state
 */
SRLatch.prototype.compute = function(state) {
    var q = this.outs[0].get();
    var qn = !this.outs[1].get();

    var r = state[0];
    var s = state[1];
    if(r && s) {
        this.outs[0].set(true);
        this.outs[1].set(false);
    } else if(r) {
        this.outs[0].set(false);
        this.outs[1].set(false);
    } else if(s) {
        this.outs[0].set(true);
        this.outs[1].set(true);
    }
};

/**
 * Clone this component object.
 * @returns {SRLatch}
 */
SRLatch.prototype.clone = function() {
    const copy = new SRLatch();
    copy.copyFrom(this);
    return copy;
};


/**
 * Create a PaletteImage object for an SR Latch
 */
SRLatch.paletteImage = function() {
	const paletteImage = new PaletteImage(120, 100);

	const context = paletteImage.context;
	context.lineWidth = 1.5;

	paletteImage.box(40, 70);

	const ioY = 20;
	paletteImage.io(20, -ioY, 'e');
	paletteImage.io(20, ioY, 'e');
	paletteImage.io(-20, -ioY, 'w');
	paletteImage.io(-20, ioY, 'w');
	paletteImage.circle(23, ioY, 3);

	const font = '20px Times';
	paletteImage.drawText('Q', 10, -ioY + 5, font);
	paletteImage.drawTextBar('Q', 10, ioY + 5, font);
	paletteImage.drawText('R', -12, -ioY + 5, font);
	paletteImage.drawText('S', -12, ioY + 5, font);

	return paletteImage;
}