
const linear = {
    /**
     * Normalization for input value
     * Параметр "a" влияет на степень нелинейности изменения переменной в нормализуемом интервале.
     * Кроме того, при использовании значений a < 0,5 нет необходимости дополнительно задаваться шириной коридора экстраполяции.
     * @function nonLinear.normalizeInput
     * @param xmax {number} - maximum by x
     * @param xmin {number} - minimum by x
     * @param xi {number} - parameter for normalization
     * @returns {number}
     */
    normalizeInput: function(xmax, xmin, xi) {
        return (xi - xmin)/(xi - xmax);
    },

    /**
     * Normalization for output value
     * @function nonLinear.normalizeOutput
     * @param ymax {number} - maximum by y
     * @param ymin {number} - minimum by y
     * @param yi {number} - parameter for normalization
     * @returns {number}
     */
    normalizeOutput: function(ymin, ymax, yi) {
        return ymin + yi * (ymax - ymin);
    },

    /**
     * Linear normalization of data for learning a neural network
     * the data of one parameter is the STRING or COLUMN (param isCol) of the matrix
     *
     * @function nonLinear.normalize
     * @param data {Array<Array{Number}>} - matrix of numbers
     * @param normalizeFn {function} - selected normalization function (linear.normalizeInput | linear.normalizeOutput)
     * @param isCol {boolean} - Normalization by row (false) or by column (true). default by row (isCol = false)
     * default: normalizeInput
     */
    normalize: function ({ data, normalizeFn = linear.normalizeInput, isCol = false }) {
        const callback = ({ max, min, vector, jMax }) => {
            let j = jMax;
            while(j >= 0) {
                vector[j] = normalizeFn(max, min, vector[j]);
                j--;
            }
        };

        enumeration(data, isCol, callback);

        return data;
    }
};

const nonLinear = {
    /**
     * Normalization for input value
     * Параметр "a" влияет на степень нелинейности изменения переменной в нормализуемом интервале.
     * Кроме того, при использовании значений a < 0,5 нет необходимости дополнительно задаваться шириной коридора экстраполяции.
     * @function nonLinear.normalizeInput
     * @param xc {number} - the center value between (Xmax - Xmin) / 2
     * @param xi {number} - parameter for normalization
     * @param a {number} - parameter determining the degree of nonlinearity
     * @returns {number}
     */
    normalizeInput: function(xc, xi, a) {
        return 1 / (Math.exp(a * xc - a * xi) + 1);
    },

    /**
     * Normalization for output value
     * @function nonLinear.normalizeOutput
     * @param yc {number} - the center value between (Ymax - Ymin) / 2
     * @param yi {number} - parameter for normalization
     * @param a {number} - parameter determining the degree of nonlinearity
     * @returns {number}
     */
    normalizeOutput: function(yc, yi, a) {
        return yc - 1/a * Math.log(1/yi - 1);
    },

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
     * @param normalizeFn {function} - selected normalization function (nonLinear.normalizeInput | nonLinear.normalizeOutput)
     * @param isCol {boolean} - Normalization by row (false) or by column (true). default by row (isCol = false)
     * default: normalizeInput
     */
    normalize: function ({ data, a = 1, normalizeFn = nonLinear.normalizeInput, isCol = false }) {
        const callback = ({ max, min, vector, jMax }) => {
            let j = jMax;
            let middle = (max - min) / 2;
            while(j >= 0) {
                vector[j] = normalizeFn(middle, vector[j], a);
                j--;
            }
        };

        enumeration(data, isCol, callback);

        return data;
    }
};

/**
 * Enumeration of data
 *
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
        while(col >= 0) {
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
    nonLinear,
    linear
};