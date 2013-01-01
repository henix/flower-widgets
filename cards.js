(function() {

/**
 * Like java.awt.CardLayout, a pile of elements, but only one at a time is displayed
 */
function Cards(elem, initIndex) {
	this.elem = elem;
	this.cur = initIndex || elem.getAttribute('data-init') || 0;
	this.origDisplay = [];
	this.afterFirstSwitchFuncs = [];
	this.switched = [];
	for (var i = 0; i < elem.children.length; i++) {
		this.origDisplay[i] = elem.children[i].style.display;
		this.afterFirstSwitch[i] = null;
		this.switched[i] = false;
	}
}
Cards.prototype.afterFirstSwitch = function(i, func) {
	this.afterFirstSwitchFuncs[i] = func;
};
Cards.prototype.switchTo = function(i) {
	var childs = this.elem.children;
	var len = childs.length;
	if (i < 0 || i >= len) {
		throw new RangeError('switchTo(' + i + ') out of range [0, ' + len + ')');
	}
	for (var j = 0; j < len; j++) {
		childs[j].style.display = ((j != i) ? 'none' : this.origDisplay[j]);
	}
	if (!this.switched[i]) {
		this.switched[i] = true;
		if (this.afterFirstSwitchFuncs[i]) {
			this.afterFirstSwitchFuncs[i].call(this, childs[i]);
		}
	}
};
Cards.prototype.next = function() {
	var len = this.elem.children.length;
	this.cur = (this.cur + 1) % len;
	this.switchTo(this.cur);
};
Cards.prototype.previous = function() {
	var len = this.elem.children.length;
	this.cur--;
	if (this.cur < 0) {
		this.cur += len;
	}
	this.switchTo(this.cur);
};
Cards.prototype.init = function() {
	var childs = this.elem.children;
	for (var i = 0; i < childs.length; i++) {
		if (i != this.cur) {
			childs[i].style.display = 'none';
		}
	}
};

FlowerUI.Cards = Cards;

})();
