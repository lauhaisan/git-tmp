"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("module-alias/register");
// tslint:disable-next-line: ordered-imports
const index_1 = __importDefault(require("@/app/config/index"));
const { ENVIRONMENT } = index_1.default;
const InitDefault_1 = __importDefault(require("@/app/services/InitDefault"));
const express_1 = __importDefault(require("@/express"));
const schedule_1 = __importDefault(require("@/schedule"));
const errorhandler_1 = __importDefault(require("errorhandler"));
const node_schedule_1 = __importDefault(require("node-schedule"));
/**
 * Error Handler. Provides full stack - remove for production
 */
if (ENVIRONMENT !== 'production') {
    // only use in development
    express_1.default.use(errorhandler_1.default());
}
/**
 * Start Express server.
 */
const server = express_1.default.listen(express_1.default.get('port'), () => {
    // tslint:disable-next-line: no-console
    console.log('  App is running at http://localhost:%d in %s mode', express_1.default.get('port'), express_1.default.get('env'));
    // tslint:disable-next-line: no-console
    console.log('  Press CTRL-C to stop\n');
    InitDefault_1.default();
    schedule_1.default.forEach(sch => {
        node_schedule_1.default.scheduleJob(sch.cronFormat, sch.function);
    });
});
exports.default = server;
//# sourceMappingURL=server.js.map