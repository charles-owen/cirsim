import {Component} from '../Component';
import {Util} from "../Utility/Util";
import {ComponentPropertiesDlg} from "../Dlg/ComponentPropertiesDlg";
import {Memory} from "./Memory";
import {InvalidArgumentException} from "../InvalidArgumentException";


/**
 * Component: General purpose ALU component.
 * Works for 4/8/16/32 bits.
 * @constructor
 */
export const Alu = function(name) {
    Component.call(this, name);

    // How much we shrink the right side relative to the left side.
    const shrink = 15;

    // Properties
    let size = 16;              // Size in bits
    let output = undefined;     // The secondary output format

    const initialize = () => {
        Object.defineProperties(this, {
            // Size in bits
            size: {
                get: function() {
                    return size;
                },
                set: function(value) {
                    if(![4, 8, 16, 32].includes(+value)) {
                        throw new InvalidArgumentException("Illegal size value " + value);
                    }

                    size = +value;
                }
            },
            height: {
                value: 16 * 8
            },
            width: {
                value: 64
            },
            output: {
                get: function() {
                    return output;
                },
                set: function(value) {
                    if(!Alu.OUTPUT.POSSIBLE.includes(+value)) {
                        throw new InvalidArgumentException("Illegal output value " + value);
                    }

                    if(output !== +value) {
                        // Output has changed, set the component secondary output
                        output = +value;
                        const out = this.outs[1];
                        out.clear();
                        out.bus = output === Alu.OUTPUT.CPSR;
                        out.name = Alu.OUTPUT.LABELS[output];
                    }
                }
            },
            control: {
                value: Alu.CONTROL.THUMB,
                writable: true
            }
        });

        this.cin = false;   // Carry in

        const left = -this.width / 2;
        const right = this.width / 2;

        this.operator = '';

        // Inputs and one output
        const inOffset = 32;
        this.addIn(left, -inOffset, 16, "A").bus = true;
        this.addIn(left, inOffset, 16, "B").bus = true;

        let dy = 0.5 * shrink;
        const c = this.addIn(0, this.height/2 - dy, 8 + dy, "C");
        c.orientation = 's';
        c.bus = true;

        this.addIn(left, inOffset+ 16, 16, "Cin");

        this.addOut(right, 0, 16, "O").bus = true;
        this.addOut(right, 24, 16, "CPSR").bus = true;

        this.output = Alu.OUTPUT.CPSR;
    }




    /**
     * Draw component object.
     * @param context Display context
     * @param view View object
     */
    this.draw = function(context, view) {
        this.selectStyle(context, view);

        var leftX = this.x - this.width/2 - 0.5;
        var rightX = this.x + this.width/2 + 0.5;
        var topY = this.y - this.height/2 - 0.5;
        var botY = this.y + this.height/2 + 0.5;


        // Left side
        context.beginPath();
        context.moveTo(leftX, topY);
        context.lineTo(leftX, this.y - shrink / 2);
        context.lineTo(leftX + 20, this.y);
        context.lineTo(leftX, this.y + shrink / 2);
        context.lineTo(leftX, botY);

        // Bottom
        context.lineTo(rightX, botY - shrink);

        // Right side
        context.lineTo(rightX, topY + shrink);

        // Top
        context.lineTo(leftX, topY);

        // Name
        if(this.naming !== null) {
            context.font = "14px Times";
            context.textAlign = "center";
            context.fillText(this.naming, this.x, this.y-16);
        }

        if(this.operator.length > 1) {
            context.font = "bold 14px Times";
            context.textAlign = "center";
            context.fillText(this.operator, this.x + 1, this.y + 4);
        } else {
            context.font = "bold 22px Times";
            context.textAlign = "center";
            var y = 6;
            var x = 1;
            switch(this.operator) {
                case '+':
                    y = 6;
                    break;

                case '-':
                    y = 5;
                    break;

                default:

                    break;
            }

            context.fillText(this.operator, this.x + x, this.y + y);
        }


        context.stroke();

        this.drawIO(context, view);
    };

    /**
     * Clone this component object.
     * @returns {Alu}
     */
    this.clone = function() {
        const copy = new Alu();
        copy.copyFrom(this);
        copy.size = this.size;
        copy.output = this.output;
        copy.control = this.control;
        return copy;
    };

    /**
     * Load this object from an object converted from JSON
     * @param obj Object from JSON
     */
    this.load = function(obj) {
        this.size = obj['size'];
        this.output = obj['output'];
        this.control = obj['control'];
        Component.prototype.load.call(this, obj);
    };


    /**
     * Create a save object suitable for conversion to JSON for export.
     * @returns {*} Object
     */
    this.save = function() {
        const obj = Component.prototype.save.call(this);
        obj['size'] = this.size;
        obj['output'] = this.output;
        obj['control'] = this.control;
        return obj;
    };

    /**
     * Map control values to the extended thumb control values.
     * @param {int} cv
     * @returns {*}
     */
    this.controlMapping = function(cv) {
        switch(this.control) {
            case Alu.CONTROL.ASAO:
                cv &= 3;

                switch(cv) {
                    case 0:
                        cv = 11;    // add
                        break;

                    case 1:
                        cv = 17;    // subtract
                        break;

                    case 2:
                        cv = 0;     // and
                        break;

                    case 3:
                        cv = 12;    // or
                        break;
                }
                break;
        }

        return cv;
    }

    initialize();
};

