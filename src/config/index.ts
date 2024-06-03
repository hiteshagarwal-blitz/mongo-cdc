import * as nconf from 'nconf';

nconf.argv().env().file({file: 'build/config/config.json'});

interface IMongoDB {
  host: string;
  port: string;
  replset: string;
  db_name: string;
}

export interface IQueueConfig {
  serviceType: 'topic' | 'sqs' | 'bull';
  queueUrl?: string;
  topicName: string;
}

export interface IPublishersConfig {
  projectId: string;
  accessKeyId: string;
  secretAccessKey: string;
  client_email: string;
  private_key: string;
}

export interface IPublisherConfig {
  config: IPublishersConfig;
  mongo_cdc_queue: IQueueConfig;
}

export const mongodb = nconf.get('mongodb') as IMongoDB;
export const slackToken = nconf.get('slack_access_token') as string;
export const publishers = nconf.get('publishers') as IPublisherConfig;
