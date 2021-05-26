"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractController_1 = __importDefault(require("@/app/declares/AbstractController"));
const AdvancedError_1 = __importDefault(require("@/app/declares/AdvancedError"));
const ApprovalFlow_1 = __importDefault(require("@/app/models/ApprovalFlow"));
const ApprovalFlowGroup_1 = __importDefault(require("@/app/models/ApprovalFlowGroup"));
const Location_1 = __importDefault(require("@/app/models/Location"));
const ResponseResult_1 = __importDefault(require("@/app/services/ResponseResult"));
const lodash_1 = require("lodash");
class ApprovalFlowGroupController extends AbstractController_1.default {
    generateMethods() {
        return [
            {
                name: 'list',
                type: 'POST',
                _ref: this.list,
            },
            {
                name: 'get-by-id',
                _ref: this.getByID,
                type: 'POST',
                validationSchema: {
                    id: {
                        in: ['body', 'params'],
                        isString: {
                            errorMessage: ['isString', 'Id is invalid'],
                        },
                    },
                },
            },
            {
                name: 'add',
                type: 'POST',
                _ref: this.add,
            },
            {
                name: 'update',
                type: 'POST',
                _ref: this.update.bind(this),
                // possiblePers: ['admin-cla'],
                validationSchema: {
                    id: {
                        in: 'body',
                        exists: {
                            errorMessage: ['required', 'Id must be provided'],
                        },
                    },
                },
            },
            {
                name: 'remove',
                type: 'POST',
                _ref: this.remove,
            },
            {
                name: 'active',
                type: 'POST',
                _ref: this.active,
            },
            {
                name: 'inactive',
                type: 'POST',
                _ref: this.inactive,
            },
        ];
    }
    /**
     * list
     */
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = req.user;
            const { body: { q, location = currentUser.employee.location.id, company = currentUser.employee.company.id, }, } = req;
            const searchQ = { $regex: q, $options: 'i' };
            // Validate location:
            const item = yield Location_1.default.findOne({
                _id: location,
                company,
            }).exec();
            if (!item) {
                throw new AdvancedError_1.default({
                    location: { kind: 'not.found', message: 'Location not found' },
                });
            }
            // Init filter
            const filter = q ? { name: searchQ } : {};
            if (location) {
                filter.location = location;
            }
            res.send(new ResponseResult_1.default({
                data: yield ApprovalFlowGroup_1.default.find(filter).exec(),
                message: 'Get list successfully.',
            }));
        });
    }
    add(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = req.user;
            const { body: { location = currentUser.employee.location.id, members }, body, } = req;
            // Validate members
            if (lodash_1.isEmpty(members)) {
                throw new AdvancedError_1.default({
                    method: {
                        path: 'members',
                        kind: 'not.valid',
                        message: `Members must have value.`,
                    },
                });
            }
            // Validate location:
            const item = yield Location_1.default.findOne({
                _id: location,
                company: currentUser.employee.company,
            }).exec();
            if (!item) {
                throw new AdvancedError_1.default({
                    location: { kind: 'not.found', message: 'Location not found' },
                });
            }
            body.company = currentUser.employee.company.id;
            body.location = location;
            res.send(new ResponseResult_1.default({
                message: 'Add Approval Flow Group successfully',
                data: yield ApprovalFlowGroup_1.default.create(body),
            }));
        });
    }
    /**
     * update
     */
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { body: { id, members }, body, } = req;
            const currentUser = req.user;
            // Validate members
            if (members && lodash_1.isEmpty(members)) {
                throw new AdvancedError_1.default({
                    method: {
                        path: 'members',
                        kind: 'not.valid',
                        message: `Members must have value.`,
                    },
                });
            }
            const item = yield ApprovalFlowGroup_1.default.findOne({
                _id: id,
                company: currentUser.employee.company,
            }).exec();
            if (!item) {
                throw new AdvancedError_1.default({
                    approvalFlowGroup: { kind: 'not.found', message: 'Approval Flow Group not found' },
                });
            }
            body = this.filterParams(body, ['location', 'company', 'status']);
            item.set(body);
            res.send(new ResponseResult_1.default({
                message: 'Update ApprovalFlowGroup successfully',
                data: yield item.save(),
            }));
        });
    }
    remove(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { body: { id }, } = req;
            const currentUser = req.user;
            const item = yield ApprovalFlowGroup_1.default.findOne({
                _id: id,
                company: currentUser.employee.company,
            }).exec();
            if (!item) {
                throw new AdvancedError_1.default({
                    item: { kind: 'not.found', message: 'Approval Flow Group not found' },
                });
            }
            // Validate dependencies:
            const approvalFlow = yield ApprovalFlow_1.default.find({
                'nodes.value': id,
                status: 'ACTIVE',
            }).exec();
            if (!lodash_1.isEmpty(approvalFlow)) {
                throw new AdvancedError_1.default({
                    item: {
                        kind: 'not.allow',
                        message: 'ApprovalFlow are using it.',
                    },
                });
            }
            yield item.remove();
            res.send(new ResponseResult_1.default({
                message: 'Remove Approval Flow Group successfully',
                data: item,
            }));
        });
    }
    active(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { body: { id }, } = req;
            const currentUser = req.user;
            const item = yield ApprovalFlowGroup_1.default.findOne({
                _id: id,
                company: currentUser.employee.company,
            }).exec();
            if (!item) {
                throw new AdvancedError_1.default({
                    item: { kind: 'not.found', message: 'Approval Flow Group not found' },
                });
            }
            item.set({ status: 'ACTIVE' });
            yield item.save();
            res.send(new ResponseResult_1.default({
                message: 'Update Approval Flow Group successfully',
                data: item,
            }));
        });
    }
    inactive(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { body: { id }, } = req;
            const currentUser = req.user;
            const item = yield ApprovalFlowGroup_1.default.findOne({
                _id: id,
                company: currentUser.employee.company,
            }).exec();
            if (!item) {
                throw new AdvancedError_1.default({
                    item: { kind: 'not.found', message: 'Approval Flow Group not found' },
                });
            }
            item.set({ status: 'INACTIVE' });
            yield item.save();
            res.send(new ResponseResult_1.default({
                message: 'Update Approval Flow Group successfully',
                data: item,
            }));
        });
    }
}
exports.default = new ApprovalFlowGroupController(ApprovalFlowGroup_1.default);
//# sourceMappingURL=ApprovalFlowGroupController.js.map