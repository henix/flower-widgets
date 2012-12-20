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
