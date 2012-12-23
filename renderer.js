(function () {

function Renderer(elem) {
	this.render_func = null;
	this.elem = elem;
	this.tmpl = elem.outerHTML;
}

Renderer.prototype.repaint = function(data) {
	Assert.present(this.render_func, 'must set render_func before repaint');
	var div = document.createElement('div');
	div.innerHTML = this.render_func(this.tmpl, data);
	var child = div.removeChild(div.children[0]);
	this.elem.parentNode.replaceChild(child, this.elem);
	this.elem = child;
};

FlowerUI.Renderer = Renderer;

})();
