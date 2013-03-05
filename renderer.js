(function () {

function Renderer(elem) {
	this.render_func = null;
	this.elem = elem;
	this.tmpl = elem.outerHTML;
}

Renderer.prototype.repaint = function(data) {
	Assert.present(this.render_func, 'must set render_func before repaint');
	var tagName = this.elem.tagName.toLowerCase();
	var parentTag;
	if (tagName == 'tr') {
		parentTag = 'table';
	} else {
		parentTag = 'div';
	}
	var div = document.createElement(parentTag);
	div.innerHTML = this.render_func(this.tmpl, data);
	var child = div.getElementsByTagName(tagName)[0];
	Assert.present(child, 'Can\'t find tag in render result: ' + tagName);
	child.parentNode.removeChild(child);
	this.elem.parentNode.replaceChild(child, this.elem);
	this.elem = child;
};

FlowerUI.Renderer = Renderer;

})();
