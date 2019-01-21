import '../../index';
import {Cirsim} from '../../src/Cirsim/Cirsim';

describe('Cirsim', function() {
    // inject the HTML fixture for the tests
    beforeEach(function() {
        var div = '<div id="cirsim"></div>';

        document.body.insertAdjacentHTML('afterbegin', div);
    });

    // remove the html fixture from the DOM
    afterEach(function() {
        document.body.removeChild(document.getElementById('cirsim'));
    });

    it('version', function() {
        var cirsim = new Cirsim('#cirsim');
        expect(cirsim.version).toBe('2.1.2');
    });
});
