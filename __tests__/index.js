const { linearNormalize, nonLinearNormalize } = require('../index');

const data = [
    [ 0,     1,     2,        3,     4],
    [34,    45,    23,       43,   -54],
    [ 3,  0.23,  0.25, -0.92324,   0.1],
    [ 2,  0.23, -0.25,  0.92324,   0.1],
    [ 1, -0.12,  2.32,    54.24, 123.1]
];

describe('numNormolize', () => {

    test('exists linearNormalize', () => {
        expect(typeof linearNormalize).toBe('function');
    });

    test('exists nonLinearNormalize', () => {
        expect(typeof nonLinearNormalize).toBe('function');
    });

    test('linearNormalize', () => {
        let output = linearNormalize({ data });

        output.forEach((l => {
            l.forEach(k => {
                expect(k <= 1 && k >= 0).toBe(true);
            })
        }));

        output = output.map(d => d.map(k => Math.ceil(k * 100)/100));

        expect(output).toEqual([
            [   0, 0.25,  0.5, 0.75,    1],
            [0.89,    1, 0.78, 0.98,    0],
            [   1,  0.3,  0.3,    0, 0.27],
            [   1, 0.22,    0, 0.53, 0.16],
            [0.01,    0, 0.02, 0.45,    1]
        ]);
    });

    test('nonLinearNormalize', () => {
        let output = nonLinearNormalize({ data });

        output.forEach((l => {
            l.forEach(k => {
                expect(k <= 1 && k >= 0).toBe(true);
            })
        }));

        output = output.map(d => d.map(k => Math.ceil(k * 100)/100));

        expect(output).toEqual([
            [0.38, 0.44,  0.5, 0.57, 0.63],
            [ 0.6, 0.63, 0.57, 0.62, 0.38],
            [0.63, 0.45, 0.45, 0.38, 0.45],
            [0.63, 0.43, 0.38, 0.51, 0.42],
            [0.38, 0.38, 0.39, 0.49, 0.63]
        ]);
    });

    test('linearNormalize by Col', () => {
        let output = linearNormalize({ data, isCol: true });

        output.forEach((l => {
            l.forEach(k => {
                expect(k <= 1 && k >= 0).toBe(true);
            })
        }));

        output = output.map(d => d.map(k => Math.ceil(k * 100)/100));

        expect(output).toEqual([
            [0.61, 0.71, 0.81, 0.91,    1],
            [0.96,    1, 0.92,    1, 0.61],
            [   1, 0.73, 0.73, 0.61, 0.71],
            [   1, 0.69, 0.61, 0.82, 0.67],
            [0.61, 0.61, 0.62, 0.78,    1]
        ]);
    });

    test('nonLinearNormalize by Col', () => {
        let output = nonLinearNormalize({ data, isCol: true });

        output.forEach((l => {
            l.forEach(k => {
                expect(k <= 1 && k >= 0).toBe(true);
            })
        }));

        output = output.map(d => d.map(k => Math.ceil(k * 100)/100));

        expect(output).toEqual([
            [0.53, 0.56, 0.58,  0.6, 0.63],
            [0.62, 0.63, 0.61, 0.63, 0.53],
            [0.63, 0.56, 0.56, 0.53, 0.56],
            [0.63, 0.55, 0.53, 0.58, 0.55],
            [0.53, 0.53, 0.53, 0.57, 0.63]
        ]);
    });

    test('nonLinearNormalize by Col, a < 0.5', () => {
        let output = nonLinearNormalize({ data, a: 0.3, isCol: true });

        output.forEach((l => {
            l.forEach(k => {
                expect(k <= 1 && k >= 0).toBe(true);
            })
        }));

        output = output.map(d => d.map(k => Math.ceil(k * 10000)/10000));

        expect(output).toEqual([
            [0.5162,  0.518, 0.5198, 0.5217, 0.5234],
            [0.5226, 0.5234, 0.5218, 0.5232, 0.5162],
            [0.5234, 0.5183, 0.5184, 0.5162, 0.5181],
            [0.5234, 0.5177, 0.5162,   0.52, 0.5173],
            [0.5163, 0.5162, 0.5163, 0.5194, 0.5234]
        ]);
    });

});