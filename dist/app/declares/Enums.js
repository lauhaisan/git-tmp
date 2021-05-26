"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lastPendingStatus = exports.REIMBURSEMENT_STATUS = exports.CLOSED_REIMBURSEMENT_STATUS = exports.PENDING_REIMBURSEMENT_STATUS = exports.DEACTIVE_REIMBURSEMENT_STATUS = exports.SUCCESS = exports.SUCCESS_CODE = void 0;
exports.SUCCESS_CODE = 200;
exports.SUCCESS = 'Success';
exports.DEACTIVE_REIMBURSEMENT_STATUS = [
    'DELETED',
    'REJECT',
    'DRAFT',
    'INQUIRY',
];
exports.PENDING_REIMBURSEMENT_STATUS = ['PENDING'];
exports.CLOSED_REIMBURSEMENT_STATUS = ['COMPLETE', 'DELETED', 'REJECT'];
exports.REIMBURSEMENT_STATUS = [
    ...exports.DEACTIVE_REIMBURSEMENT_STATUS,
    ...exports.PENDING_REIMBURSEMENT_STATUS,
    ...exports.CLOSED_REIMBURSEMENT_STATUS,
    'PAID',
];
function lastPendingStatus() {
    return exports.PENDING_REIMBURSEMENT_STATUS[exports.PENDING_REIMBURSEMENT_STATUS.length - 1];
}
exports.lastPendingStatus = lastPendingStatus;
//# sourceMappingURL=Enums.js.map