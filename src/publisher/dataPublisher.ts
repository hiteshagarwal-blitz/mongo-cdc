import {publishers} from '../config';
import {PubSub} from '@google-cloud/pubsub';

const pubSubClient = new PubSub({ projectId: publishers.config.projectId, credentials: publishers.config });

const publishMonogCdcData = (data: object) => {
  pubSubClient.topic(publishers.mongo_cdc_queue.topicName).publishMessage({data: Buffer.from(JSON.stringify(data))}).catch(err => {
    throw err;
  })
};

export default publishMonogCdcData;
