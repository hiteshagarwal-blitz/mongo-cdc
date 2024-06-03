import mongoose from 'mongoose';

import {mongodb} from './config';

import {slackAtAirflowTest} from './utils/slack';
import publishMonogCdcData from './publisher/dataPublisher';

const {host, port, db_name, replset} = mongodb;

type RequiredChangeStreanType =
  | mongoose.mongo.ChangeStreamInsertDocument
  | mongoose.mongo.ChangeStreamUpdateDocument;

const cdcParserForUpdateOp = (
  changeEvent: mongoose.mongo.ChangeStreamUpdateDocument
) => {
  return {
    db: changeEvent.ns.db,
    collection: changeEvent.ns.coll,
    document_id: changeEvent.documentKey._id,
    updated_fields: changeEvent.updateDescription.updatedFields,
    removed_fields: changeEvent.updateDescription.removedFields,
    truncated_arrays: changeEvent.updateDescription.truncatedArrays,
    timestamp: changeEvent.clusterTime,
    resume_token: changeEvent._id,
  };
};

const cdcParserForInsertOp = (
  changeEvent: mongoose.mongo.ChangeStreamInsertDocument
) => {
  return {
    db: changeEvent.ns.db,
    collection: changeEvent.ns.coll,
    document_id: changeEvent.documentKey._id,
    full_document: changeEvent.fullDocument,
    timestamp: changeEvent.clusterTime,
    resume_token: changeEvent._id,
  };
};

const cdcParser = (changeEvent: RequiredChangeStreanType) => {
  let formattedChangeEvent;
  switch (changeEvent.operationType) {
    case 'insert':
      formattedChangeEvent = cdcParserForInsertOp(changeEvent);
      break;
    case 'update':
      formattedChangeEvent = cdcParserForUpdateOp(changeEvent);
      break;
  }

  console.log('CDC Event Data:\n', formattedChangeEvent);
  publishMonogCdcData(formattedChangeEvent);
};

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

    const pipeline = [
      {
        $match: {operationType: {$in: ['insert', 'update']}},
      },
    ];

    const watchCursor = connection.watch(pipeline, {startAfter: resumeToken});
    watchCursor.on('change', (event: RequiredChangeStreanType) => {
      cdcParser(event);
    });

    process.on('SIGINT', () => {
      console.info('Closing Mongo Watch!!');
      watchCursor.close();
      slackAtAirflowTest('SIGINT signal received');
      throw new Error('SIGINT signal received');
    });

    process.on('SIGTERM', () => {
      console.info('Closing Mongo Watch!!');
      watchCursor.close();
      slackAtAirflowTest('SIGTERM signal received');
      throw new Error('SIGTERM signal received');
    });
  } catch (err) {
    slackAtAirflowTest(JSON.stringify(err));
    console.error('>>>Error>>>>\n', err);
  }
})();
