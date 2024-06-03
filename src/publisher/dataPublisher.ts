import {publishers} from '../config';
import sarthi from '../utils/sarthi';

const {QueueService} = sarthi.common.services.queue;

const queueService = new QueueService({
  ...publishers.config,
  ...publishers.mongo_cdc_queue,
});

const publishMonogCdcData = (data: object) => {
  queueService.publishMessage(data);
};

export default publishMonogCdcData;
