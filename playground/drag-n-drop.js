function draggableNDroppable (elm, opts) {
    return new DragNDrop(elm, opts);
}

function DragNDrop (elm, opts) {
    this.elm = elm;
    this.startMouseX = 0;

    elm.setAttribute('draggable', 'true');
    elm.addEventListener('dragstart', this.onDragStart.bind(this));
    elm.addEventListener('dragend', this.onDragEnd);

    // container
    elm.parentNode.addEventListener('dragover', this.onDragOver);
    elm.parentNode.addEventListener('drop', this.onDrop.bind(this));
}

DragNDrop.prototype.onDragStart = function (ev) {
    console.log(ev.clientX);
    
    this.startMouseX = ev.clientX;
    this.elm.classList.add('dragging');

    setTimeout(() => {
        this.elm.classList.add('hidden');
    }, 0)
};

DragNDrop.prototype.onDragEnd = function (ev) {
    this.classList.remove('dragging', 'hidden');
};

DragNDrop.prototype.onDragOver = function (ev) {
    ev.preventDefault();
    this.classList.add('dragging-over');
};

DragNDrop.prototype.onDrop = function (ev) {
    const newLeft = parseInt(this.elm.style.left || 0) + ev.clientX - this.startMouseX;

    this.elm.style.left = newLeft  + 'px';
    this.elm.parentNode.classList.remove('dragging-over');
};