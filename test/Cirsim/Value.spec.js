
import Value from '../../src/Cirsim/Value.js';

describe('Value', function() {
   var v = new Value(Value.AUTO)

    it('is set Binary', function() {
        var v = new Value([true, false, false, true, true]);
        expect(v.getAsBinary()).toBe("11001");

        v.set([false, true, true, false, false]);
        expect(v.getAsBinary()).toBe("00110");

        function testBinary(set, expected) {
            expect(v.setAsBinary(set)).toBeTruthy();
            expect(v.getAsBinary()).toBe(expected);
        }

        expect(v.setAsBinary("01001101")).toBeTruthy();
        expect(v.getAsBinary()).toBe("01001101");

        testBinary("01001101", "01001101");

        // Parse only passes and does not change value
        expect(v.setAsBinary("110", true)).toBeTruthy();
        expect(v.getAsBinary()).toBe("01001101");

        expect(v.setAsBinary("x", true)).not.toBeTruthy();
        expect(v.getAsBinary()).toBe("01001101");

        testBinary("0000000000", "0000000000");
        testBinary("    01011  ", "01011");
    });

    it('is doing Conversions', function () {
        var expected = "01?001?";
        var v = new Value();
        v.type = Value.BINARY;
        v.setAsString(expected);
        expect(v.getAsBinary()).toBe('01?001?');

        v.setAsString("?");
        expect(v.getAsBinary()).toBe("?");
    });

    it('is set Hex', function() {
        var v = new Value([true, false, false, true, true]);
        expect(v.getAsHex()).toBe('19');

        expect(v.setAsBinary("11101010")).toBeTruthy();
        expect(v.getAsHex()).toBe('ea');

        expect(v.setAsBinary("10100111101")).toBeTruthy();
        expect(v.getAsHex()).toBe("53d");

        expect(v.setAsHex("01ab")).toBeTruthy();
        expect(v.getAsHex()).toBe("01ab");

        expect(v.setAsHex("1111", true)).toBeTruthy();
        expect(v.getAsHex()).toBe("01ab");

        expect(v.setAsHex("xxx", true)).not.toBeTruthy();
        expect(v.getAsHex()).toBe("01ab");

        expect(v.setAsHex("    07ab    ")).toBeTruthy();
        expect(v.getAsHex()).toBe("07ab");
    });

    it('is set Float', function() {

        var f = new Value();

        // -1
        var t = [false, false, false, false, false, false, false, false, false, false,
            true, true, true, true, false,
            true];
        f.set(t);

        expect(f.get()).toEqual(t);

        expect(f.getAsFloat16()).toBe('-1.000e+0');

        // 1.5
        t = [false, false, false, false, false, false, false, false, false, true,
            true, true, true, true, false,
            false];
        f.set(t);

        expect(f.getAsFloat16()).toBe('1.500e+0');

        function test(t, expected) {
            var f = new Value();
            f.setAsFloat16(t);
            var t1 = f.getAsFloat16();

            // console.log("" + t + "/" + t1);
            expect(t1).toBe(expected);
        }

        test(1, "1.000e+0");
        test(1.5, "1.500e+0");
        test(2.066e1, "2.066e+1");
        test(-87.311, "-8.725e+1");
        test(1087.5, "1.087e+3");
        test(-0.0012335, "-1.233e-3");
        test(99999, "inf");
        test(-99999, "-inf");

        var g = new Value();

        expect(g.setAsString("inf")).toBeTruthy();
        expect(g.getAsFloat16()).toBe('inf');

        expect(g.setAsString("-inf")).toBeTruthy();
        expect(g.getAsFloat16()).toBe('-inf');

        expect(g.setAsString("NaN")).toBeTruthy();
        expect(g.getAsFloat16()).toBe('NaN');
    });

    it('is Error checking', function() {
        var f = new Value();
        expect(f.setAsString("x", true)).not.toBeTruthy();
    });

});


