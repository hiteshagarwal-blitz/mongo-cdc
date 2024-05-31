import * as nconf from 'nconf';

nconf.argv().env().file({file: 'build/config/config.json'});

interface IMongoDB {
  host: string;
  port: string;
  replset: string;
  db_name: string;
}

export const mongodb = nconf.get('mongodb') as IMongoDB;
