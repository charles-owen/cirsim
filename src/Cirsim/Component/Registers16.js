import {Component} from '../Component';
import {Connector} from '../Connector';
import {Util} from '../Utility/Util';

/**
 * Component: Simple 16-bit 8-register file.
 */
export const Registers16 = function() {
    Component.call(this);

    this.height = 176;
    this.width = 128;
    const w2 = this.width / 2;
    const h2 = this.height / 2;

    this.values = [0, 0, 0, 0, 0, 0, 0, 0];

    this.lastClk = false;
    this.lastA = null;
    this.lastB = null;
    this.lastALU = null;
    this.lastW = null;
    this.alu = 0;


    const clk = this.addIn(0, -h2, 8);
    clk.orientation = 'n';
    clk.clock = true;

    this.addIn(-w2, -48, 16, "ALU").bus = true;
    this.addIn(-w2, 16, 16, "Ae").bus = true;
    this.addIn(-w2, 48, 16, "Be").bus = true;
    this.addIn(-w2, -32, 16, "ALUe").bus = true;

    const reset = this.addIn(0, this.height / 2, 8, "R");
    reset.orientation = 's';

    this.addIn(-w2, -16, 16, 'W');

    this.addOut(w2, -48, 16, "A").bus = true;
    this.addOut(w2, 48, 16, "B").bus = true;

    this.outs[0].set(undefined);
    this.outs[1].set(undefined);
};

Registers16.prototype = Object.create(Component.prototype);
Registers16.prototype.constructor = Registers16;
Registers16.prototype.prefix = "R";

Registers16.type = "Registers16";            ///< Name to use in files
Registers16.label = "Registers";           ///< Label for the palette
Registers16.desc = "Register File";       ///< Description for the palette
Registers16.img = "registers16.png";         ///< Image to use for the palette
Registers16.description = `<h2>Registers</h2>
<p>Simple 16-bit register file. Ae and Be choose which register is routed to 
the A and B outputs. ALU is the input from the ALU. ALUe chooses which register to write. 
A register will only be written if W (write enable) is high.</p><p>R is a reset input and is optional. 
The R input (reset) sets all registers to zero.</p>
<p>The register file sets the 
register on the clock <em>leading edge.</em></p>`;
Registers16.order = 700;
Registers16.help = 'registers16';

/**
 * Compute the gate result
 * @param state
 */
Registers16.prototype.compute = function(state) {
    // What are the addresses?
    this.lastA = Connector.busValueToDecimal(state[2], 8);
    this.lastB = Connector.busValueToDecimal(state[3], 8);
    this.lastALU = Connector.busValueToDecimal(state[4], 8);

    this.lastW = state[6];  // W

    if(state[0] && !this.lastClk) {
        // Clock leading edge
        this.alu = Connector.busValueToDecimal(state[1]);

        if(this.lastALU !== null && this.lastW) {
            this.values[this.lastALU] = this.alu;
        }
    }

    // Reset?
    if(state[5]) {
        this.values = [0, 0, 0, 0, 0, 0, 0, 0];
    }

    if(this.lastA !== null) {
        let o = this.values[this.lastA];
        const data = [];
        for(let i=0; i<16; i++) {
            data.push((o & 1) == 1);
            o >>= 1;
        }

        this.outs[0].set(data);
    } else {
        this.outs[0].set(undefined);
    }


    if(this.lastB !== null) {
        let o = this.values[this.lastB];
        const data = [];
        for(let i=0; i<16; i++) {
            data.push((o & 1) == 1);
            o >>= 1;
        }

        this.outs[1].set(data);
    } else {
        this.outs[1].set(undefined);
    }

    this.lastClk = state[0];
}

/**
 * Clone this component object.
 * @returns {Registers16}
 */
Registers16.prototype.clone = function() {
    const copy = new Registers16();
    copy.copyFrom(this);
    copy.values = this.values.slice();
    return copy;
};

/**
 * Draw component object.
 * @param context Display context
 * @param view View object
 */
Registers16.prototype.draw = function(context, view) {
    this.selectStyle(context, view);

    this.drawBox(context);

    context.font = '10px "Lucida Console", Monaco, monospace';
    context.textAlign = "left";

    // Where does the text start?
    var textY = this.y - 54;
    var textX = this.x - 11;
    var textXr = textX + 45;

    var y = textY;
    for(var i=0; i<8; i++) {
        context.fillText("r" + i + ":" +
            Util.toHex(this.values[i], 4), this.x -10, y);
        y += 16;
    }

    // Offset to center in the next
    var textYc = textY - 4;
    if(this.lastALU !== null && this.lastW) {
        this.jaggedLine(context, this.x - this.width/2 + 34, this.y - 48,
            textX, textYc + this.lastALU * 16, 0.5);
    }

    if(this.lastA !== null) {
        this.jaggedLine(context, textXr, textYc + this.lastA * 16,
            this.x + this.width/2 - 14, this.y - 48, 0.66);
    }

    if(this.lastB !== null) {
        this.jaggedLine(context, textXr, textYc + this.lastB * 16,
            this.x + this.width/2 - 14, this.y + 48, 0.33);
    }

    context.font = "12px Times";
    context.textAlign = "center";
    this.drawIO(context, view);
};

/**
 * Support for string-based testing.
 *
 * Set the register as a string.
 * This is used for testing/validation of register contents
 * Examples:
 *     test:r0-23
 *     test:reset
 * @param value Test string like red=1 or yel=0
 * @param input In object test was sent to
 */
Registers16.prototype.testAsString = function(value, input) {
    if(value === null) {
        return;
    }

    if(value === 'reset') {
        this.values = [0, 0, 0, 0, 0, 0, 0, 0];
        this.pending();
    } else if(value.substr(0, 1) === 'r') {
        const reg = parseInt(value.substr(1, 1));
        if(reg < 0 || reg > 7) {
            throw "Invalid register indicated in test " + value;
        }
        const expected = parseInt(value.substr(3));
        if(expected !== +this.values[reg]) {
            throw "Incorrect register values. Register r" + reg + " expected=0x" +
            Util.toHex(expected, 4) + " actual=0x" +
            Util.toHex(this.values[reg], 4);
        }
    }
}

/**
 * Set the register as a string.
 * This is used for testing/validation of register contents. Works just
 * like testAsString and is mainly retained for backward compatibility.
 * @param value
 */
Registers16.prototype.setAsString = function(value) {
    this.testAsString(value);
}
