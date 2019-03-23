import {Fixture} from '../Support/Fixture'
import {Alu} from '../../../src/Cirsim/Component/Alu';

describe('Alu', function() {
    beforeEach(function() {
        jasmine.addMatchers(Fixture.matcher);
    });

    it('ALU 16 bit test', function() {
        const component = new Alu();
        component.naming = 'ALU2';
        expect(component.naming).toBe('ALU2');

        component.size = 16;

        let fixture = new Fixture(component);
        expect(fixture).toPassTest([
            // And
            ['0xffff', '0x1234', '0b000000', '0x0000', '0x1234', '0b0000'],
            // Xor
            ['0xffff', '0x1234', '0b000001', '0x0000', '0xedcb', '0b0001']
        ]);

    });

    fit('ALU 32 bit test', function() {
        const component = new Alu();
        component.naming = 'ALU2';
        expect(component.naming).toBe('ALU2');

        component.size = 32;

        let fixture = new Fixture(component);
        expect(fixture).toPassTest([
            // And
            ['0xffffffff', '0x12345678', '0b000000', false, '0x12345678', '0b0000'],
            // Xor
            ['0xffffffff', '0x12345678', '0b000001', false, '0xedcba987', '0b0001'],
            // Left shift logical
            ['0x12345000', '0x00000001', '0b000010', false, '0x2468a000', '0b0000'],
        ]);

        component.control = Alu.CONTROL.ASAO;

        expect(fixture).toPassTest([
            // And
            ['0xffffffff', '0x12345678', '0b10', false, '0x12345678', '0b0000']
        ]);
    });

});


