import dotenvFlow from 'dotenv-flow';
import path from 'path';

const envPath = path.resolve(__dirname, '..');

// delete old GSTUDIO_* environment variables
const { env } = process;
Object.keys(env).forEach(
  (key) =>
    // eslint-disable-next-line no-prototype-builtins
    env.hasOwnProperty(key) && key.startsWith('GSTUDIO_') && delete env[key]
);
// console.log(env);

dotenvFlow.config({ path: envPath, default_node_env: 'test' });
