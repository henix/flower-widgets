(function() {

#inline FlowerUI

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
