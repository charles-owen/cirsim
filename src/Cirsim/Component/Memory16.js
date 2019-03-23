import {Component} from '../Component';
import {Connector} from '../Connector';
import {Util} from '../Utility/Util';
import {ComponentPropertiesDlg} from '../Dlg/ComponentPropertiesDlg';
import {Sanitize} from '../Utility/Sanitize';
import {PaletteImage} from "../Graphics/PaletteImage";

/**
 * Component: 16-bit memory

 * @constructor
 * @deprecated Use Memory instead
 */
export const Memory16 = function() {
    Component.call(this);

    this.height = 132;
    this.width = 64;
    const w2 = this.width / 2;
    const h2 = this.height / 2;

    this.lastClk = false;

    this.data = [];

    this.lastAddress = 0;
    this.lastData = 0;
    this.write = 0;

    this.addIn(-w2, -32, 16, "A").bus=true;
    this.addIn(-w2, 32, 16, "W").bus=true;
    const clk = this.addIn(0, -h2, 14);
    clk.orientation = 'n';
    clk.clock = true;
    this.addOut(w2, -32, 16, "R").bus=true;
};

Memory16.prototype = Object.create(Component.prototype);
Memory16.prototype.constructor = Memory16;

Memory16.prototype.prefix = "M";
Memory16.type = "Memory16";            ///< Name to use in files
Memory16.label = "Memory";           ///< Label for the palette
Memory16.desc = "16-bit Memory";       ///< Description for the palette
Memory16.img = null;         ///< Image to use for the palette
Memory16.description = `<h2>16-bit Memory Bank</h2><p>The Memory component implements a simple 16-bit Memory Bank.
Memory is an array of bytes. The A (address) input selects a memory location that is output on the R
output. The component implements 16-bit memory,
so all accesses are considered to be multiples of two and retrieve two bytes. Memory is retrieved in little-endian
mode (first byte is the least significant byte).</p>
<p>A clock cycle on the clock input writes the memory component with the value on the W (write) input.</p>`;
Memory16.order = 704;
Memory16.help = 'memory16';


/**
 * Compute the gate result
 * @param state
 */
Memory16.prototype.compute = function(state) {
    // What is the address?
    var a = Connector.busValueToDecimal(state[0]);
    if(a === null) {
        this.outs[0].set(undefined);
    } else {
        if(state[2] && !this.lastClk) {
            // Leading edge
            this.write = Connector.busValueToDecimal(state[1]);
            if(this.write !== null) {
                // Ensure the address exists...
                while(this.data.length < (a+2)) {
                    this.data.push(0);
                }

                var hi = this.write >> 8;
                var lo = this.write & 0xff;
                this.data[a] = lo;
                this.data[a+1] = hi;
            }
        }

        if(a < (this.data.length - 1)) {
            var o = this.data[a] + (this.data[a+1] << 8);
        } else {
            var o = 0;
        }

        this.lastAddress = a;
        this.lastData = o;
        var data = [];
        for(var i=0; i<16; i++) {
            data.push((o & 1) == 1);
            o >>= 1;
        }

        this.outs[0].set(data);
    }

    this.lastClk = state[2];
};

Memory16.prototype.setAsString = function(value, set) {
    value = Sanitize.sanitize(value);

    if(set === undefined) {
        set = true;
    }

    if(set) {
        this.data = [];
    }

    var values = value.split(/\s+/);

    var a = 0;
    for(var i in values) {
        var d = values[i];
        if(d.indexOf(":") >= 0) {
            a = parseInt(d, 16);
            if(isNaN(a)) {
                return "invalid input address";
            }

            continue;
        }

        if(d !== '') {
            var d = parseInt(d, 16);
            if(isNaN(d)) {
                return "invalid input data";
            }

            if(set) {
                while(this.data.length < a) {
                    this.data.push(0);
                }

                this.data[a] = d;
                a++;
            }
        }
    }

    if(set) {
        this.pending();
    }

    return null;
}

/**
 * Clone this component object.
 * @returns {Memory16}
 */
Memory16.prototype.clone = function() {
    var copy = new Memory16();
    copy.data = this.data.slice();
    copy.copyFrom(this);
    return copy;
};

/**
 * Load this object from an object converted from JSON
 * @param obj Object from JSON
 */
Memory16.prototype.load = function(obj) {
    this.data = obj['data'];
    Component.prototype.load.call(this, obj);
};


/**
 * Create a save object suitable for conversion to JSON for export.
 * @returns {*} Object
 */
Memory16.prototype.save = function() {
    var obj = Component.prototype.save.call(this);
    obj.data = this.data;
    return obj;
};

/**
 * Draw component object.
 * @param context Display context
 * @param view View object
 */
Memory16.prototype.draw = function(context, view) {
    this.selectStyle(context, view);
    this.drawBox(context);

    context.font = "12px Times";
    context.textAlign = "center";
    context.fillText(Util.toHex(this.lastAddress, 4) + ":" +
        Util.toHex(this.lastData, 4), this.x, this.y + this.height/2 - 18);
    context.fillText("memory", this.x, this.y + this.height/2 - 5);

    this.drawName(context, 0, 3);
    this.drawIO(context, view);
};

Memory16.prototype.properties = function(main) {
    //
    // Generate the hex representation of the memory
    //
    let data = '';
    for(let a=0; a<this.data.length; a++) {
        if((a % 8) === 0) {
            if(data.length > 0) {
                data += "\n";
            }

            data += Util.toHex(a, 4) + ":";
        }

        data += " " + Util.toHex(this.data[a], 2);
    }

    let dlg = new ComponentPropertiesDlg(this, main);
	let id = dlg.uniqueId();

	let html = `<div class="control"><label for="${id}">Contents:</label>
<textarea class="code1" type="text" rows="9" name="${id}" id="${id}" spellcheck="false">${data}</textarea>
</div>`;

    dlg.extra(html, () => {
        let value = document.getElementById(id).value;
        return this.setAsString(value, false);
    }, () => {
        let value = document.getElementById(id).value;
        return this.setAsString(value);
    }, 85);

    dlg.open();
};

/**
 * Create a PaletteImage object for memory component
 */
Memory16.paletteImage = function() {
	const paletteImage = new PaletteImage(120, 120);

	const context = paletteImage.context;
	context.lineWidth = 1.5;

	paletteImage.box(40, 80);

	const w = paletteImage.width;
	const h = paletteImage.height;

	const ioY = 18;
	paletteImage.io(0, -40, 'n');

	const lw = paletteImage.lineWidth(2);
	paletteImage.io(20, -ioY, 'e');
	paletteImage.io(-20, -ioY, 'w');
	paletteImage.io(-20, ioY, 'w');
	paletteImage.lineWidth(lw);

	const font = '20px Times';
	paletteImage.drawText('R', 10, -ioY + 5, font);
	paletteImage.drawText('A', -12, -ioY + 5, font);
	paletteImage.drawText('W', -12, ioY + 5, font);

	const sz = 7;
	context.beginPath();
	context.moveTo(-sz + w/2, -40 + h/2);
	context.lineTo(w/2, -40 + sz + h/2);
	context.lineTo(sz + w/2, -40 + h/2);
	context.stroke();

	paletteImage.drawText("memory", 0, 38, "8px Times");
	paletteImage.drawText("0000:0000", 0, 32, "8px Times");


	return paletteImage;
}