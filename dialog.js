if (typeof FlowerUI === 'undefined') {
	var FlowerUI = {};
}

(function() {

function Dialog(body, title) {
	this.elem = document.createElement('div');
	this.elem.className = 'flower-dialog';
	this.elem.style.display = 'none';

	do {
		var titleDiv = document.createElement('div');
		titleDiv.className = 'flower-dialog-title';
		titleDiv.innerHTML = title || 'Dialog';

		do {
			var closeBut = document.createElement('a');
			closeBut.href = 'javascript:;';
			closeBut.className = 'flower-dialog-close';
			closeBut.innerHTML = '&times;';
			var this1 = this; // to make a closure
			eventer.addEventListener(closeBut, 'click', function(e) {
				e = e || window.event;
				this1.close.call(this1);
				eventer.preventDefault(e);
			});
			titleDiv.appendChild(closeBut);
		} while(false);

		this.elem.appendChild(titleDiv);
	} while(false);

	do {
		if (body.parentNode) { // remove body from dom
			body.parentNode.removeChild(body);
		}
		var bodyCont = document.createElement('div');
		bodyCont.className = 'flower-dialog-body';
		bodyCont.appendChild(body);
		this.elem.appendChild(bodyCont);
	} while(false);

	document.body.appendChild(this.elem);

	this.close = function() { // default close event handler
		this.hide();
	};
}

Dialog.prototype.show = function() {
	this.elem.style.width = this.width ? this.width + 'px' : 'auto';
	this.elem.style.height = this.height ? this.height + 'px' : 'auto';
	this.elem.style.left = ((domer.viewWidth() - (this.width || 200)) / 2) + 'px';
	this.elem.style.top = ((domer.viewHeight() - (this.height || 200)) / 2) + 'px';
	this.elem.style.display = 'block';
};

Dialog.prototype.hide = function() {
	this.elem.style.display = 'none';
};

// TODO: draggable

FlowerUI.Dialog = Dialog;

})();
