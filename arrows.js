(function() {

function Arrows(element) {
	/**
	 * container
	 */
	this.cont = element;
}

var browserPrefix = ['-webkit-', '-moz-', '-o-', '-ms-', ''];

function genTransformRotate(deg) {
	return browserPrefix.map(function(p){return p + 'transform:rotate(' + deg + 'deg);';}).join('');
}

function genMatrixFilter(deg) {
	var r = deg * Math.PI / 180.0;
	var str = 'progid:DXImageTransform.Microsoft.Matrix(M11=' + Math.cos(r) + ', M12=' + (-Math.sin(r)) + ', M21=' + Math.sin(r) + ', M22=' + Math.cos(r) + ', SizingMethod=\'auto expand\')';
	return '-ms-filter:' + str + ';' + 'filter:' + str + ';';
}

Arrows.prototype.drawArrow = function(x1, y1, x2, y2, color) {
	var ie = Flower.ieVersion();

	var div = document.createElement('div');
	div.className = 'flower-arrow-cont';
	if (color) {
		div.innerHTML = '<div class="flower-arrow" style="border-top-color:' + color + '"><div class="arrow-head" style="border-left-color:' + color + '">' + (ie == 6 ? '&#x25B6;' : '') + '</div></div>';
	} else {
		div.innerHTML = '<div class="flower-arrow"><div class="arrow-head">' + (ie == 6 ? '&#x25B6;' : '') + '</div></div>';
	}

	var l = Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
	var deg = Math.atan((y2-y1)/(x2-x1)) / Math.PI * 180.0;
	if (x1 > x2) {
		deg += 180;
	}

	// IE support CSS3 transform since IE9, for IE6-8, use Matrix filter instead
	var fleft = x1;
	var ftop = y1;
	if (ie && ie < 9) {
		fleft = Math.min(x1, x2) - 3;
		if (ie == 6) {
			fleft -= 3;
		}
		ftop = Math.min(y1, y2) + 3;
	}
	div.style.cssText = 'width:' + l + 'px;left:' + fleft + 'px;top:' + ftop + 'px;' + ((ie && (ie < 9)) ? genMatrixFilter(deg) : genTransformRotate(deg));

	this.cont.appendChild(div);

	return div;
};

var VFACTOR = {'t':0,'c':0.5,'b':1};
var HFACTOR = {'l':0,'c':0.5,'r':1};

function getHOffset(c) {
	Assert.present(HFACTOR[c], 'Invalid horizontal position: "' + c + '", must be one of [lcr]');
	return HFACTOR[c];
}

function getVOffset(c) {
	Assert.present(VFACTOR[c], 'Invalid vertical position: "' + c + '", must be one of [tcb]');
	return VFACTOR[c];
}

function getFactors(str) {
	if (str.length == 2) {
		return {h: getHOffset(str.charAt(1)), v: getVOffset(str.charAt(0))};
	} else {
		if (VFACTOR.hasOwnProperty(str)) {
			return {h: getHOffset('c'), v: getVOffset(str)};
		} else if (HFACTOR.hasOwnProperty(str)) {
			return {h: getHOffset(str), v: getVOffset('c')};
		} else {
			Assert.fail('Invalid position: ' + str);
		}
	}
}

/**
 * pos1 and pos2 could be:
 * * c - center
 * * l - left (center)
 * * r - right
 * * t - top
 * * b - bottom
 * * br - bottom right
 * * ...
 */
Arrows.prototype.arrow = function(elem1, pos1, elem2, pos2, color) {
	Assert.between(pos1.length, 1, 2, pos1);
	Assert.between(pos2.length, 1, 2, pos2);

	pos1 = pos1.toLowerCase();
	pos2 = pos2.toLowerCase();

	var pt1 = Flower.domer.offset(elem1);
	var pt2 = Flower.domer.offset(elem2);

	var factor1 = getFactors(pos1);
	var factor2 = getFactors(pos2);

	return this.drawArrow(pt1.left + elem1.offsetWidth * factor1.h, pt1.top + elem1.offsetHeight * factor1.v, pt2.left + elem2.offsetWidth * factor2.h, pt2.top + elem2.offsetHeight * factor2.v, color);
};

Arrows.prototype.clear = function() {
	this.cont.innerHTML = '';
};

FlowerUI.Arrows = Arrows;

})();