Alu.prototype = Object.create(Component.prototype);
Alu.prototype.constructor = Alu;

Alu.prototype.prefix = "ALU";
Alu.prototype.nameRequired = true;

Alu.type = "Alu";            ///< Name to use in files
Alu.label = "ALU";           ///< Label for the palette
Alu.desc = "Arithmetic Logic Unit";       ///< Description for the palette
Alu.img = "alu.png";         ///< Image to use for the palette
Alu.description = `<h2>Arithmetic Logic Unit</h2><p>A and B are bus inputs 
to the ALU. C is the control input. Cin is the carry input for adc and sbc 
operations. O is a bus output result.</p>
<p>If Cin is not connected, it is assumed to be false.</p>
<p>The status bits in CPSR are: 0:N, 1:Z, 2:C, 3:V</p>`;
Alu.help = 'alu';
Alu.order = 707;

// Definition of the possible ALU outputs
Alu.OUTPUT = {
    CPSR: 0,    ///< CPSR register.
    N: 1,       ///< Negative flag
    Z: 2,       ///< Zero flag
    C: 3,       ///< Carry
    V: 4,       ///< Overflow,
    POSSIBLE: [0, 1, 2, 3, 4],
    NAMES: ['CPSR', 'N - Negative', 'Z - Zero', 'C - Carry', 'V - Overflow'],
    LABELS: ['CPSR', 'N', 'Z', 'Cout', 'V']
};

Alu.CONTROL = {
    THUMB: 0,   ///< Thumb format (4 or 6 bits)
    ASAO: 1,    ///< Add/subtract/and/or only (2 bits),
    POSSIBLE: [0, 1],
    NAMES: ['Thumb (4 or 6 bits)', 'Add/subtract/and/or']
};

/**
 * Compute the gate result
 * @param state
 */
