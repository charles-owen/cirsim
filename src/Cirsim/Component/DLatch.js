import {Component} from '../Component';
import {PaletteImage} from "../Graphics/PaletteImage";

/**
 * Component: D-Latch gate
 */
export const DLatch = function() {
    Component.call(this);

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
DLatch.label = "D  Latch";           ///< Label for the palette
DLatch.desc = "D Latch";       ///< Description for the palette
//DLatch.img = "d.png";         ///< Image to use for the palette
DLatch.order = 202;               ///< Order of presentation in the palette
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


/**
 * Create a PaletteImage object for a D-Latch
 */
DLatch.paletteImage = function() {
	const paletteImage = new PaletteImage(120, 120);

	const context = paletteImage.context;
	context.lineWidth = 1.5;

	paletteImage.box(40, 80);

	const ioY = 18;
	paletteImage.io(20, -ioY, 'e');
	paletteImage.io(20, ioY, 'e');
	paletteImage.io(-20, 0, 'w');
	paletteImage.io(0, -40, 'n');
	paletteImage.circle(23, ioY, 3);

	const font = '20px Times';
	paletteImage.drawText('Q', 10, -ioY + 5, font);
	paletteImage.drawTextBar('Q', 10, ioY + 5, font);
	paletteImage.drawText('D', -12, 5, font);
	paletteImage.drawText('CLK', 0, -29, '12px Times');

	return paletteImage;
}