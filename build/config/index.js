"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongodb = void 0;
const nconf = require("nconf");
nconf.argv().env().file({ file: 'build/config/config.json' });
exports.mongodb = nconf.get('mongodb');
//# sourceMappingURL=index.js.map