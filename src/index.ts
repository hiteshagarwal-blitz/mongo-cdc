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

    let resumeToken;

    console.log('Starting Mongo Watch.....');

    const pipeline = {
      $match: {operationType: ['insert', 'update']},
    };

    const watchCursor = connection.watch([pipeline], {startAfter: resumeToken});
    watchCursor.on('change', event => {
      console.log(event, {depth: null});
      resumeToken = event._id;
      console.log('resumeToken>>', resumeToken);
    });

    process.on('SIGINT', () => {
      console.error('SIGINT signal received');
      console.info('Closing Mongo Watch!!');
      watchCursor.close();
      throw new Error('SIGINT signal received');
    });

    process.on('SIGTERM', () => {
      console.info('Closing Mongo Watch!!');
      watchCursor.close();
      throw new Error('SIGTERM signal received');
    });
  } catch (err) {
    console.error('>>>Error>>>>\n', err);
  }
})();
