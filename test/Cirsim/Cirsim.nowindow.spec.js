import '../../src/app.modules.js';
import Cirsim from '../../src/Cirsim/Cirsim.js';
import $ from 'jquery';

describe('Cirsim no-window', function() {

    fit('and-test', function(done) {
        // let cirsim = new Cirsim(null, {
        //     load: '{"grid":8,"snap":true,"circuits":[{"name":"main","width":1920,"height":1080,"components":[{"id":"c1001","x":120,"y":96,"name":"A","type":"InPin","value":false},{"id":"c1002","x":120,"y":128,"name":"B","type":"InPin","value":false},{"id":"c1003","x":368,"y":112,"name":"O","type":"OutPin"},{"id":"c1004","x":240,"y":112,"name":null,"type":"And"}],"connections":[{"from":"c1001","out":0,"to":"c1004","in":0,"bends":[]},{"from":"c1002","out":0,"to":"c1004","in":1,"bends":[]},{"from":"c1004","out":0,"to":"c1003","in":0,"bends":[]}]}]}'
        // });

        let cirsim = new Cirsim(null);
        let instance = cirsim.start();

        let tst = [
            ['?', '?', '?'],
            [0, 0, 0],
            [0, 1, 0],
            [1, 0, 0],
            [1, 1, 1]
        ]

        let test = {
            'tag': 'test',
            'name': "And Test",
            'input': ['A', 'B'],
            'output': ['O'],
            'test': tst
        }

        instance.load('{"grid":8,"snap":true,"circuits":[{"name":"main","width":1920,"height":1080,"components":[{"id":"c1001","x":120,"y":96,"name":"A","type":"InPin","value":false},{"id":"c1002","x":120,"y":128,"name":"B","type":"InPin","value":false},{"id":"c1003","x":368,"y":112,"name":"O","type":"OutPin"},{"id":"c1004","x":240,"y":112,"name":null,"type":"And"}],"connections":[{"from":"c1001","out":0,"to":"c1004","in":0,"bends":[]},{"from":"c1002","out":0,"to":"c1004","in":1,"bends":[]},{"from":"c1004","out":0,"to":"c1003","in":0,"bends":[]}]}]}');
        instance.addTest(test);

        expect(instance).not.toBeNull();

        let promise = instance.runTest('test');
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
