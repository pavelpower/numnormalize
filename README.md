# Number normalize

# Instalation

```
$ npm i numnormalize --save
```

The need for the normalization of data samples is conditioned by the very nature of the variables used
in neural network models. Being different in physical sense, they can often differ greatly in absolute values.
So, for example, the sample can contain both concentration, measured in tenths or hundredths of percent, and pressure
in hundreds of thousands of pascals. Normalization of data allows you to bring all used numerical values ​​of variables
to the same area of ​​their change, which makes it possible to bring them together in one neural network model.

In order to normalize the data, you need to know exactly the limits of the changes in the values ​​of
the corresponding variables (minimum and maximum theoretically possible values). Then the limits of
the normalization interval will correspond to them. When it is impossible to set the limits of variable
changes precisely, they are set taking into account the minimum and maximum values ​​in the available data sample.

The most common way to normalize input and output variables is linear normalization.

Example:
```
const brain = require('brain.js');
const net = new brain.NeuralNetwork();
const { linearNormalize, linearDeNormalize, getMaxMin } = require('../index');

const inputData = [
    [ 0,     1,     2,        3,     4],
    [34,    45,    23,       43,   -54],
    [ 3,  0.23,  0.25, -0.92324,   0.1],
    [ 2,  0.23, -0.25,  0.92324,   0.1],
    [ 1, -0.12,  2.32,    54.24, 123.1]
];

const outputData = [[
    102,
     35,
     56,
     43,
     84
]];

const maxminInput = getMaxMin(inputData);
const maxminOutput = getMaxMin(outputData);

const normInput = linearNormalize({ data: inputData, maxmin: maxminInput });
const normOutput = linearNormalize({ data: outputData, maxmin: maxminOutput });

const trainData = normInput.map((row, i) => ({
    input: row,
    output: normOutput[0]
}));

console.log('trainData');
console.log(trainData);
net.train(trainData);

const data = linearNormalize({ data: [ [36, 23, 10, 53, 4] ], maxmin: maxminInput });

console.log('Search for solutions for');
console.log(data);

let answer = net.run(data[0]);

console.log('ANSWER norm:');
console.log(answer);

answer = linearDeNormalize({ data: [answer], maxmin: maxminOutput });

console.log('ANSWER de norm:');
console.log(answer);

```

One way of non-linear normalization is using a sigmoid logistic function or a hyperbolic tangent.

Example:
```
const { nonLinearNormalize, nonLinearDeNormalize, getMaxMin } = require('numnormolize');
```

# Links

* [normalize of params](http://neuronus.com/theory/931-sposoby-normalizatsii-peremennykh.html)
* [Batch Normalization shift/scale parameters defeat the point](https://stats.stackexchange.com/questions/272010/batch-normalization-shift-scale-parameters-defeat-the-point)
* [How to Normalize and Standardize Time Series Data in Python](https://machinelearningmastery.com/normalize-standardize-time-series-data-python/) 