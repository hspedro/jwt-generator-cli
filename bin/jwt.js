const yargs = require('yargs');
const uuidv4 = require('uuid/v4');

// eslint-disable-next-line no-unused-vars
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

// eslint-disable-next-line no-unused-vars
const parseSecret = secret => secret || uuidv4();
