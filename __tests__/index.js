const {
    linearNormalize,
    nonLinearNormalize,
    linearDeNormalize,
    nonLinearDeNormalize,
    getMaxMin,
    transpose
} = require('../index');

//mathematical error 1/1000
const div = 1000;
const ε = 5/1000;
const truncated = value =>  Math.trunc(value * div, 1)/div;

// https://en.wikipedia.org/wiki/Machine_epsilon
const equal = (x, y, ε = Number.EPSILON) => (Math.abs(x - y) < ε);

const toEqual = (data, testData, e = ε) => {
    let [i, j] = [data.length, data[0].length];
    let test = true;
    while(i-- > 0) {
        while(j-- > 0) {
            test = test && equal(data[i][j], testData[i][j], e);
            if (!test) {
                break;
            }
        }
        if (!test) {
            break;
        }
    }
    return test;
};

const data = [
    [ 0,     1,     2,        3,     4],
    [34,    45,    23,       43,   -54],
    [ 3,  0.23,  0.25, -0.92324,   0.1],
    [ 2,  0.23, -0.25,  0.92824,   0.1],
    [ 1, -0.12,  2.32,    54.24,  64.3]
];

const testData = data.map(d => d.map(truncated));

describe('numNormolize', () => {

    test('equal', ()=>{
        expect(equal(64.30240967053572, 64.3, 0.005)).toBe(true);
    })

    test('exists linearNormalize', () => {
        expect(typeof linearNormalize).toBe('function');
    });

    test('exists nonLinearNormalize', () => {
        expect(typeof nonLinearNormalize).toBe('function');
    });

    test('exists linearDeNormalize', () => {
        expect(typeof linearDeNormalize).toBe('function');
    });

    test('exists nonLinearDeNormalize', () => {
        expect(typeof nonLinearDeNormalize).toBe('function');
    });

    test('exists getMaxMin', () => {
        expect(typeof getMaxMin).toBe('function');
    });

    test('getMaxMin', () => {
        const maxmin = getMaxMin([
            [ 3,  0.23,  0.25, -0.92324,   0.1]
        ]);

        expect(maxmin).toEqual([
            { max: 3, min: -0.92324 }
        ]);
    });

    test('transpose', ()=>{
        const input = [[1],[2],[3],[4],[5]];

        const output = transpose(input);

        expect(output).toEqual([[1, 2, 3, 4, 5]]);

        const output2 = transpose(output);

        expect(output2).toEqual(input);

        console.log(input);
    });

    test('linearNormalize', () => {
        const maxmin = getMaxMin(data);
        let output = linearNormalize({
            data,
            maxmin
        });

        output.forEach((l => {
            l.forEach(k => {
                expect(k <= 1 && k >= 0).toBe(true);
            })
        }));

        output = output.map(d => d.map(truncated));

        expect(output).toEqual([
            [    0,  0.25,   0.5,  0.75,     1],
            [0.888,     1, 0.777, 0.979,     0],
            [    1, 0.293, 0.299,     0,  0.26],
            [    1, 0.213,     0, 0.523, 0.155],
            [0.017,     0, 0.037, 0.843,     1]
        ]);
    });

    test('nonLinearNormalize', () => {
        const maxmin = getMaxMin(data);
        let output = nonLinearNormalize({
            data,
            maxmin,
            a: 0.3
        });

        output.forEach((l => {
            l.forEach(k => {
                expect(k <= 1 && k >= 0).toBe(true);
            })
        }));

        output = output.map(d => d.map(truncated));

        expect(output).toEqual([
            [0.354, 0.425,   0.5, 0.574, 0.645],
            [0.009, 0.205,     0, 0.124,     0],
            [0.577, 0.372, 0.374, 0.296, 0.363],
            [0.565, 0.433, 0.398, 0.485, 0.423],
            [    0,     0,     0, 0.998, 0.999]
        ]);
    });

    test('nonLinearDeNormalize', () => {
        const maxmin = getMaxMin(data);

        let output = nonLinearNormalize({
            data,
            maxmin
        });

        output.forEach((l => {
            l.forEach(k => {
                expect(k <= 1 && k >= 0).toBe(true);
            })
        }));

        let output2 = nonLinearDeNormalize({
            data: output,
            maxmin
        });

        expect(toEqual(output2, testData)).toBe(true);
    });

    test('linearDeNormalize', () => {
        const maxmin = getMaxMin(data);
        let outputNorm = linearNormalize({
            data,
            maxmin
        });

        let outputDeNorm = linearDeNormalize({ data: outputNorm, maxmin });

        expect(toEqual(data, outputDeNorm)).toBe(true);
    });

    test('test linear normalize for vector', () => {
        const yData = [
            [102, 35, 56, 43, 84]
        ];

        const maxmin = getMaxMin(yData);

        let yOutput = linearNormalize({
            data: yData,
            maxmin: maxmin
        });

        const denormY = linearDeNormalize({
            data: yOutput,
            maxmin: maxmin
        });

        expect(toEqual(yData, denormY)).toBe(true);
    });
});