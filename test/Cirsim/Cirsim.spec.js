import '../../index';
import {Cirsim} from '../../src/Cirsim/Cirsim';

describe('Cirsim', function() {
    // inject the HTML fixture for the tests
    beforeEach(function() {
        const div = '<div id="cirsim"></div>';

        document.body.insertAdjacentHTML('afterbegin', div);
    });

    // remove the html fixture from the DOM
    afterEach(function() {
        document.body.removeChild(document.getElementById('cirsim'));
    });

});
