(function() {

function Combobox(elem) {
	Assert.equalsIgnoreCase(elem.tagName, 'input', 'Combobox must be used with an input');
	this.input = elem;

	Assert.notEmpty(elem.value, 'You must fill input\'s value with CSV format value list');
	var values = CSV.parseOne(elem.value);
	elem.value = '';
	var ul = document.createElement('ul');
	for (var i = 0; i < values.length; i++) {
		var li = document.createElement('li');
		li.innerHTML = values[i];
		ul.appendChild(li);
	}
	this.datalist = ul;
}
Combobox.prototype.showOptions = function() {
	this.datalist.style.display = '';
};
Combobox.prototype.hideOptions = function() {
	this.datalist.style.display = 'none';
};
Combobox.prototype.init = function() {
	var this1 = this;
	(function() { // create a container div and replace
		var div = document.createElement('div');
		div.className = 'flower-combobox';
		var input = this1.input.cloneNode(false);
		div.appendChild(input);
		div.appendChild(this1.datalist);
		this1.input.parentNode.replaceChild(div, this1.input);
		this1.input = input;
		this1.elem = div;
	})();
	this.hideOptions();
	Flower.eventer.addEventListener(this.input, 'focus', function(e) {
		this1.showOptions();
	});
	Flower.eventer.addEventListener(this.input, 'blur', function(e) {
		setTimeout(function(){this1.hideOptions();}, 100); // delay, otherwise can't trigger click
	});
	Flower.eventer.addEventListener(this.datalist, 'click', function(e) {
		e = e || window.event;
		var target = e.target || e.srcElement;
		if (target.tagName.toUpperCase() == 'LI') {
			this1.input.value = target.innerHTML;
		}
		this1.hideOptions(); // in IE, click don't trigger blur
	});

	var ie = Flower.ie.version();
	if (ie && ie < 7) {
		for (var i = 0; i < this.datalist.children.length; i++) {
			Flower.ie.hoverClass(this.datalist.children[i], 'flower-hover');
		}
	}
};

FlowerUI.Combobox = Combobox;

})();
