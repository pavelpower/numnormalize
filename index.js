
/**
 * Linear normalization of data for learning a neural network
 * the data of one parameter is the STRING or COLUMN (param isCol) of the matrix
 *
 * @param data {Array<Array{Number}>} - matrix of numbers
 * @param maxmin {Array<{ max: Number, min: Number}>} - array of object with max min properties for each row data
 * default: normalizeInput
 */
function linearNormalize({ data, maxmin }) {
    const callback = ({ max, min, el }) => (el - min)/(max - min);

    return enumeration(data, maxmin, callback);
}

/**
 * Linear denormalization of data for learning a neural network
 * the data of one parameter is the STRING or COLUMN (param isCol) of the matrix
 *
 * @param data {Array<Array{Number}>} - matrix of numbers
 * @param maxmin {Array<{ max: Number, min: Number}>} - array of object with max min properties for each row data
 */
function linearDeNormalize({ data, maxmin }) {
    const callback = ({ max, min, el }) => min + el * (max - min);

    return enumeration(data, maxmin, callback);
}

/**
 * Non-linear normalization of data for learning a neural network
 * the data of one parameter is the STRING or COLUMN (param isCol) of the matrix
 *
 * The parameter "a" affects the degree of non-linearity of the variable change in the normalized interval.
 * In addition, when using the values a < 0.5, there is no need to additionally
 * specify the width of the extrapolation corridor.
 *
 * @function nonLinear.normalize
 * @param data {Array<Array{Number}>} - matrix of numbers
 * @param maxmin {Array<{ max: Number, min: Number}>} - array of object with max min properties for each row data
 * @param a {number} - parameter determining the degree of nonlinearity, default: 1
 */
function nonLinearNormalize({ data, maxmin, a = 1 }) {
    const callback = ({ max, min, el }) => 1 / (Math.exp(a * ((max - min) / 2) - a * el) + 1);

    return enumeration(data, maxmin, callback);
}

/**
 * Non-linear denormalization of data for learning a neural network
 * the data of one parameter is the STRING or COLUMN (param isCol) of the matrix
 *
 * The parameter "a" affects the degree of non-linearity of the variable change in the normalized interval.
 * In addition, when using the values a < 0.5, there is no need to additionally
 * specify the width of the extrapolation corridor.
 *
 * @param data {Array<Array{Number}>} - matrix of numbers
 * @param maxmin {Array<{ max: Number, min: Number}>} - array of object with max min properties for each row data
 * @param a {number} - parameter determining the degree of nonlinearity, default: 1
 */
function nonLinearDeNormalize({ data, maxmin, a = 1 }) {
    const callback = ({ max, min, el }) => (max - min) / 2 - (1/a) * Math.log(1/el -1);

    return enumeration(data, maxmin, callback);
}

const transpose = m => m[0].map((x,i) => m.map(x => x[i]));

/**
 * Enumeration of data
 *
 * @private
 * @param data {Array<Array{Number}>} - matrix of numbers
 * @param maxmin {Array<{ max: Number, min: Number}>|undefined} - array of object with max min properties for each row data
 * @param callback {function} - callback from circle by row Or col (the isCol parameter affects)
 */
function enumeration(data, maxmin, callback) {
    const rowMax = data.length - 1;
    const colMax = data[0].length - 1;
    const answer = generateMatrix(rowMax, colMax);

    let r = rowMax;
    while(r >= 0) {
        c = colMax;
        while(c >= 0) {
            answer[r][c] = callback({ ...maxmin[r], el: data[r][c] });
            c--;
        }
        r--;
    }

    return answer;
}

/**
 * Generate new matrix with 0 in value
 * @param rows {Number}
 * @param cols {Number}
 * @returns {Array<Array<Number>>}
 */
function generateMatrix(rows, cols) {
    const matrix = [];

    let y = rows;
    for (; y >= 0; y--) {
        matrix[y] = [];
        let x = cols;
        for (;x >= 0; x--) {
            matrix[y][x] = 0;
        }
    }
    return matrix;
}

/**
 * Get array of max/min values for row of Array
 * @param data
 * @returns {Array<{ max: Number, min: Number }>}
 */
function getMaxMin(data) {
    const rowMax = data.length - 1;
    const colMax = data[0].length - 1;
    const answer = new Array(rowMax);

    let r = rowMax;
    while(r >= 0) {
        let max;
        let min;

        // find max & min elements
        let c = colMax;
        while(c >= 0) {
            let el = data[r][c];
            max = (max !== undefined && el < max) ? max : el;
            min = (min !== undefined && el > min) ? min : el;
            c--;
        }

        answer[r] = { max, min };
        r--;
    }
    return answer;
}

module.exports = {
    linearNormalize,
    linearDeNormalize,
    nonLinearNormalize,
    nonLinearDeNormalize,
    getMaxMin,
    transpose
};