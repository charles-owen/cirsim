/**
 * Component: Simple 4-bit instruction decoder
 */
Cirsim.InstructionDecoder4 = function(name) {
    Cirsim.Component.call(this, name);

    this.height = 120;
    this.width = 80;

    this.instruction = "";

    // Only outputs
    var y = -16 * 2;
    this.addOut(this.width/2, y, 16, "Ae").bus = true;      y += 16;
    this.addOut(this.width/2, y, 16, "Be").bus = true;      y += 16;
    this.addOut(this.width/2, y, 16, "ALUe").bus = true;    y += 16;
    this.addOut(this.width/2, y, 16, "Im").bus = true;      y += 16;
    this.addOut(this.width/2, y, 16, "C").bus = true;       y += 16;

    this.setAsString("nop");
};

Cirsim.InstructionDecoder4.prototype = Object.create(Cirsim.Component.prototype);
Cirsim.InstructionDecoder4.prototype.constructor = Cirsim.InstructionDecoder4;

Cirsim.InstructionDecoder4.prototype.prefix = "ID";
Cirsim.InstructionDecoder4.prototype.nameRequired = true;

Cirsim.InstructionDecoder4.type = "InstructionDecoder4";            ///< Name to use in files
Cirsim.InstructionDecoder4.label = "Ins Dec";           ///< Label for the palette
Cirsim.InstructionDecoder4.desc = "Instruction Decoder";       ///< Description for the palette
Cirsim.InstructionDecoder4.img = "insdecoder4.png";         ///< Image to use for the palette
Cirsim.InstructionDecoder4.description = '<h2>Instruction Decoder</h2><p>Simple example' +
    ' instruction decoder. Decodes assembly statements into register and ALU operations.</p>';

/**
 * Compute the gate result
 * @param state
 */
Cirsim.InstructionDecoder4.prototype.compute = function(state) {
};

Cirsim.InstructionDecoder4.prototype.setAsString = function(value, set) {
    this.instruction = value;
    if(set === undefined) {
        set = true;
    }

    var re = /\s*([a-zA-Z]*)(?:[\s,$]+([^\s,]+))?(?:[\s,$]+([^\s,]+))?(?:[\s,$]+([^\s,]+))?/;
    var match = this.instruction.toLowerCase().match(re);
    if(match === null) {
        return "syntax error in input";
    }

    var ae = this.outs[0];
    var be = this.outs[1];
    var alue = this.outs[2];
    var im = this.outs[3];
    var c = this.outs[4];

    // Get a register value from a string
    function getreg(s) {
        switch(s) {
            case 'r0':
                return "00";

            case 'r1':
                return "01";

            case 'r2':
                return "10";

            case 'r3':
                return '11';

            default:
                return null;
        }
    }

    // Get an immediate value from a string
    function getimm(s) {
        if(s === null || s === undefined) {
            return null;
        }

        if(s.substr(0, 1) !== '#') {
            return null;
        }

        var im = parseInt(s.substr(1));
        if(im > 7 || im < -8) {
            return null;
        }


        return ((im & 8) != 0 ? '1' : '0') + ((im & 4) != 0 ? '1' : '0') +
            ((im & 2) != 0 ? '1' : '0') + ((im & 1) != 0 ? '1' : '0');
    }


    var opcode = match[1];
    var rd = match[2];
    var ra = match[3];
    var rb = match[4];

    var rdreg = getreg(rd);
    var rareg = getreg(ra);
    var rbreg = getreg(rb);

    var raimm = getimm(ra);
    var rbimm = getimm(rb);


    function operation(cOp) {
        // Must have registers Rd and Ra
        if(rdreg === null || rareg === null) {
            return null;
        }

        if(rb.substr(0, 1) === '#') {
            // This is an immediate operation
            if(rbimm === null) {
                return "invalid immediate value";
            }

            if(set) {
                ae.setAsString(rareg);
                be.setAsString("100");
                alue.setAsString("0" + rdreg);
                c.setAsString(cOp);
                im.setAsString(rbimm);
            }
        } else if(rareg !== null) {
            // This is a register operation
            if(set) {
                ae.setAsString(rareg);
                be.setAsString("0" + rbreg);
                alue.setAsString("0" + rdreg);
                c.setAsString(cOp);
            }
        }

        return null;
    }

    switch(opcode) {
        case 'nop':
            if(set) {
                ae.setAsString("00");
                be.setAsString("000");
                alue.setAsString("100");
                im.setAsString("0000");
                c.setAsString("111");
            }
            break;

        case 'mov':
            if(rdreg === null) {
                return null;
            }

            if(ra.substr(0, 1) === '#') {
                // This is an immediate operation
                if(raimm === null) {
                    return "invalid immediate value";
                }

                if(set) {
                    ae.setAsString(rdreg);
                    be.setAsString("100");
                    alue.setAsString("0" + rdreg);
                    c.setAsString("000");
                    im.setAsString(raimm);
                }
            } else if(rareg !== null) {
                // This is a register operation
                if(set) {
                    ae.setAsString(rdreg);
                    be.setAsString("0" + rareg);
                    alue.setAsString("0" + rdreg);
                    c.setAsString("000");
                }
            }

            break;

        case 'add':
            return operation("001");

        case 'sub':
            return operation("010");

        case 'and':
            return operation("011");

        case 'or':
            return operation("100");

        case 'sll':
            return operation("101");

        case 'sla':
            return operation("110");
    }

    return null;
}


/**
 * Clone this component object.
 * @returns {Cirsim.InstructionDecoder4}
 */
Cirsim.InstructionDecoder4.prototype.clone = function() {
    var copy = new Cirsim.InstructionDecoder4();
    copy.copyFrom(this);
    return copy;
};


/**
 * Draw component object.
 * @param context Display context
 * @param view View object
 */
Cirsim.InstructionDecoder4.prototype.draw = function(context, view) {
    this.selectStyle(context, view);

    var leftX = this.x - this.width/2 - 0.5;
    var rightX = this.x + this.width/2 + 0.5;
    var topY = this.y - this.height/2 - 0.5;
    var botY = this.y + this.height/2 + 0.5;

    // Left side
    context.beginPath();
    context.moveTo(leftX, topY);
    context.lineTo(leftX, botY);

    // Bottom
    context.lineTo(rightX, botY);

    // Right side
    context.lineTo(rightX, topY);

    // Top
    context.lineTo(leftX, topY);

    context.font = "12px Times";
    context.textAlign = "center";
    context.fillText("instruction", this.x, this.y + this.height/2 - 14);
    context.fillText("decoder", this.x, this.y + this.height/2 - 2);

    context.fillText(this.instruction, this.x, this.y - this.height/2 + 10);

    // Name
    if(this.naming !== null) {
        context.font = "14px Times";
        context.textAlign = "center";
        context.fillText(this.naming, this.x-15, this.y+3);
    }

    context.stroke();

    this.drawIO(context, view);
};

Cirsim.InstructionDecoder4.prototype.properties = function(main) {
    var that = this;

    var value = this.instruction;

    var dlg = new Cirsim.ComponentPropertiesDlg(this, main);
    var html = '<p>Value<br>' +
        '<input type="text" id="insdecoder-value" name="insdecoder-value" spellcheck="false" value="' + value + '"></p>';

    dlg.extra(html, function() {
        var value = $('input[name="insdecoder-value"]').val();
        return that.setAsString(value, false);
    }, function() {
        var value = $('input[name="insdecoder-value"]').val();
        that.setAsString(value);
    }, 40);

    dlg.open();
    $("#insdecoder-value").focus().select();
};
