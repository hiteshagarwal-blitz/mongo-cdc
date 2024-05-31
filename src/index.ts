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

    let resumeAfter;

    const watchCursor = connection.watch([], {resumeAfter});
    watchCursor.on('change', next => {
      console.log(next);
    });
  } catch (err) {
    console.log('>>>Error>>>>\n', err);
  }
})();
