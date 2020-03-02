#! /usr/bin/env node

const yargs = require('yargs');
const jwt = require('jsonwebtoken');
const uuidv4 = require('uuid/v4');

const parseSecret = secret => secret || uuidv4();

const { argv } = yargs
  .option('algorithm', {
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
  .option('expiresIn', {
    description: `Identifies the expiration time on or after which the JWT MUST
    NOT be accepted for processing. Can be expressed as a string describing
    time span. Eg: 60, '2 days', '10h', '7d'.
    More info: [zeit/ms](https://github.com/zeit/ms.js).`,
    type: 'string',
  })
  .option('notBefore', {
    description: `Identifies the time before which the JWT MUST NOT be accepted
    for processing. Can be expressed as a string describing time span.
    Eg: 60, '2 days', '10h', '7d'.
    More info: [zeit/ms](https://github.com/zeit/ms.js).`,
    type: 'string',
  })
  .option('audience', {
    description: `Identifies the recipients that the JWT is intended for. This
    can be a single string or an array of strings comma separated.
    Eg: audience1,audience2,audience3`,
    type: 'string',
  })
  .coerce('audience', audience => audience.split(','))
  .option('subject', {
    description: 'Identifies the principal that is the subject of the JWT',
    type: 'string',
  })
  .option('issuer', {
    description: 'Identifies the principal that issued the JWT.',
    type: 'string',
  })
  .option('jwtid', {
    description: 'Specific ID associated with the generated JWT.',
    type: 'string',
  })
  .option('mutatePayload', {
    description: `If true, the sign function will modify the payload object
    directly. This is useful if you need a raw reference to the payload after
    claims have been applied to it but before it has been encoded into a token`,
    type: 'boolean',
  })
  .option('header', {
    description: `Header to be encoded in the token. This is a string that will
    be parsed as JSON`,
    type: 'string',
  })
  .option('encoding', {
    description: 'Content-Encoding to be used',
    type: 'string',
  })
  .option('secret', {
    description: 'Secret Key to be used on creation JWT token',
    type: 'string',
  })
  .option('payload', {
    default: '{}',
    description: `Payload to be encoded with JWT. This is a string that will be
    parsed as JSON`,
    type: 'string',
  })
  .coerce({ payload: JSON.parse, header: JSON.parse, secret: parseSecret })
  .demandOption(['algorithm'])
  .help()
  .alias('help', 'h');

Object.keys(argv).forEach(
  key =>
    (argv[key] === undefined || key === '_' || key === '$0') &&
    delete argv[key],
);

const generateToken = async ({ payload, secret, ...options }) =>
  jwt.sign(payload, secret, options);

// eslint-disable-next-line no-async-promise-executor
new Promise(async (resolve, reject) => {
  let token;
  try {
    token = await generateToken(argv);
  } catch (e) {
    reject(e);
  }
  resolve(token);
})
  .then(token => console.log(token))
  .catch(error => console.error(error));
