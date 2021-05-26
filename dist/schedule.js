"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const EmploymentService_1 = __importDefault(require("./app/services/EmploymentService"));
const ManageBalanceService_1 = __importDefault(require("./app/services/ManageBalanceService"));
const scheduleList = [
    {
        cronFormat: '0 0 1 * * *',
        function: () => { },
    },
    {
        cronFormat: '0 0 0 * * 0-6',
        function: () => {
            new EmploymentService_1.default().changeOnSchedule();
        },
    },
    {
        cronFormat: '0 0 * * *',
        function: () => {
            new EmploymentService_1.default().updateCandidateOffer();
        },
    },
    {
        cronFormat: '0 0 0 * * *',
        function: () => {
            new ManageBalanceService_1.default().resetBalance();
        },
    },
];
exports.default = scheduleList;
//# sourceMappingURL=schedule.js.map