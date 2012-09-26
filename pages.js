if (typeof FlowerUI === 'undefined') {
	var FlowerUI = {};
}

(function() {

function Pages(elem, init) {
	Flower.assert.present(elem, 'elem must not be null');

	this.elem = elem;
	this.initFuncs = [];

	init = init || 0;
	for (var i = 0; i < elem.children.length; i++) {
		elem.children[i].style.display = ((i != init) ? 'none' : 'block');
	}
}
Pages.prototype.setInitFunc = function(i, func) {
	this.initFuncs[i] = func;
};
Pages.prototype.switchTo = function(i) {
	var childs = this.elem.children;
	var len = childs.length;
	if (i < 0 || i >= len) {
		throw new RangeError('pages only have ' + len + ' children, but you switchTo ' + i);
	}
	for (var j = 0; j < len; j++) {
		childs[j].style.display = ((j != i) ? 'none' : 'block');
	}
	if (this.initFuncs[i]) {
		this.initFuncs[i](childs[i]);
	}
};

FlowerUI.Pages = Pages;

})();
