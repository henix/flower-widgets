(function() {

;
var Flower = {};
;
Flower.csser = {
	prependSheet: function(ruleString) {
		this.insertSheet(ruleString, true);
	},
	insertSheet: function(ruleString, atstart) {
		var head = document.getElementsByTagName('head')[0];
		var style = document.createElement('style');
		var rules = document.createTextNode(ruleString);
		style.type = 'text/css';
		if(style.styleSheet) {
			style.styleSheet.cssText = rules.nodeValue;
		} else {
			style.appendChild(rules);
		}
		if (atstart) {
			head.insertBefore(style, head.children[0]);
		} else {
			head.appendChild(style);
		}
	},
	addClass: function(e, name) {
		if (!this.hasClass(e, name)) {
			e.className += (' ' + name);
		}
	},
	removeClass: function(e, name) {
		e.className = e.className.replace(new RegExp('(^|\\s+)' + name + '(?=\\s|$)', 'gm'), ''); // zero-width assertion
	},
	hasClass: function(e, name) {
		/* NOTE: class names are case sensitive: http://devedge-temp.mozilla.org/viewsource/2001/css-class-id/ */
		return e.className.match(new RegExp('(^|\\s)' + name + '(\\s|$)', 'gm')) !== null;
	}
};
;
Flower.eventer = {};
;
if (document.body.addEventListener) {
	Flower.eventer.addEventListener = function(target, eventType, handler) {
		target.addEventListener(eventType, handler, false);
	};
	Flower.eventer.removeEventListener = function(target, eventType, handler) {
		target.removeEventListener(eventType, handler);
	};
} else {
	Flower.eventer.addEventListener = function(target, eventType, handler) {
		target.attachEvent('on' + eventType, handler);
	};
	Flower.eventer.removeEventListener = function(target, eventType, handler) {
		target.detachEvent('on' + eventType, handler);
	};
}
;
Flower.ie = {};
;
/**
 * For IE6 doesn't support :hover on any element
 */
Flower.ie.hoverClass = function(elem, className) {
	Assert.present(elem, 'missing elem in ie.hoverClass()');
	Assert.present(className, 'missing className in ie.hoverClass()');

	Flower.eventer.addEventListener(elem, 'mouseenter', function() {
		Flower.csser.addClass(elem, className);
	});

	Flower.eventer.addEventListener(elem, 'mouseleave', function() {
		Flower.csser.removeClass(elem, className);
	});
};
;
function AssertError(msg) {
	this.message = msg;
}
AssertError.prototype = new Error();
AssertError.prototype.constructor = AssertError;
AssertError.prototype.name = 'AssertError';

var Assert = {
	fail: function(msg) {
		throw new AssertError(msg);
	}
};
;
Assert.notEmpty = function(str, msg) {
	if (str.length === 0) {
		msg = msg ? ': ' + msg : '';
		Assert.fail('string is empty' + msg);
	}
};
;
Assert.equalsIgnoreCase = function(actuall, expected, msg) {
	if (actuall.toLowerCase() !== expected.toLowerCase()) {
		msg = msg ? ': ' + msg : '';
		Assert.fail(actuall + ' !=(ignore case) ' + expected + ' (expected)' + msg);
	}
};
;
/**
 * Could be:
 * * undefined: not deteced yet
 * * null: detected, not IE
 * * number: ie version
 */
Flower.ie.ieVersion = undefined;
Flower.ie.version = function() {
	if (this.ieVersion !== undefined) {
		return this.ieVersion; // cached
	}
	var v = 3;
	var div = document.createElement('div');
	var ins = div.getElementsByTagName('i');
	do {
		v++;
		div.innerHTML = '<!--[if gt IE ' + v + ']><i></i><![endif]-->';
	} while (ins[0]);
	this.ieVersion = v > 4 ? v : null;
	return this.ieVersion;
};
;
/**
 * csv.js
 *
 * https://github.com/henix/csv.js
 *
 * License: MIT License
 */
(function() {

var CSV = {
	DefaultOptions: {
		delim: ',',
		quote: '"',
		rowdelim: '\n'
	}
};

function CSVSyntaxError(msg) {
	this.message = msg;
	if (Error.captureStackTrace) {
		Error.captureStackTrace(this, arguments.callee);
	}
}
CSVSyntaxError.prototype = new Error();
CSVSyntaxError.prototype.constructor = CSVSyntaxError;
CSVSyntaxError.prototype.name = 'CSVSyntaxError';

function CSVParser(str, options) {
	this.str = str;
	this.options = CSV.DefaultOptions;
	if (options) {
		options.delim = options.delim || CSV.DefaultOptions.delim;
		options.quote = options.quote || CSV.DefaultOptions.quote;
		options.rowdelim = options.rowdelim || CSV.DefaultOptions.rowdelim;
		this.options = options;
	}

	this.pos = 0;
	this.endpos = str.length;

	this.lineNo = 1;
}

CSVParser.prototype.next = function(s) {
	if (this.pos < this.endpos) {
		var len = s.length;
		if (this.str.substring(this.pos, this.pos + len) == s) {
			this.pos += len;
			return true;
		}
	}
	return false;
};

CSVParser.prototype.ahead = function(s) {
	if (this.pos < this.endpos) {
		var len = s.length;
		if (this.str.substring(this.pos, this.pos + len) == s) {
			return true;
		}
	}
	return false;
};

CSVParser.prototype.nextAny = function() {
	if (this.pos <= this.endpos) {
		this.pos++;
		return true;
	}
	return false;
};

CSVParser.prototype.charInQuote = function(s) {
	var mark = this.pos;
	if (!this.ahead(this.options.quote)) {
		if (this.nextAny()) {
			if (this.str.charAt(this.pos - 1) == '\n') {
				this.lineNo++;
			}
			return true;
		}
	} else if (this.next(this.options.quote + this.options.quote)) {
		return true;
	}
	this.pos = mark;
	return false;
};

CSVParser.prototype.quotedField = function() {
	var mark = this.pos;
	if (!this.next(this.options.quote)) { this.pos = mark; return null; }
	var begin = this.pos;
	while (this.charInQuote()) ;
	if (!this.next(this.options.quote)) { this.pos = mark; return null; }
	return this.str.substring(begin, this.pos - 1).replace(this.options.quote + this.options.quote, this.options.quote);
};

CSVParser.prototype.normalField = function() {
	var begin = this.pos;
	while (!(this.ahead(this.options.delim) || this.ahead(this.options.rowdelim)) && this.nextAny()) ;
	return this.str.substring(begin, this.pos);
};

CSVParser.prototype.nextField = function() {
	var tmp = this.quotedField();
	if (tmp !== null) return tmp;
	return this.normalField();
};

CSVParser.prototype.nextRow_0 = function() {
	var mark = this.pos;
	if (!this.next(this.options.delim)) { this.pos = mark; return null; }
	var tmp = this.nextField();
	if (tmp === null) { this.pos = mark; return null; }
	return tmp;
};

/**
 * @return String[]
 * @throws CSVSyntaxError
 */
CSVParser.prototype.nextRow = function() {
	var ar = [];
	var mark = this.pos;
	var tmp = this.nextField();
	if (tmp === null) { this.pos = mark; return null; }
	ar.push(tmp);
	tmp = this.nextRow_0();
	while (tmp !== null) {
		ar.push(tmp);
		tmp = this.nextRow_0();
	}
	if (!(this.next(this.options.rowdelim) || !this.ahead(''))) { throw new CSV.CSVSyntaxError('line ' + this.lineNo + ': ' + this.str.substring(Math.max(this.pos - 5, 0), this.pos + 5)); this.pos = mark; return null; }
	if (this.str.charAt(this.pos - 1) == '\n') {
		this.lineNo++;
	}
	return ar;
};

/**
 * @return boolean
 */
CSVParser.prototype.hasNext = function() {
	return this.ahead('');
};

CSV.CSVSyntaxError = CSVSyntaxError;
CSV.CSVParser = CSVParser;

/**
 * @return String[] or null
 */
CSV.parseOne = function(str, options) {
	var parser = new CSV.CSVParser(str, options);
	if (parser.hasNext()) {
		return parser.nextRow();
	}
	return null;
};

/**
 * @return String[][]
 */
CSV.parse = function(str, options) {
	var parser = new CSV.CSVParser(str, options);
	var all = [];
	while (parser.hasNext()) {
		var ar = parser.nextRow();
		all.push(ar);
	}
	return all;
};

/**
 * @param rows String[][]
 * @param colnames String[]
 * @return Object[]
 */
CSV.bindColumns = function(rows, colnames) {
	if (!colnames) {
		colnames = rows.shift();
	}
	return rows.map(function(row) {
		var obj = {};
		for (var i = 0; i < row.length; i++) {
			obj[colnames[i]] = row[i];
		}
		return obj;
	});
};

/**
 * https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/map
 */
if (!Array.prototype.map) {
	Array.prototype.map = function(callback, thisArg) {
		var T, A, k;
		if (this === null) {
			throw new TypeError(" this is null or not defined");
		}
		var O = Object(this);
		var len = O.length >>> 0;
		if ({}.toString.call(callback) != "[object Function]") {
			throw new TypeError(callback + " is not a function");
		}
		if (thisArg) {
			T = thisArg;
		}
		A = new Array(len);
		k = 0;
		while(k < len) {
			var kValue, mappedValue;
			if (k in O) {
				kValue = O[ k ];
				mappedValue = callback.call(T, kValue, k, O);
				A[ k ] = mappedValue;
			}
			k++;
		}
		return A;
	};
}

// exports
if (typeof exports !== 'undefined') {
	if (typeof module !== 'undefined' && module.exports) {
		exports = module.exports = CSV;
	}
} else if (typeof define === 'function') {
	define(function () {
		return CSV;
	});
} else {
	window.CSV = CSV;
}

})();
;
var FlowerUI = {};
;
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
;
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
;
/**
 * Array.map
 *
 * https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/map
 */
// Production steps of ECMA-262, Edition 5, 15.4.4.19
// Reference: http://es5.github.com/#x15.4.4.19
if (!Array.prototype.map) {
	Array.prototype.map = function(callback, thisArg) {

		var T, A, k;

		if (this === null) {
			throw new TypeError(" this is null or not defined");
		}

		// 1. Let O be the result of calling ToObject passing the |this| value as the argument.
		var O = Object(this);

		// 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
		// 3. Let len be ToUint32(lenValue).
		var len = O.length >>> 0;

		// 4. If IsCallable(callback) is false, throw a TypeError exception.
		// See: http://es5.github.com/#x9.11
		if ({}.toString.call(callback) != "[object Function]") {
			throw new TypeError(callback + " is not a function");
		}

		// 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
		if (thisArg) {
			T = thisArg;
		}

		// 6. Let A be a new array created as if by the expression new Array(len) where Array is
		// the standard built-in constructor with that name and len is the value of len.
		A = new Array(len);

		// 7. Let k be 0
		k = 0;

		// 8. Repeat, while k < len
		while(k < len) {

			var kValue, mappedValue;

			// a. Let Pk be ToString(k).
			//   This is implicit for LHS operands of the in operator
			// b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
			//   This step can be combined with c
			// c. If kPresent is true, then
			if (k in O) {

				// i. Let kValue be the result of calling the Get internal method of O with argument Pk.
				kValue = O[ k ];

				// ii. Let mappedValue be the result of calling the Call internal method of callback
				// with T as the this value and argument list containing kValue, k, and O.
				mappedValue = callback.call(T, kValue, k, O);

				// iii. Call the DefineOwnProperty internal method of A with arguments
				// Pk, Property Descriptor {Value: mappedValue, : true, Enumerable: true, Configurable: true},
				// and false.

				// In browsers that support Object.defineProperty, use the following:
				// Object.defineProperty(A, Pk, { value: mappedValue, writable: true, enumerable: true, configurable: true });

				// For best browser support, use the following:
				A[ k ] = mappedValue;
			}
			// d. Increase k by 1.
			k++;
		}

		// 9. return A
		return A;
	};
}
;
Flower.domer = {
	getText: function(node) {
		return node.textContent || node.innerText || '';
	},
	hasAttribute: function(element, name) {
		if (element.hasAttribute) {
			return element.hasAttribute(name);
		} else { // IE 6 7
			return element.getAttribute(name) !== null;
		}
	},
	offset: function (obj) {
		if (typeof obj.getBoundingClientRect !== "undefined") {
			// https://github.com/jquery/jquery/blob/master/src/offset.js
			var rect = obj.getBoundingClientRect();
			var docElem = document.documentElement;
			return {
				left: rect.left + (window.pageXOffset || docElem.scrollLeft) - (docElem.clientLeft || 0),
				top: rect.top + (window.pageYOffset || docElem.scrollTop) - (docElem.clientTop || 0)
			};
		} else {
			// http://www.quirksmode.org/js/findpos.html
			var curleft = 0;
			var curtop = 0;
			if (obj.offsetParent) {
				do {
					curleft += obj.offsetLeft;
					curtop += obj.offsetTop;
					obj = obj.offsetParent;
				} while(obj);
			}
			return {'left':curleft,'top':curtop};
		}
	},
	viewWidth: function() {
		return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth || 0;
	},
	viewHeight: function() {
		return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 0;
	}
};
;
Assert.between = function(actuall, start, end, msg) {
	if ((actuall < start) || (actuall > end)) {
		msg = msg ? ': ' + msg : '';
		Assert.fail(actuall + ' is not between [' + start + ',' + end + ']' + msg);
	}
};
;
Assert.present = function(obj, msg) {
	if ((typeof obj === 'undefined') || (obj === null)) {
		msg = msg ? ': ' + msg : '';
		Assert.fail('object null or undefined' + msg);
	}
};
;
(function() {

var detectIE = function() {
	if (detectIE.ieVersion !== undefined) {
		return detectIE.ieVersion; // cached
	}
	var v = 3;
	var div = document.createElement('div');
	var ins = div.getElementsByTagName('i');

	do {
		v++;
		div.innerHTML = '<!--[if gt IE ' + v + ']><i></i><![endif]-->';
	} while(ins[0]);
	detectIE.ieVersion = v > 4 ? v : null;
	return detectIE.ieVersion;
};

Flower.ieVersion = detectIE;

})();
;
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
;
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
;
Assert.isTrue = function(cond, msg) {
	if (cond !== true) {
		msg = msg ? ': ' + msg : '';
		Assert.fail('condition ' + cond + ' is not true' + msg);
	}
};
;
Flower.string = {
	/* see http://stackoverflow.com/questions/646628/javascript-startswith */
	/* benchmark: http://jsperf.com/js-startswith/6 */
	startsWith: function(str, prefix) {
		return str.lastIndexOf(prefix, 0) === 0;
	},
	endsWith: function(str, suffix) {
		return str.indexOf(suffix, str.length - suffix.length) !== -1;
	},
	removeEnd: function(str, suffix) {
		if (this.endsWith(str, suffix)) {
			return str.substring(0, str.length - suffix.length);
		}
		return str;
	}
};
;
Assert.notPresent = function(obj, msg) {
	if ((typeof obj !== 'undefined') && (obj !== null)) {
		msg = msg ? ': ' + msg : '';
		Assert.fail('object is present' + msg);
	}
};
;
(function() {

/**
 * 处理具有 data-name 或 data-class 的 element：
 *
 * 1. 如果有 data-class ，则值为 new class(element)
 * 2. 否则值为此 element
 *
 * 然后将值用 data-name 保存到最近的具有 data-class 的祖先
 *
 * 也允许只有 data-class 但没有名字的匿名对象
 */
function compileElement(parentObj, element) {
	var name = element.getAttribute('data-name');
	var klass = element.getAttribute('data-class');
	var obj = null;
	if (klass) {
		obj = eval('new ' + klass + '(element)'); // FIXME: eval
	}
	if (name && parentObj) {
		obj = obj || element;
		if (Flower.string.endsWith(name, '[]')) { // 数组
			name = Flower.string.removeEnd(name, '[]');
			Assert.present(parentObj[name], 'parentObj.' + name);
			parentObj[name].push(obj);
		} else {
			Assert.notPresent(parentObj[name], 'name conflict: ' + name);
			parentObj[name] = obj;
		}
	}
	var childs = element.children;
	var len = childs.length;
	var nextParent = klass ? obj : parentObj;
	for (var i = 0; i < len; i++) {
		compileElement(nextParent, childs[i]);
	}
	if (klass && obj && typeof obj.init === 'function') {
		obj.init(); // trigger init event
	}
	if (klass) {
		return obj;
	}
}

/**
 * 编译一个具有 data-class 的 element（不一定有 data-name）
 */
function compileUI(element) {
	Assert.isTrue(Flower.domer.hasAttribute(element, 'data-class'), 'element must have data-class attribute');
	// Flower.assert.isFalse(Flower.domer.hasAttribute(element, 'data-name'), 'element must not have data-name attribute');
	/*var rootObj = eval('new ' + element.getAttribute('data-class') + '(element)'); // FIXME: eval
	for (var i = 0; i < element.children.length; i++) {
		compileElement(rootObj, element.children[i]);
	}
	if (typeof rootObj.init === 'function') {
		rootObj.init(); // trigger init event
	}
	return rootObj;*/
	return compileElement(null, element);
}

function compileAll(element) {
	var obj = {};
	compileElement(obj, element || document.body);
	return obj;
}

FlowerUI.compileAll = compileAll;

})();
;
(function() {
function Template(elem) {
	this.content = elem.innerHTML;
}
FlowerUI.Template = Template;
})();
;
Flower.eventer.preventDefault = function(e) {
	if (typeof e.preventDefault === 'function') {
		e.preventDefault();
		e.stopPropagation();
	} else {
		e.returnValue = false;
		e.cancelBubble = true;
	}
};
;
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
			Flower.eventer.addEventListener(closeBut, 'click', function(e) {
				e = e || window.event;
				this1.close.call(this1);
				Flower.eventer.preventDefault(e);
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
	this.elem.style.left = ((Flower.domer.viewWidth() - (this.width || 200)) / 2) + 'px';
	this.elem.style.top = ((Flower.domer.viewHeight() - (this.height || 200)) / 2) + 'px';
	this.elem.style.display = 'block';
};

Dialog.prototype.hide = function() {
	this.elem.style.display = 'none';
};

// TODO: draggable

FlowerUI.Dialog = Dialog;

})();
;

if (typeof exports !== 'undefined') {
	if (typeof module !== 'undefined' && module.exports) {
		exports = module.exports = FlowerUI;
	}
} else if (typeof define === 'function') {
	define(function () {
		return FlowerUI;
	});
} else {
	window.FlowerUI = FlowerUI;
}

})();
