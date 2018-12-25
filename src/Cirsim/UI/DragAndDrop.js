/**
 * Drag and drop support for the palette
 * @constructor
 */
export const DragAndDrop = function(main) {

	let dragElement = null; // DOM Element
	let dragItem = null;    // PaletteItem
	let dropViews = [];     // View

	const initialize = () => {
		main.element.addEventListener('mousemove', (event) => {
			if(event.which === 0) {
				mouseUp(event.pageX, event.pageY);
				return;
			}

			mouseMove(event.pageX, event.pageY);
		});

		main.element.addEventListener('touchmove', (event) => {
			let touch = event.changedTouches[0];
			mouseMove(touch.pageX, touch.pageY);
		});

		main.element.addEventListener('mouseup', (event) => {
			mouseUp(event.pageX, event.pageY);
		});

		main.element.addEventListener('touchend', (event) => {
			let touch = event.changedTouches[0];
			mouseUp(touch.pageX, touch.pageY);
		});

		main.element.addEventListener('touchcancel', (event) => {
			let touch = event.changedTouches[0];
			mouseUp(touch.pageX, touch.pageY);
		});
	}

	this.draggable = (paletteItem) => {
		paletteItem.element.addEventListener('mousedown', (event) => {
			event.preventDefault();
			click(paletteItem);

			mouseMove(event.pageX, event.pageY);
		});

		paletteItem.element.addEventListener('touchstart', (event) => {
			event.preventDefault();
			click(paletteItem);

			let touch = event.changedTouches[0];
			mouseMove(touch.pageX, touch.pageY);
		});
	}

	this.droppable = (view, callback) => {
		dropViews.push({
			'view': view,
			'callback': callback
		});
	}

	const click = (paletteItem) => {
		//
		// Create a copy of the element and set it up for dragging
		//
		const clone = paletteItem.paletteImage();
		main.element.appendChild(clone);
		clone.style.position = 'absolute';
		clone.style.top = 0;
		clone.style.left = 0;
		clone.style.zIndex = 100;
		clone.style.cursor = 'pointer';

		dragItem = paletteItem;
		dragElement = clone;
	}

	const mouseMove = (x, y) => {
		if(dragElement !== null) {
			const rect = main.element.getBoundingClientRect();
			const mainX = rect.left + main.element.scrollLeft + window.pageXOffset;
			const mainY = rect.top  + main.element.scrollTop + window.pageYOffset;

			dragElement.style.left = (x - mainX - dragElement.clientWidth / 2) + 'px';
			dragElement.style.top = (y - mainY - dragElement.clientHeight / 2) + 'px';
			return true;
		}

		return false;
	}

	const mouseUp = (x, y) => {
		if(dragElement !== null) {

			for(const view of dropViews) {
				//
				// Is the view enabled?
				//
				const viewElement = view.view.element;
				if(viewElement.parentNode.style.display === 'none') {
					continue;
				}

				//
				// Determine x,y in the canvas
				//
				const rect = viewElement.getBoundingClientRect();
				const viewX = rect.left + viewElement.scrollLeft + window.pageXOffset;
				const viewY = rect.top + viewElement.scrollTop + window.pageYOffset;

				if(x >= viewX &&
					y >= viewY &&
					x < viewX + (rect.right - rect.left) &&
					y < viewY + (rect.bottom - rect.top)) {
					view.callback(dragItem, x - viewX, y - viewY);
					break;
				}
			}

			main.element.removeChild(dragElement);
			dragElement = null;
			dragItem = null;
		}
	}



	initialize();
}