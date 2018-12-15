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
			mouseMove(event);
		});

		main.element.addEventListener('mouseup', (event) => {
			mouseUp(event);
		})
	}

	this.draggable = (paletteItem) => {
		paletteItem.element.addEventListener('mousedown', (event) => {
			click(paletteItem);
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

		mouseMove(event);
	}

	const mouseMove = (event) => {
		if(event.which === 0) {
			mouseUp(event);
			return;
		}

		if(dragElement !== null) {
			dragElement.style.left = (event.clientX - main.element.offsetLeft - dragElement.clientWidth / 2) + 'px';
			dragElement.style.top = (event.clientY - main.element.offsetTop - dragElement.clientHeight / 2) + 'px';
		}
	}

	const mouseUp = (event) => {
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
				const viewX = rect.left + viewElement.scrollLeft;
				const viewY = rect.top + viewElement.scrollTop;

				if(event.pageX >= viewX &&
					event.pageY >= viewY &&
					event.pageX < rect.right &&
					event.pageY < rect.bottom) {
					view.callback(dragItem, event.pageX - rect.left, event.pageY - rect.top);
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