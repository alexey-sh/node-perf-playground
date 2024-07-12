const http = require('node:http');
const crypto = require("node:crypto");

const time2workDefault = 60_000;
const time2workEnv = Number(process.env.TIME2WORK);


const concurrencyDefault = 30;
const concurrencyEnv = Number(process.env.CONCURRENCY);

const time2work = Number.isNaN(time2workEnv) ? time2workDefault : time2workEnv;
const concurrency = Number.isNaN(concurrencyEnv) ? concurrencyDefault : concurrencyEnv;

const httpPort = 8000;

console.log('randomizer type', process.env.RANDOMIZER_TYPE);
console.log('time2work', time2work);
console.log('concurrency', concurrency);

function getRndNum (max) {
  if (process.env.RANDOMIZER_TYPE === 'math') {
    return Math.round(Math.random() * max)
  }
  return Math.round((crypto.getRandomValues(new Uint32Array(1))[ 0 ] / 2 ** 32) * max);
}

function genRndStr (size) {
  const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';
  for (let i = 0; i < size; i++) {
    let randomPoz = getRndNum(charSet.length);
    randomString += charSet.substring(randomPoz, randomPoz + 1);
  }
  return randomString;
}

function genRndVal (type) {
  switch (type) {
    case 'int':
      return getRndNum(100_000);
    case 'str':
      return `"${ genRndStr(30) }"`;
    case 'null':
      return null;
    case 'boolean':
      return getRndNum(1) > 0;
    default:
      return `"${ genRndStr(30) }"`;
  }
}

function generateJSON (size) {
  let result = '{';
  const types = [ 'int', 'str', 'null', 'boolean', 'str', 'str' ];
  for (let i = 0; i < size; i++) {
    const key = genRndStr(20);
    const value = genRndVal(types[ getRndNum(types.length) ]);
    result += `"${ key }":${ value }${ i + 1 === size ? '' : ',' }`
  }
  return result + '}';
}
let counter = 0;
const server = http.createServer({ }, (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(JSON.parse(generateJSON(100))));
  counter++;
});

server.listen(httpPort);


function sendRequest() {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(JSON.parse(generateJSON(200)));
    const options = {
      hostname: 'localhost',
      port: httpPort,
      path: '/',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const req = http.request(options, (res) => {
      const chunks = [];
      res.on('data', (chunk) => {
        chunks.push(chunk);
      });
      res.on('end', () => {
        JSON.parse(Buffer.concat(chunks).toString('utf-8'));
        resolve()
      });
    });

    req.on('error', (e) => {
      console.error(`problem with request: ${e.message}`);
      reject(e);
    });

// Write data to request body
    req.write(postData);
    req.end();
  });
}

let inWork = true;
setTimeout(() => {
  inWork = false;
  setTimeout(() => {
    server.close((e) => {
      console.log('time2work', time2work);
      console.log('concurrency', concurrency);
      console.log('counter', counter);
      console.log('server closed', e);
    });
  }, 3000);
}, time2work);

async function requester() {
  while( inWork) {
    await sendRequest();
  }
}

(async function main() {
  for (let i = 0; i < concurrency; i++) {
    requester().catch((e) => {
      console.error('main failed');
      process.exit(1);
    });
  }
})().catch((e) => {
  console.error('main failed');
  process.exit(1);
})
