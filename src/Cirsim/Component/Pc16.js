
import {Util} from '../Utility/Util';
import {Component} from '../Component';
import {Connector} from '../Connector';

/**
 * Component: Simple 16-bit program counter
 */
export const Pc16 = function() {
    Component.call(this);

    this.height = 128;
    this.width = 64;
    const w2 = this.width / 2;
    const h2 = this.height / 2;

    this.value = 0;

    this.lastClk = false;
    this.ba = 0;

    const clk = this.addIn(0, -h2, 8);
    clk.orientation = 'n';
    clk.clock = true;

    this.addIn(-w2, -32, 16, "BA").bus = true;
    this.addIn(-w2, 32, 16, "B");
    const res = this.addIn(0, h2, 8, "R");
    res.orientation = 's';

    this.addOut(w2, -32, 16, "PC").bus = true;

    this.outs[0].set(undefined);
};

Pc16.prototype = Object.create(Component.prototype);
Pc16.prototype.constructor = Pc16;
Pc16.prototype.prefix = "PC";

Pc16.type = "Pc16";            ///< Name to use in files
Pc16.label = "Program Counter";           ///< Label for the palette
Pc16.desc = "Program Counter";       ///< Description for the palette
Pc16.img = "pc16.png";         ///< Image to use for the palette
Pc16.description = `<h2>Program Counter</h2><p>Simple 16-bit program counter (PC). If B is true when 
the clock edge rises, the signed value in BA (branch address) plus 2 is added to the PC.</p>`;
Pc16.order = 702;
Pc16.help = 'pc16';

/**
 * Compute the gate result
 * @param state
 */
Pc16.prototype.compute = function(state) {
    if(state[3]) {
        // Reset!
        this.value = 0;
    } else {
        if(state[0] && !this.lastClk) {
            // Leading edge
            // Store the branch offset
            this.ba = Connector.busValueToDecimal(state[1]);
            this.value += 2;

            // Clock in BA if the B input is set
            if(state[2]) {
                if(this.ba !== null) {
                    // Branching!
                    this.value += this.ba + 2;
                }
            }
        }
    }

    this.value &= 0xffff;

    let o = this.value;
    let data = [];
    for(let i=0; i<16; i++) {
        data.push((o & 1) == 1);
        o >>= 1;
    }

    this.outs[0].set(data);

    this.lastClk = state[0];
};

/**
 * Clone this component object.
 * @returns {Pc16}
 */
Pc16.prototype.clone = function() {
    var copy = new Pc16();
    copy.copyFrom(this);
    return copy;
};

/**
 * Draw component object.
 * @param context Display context
 * @param view View object
 */
Pc16.prototype.draw = function(context, view) {
    this.selectStyle(context, view);

    this.drawBox(context);

    var y = this.y - 10;


    context.font = '14px "Lucida Console", Monaco, monospace';
    context.textAlign = "center";

    // Where does the text start?
    context.fillText(Util.toHex(this.value, 4), this.x, y);
    y += 20;

    context.font = "12px Times";

    context.fillText("program", this.x, y);
    context.fillText("counter", this.x, y + 15);
    //this.drawName(context, 0, -this.height/2 + 20);
    this.drawIO(context, view);
};
