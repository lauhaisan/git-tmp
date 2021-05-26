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
// import { PENDING_REIMBURSEMENT_STATUS } from '@/app/declares/Enums'
const ApprovalFlow_1 = __importDefault(require("@/app/models/ApprovalFlow"));
const Location_1 = __importDefault(require("@/app/models/Location"));
const OffBoardingRequest_1 = __importDefault(require("@/app/models/OffBoardingRequest"));
const ResponseResult_1 = __importDefault(require("@/app/services/ResponseResult"));
const constant_1 = require("@/app/utils/constant");
const lodash_1 = require("lodash");
const mongoose_1 = require("mongoose");
const ApprovalFlowGroup_1 = __importDefault(require("../models/ApprovalFlowGroup"));
const Employee_1 = __importDefault(require("../models/Employee"));
class ApprovalFlowController extends AbstractController_1.default {
    generateMethods() {
        return [
            {
                name: 'list',
                type: 'POST',
                _ref: this.list,
            },
            {
                name: 'init-flow-location',
                type: 'POST',
                _ref: this.initFlowLocation,
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
                name: 'get-active',
                _ref: this.getActive,
                type: 'POST',
            },
            {
                name: 'add',
                type: 'POST',
                _ref: this.add,
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
                name: 'update',
                type: 'POST',
                _ref: this.update,
            },
        ];
    }
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = req.user;
            const { body: { q, location = currentUser.employee.location.id }, } = req;
            const searchQ = { $regex: q, $options: 'i' };
            // Validate location by currentUser.company
            const item = yield Location_1.default.findOne({
                _id: location,
                company: currentUser.employee.company,
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
                data: yield ApprovalFlow_1.default.find(filter).exec(),
                message: 'Get list successfully.',
            }));
        });
    }
    add(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = req.user;
            const { body: { location = currentUser.employee.location.id, nodes }, body, } = req;
            // Validate nodes
            if (lodash_1.isEmpty(nodes)) {
                throw new AdvancedError_1.default({
                    method: {
                        path: 'nodes',
                        kind: 'not.valid',
                        message: `Nodes must have value.`,
                    },
                });
            }
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
                message: 'Add ApprovalFlow successfully',
                data: yield ApprovalFlow_1.default.create(body),
            }));
        });
    }
    /**
     * update
     */
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { body: { id, name, nodes }, } = req;
            const currentUser = req.user;
            // Validate nodes
            if (nodes && lodash_1.isEmpty(nodes)) {
                throw new AdvancedError_1.default({
                    method: {
                        path: 'nodes',
                        kind: 'not.valid',
                        message: `Nodes must have value.`,
                    },
                });
            }
            const item = yield ApprovalFlow_1.default.findOne({
                _id: id,
                company: currentUser.employee.company,
            }).exec();
            if (!item) {
                throw new AdvancedError_1.default({
                    ApprovalFlowGroup: { kind: 'not.found', message: 'ApprovalFlow not found' },
                });
            }
            item.set({ name });
            res.send(new ResponseResult_1.default({
                message: 'Update ApprovalFlow successfully',
                data: yield item.save(),
            }));
        });
    }
    remove(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { body: { id }, } = req;
            const currentUser = req.user;
            const item = yield ApprovalFlow_1.default.findOne({
                _id: id,
                company: currentUser.employee.company,
            }).exec();
            if (!item) {
                throw new AdvancedError_1.default({
                    item: { kind: 'not.found', message: 'ApprovalFlow not found' },
                });
            }
            yield this.getTicketRequest(item);
            // const report = await Report.findOne({
            //   approvalFlow: id,
            // }).exec()
            // if (report) {
            //   throw new AdvancedError({
            //     item: { kind: 'dependencies', message: 'Reports are using it' },
            //   })
            // }
            yield item.remove();
            res.send(new ResponseResult_1.default({
                message: 'Remove ApprovalFlow successfully',
                data: item,
            }));
        });
    }
    getTicketRequest(approvalFlowItem) {
        return __awaiter(this, void 0, void 0, function* () {
            let ticketRequest = null;
            switch (approvalFlowItem.type) {
                case constant_1.TYPE_TICKET_REQUEST.offBoarding:
                    ticketRequest = OffBoardingRequest_1.default.findOne({
                        approvalFlow: approvalFlowItem.id,
                    }).exec();
                    break;
                default:
                    break;
            }
            if (ticketRequest) {
                throw new AdvancedError_1.default({
                    item: { kind: 'dependencies', message: 'Some request are using it' },
                });
            }
            return ticketRequest;
        });
    }
    active(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { body: { id }, } = req;
            const currentUser = req.user;
            const item = yield ApprovalFlow_1.default.findOne({
                _id: id,
                company: currentUser.employee.company,
            }).exec();
            if (!item) {
                throw new AdvancedError_1.default({
                    item: { kind: 'not.found', message: 'ApprovalFlow not found' },
                });
            }
            // Inactive all ApprovalFlow
            yield ApprovalFlow_1.default.updateMany({
                location: item.location,
                company: item.company,
                _id: { $nin: [id] },
            }, { status: 'INACTIVE' });
            res.send(new ResponseResult_1.default({
                message: 'Update ApprovalFlow successfully',
                data: yield item.set({ status: 'ACTIVE' }).save(),
            }));
        });
    }
    /**
     * getByID
     */
    getByID({ body: { id } }, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const item = yield ApprovalFlow_1.default.findById(id).exec();
            if (!item) {
                throw new AdvancedError_1.default({
                    approvalFlow: { kind: 'not.found', message: 'ApprovalFlow not found' },
                });
            }
            res.send(new ResponseResult_1.default({
                data: item,
                message: 'Get ApprovalFlow successfully',
            }));
        });
    }
    getActive(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.user;
            const item = yield ApprovalFlow_1.default.findOne({
                status: 'ACTIVE',
                location: user.location.id,
            }).exec();
            if (!item) {
                throw new AdvancedError_1.default({
                    approvalFlow: { kind: 'not.found', message: 'ApprovalFlow not found' },
                });
            }
            res.send(new ResponseResult_1.default({
                data: item,
                message: 'Get ApprovalFlow successfully',
            }));
        });
    }
    initFlowLocation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body: { location }, } = req;
            const approvalFlowDefault = yield ApprovalFlow_1.default.findOne({ location, status: 'ACTIVE' });
            let approvalFlow;
            if (!approvalFlowDefault) {
                const locationCheck = yield Location_1.default.findById(location);
                if (!locationCheck) {
                    throw new AdvancedError_1.default({
                        location: {
                            kind: 'not.found',
                            message: 'Location not found.',
                        },
                    });
                }
                let aggregate = [];
                const matchOne = { $match: {} };
                if (location) {
                    matchOne.$match.location = mongoose_1.Types.ObjectId(location);
                }
                aggregate.push(matchOne);
                const lookup = [
                    {
                        $lookup: {
                            from: 'users',
                            localField: '_id',
                            foreignField: 'employee',
                            as: 'user',
                        },
                    },
                    {
                        $unwind: {
                            path: '$user',
                            preserveNullAndEmptyArrays: true,
                        },
                    },
                ];
                aggregate = [...aggregate, ...lookup];
                const matchTwo = { $match: {} };
                const matchAnd = {
                    $and: [],
                };
                matchAnd.$and.push({
                    'user.roles': { $in: ['HR-MANAGER'] },
                });
                matchTwo.$match = matchAnd;
                aggregate.push(matchTwo);
                const project = {
                    $project: {
                        _id: 1,
                    },
                };
                aggregate.push(project);
                const hrManager = yield Employee_1.default.aggregate(aggregate);
                if (hrManager.length === 0) {
                    throw new AdvancedError_1.default({
                        hrManager: {
                            kind: 'not.found',
                            message: 'hrManager not found.',
                        },
                    });
                }
                const approvalFlowGroup = yield ApprovalFlowGroup_1.default.create({
                    name: 'HR Team USA',
                    members: [hrManager[0]._id],
                    description: 'approvalFlowGroup HR Team',
                    location: locationCheck,
                    company: locationCheck.company,
                });
                console.log(locationCheck);
                approvalFlow = yield ApprovalFlow_1.default.create({
                    location: locationCheck._id,
                    company: locationCheck.company,
                    name: "Default Approval Flow Off Boarding",
                    type: "OffBoarding",
                    nodes: [
                        {
                            "type": "DirectManager",
                            "value": "Direct Manager"
                        },
                        {
                            "type": "ApprovalFlowGroup",
                            "value": approvalFlowGroup._id.toString(),
                            "data": null
                        }
                    ]
                });
                res.send(new ResponseResult_1.default({
                    message: 'Add ApprovalFlow successfully',
                    data: approvalFlow
                }));
            }
            else {
                throw new AdvancedError_1.default({
                    approvalFlow: {
                        kind: 'existed',
                        message: 'approvalFlow existed',
                    },
                });
            }
        });
    }
}
exports.default = new ApprovalFlowController(ApprovalFlow_1.default);
//# sourceMappingURL=ApprovalFlowController.js.map