import mongoose from 'mongoose';
import consola from 'consola';

import {mongodb} from './config';

const {host, port, db_name, replset} = mongodb;

(async () => {
  try {
    const connection = await mongoose
      .createConnection(`mongodb://${host}:${port}/${db_name}`, {
        readPreference: 'secondaryPreferred',
        replicaSet: replset,
      })
      .asPromise();

    consola.info('Mongo Status', connection.readyState);

    let resumeAfter;

    consola.log('Starting Mongo Watch.....');

    const watchCursor = connection.watch([], {resumeAfter});
    watchCursor.on('change', next => {
      consola.log(next);
    });
  } catch (err) {
    consola.error('>>>Error>>>>\n', err);
  }
})();
