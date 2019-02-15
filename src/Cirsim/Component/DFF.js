import {Component} from '../Component';
import {PaletteImage} from "../Graphics/PaletteImage";


/**
 * Component: D Flip-Flop

 * @constructor
 */
export const DFF = function() {
    Component.call(this);

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
DFF.order = 204;               ///< Order of presentation in the palette
DFF.description = '<h2>D Flip-Flop</h2><p>D Flip-Flop.</p>';

/**
 * Compute the gate result
 * @param state
 */
DFF.prototype.compute = function(state) {
    if(state[1] && !this.lastClk) {
        const q = state[0];
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


/**
 * Create a PaletteImage object for a D-Flip Flop
 */
DFF.paletteImage = function() {
	const paletteImage = new PaletteImage(120, 120);

	const context = paletteImage.context;
	context.lineWidth = 1.5;

	paletteImage.box(40, 80);

	const w = paletteImage.width;
	const h = paletteImage.height;

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

	const sz = 7;
	context.beginPath();
	context.moveTo(-sz + w/2, -40 + h/2);
	context.lineTo(w/2, -40 + sz + h/2);
	context.lineTo(sz + w/2, -40 + h/2);
	context.stroke();

	return paletteImage;
}