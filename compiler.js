(function() {

function newInstance(klass, arg0) {
	var names = klass.split('.');
	var f = window;
	for (var i = 0; i < names.length; i++) {
		f = f[names[i]];
		Assert.present(f, function() { return names.slice(0, i + 1).join('.'); });
	}
	return new f(arg0);
}

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
		// obj = eval('new ' + klass + '(element)'); // eval
		obj = newInstance(klass, element);
	}
	if (name && parentObj) {
		obj = obj || element;
		if (Strings.endsWith(name, '[]')) { // 数组
			name = Strings.removeEnd(name, '[]');
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
	return obj;
}

function compileAll(element) {
	var obj = {};
	compileElement(obj, element || document.body);
	return obj;
}

FlowerUI.compileElement = compileElement;
FlowerUI.compileAll = compileAll;

})();
