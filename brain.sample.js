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