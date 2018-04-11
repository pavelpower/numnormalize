
/**
 * Linear normalization of data for learning a neural network
 * the data of one parameter is the STRING or COLUMN (param isCol) of the matrix
 *
 * @function nonLinear.normalize
 * @param data {Array<Array{Number}>} - matrix of numbers
 * @param isCol {boolean} - Normalization by row (false) or by column (true). default by row (isCol = false)
 * default: normalizeInput
 */
function linearNormalize({ data, isCol = false }) {
    const callback = ({ max, min, vector, jMax }) => {
        let j = jMax;
        while(j >= 0) {
            vector[j] = (vector[j] - min)/(max - min);
            j--;
        }
    };

    enumeration(data, isCol, callback);

    return data;
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
 * @param a {number} - parameter determining the degree of nonlinearity, default: 1
 * @param isCol {boolean} - Normalization by row (false) or by column (true). default by row (isCol = false)
 * default: normalizeInput
 */
function nonLinearNormalize({ data, a = 1, isCol = false }) {
    const callback = ({ max, min, vector, jMax }) => {
        let j = jMax;
        let middle = (max - min) / 2;
        while(j >= 0) {
            vector[j] = 1 / (Math.exp(a * middle - a * vector[j]) + 1);
            j--;
        }
    };

    enumeration(data, isCol, callback);

    return data;
}


/**
 * Enumeration of data
 *
 * @private
 * @param data {Array<Array{Number}>} - matrix of numbers
 * @param isCol {boolean} - Normalization by row (false) or by column (true). default by row (isCol = false)
 * @param callback {function} - callback from circle by row Or col (the isCol parameter affects)
 */
function enumeration(data, isCol = false, callback) {
    const iMax = isCol ? data[0].length - 1 : data.length - 1;
    const jMax = isCol ? data.length - 1 : data[0].length - 1 ;

    let i = iMax;
    while(i >= 0) {
        let max = 0;
        let min = 0;

        // Находим максимум и минимум по столбцу
        let j = jMax;
        while(j >= 0) {
            max = data[i][j] > max ? data[i][j] : max;
            min = data[i][j] < min ? data[i][j] : min;
            j--;
        }

        callback({ max, min, vector: data[i], jMax });

        i--;
    }

    return data;
}


module.exports = {
    linearNormalize,
    nonLinearNormalize
};