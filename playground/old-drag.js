var drag = {
	startX : 0,
	startY : 0,

	offsetX : 0,
	offsetY : 0,

	dragElement : null,
	oldZIndex : 0,

	start_listening : function () {
		var doc = document;
		doc.onmousedown = this.OnMouseDown;
		doc.onmouseup   = this.OnMouseUp;
	},

	OnMouseDown : function (e) {
		var self = drag;
		var doc = document;

		// IE is retarded and doesn't pass the event object
		var e = (e === null) ? window.event : e;

		// IE uses srcElement, others use target
		var target = (e.target !== null) ? e.target : e.srcElement;

		// for IE, left click == 1 // for Firefox, left click == 0
		if ((e.button == 1 && window.event != null || e.button == 0) && target.className == 'drag drag-box') {

			// grab the mouse position
			self.startX = e.clientX;
			self.startY = e.clientY;
			// grab the clicked element's position
			self.offsetX = self.ExtractNumber(target.style.left);
			self.offsetY = self.ExtractNumber(target.style.top);

			console.log(self.startX);
			console.log(self.offsetX);

			// bring the clicked element to the front while it is being dragged
			self.oldZIndex = target.style.zIndex;
			target.style.zIndex = 10000;

			// we need to access the element in OnMouseMove
			self.dragElement = target;

			// tell our code to start moving the element with the mouse
			doc.onmousemove = self.OnMouseMove;

			// cancel out any text selections
			document.body.focus();

			// prevent text selection in IE
			doc.onselectstart = function () {
				return false;
			};

			// prevent IE from trying to drag an image
			target.ondragstart = function () {
				return false;
			};

			// prevent text selection (except IE)
			return false;
		}
	},

	OnMouseMove : function (e) {
		var self = drag;
		var e = (e === null) ? window.event : e;

		console.log(self.offsetX, e.clientX, self.startX, (self.offsetX + e.clientX - self.startX));
		self.dragElement.style.left = (self.offsetX + e.clientX - self.startX) + 'px';
		self.dragElement.style.top  = (self.offsetY + e.clientY - self.startY) + 'px';
	},

	OnMouseUp : function (e) {
		var self = drag;
		var doc = document;

		if (self.dragElement !== null) {
			self.dragElement.style.zIndex = self.oldZIndex;

			// we're done with these events until the next OnMouseDown
			doc.onmousemove   = null;
			doc.onselectstart = null;
			self.dragElement.ondragstart = null;

			// this is how we know we're not dragging
			self.dragElement = null;
		}
	},

	ExtractNumber : function (value) {
		var n = parseInt(value);
		return n === null || isNaN(n) ? 0 : n;
	}
}

drag.start_listening();
module.exports = drag;
