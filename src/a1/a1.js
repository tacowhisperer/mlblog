const baseN = require('./../baseN/baseN').baseN;

// ['A', 'B', 'C', ..., 'Z']
const BASE = '.'.repeat(26).split('').map((x, i) => String.fromCharCode(65 + i));

/**
 * Enum-like object that denotes the different A1 notation modes. It determines which aspects of the output should
 * be relative and which should be absolute.
 */
const MODE = {
	RELATIVE: 0,
	ABSOLUTE_COL: 1,
	ABSOLUTE_ROW: 2,
	ABSOLUTE: 3
};

/**
 * Converts the incoming column and row index values (0-based) into the equivalent values in A1 notation.
 * @param {number} colIdx The column index
 * @param {number} rowIdx The row index
 * @param {string} page Optional. The page name to prepend to the output A1 notation.
 * @param {number} mode Optional. The mode in which the A1 columns/rows should be calculated (relative or absolute).
 */
function toA1(colIdx, rowIdx, page = null, mode = MODE.RELATIVE) {
	const PAGE = page == null ? '' : `${page}!`;
	switch (mode) {
		case MODE.ABSOLUTE_COL:
			return `${PAGE}$${toA1Column(colIdx)}${rowIdx + 1}`;
		case MODE.ABSOLUTE_ROW:
			return `${PAGE}${toA1Column(colIdx)}$${rowIdx + 1}`;
		case MODE.ABSOLUTE:
			return `${PAGE}$${toA1Column(colIdx)}$${rowIdx + 1}`;
		default:
			return `${PAGE}${toA1Column(colIdx)}${rowIdx + 1}`;
	}
	
}

/**
 * Helper function for toA1. It handles the conversion of a column 0-based index into its A1 letter.
 * @param {number} idx The index of a column.
 * @returns {string} The A1 equivalent of the column index.
 */
function toA1Column(idx) {
	let offset = 0;
	let digits = 1;

	for (; idx - offset >= 0; digits++) {
		offset += Math.pow(BASE.length, digits);
	}

	// A1 notation offset and number of digits
	const DIGITS = digits - 1;
	const OFFSET = offset - Math.pow(BASE.length, DIGITS);

	return baseN(idx - OFFSET, BASE, DIGITS);
}

// Export the mode object for enum-like options for A1 mode notation.
exports.MODE = MODE;

// Export the function for access in other modules.
exports.toA1 = toA1;
