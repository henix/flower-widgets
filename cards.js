(function() {

/**
 * Like java.awt.CardLayout, a pile of elements, but only one at a time is displayed
 */
function Cards(elem, initIndex) {
	this.elem = elem;
	this.cur = initIndex || elem.getAttribute('data-init') || 0;
	this.origDisplay = [];
	for (var i = 0; i < elem.children.length; i++) {
		this.origDisplay[i] = elem.children[i].style.display;
		if (i != this.cur) {
			elem.children[i].style.display = 'none';
		}
	}
}
Cards.prototype.switchTo = function(i) {
	var childs = this.elem.children;
	var len = childs.length;
	if (i < 0 || i >= len) {
		throw new RangeError('switchTo(' + i + ') out of range [0, ' + len + ')');
	}
	for (var j = 0; j < len; j++) {
		childs[j].style.display = ((j != i) ? 'none' : this.origDisplay[j]);
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

FlowerUI.Cards = Cards;

})();
