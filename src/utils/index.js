export const shallowEquals = (arr1, arr2) => {
	if (!arr1 || !arr2 || arr1.length !== arr2.length) {
		return false;
	}

	let equals = true;

	for (var i = 0; i < arr1.length; i++) {
		if (arr1[i] !== arr2[i]) {
			equals = false;
		}
	}

	return equals;
};

export const arrayDiff = (arr1, arr2) => {
	return arr1.map((a, i) => (a - arr2[i]))
};
