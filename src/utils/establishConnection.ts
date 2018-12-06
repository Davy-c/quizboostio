
import { createConnection } from 'typeorm';
import defaultOptions from './connectionOptions';

export default async function establishConnection(options: {logging?: boolean} = {}) {
  return createConnection({
    ...defaultOptions,
    ...options,
  });
}