Alu.prototype.compute = function(state) {
    const a = state[0];
    const b = state[1];
    const c = state[2];

    const size = this.size;

    // Number of bytes in the result
    const bytes = size / 8;

    // A byte mask for results
    let mask = 0;
    for(let i=0; i<bytes; i++) {
        mask <<= 8;
        mask |= 0xff;
    }

    // Negative bit set value
    // This would be 0x8000 for 16 bits
    const nBit = 1 << (size-1);
    // Maximum value
    // This would be 32767 for 16 bits
    const max = nBit - 1;
    // Minimum value
    // This would be -32767 for 16 bits
    const min = -max - 1;

    // Determine the carry input
    this.cin = state[3] !== undefined && state[3];

    function parse(c) {
        if(c === undefined) {
            return undefined;
        }

        if(!Array.isArray(c)) {
            return undefined;
        }

        let p = 1;      // Power
        let sum = 0;    // Computed total
        for(let v of c) {
            if(v === undefined) {
                return undefined;
            }

            if(v) {
                if(p === nBit) {
                    sum -= p;
                } else {
                    sum += p;
                }

            }

            p *= 2;
        }

        return sum;
    }

    const av = parse(a);
    const bv = parse(b);
    const cv = this.controlMapping(parse(c));
    // console.log("av=" + av + " bc=" + bv + " cv=" + cv);

    let ov = bv;
    let carry = false;
    let overflow = false;
    let ov1, sign;

    switch(cv) {
        case 8:     // TST (works like AND)
        case 0:     // and
            ov = av & bv;
            this.operator = '&';
            break;

        case 1:     // xor
            ov = av ^ bv;
            this.operator = 'xor';
            break;

        case 2:     // left shift logical
            ov = av << bv;
            this.operator = '<<';
            break;

        case 3:     // Right shift logical
            ov = (av & mask) >> bv;
            this.operator = '>>';
            break;

        case 4:     // Arithmetic shift right
            sign = av & (1 << size - 1);
            ov = av;
            for(let i=0; i<bv; i++) {
                ov = av >> 1;
                ov |= sign;
            }
            this.operator = 'asr';
            break;

        case 5:     // add w/carry
            ov = av + bv;
            if(this.cin) {
                ov++;
            }

            ov1 = (av & mask) + (bv & mask);
            carry = (ov1 & (1 << size)) !== 0;
            overflow = (ov < min || ov > max);
            this.operator = '+';
            break;

        case 11:    // cmn, works like add
        case 34:    // Format 3 add
        case 16:    // Format 2 add
            ov = av + bv;
            ov1 = (av & mask) + (bv & mask);
            carry = (ov1 & (1 << size)) !== 0;
            overflow = (ov < min || ov > max);
            this.operator = '+';
            break;

        case 6:     // subtract w/carry
            ov = av - bv;
            if(!this.cin) {
                ov--;
            }

            ov1 = (av & mask) + ((~bv) & mask) + 1;
            carry = (ov1 & (1 << size)) !== 0;
            overflow = (ov < min || ov > max);
            this.operator = '-';
            break;

        case 10:    // cmp (works like sub)
        case 33:    // Format 3 cmp
        case 35:    // Format 3 sub
        case 17:    // Format 2 sub
            ov = av - bv;
            ov1 = (av & mask) + ((~bv) & mask) + 1;
            carry = (ov1 & (1 << size)) !== 0;
            overflow = (ov < min || ov > max);
            this.operator = '-';
            break;

        case 7:     // Rotate right
            sign = av & nBit;
            ov = av & mask;
            for(let i=0; i<bv; i++) {
                const low = (ov & 1) << (size - 1);
                ov = (av & mask) >> 1;
                ov |= low;
            }
            this.operator = 'ror';
            break;

        case 9:     // Negate
            ov = -bv;
            this.operator = 'neg';
            break;

        case 12:     // or
            ov = av | bv;
            this.operator = 'or';
            break;

        case 13:    // mul
            ov = av * bv;
            overflow = (ov < min || ov > max);
            this.operator = '*';
            break;

        case 14:    // bic
            ov = av & (bv ^ mask);
            this.operator = 'bic';
            break;

        case 15:    // not
            ov = av ^ mask;
            this.operator = 'not';
            break;

        case 18:    // mul high
            ov = ((av & mask) * (bv & mask)) >> size;
            this.operator = '*^';
            break;

        default:    // mov
            ov = bv;
            this.operator = 'mov';
            break;
    }

    ov &= mask;
    let o = [];     // For accumulating the output

    if(ov === undefined) {
        for(let i=0; i<size; i++) {
            o.push(undefined);
        }

        if(this.output === Alu.OUTPUT.CPSR) {
            this.outs[1].set([undefined, undefined, undefined, undefined]);
        } else {
            this.outs[1].set(undefined);
        }

    } else {
        let ov1 = ov;
        for(let i=0; i<size; i++) {
            o.push((ov1 & 1) === 1);
            ov1 >>= 1;
        }

        switch(this.output) {
            case Alu.OUTPUT.CPSR:
                // Order: N, Z, C, V
                this.outs[1].set([o[size-1], ov === 0, carry, overflow]);
                break;

            case Alu.OUTPUT.N:
                this.outs[1].set(o[size-1]);
                break;

            case Alu.OUTPUT.Z:
                this.outs[1].set(ov === 0);
                break;

            case Alu.OUTPUT.C:
                this.outs[1].set(carry);
                break;

            case Alu.OUTPUT.V:
                this.outs[1].set(overflow);
                break;
        }

    }

    this.outs[0].set(o);
};

Alu.prototype.properties = function(main) {
    let dlg = new ComponentPropertiesDlg(this, main);
    const sizeId = dlg.uniqueId();
    const outputId = dlg.uniqueId();
    const controlId = dlg.uniqueId();

    let html = `<div class="control-table"><div class="control">
<label for="${sizeId}">Size:</label>
<select name="${sizeId}" id="${sizeId}">`;

    for(const size of [4, 8, 16, 32]) {
        const selected = this.size === size ? ' selected' : '';
        html += `<option value="${size}"${selected}>${size}</option>`;
    }

    html += `</select>
</div>
<div class="control">
        <label>Secondary Output:</label>
        <select class="auto" name="${outputId}" id="${outputId}">`

    for(const output of Alu.OUTPUT.POSSIBLE) {
        const selected = this.output === output ? ' selected' : '';
        const name = Alu.OUTPUT.NAMES[output];
        html += `<option value="${output}"${selected}>${name}</option>`;
}

html += `</select>
</div>
<div class="control">
<label>Control:</label>
<select class="auto" name="${controlId}" id="${controlId}">`;

    for(const control of Alu.CONTROL.POSSIBLE) {
        const selected = this.control === control ? ' selected' : '';
        const name = Alu.CONTROL.NAMES[control];
        html += `<option value="${control}"${selected}>${name}</option>`;
    }

    html += `</select>
</div></div>`;

    dlg.extra(html, () => {
        return null;
    }, () => {
        this.size = document.getElementById(sizeId).value;
        this.output = document.getElementById(outputId).value;
        return null;
    }, 85);

    dlg.open();
};






