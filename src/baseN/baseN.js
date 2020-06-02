/**
 * @author tacowhisperer
 */
 
/**
 * Converts the input integer into the string represented by the symbology provided.
 * @param {number} num The number to be converted.
 * @param {Array} base Array from least to most significant symbol for the number whose base should be changed.
 * @param {number} digits The number of digits to display as the output. Default 0 means as few as necessary.
 * @return {string} The input number represented with the provided symbology.
 */
function baseN(num, base, digits = 0) {
	const N = base.length;
	if (base.length == 0)
		return '';

	// Base case of no digit carryover
	if (num < base.length)
		return base[0].repeat(Math.max(digits - 1, 0)) + base[num];

	let r = num;

	// Container string for the output
	let s = '';

	// Largest power of base N that fits in num
	let x0 = Math.floor(Math.log(r) / Math.log(N));

	// Continue calculating s until there is no remainder left to calculate
	for (let x = x0; x >= 0; x--) {
		const p = Math.pow(N, x);
		let i = Math.floor(r / p);

		s += base[i];
		r -= i * p;
	}

	return base[0].repeat(Math.max(digits - s.length, 0)) + s;
}

// Export the factory for access in other modules.
exports.baseN = baseN;
