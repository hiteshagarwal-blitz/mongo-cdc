type CreateOptions<T> = {
  [Property in keyof T]+?: T[Property];
};

type QueueConfigOptions = CreateOptions<IQueueConfig>;

interface IQueueConfig {
  serviceType: 'topic' | 'sqs' | 'bull';
  queueUrl?: string;
  topicName: string;
}

interface IPublishersConfig {
  projectId: string;
  accessKeyId: string;
  secretAccessKey: string;
  client_email: string;
  private_key: string;
}

interface SarthiCommonQueue {
  publishMessage: (payload: object, delay?: number) => unknown;
}

interface ISarthiCommonServiceQueue {
  QueueService: new (
    queueServiceConfig: QueueConfigOptions & IPublishersConfig
  ) => SarthiCommonQueue;
}

interface ISarthiCommonServices {
  queue: ISarthiCommonServiceQueue;
}

interface ISarthiCommon {
  services: ISarthiCommonServices;
}

export interface ISarthi {
  common: ISarthiCommon;
}

const sarthi = require('sarthi') as ISarthi;

export default sarthi;
