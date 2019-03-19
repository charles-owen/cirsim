import {Selection} from './Selection';
import {Component} from './Component';
import {Tools} from './DOM/Tools';
import {ImportTabDialog} from "./Dlg/ImportTabDialog";
import {Model} from "./Model";
import {ExportPNGDlg} from "./Dlg/ExportPNGDlg";

/**
 * View of a circuit
 * @param main Main object for interface
 * @param canvas Canvas element in the view
 * @param circuit Circuit we draw on that canvas
 * @constructor
 */
export const View = function(main, canvas, circuit) {
    //
    // Object properties
    //
    Object.defineProperties(this, {
        main: {
            get: function() {
                return main;
            }
        },
        circuit: {
            get: function() {
                return circuit;
            },
            set: function(value) {
                circuit = value;
            }
        },
        element: {
            get: function() {
                return canvas;
            }
        },
        model: {
            get: function() {
                return circuit.circuits.model;
            }
        }
    });

  //  this.main = main;
 //    this.circuit = circuit;
  //  this.element = canvas;

    // The selection object
    this.selection = new Selection(this);

    /// The tab number for this view
    this.tabnum = -1;

    canvas.addEventListener('dragover', (event) => {
        event.preventDefault();
    });

    canvas.addEventListener('drop', (event) => {
        event.preventDefault();
    });

    this.initialize = () => {
        this.setSize();

        main.dragAndDrop.droppable(this, (paletteItem, x, y) => {
            const componentObject = paletteItem.obj;
            if(componentObject === undefined) {
                return;
            }

            this.model.backup();
            const component = new componentObject(paletteItem);
            component.brand();

            component.x = x;
            component.y = y;

	        this.circuit.add(component);
	        this.circuit.snapIt(component);
	        this.ensureSize();
	        this.draw();
        });

        //
        // Mouse management
        //
        let lastMouse = {x: 0, y: 0};
        let mouse = {x: 0, y: 0};
        let lastPage = {x: 0, y: 0};

        let mouseDownListener = (event) => {
            event.preventDefault();

            downListener(event.pageX, event.pageY, false, event);
        }

        let touchStartListener = (event) => {
            event.preventDefault();

            let touch = event.changedTouches[0];
            downListener(touch.pageX, touch.pageY, true, event);
        }

        let downListener = (pageX, pageY, touch, event) => {

            let offset = Tools.offset(canvas);
            lastPage = {x: pageX, y: pageY};
            mouse.x = pageX - offset.left;
            mouse.y = pageY - offset.top;
            lastMouse.x = mouse.x;
            lastMouse.y = mouse.y;

            // If we are in inline mode, we don't allow selecting
            // or dragging at all.
            if(main.options.display === 'inline') {
                this.circuit.touch(mouse.x, mouse.y);
                return;
            }


            this.selection.mouseDown(mouse.x, mouse.y, event);
            this.draw();

            // Only install mouse or touch movement
            // handler while we are moving
            if(touch) {
                canvas.addEventListener('touchmove', touchMoveListener);
            } else {
	            canvas.addEventListener('mousemove', mouseMoveListener);
            }

            canvas.parentNode.addEventListener('scroll', scrollListener);
        };

        let scrollListener = () => {
	        const offset = Tools.offset(canvas); // canvasJ.offset();
	        mouse.x = lastPage.x - offset.left;
	        mouse.y = lastPage.y - offset.top;
	        this.selection.mouseMove(mouse.x, mouse.y, mouse.x - lastMouse.x, mouse.y - lastMouse.y);
	        lastMouse.x = mouse.x;
	        lastMouse.y = mouse.y;
	        this.draw();
        }

        let mouseMoveListener = (event) => {
            event.preventDefault();
            moveListener(event.pageX, event.pageY, false);
        }

        let touchMoveListener = (event) => {
            event.preventDefault();

            let touch = event.changedTouches[0];
            moveListener(touch.pageX, touch.pageY, true);
        }

        let moveListener = (pageX, pageY, touch) => {
            // Ignore if we did not actually move
            if(pageX === lastPage.x && pageY === lastPage.y) {
                return;
            }

	        const offset = Tools.offset(canvas);
	        lastPage = {x: pageX, y: pageY};
            mouse.x = pageX - offset.left;
            mouse.y = pageY - offset.top;
            this.selection.mouseMove(mouse.x, mouse.y, mouse.x - lastMouse.x, mouse.y - lastMouse.y);

            this.ensureSize();
            
            lastMouse.x = mouse.x;
            lastMouse.y = mouse.y;
            this.draw();
        }

        let mouseDblClickListener = (event) => {
            event.preventDefault();

            if (this.selection.selection.length === 1 &&
                (this.selection.selection[0] instanceof Component)) {
                let component = this.selection.selection[0];
                component.properties(main);
            }
        }

        let touchEndListener = (event) => {
            event.preventDefault();
            let touch = event.changedTouches[0];
            upListener(touch.pageX, touch.pageY, true);
        }

        let touchCancelListener = (event) => {
            let touch = event.changedTouches[0];
            upListener(touch.pageX, touch.pageY, true);
        }

        let mouseUpListener = (event) => {
            canvas.removeEventListener('mousemove', mouseMoveListener);
            upListener(event.pageX, event.pageY, false);
        }

        let upListener = (pageX, pageY, touch) => {
            canvas.parentNode.removeEventListener('scroll', scrollListener);
            // canvasJ.parent().off("scroll");
	        let offset = Tools.offset(canvas);
            mouse.x = pageX - offset.left;
            mouse.y = pageY - offset.top;
            this.selection.mouseUp(mouse.x, mouse.y);
            lastMouse.x = mouse.x;
            lastMouse.y = mouse.y;
            this.draw();
        }

        // Install mouse handlers
        canvas.addEventListener('mousedown', mouseDownListener);
        canvas.addEventListener('dblclick', mouseDblClickListener);

        let body = document.querySelector('body');
        body.addEventListener('mouseup', mouseUpListener);

        // Install touch handlers
        canvas.addEventListener('touchstart', touchStartListener);
        canvas.addEventListener('touchend', touchEndListener);
        canvas.addEventListener('touchcancel', touchCancelListener);
    }

    this.draw = function() {
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        this.circuit.draw(ctx, this);
        this.selection.draw(ctx);
    };

    this.delete = function() {
        this.model.backup();
        this.selection.delete();
        this.draw();
    };

    /**
     * Advance the animation for this view by a given amount of time...
     * @param delta
     */
    this.advance = function(delta) {
        return this.circuit.circuits.advance(delta);
    };

    this.ensureSize = function() {
        let bounds = this.circuit.bounds();
        let wid = bounds.right + 1;
        let hit = bounds.bottom + 1;

        if(wid > canvas.offsetWidth) {
            //canvasJ.width(max.x);
            canvas.style.width = wid + 'px';
            canvas.setAttribute("width", wid);
            circuit.width = wid;
        }

        if(hit > canvas.offsetHeight) {
            canvas.style.height = bounds.bottom + 'px';
            canvas.setAttribute("height", bounds.bottom);
            circuit.height = bounds.bottom;
        }
    }

    this.setSize = function() {
        if(canvas.offsetWidth !== this.circuit.width ||
            canvas.offsetHeight !== this.circuit.height) {

            // Size setting
            canvas.style.width = this.circuit.width + 'px';
            canvas.style.height = this.circuit.height + 'px';
            canvas.width = this.circuit.width;
            canvas.height = this.circuit.height;
        }
    };

    this.initialize();
    this.draw();
};



View.prototype.undo = function() {
    if(this.circuit.prev !== null) {
        this.selection.clear();
        this.circuit = this.circuit.prev;
        this.draw();
    }
};

/**
 * Import a tab from another file that we load via AJAX.
 * @param importer Object from the list of imports
 *
 * Keys in the importer object:
 *
 * from - Tab in source we import from
 * into - Tab we import into
 * name - Filename for source
 * extra - Object with extra key/value pairs to send to server when importing
 */
View.prototype.importTab = function(importer) {
    this.selection.clear();

    const dlg = new ImportTabDialog(importer, this.main.options, this.main.toast);
    dlg.open((data) => {
        this.model.backup();

        const model = new Model(this.main);
        model.fmJSON(data);

        // Find the tab
        const circuit = model.getCircuit(importer.from);
        if(circuit !== null) {
            circuit.name = importer.into;
	        this.main.model.replaceCircuit(circuit);
	        this.circuit = circuit;
	        this.draw();
        }
    });
}

/**
 * Export this view as a PNG file
 */
View.prototype.exportPNG = function() {
    const dlg = new ExportPNGDlg(this);
    dlg.open();
}

