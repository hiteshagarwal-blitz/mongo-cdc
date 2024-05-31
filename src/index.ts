import mongoose from 'mongoose';

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

    console.info('Mongo Status', connection.readyState);

    let resumeAfter;

    console.log('Starting Mongo Watch.....');

    const watchCursor = connection.watch([], {resumeAfter});
    watchCursor.on('change', next => {
      console.log(next, {depth: null});
    });
  } catch (err) {
    console.error('>>>Error>>>>\n', err);
  }
})();
