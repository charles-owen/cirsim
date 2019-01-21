import '../../../index';
import {Cirsim} from '../../../src/Cirsim/Cirsim';

describe('Registers16', function() {
    // inject the HTML fixture for the tests
    beforeEach(function() {
        var div = '<div id="cirsim"></div>';
        document.body.insertAdjacentHTML('afterbegin', div);
    });

    // remove the html fixture from the DOM
    afterEach(function() {
        document.body.removeChild(document.getElementById('cirsim'));
    });

    it('start', function(done) {
        var cirsim = new Cirsim('#cirsim', {
            components: 'all',
            load: '{"grid":8,"snap":true,"circuits":[{"name":"main","width":1920,"height":1080,"components":[{"id":"c1001","x":288,"y":216,"name":null,"type":"Registers16"},{"id":"c1002","x":128,"y":128,"name":"ALU","type":"InPinBus","value":[false,false,false,false],"valuetype":2,"narrow":false},{"id":"c1003","x":128,"y":232,"name":"Ae","type":"InPinBus","value":[false,false,false],"narrow":false},{"id":"c1004","x":128,"y":264,"name":"Be","type":"InPinBus","value":[false,false,false],"narrow":false},{"id":"c1005","x":128,"y":160,"name":"ALUe","type":"InPinBus","value":[false,false,false],"narrow":false},{"id":"c1006","x":440,"y":168,"name":"A","type":"OutPinBus","value":[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],"valuetype":2,"narrow":false},{"id":"c1007","x":440,"y":264,"name":"B","type":"OutPinBus","value":[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],"valuetype":2,"narrow":false},{"id":"c1008","x":144,"y":200,"name":"W","type":"InPin","value":false},{"id":"c1009","x":240,"y":88,"name":"C","type":"InPin","value":false},{"id":"c1010","x":240,"y":352,"name":"R","type":"InPin","value":false}],"connections":[{"from":"c1001","out":0,"to":"c1006","in":0,"bends":[]},{"from":"c1001","out":1,"to":"c1007","in":0,"bends":[]},{"from":"c1002","out":0,"to":"c1001","in":1,"bends":[{"x":200,"y":128},{"x":200,"y":168}]},{"from":"c1003","out":0,"to":"c1001","in":2,"bends":[]},{"from":"c1004","out":0,"to":"c1001","in":3,"bends":[]},{"from":"c1005","out":0,"to":"c1001","in":4,"bends":[{"x":192,"y":184}]},{"from":"c1008","out":0,"to":"c1001","in":6,"bends":[]},{"from":"c1009","out":0,"to":"c1001","in":0,"bends":[]},{"from":"c1010","out":0,"to":"c1001","in":5,"bends":[]}]}]}',
            testTime: 1
        });

        var tst = [
            ["0x0000", "0b000", 0, "0b000", "0b000", 0, 1, "0x0000", "0x0000"],    // Reset
        ];

        var bin3 = ['0b000', '0b001', '0b010', '0b011', '0b100', '0b101', '0b110', '0b111'];
        var registers = ['0x0000', '0x0000', '0x0000', '0x0000', '0x0000', '0x0000', '0x0000', '0x0000'];

        function verifyRegister(reg) {
            let rb = bin3[reg];
            tst.push(['0x0000', '0b000', 0, rb, '0b000', 0, 0, registers[reg], registers[0]]);
            tst.push(['0x0000', '0b000', 0, '0b000', rb, 0, 0, registers[0], registers[reg]]);
        }


        function writeRegister(reg, value, w) {
             let rb = bin3[reg];
             tst.push([value, rb, w, "0b000", "0b000", 0, 0, "?", "?"]);
             tst.push([value, rb, w, "0b000", "0b000", 1, 0, "?", "?"]);
             tst.push([value, rb, w, "0b000", "0b000", 0, 0, "?", "?"]);
             if(w) {
                 registers[reg] = value;
             }
        }

        function verifyAll() {
            for(let i=0; i<8; i++) {
                verifyRegister(i);
            }
        }

        verifyAll();
        writeRegister(0, '0x1235', 1);
        writeRegister(1, '0xa7b2', 1);
        verifyAll();
        writeRegister(1, '0x9983', 0);  // Write not enabled
        verifyAll();
        writeRegister(3, '0x814a', 1);
        writeRegister(4, '0x23aa', 1);
        writeRegister(5, '0xbcda', 1);
        writeRegister(6, '0x111a', 1);
        writeRegister(7, '0xfeaa', 1);
        verifyAll();


        var test = {
            'tag': 'test',
            'name': "Test",
            'input': ['ALU', 'ALUe', 'W', 'Ae', 'Be', 'C', 'R'],
            'output': ['A', 'B'],
            'test': tst
        }

        cirsim.addTest(test);
        cirsim.startNow();
        var main = cirsim.getInstances()[0];
        var tester = main.test;

        var promise = tester.runTest(test);
        promise.then(() => {
            // Success
            expect(true).toBeTruthy();
            done();
        }, (msg) => {
            console.log('failure ' + msg);
            // Failure
            expect(msg).toBeNull();
            done();
        });
    });

});


