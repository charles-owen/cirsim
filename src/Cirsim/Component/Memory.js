import {Component} from '../Component';
import {Connector} from '../Connector';
import {Util} from '../Utility/Util';
import {ComponentPropertiesDlg} from '../Dlg/ComponentPropertiesDlg';
import {Sanitize} from '../Utility/Sanitize';
import {PaletteImage} from "../Graphics/PaletteImage";

/**
 * Component: General purpose memory component.
 * Works as 8, 16, or 32 bits.
 * @property {int} size Size in bits
 * @constructor
 */
export const Memory = function() {
    Component.call(this);

    let size = 16;
    let badAddr = false;

    Object.defineProperties(this, {
        size: {
            get: function() {
                return size;
            },
            set: function(value) {
                switch(+value) {
                    case 8:
                        size=8;
                        break;

                    default:
                        size=16;
                        break;

                    case 32:
                        size = 32;
                        break;
                }
            }
        },
        badAddr: {
            writable: true
        },
        height: {
            value: 132
        },
        width: {
            value: 64
        }
    });

    const w2 = this.width / 2;
    const h2 = this.height / 2;

    this.lastClk = false;

    this.data = [];

    this.lastAddress = null;
    this.lastData = null;
    this.write = 0;

    this.addIn(-w2, -32, 16, "A").bus=true;
    this.addIn(-w2, 32, 16, "W").bus=true;
    const clk = this.addIn(0, -h2, 14);
    clk.orientation = 'n';
    clk.clock = true;
    this.addOut(w2, -32, 16, "R").bus=true;
};

Memory.prototype = Object.create(Component.prototype);
Memory.prototype.constructor = Memory;

Memory.prototype.prefix = "M";
Memory.type = "Memory";             ///< Name to use in files
Memory.label = "Memory";            ///< Label for the palette
Memory.desc = "Memory";             ///< Description for the palette
Memory.img = null;                  ///< Image to use for the palette
Memory.description = `<h2>Memory Bank</h2><p>The Memory component implements a simple Memory Bank.
Memory is an array of bytes. The A (address) input selects a memory location that is output on the R
output. The component can be configured for 8-, 16-, or 32-bit memory. 
</p>
<p>In the 16-bit configuration,
all accesses are considered to be multiples of two and retrieve two bytes. Addresses with the lower bit set
are considered erroneous. </p>
<p>In the 32-bit configuration,
all accesses are considered to be multiples of four and retrieve four bytes. Addresses with any of the lower 
two bits set are considered erroneous.</p>
<p>Memory is retrieved in little-endian mode (first byte is the least significant byte). 
Erroneous addresses are indicated by an X next to the A input on
 the component.</p>
<p>A clock cycle on the clock input writes the memory component with the value on the W (write) input.</p>`;
Memory.order = 705;
Memory.help = 'memory';

/**
 * Compute the gate result
 * @param state
 */
Memory.prototype.compute = function(state) {
    const bytes = this.size / 8;        // How many bytes we read/write

    // What is the address?
    const actualAddr = Connector.busValueToDecimal(state[0]);
    let addr = actualAddr;      // Subject to correction for byte offset
    this.badAddr = false;       // Until we know otherwise

    if(addr === null) {
        this.outs[0].set(undefined);
    } else {
        // Validate the address
        switch(bytes) {
            case 2:
                this.badAddr = (addr & 1) !== 0;
                addr &= 0xfffe;
                break;

            case 4:
                this.badAddr = (addr & 3) !== 0;
                addr &= 0xfffc;
                break;
        }

        if(state[2] && !this.lastClk) {
            // clock leading edge
            this.write = Connector.busValueToDecimal(state[1]);
            if(this.write !== null) {
                // Ensure the address exists...
                while(this.data.length < (addr+bytes)) {
                    this.data.push(0);
                }

                // Write the bytes
                let write = this.write;
                for(let i=0; i<bytes; i++) {
                    this.data[addr+i] = write;
                    write >>= 8;
                }
            }
        }

        let o = 0;
        if(addr <= (this.data.length - bytes)) {
            for(let i=0; i<bytes; i++) {
                o += this.data[addr + i] << (i * 8);
            }
        }

        this.lastAddress = actualAddr;
        this.lastData = o;
        const data = [];
        for(let i=0; i<this.size; i++) {
            data.push((o & 1) === 1);
            o >>= 1;
        }

        this.outs[0].set(data);
    }

    this.lastClk = state[2];
};

