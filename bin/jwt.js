const yargs = require('yargs');
const jwt = require('jsonwebtoken');
const uuidv4 = require('uuid/v4');

const { argv } = yargs
  .option('algorithm', {
    alias: 'a',
    description: 'Algorithm to sign JWT',
    choices: [
      'HS256',
      'HS384',
      'HS512',
      'RS256',
      'RS384',
      'RS512',
      'ES256',
      'ES384',
      'ES512',
      'PS256',
      'PS384',
      'PS512',
    ],
    type: 'string',
  })
  .option('secret', {
    alias: 's',
    description: 'Secret Key to be used on creation JWT token',
    type: 'string',
  })
  .option('payload', {
    alias: 'p',
    default: '{}',
    description: `Payload to be encoded with JWT. This is a string that will be
    parsed as JSON`,
    type: 'string',
  })
  .demandOption(['algorithm'])
  .help()
  .alias('help', 'h');

// eslint-disable-next-line no-unused-vars
const parsePayload = async input => {
  let parsed = '';
  try {
    parsed = await JSON.parse(input);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Error while generating payload: ', e);
  }
  return parsed;
};

const parseSecret = secret => secret || uuidv4();

const generateToken = async () => {
  const secret = parseSecret(argv.secret);
  const payload = await parsePayload(argv.payload);
  return jwt.sign(payload, secret, {
    algorithm: argv.algorithm,
  });
};

// eslint-disable-next-line no-async-promise-executor
new Promise(async (resolve, reject) => {
  let token;
  try {
    token = await generateToken();
  } catch (e) {
    reject(e);
  }
  resolve(token);
})
  .then(token => console.log(token))
  .catch(error => console.error(error));
