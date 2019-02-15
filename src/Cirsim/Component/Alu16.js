import {Component} from '../Component';


/**
 * Component: 16-bit ALU
 * @constructor
 */
export const Alu16 = function(name) {
    Component.call(this, name);

    this.height = 16 * 8;
    this.width = 64;
    this.shrink = 15;

    this.cin = false;   // Carry in

    const left = -this.width / 2;
    const right = this.width / 2;

    this.operator = '';

    // Inputs and one output
    var inOffset = 32;
    this.addIn(left, -inOffset, 16, "A").bus = true;
    this.addIn(left, inOffset, 16, "B").bus = true;

    var dy = 0.5 * this.shrink;
    var c = this.addIn(0, this.height/2 - dy, 8 + dy, "C");
    c.orientation = 's';
    c.bus = true;

    this.addIn(left, inOffset+ 16, 16, "Cin");

    this.addOut(right, 0, 16, "O").bus = true;
    this.addOut(right, 24, 16, "CPSR").bus = true;
};

Alu16.prototype = Object.create(Component.prototype);
Alu16.prototype.constructor = Alu16;

Alu16.prototype.prefix = "ALU";
Alu16.prototype.nameRequired = true;

Alu16.type = "Alu16";            ///< Name to use in files
Alu16.label = "ALU 16";           ///< Label for the palette
Alu16.desc = "Simple 16-bit ALU";       ///< Description for the palette
Alu16.img = "alu.png";         ///< Image to use for the palette
Alu16.description = '<h2>16-bit ALU</h2><p>Simple example 16-bit ALU. A and ' +
    'B are bus inputs to the ALU. C is the control input. Cin is the carry input ' +
    'for adc and sbc operations. O is a bus output result and CPSR is the status' +
    ' output bits for the current program status register.</p>' +
    '<p>If Cin is not connected, it is assumed to be false.</p>' +
    '<p>The status bits in CPSR are: 0:N, 1:Z, 2:C, 3:V</p>';
Alu16.help = 'alu16';
Alu16.order = 706;

/**
 * Compute the gate result
 * @param state
 */
Alu16.prototype.compute = function(state) {
    var a = state[0];
    var b = state[1];
    var c = state[2];

    // Determine the carry input
    this.cin = state[3] !== undefined && state[3];

    function parse(c) {
        if(c === undefined) {
            return undefined;
        }

        var p = 1;
        var sum = 0;
        c.forEach(function(v) {
            if(v === undefined) {
                return undefined;
            }

            if(v) {
                if(p == 0x8000) {
                    sum -= p;
                } else {
                    sum += p;
                }

            }

            p *= 2;
        });

        return sum;
    }

    var av = parse(a);
    var bv = parse(b);
    var cv = parse(c);
    //console.log("av=" + av + " bc=" + bv + " cv=" + cv);

    var ov = bv;
    var carry = false;
    var overflow = false;

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
            ov = (av & 0xffff) >> bv;
            this.operator = '>>';
            break;

        case 4:     // Arithmetic shift right
            var sign = av & 0x8000;
            ov = av;
            for(var i=0; i<bv; i++) {
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

            var ov1 = (av & 0xffff) + (bv & 0xffff);
            carry = (ov1 & 0x10000) != 0;
            overflow = (ov < -32768 || ov > 32768);
            this.operator = '+';
            break;

        case 11:    // cmn, works like add
        case 34:    // Format 3 add
        case 16:    // Format 2 add
            ov = av + bv;
            var ov1 = (av & 0xffff) + (bv & 0xffff);
            carry = (ov1 & 0x10000) != 0;
            overflow = (ov < -32768 || ov > 32768);
            this.operator = '+';
            break;

        case 6:     // subtract w/carry
            ov = av - bv;
            if(!this.cin) {
                ov--;
            }

            var ov1 = (av & 0xffff) + ((~bv) & 0xffff) + 1;
            carry = (ov1 & 0x10000) != 0;
            overflow = (ov < -32768 || ov > 32768);
            this.operator = '-';
            break;

        case 10:    // cmp (works like sub)
        case 33:    // Format 3 cmp
        case 35:    // Format 3 sub
        case 17:    // Format 2 sub
            ov = av - bv;
            var ov1 = (av & 0xffff) + ((~bv) & 0xffff) + 1;
            carry = (ov1 & 0x10000) != 0;
            overflow = (ov < -32768 || ov > 32768);
            this.operator = '-';
            break;

        case 7:     // Rotate right
            var sign = av & 0x8000;
            ov = av & 0xffff;
            for(var i=0; i<bv; i++) {
                var low = (ov & 1) << 15;
                ov = (av & 0xffff) >> 1;
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
            overflow = (ov < -32768 || ov > 32768);
            this.operator = '*';
            break;

        case 14:    // bic
            ov = av & (bv ^ 0xffff);
            this.operator = 'bic';
            break;

        case 15:    // not
            ov = av ^ 0xffff;
            this.operator = 'not';
            break;

        case 18:    // mul high
            av &= 0xffff;
            bv &= 0xffff;
            ov = (av * bv) >> 16;
            this.operator = '*^';
            break;

        default:    // mov
            ov = bv;
            this.operator = 'mov';
            break;
    }

    ov &= 0xffff;

    if(ov === undefined) {
        this.outs[0].set([undefined, undefined, undefined, undefined]);
        this.outs[1].set([undefined, undefined, undefined, undefined]);
    } else {
        var o = [];
        var ov1 = ov;
        for(var i=0; i<16; i++) {
            o.push((ov1 & 1) == 1);
            ov1 >>= 1;
        }
        this.outs[0].set(o);

        // Order: N, Z, C, V
        this.outs[1].set([o[15], ov == 0, carry, overflow]);
    }

};

/**
 * Clone this component object.
 * @returns {Alu16}
 */
Alu16.prototype.clone = function() {
    const copy = new Alu16();
    copy.copyFrom(this);
    return copy;
};



/**
 * Draw component object.
 * @param context Display context
 * @param view View object
 */
Alu16.prototype.draw = function(context, view) {
    this.selectStyle(context, view);

    var leftX = this.x - this.width/2 - 0.5;
    var rightX = this.x + this.width/2 + 0.5;
    var topY = this.y - this.height/2 - 0.5;
    var botY = this.y + this.height/2 + 0.5;


    // Left side
    context.beginPath();
    context.moveTo(leftX, topY);
    context.lineTo(leftX, this.y - this.shrink / 2);
    context.lineTo(leftX + 20, this.y);
    context.lineTo(leftX, this.y + this.shrink / 2);
    context.lineTo(leftX, botY);

    // Bottom
    context.lineTo(rightX, botY - this.shrink);

    // Right side
    context.lineTo(rightX, topY + this.shrink);

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
