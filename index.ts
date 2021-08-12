import './style.css';
import lodash from 'lodash';
import { config } from 'dotenv';

config();

console.log('---', process.env.password);

// Write TypeScript code!
const sourceDiv: HTMLElement = document.getElementById('source');
const resultDiv: HTMLElement = document.getElementById('result');

// Source data
const data = [
  { who: 'a', on: 'b' },
  { who: 'b', on: 'c' },
  { who: 'a', on: 'd' },
  { who: 'b', on: 'd' },
  { who: 'a', on: 'd' }
];

const groupedData = Object.entries(lodash.groupBy(data, 'who')).reduce(
  (acc, [who, list]) => {
    acc[who] = lodash.uniq(list.map(({ on }) => on));
    return acc;
  },
  {}
);
// All symbols
const all = lodash.uniq(lodash.flatten(data.map(item => Object.values(item))));
// find indpendent deps -- symbols that are not listed as keys in groupedData
const indeps = all.filter(symbol => !groupedData[symbol]);
let final = [...indeps];
let pool = { ...groupedData };
let term = Object.keys(pool).length;
console.log({ all, groupedData, indeps });

sourceDiv.innerHTML = `
  <h3>Source</h3>
  <pre>${JSON.stringify(data, null, 2)}</pre>
`;

try {
  while (Object.keys(pool).length) {
    final = [
      ...Object.entries(pool).reduce((acc, [who, on]) => {
        if (on.every(symbol => acc.includes(symbol))) {
          acc.push(who);
          delete pool[who];
        }
        return acc;
      }, final)
    ];
    if (!term--) {
      throw new Error('Unable to resolve dependency path');
    }
  }
  resultDiv.innerHTML = `
    <h3>Result</h3>
    <pre>${final.join(', ')}</pre>
  `;
} catch (error) {
  console.error(error.message);
  resultDiv.innerHTML = `
    <h3 class="error">${error.message}<h3>
  `;
}