Memory.prototype.setAsString = function(value, set) {
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
 * @returns {Memory}
 */
Memory.prototype.clone = function() {
    var copy = new Memory();
    copy.data = this.data.slice();
    copy.size = this.size;
    copy.copyFrom(this);
    return copy;
};

/**
 * Load this object from an object converted from JSON
 * @param obj Object from JSON
 */
Memory.prototype.load = function(obj) {
    this.data = obj['data'];
    this.size = obj['size'];
    Component.prototype.load.call(this, obj);
};


/**
 * Create a save object suitable for conversion to JSON for export.
 * @returns {*} Object
 */
Memory.prototype.save = function() {
    const obj = Component.prototype.save.call(this);
    obj.data = this.data;
    obj.size = this.size;
    return obj;
};

/**
 * Draw component object.
 * @param context Display context
 * @param view View object
 */
Memory.prototype.draw = function(context, view) {
    const bytes = this.size / 8;

    this.selectStyle(context, view);
    this.drawBox(context);

    const addrStr = this.lastAddress !== null ?
        Util.toHex(this.lastAddress, 4) :
        '????';

    const dataStr = this.lastData !== null ?
        Util.toHex(this.lastData, bytes * 2) :
        '????????'.substr(0, bytes * 2);

    context.font = "12px Times";
    context.textAlign = "center";

    if(bytes < 4) {
        context.fillText(addrStr + ":" + dataStr, this.x, this.y + this.height/2 - 18);
    } else {
        context.fillText(addrStr + ":", this.x, this.y + this.height/2 - 18 - 13);
        context.fillText(dataStr, this.x, this.y + this.height/2 - 18);
    }

    context.fillText("memory", this.x, this.y + this.height/2 - 5);

    this.drawName(context, 0, 3);
    this.drawIO(context, view);

    if(this.badAddr) {
        const savedStyle = context.strokeStyle;
        context.strokeStyle = '#ff0000';
        const sz = 12;
        const x = this.x - 12;
        const y = this.y - 33;
        context.beginPath();
        context.moveTo(x - sz/2, y - sz/2);
        context.lineTo(x + sz/2, y+sz/2);
        context.moveTo(x + sz/2, y - sz/2);
        context.lineTo(x - sz/2, y+sz/2);
        context.stroke();
        context.strokeStyle = savedStyle;
    }
};

Memory.prototype.properties = function(main) {
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
	const sizeId = dlg.uniqueId();

	let html = `<div class="control">
<label for="${id}">Contents:
<textarea class="code1" type="text" rows="9" name="${id}" id="${id}" spellcheck="false">${data}</textarea>
</label>
</div>
<div class="control center">
<label>Size: 
<select name="${sizeId}" id="${sizeId}">
`;

	for(const size of [8, 16, 32]) {
	    const selected = this.size === size ? ' selected' : '';
	    html += `<option value="${size}"${selected}>${size}</option>`;
    }
	html += `</select>
</label>
</div>`;

    dlg.extra(html, () => {
        let value = document.getElementById(id).value;
        return this.setAsString(value, false);
    }, () => {
        this.size = document.getElementById(sizeId).value;
        let value = document.getElementById(id).value;
        return this.setAsString(value);
    }, 85);

    dlg.open();
};

/**
 * Create a PaletteImage object for memory component
 */
Memory.paletteImage = function() {
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