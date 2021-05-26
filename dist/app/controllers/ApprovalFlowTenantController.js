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
// import ApprovalFlowGroupTenant from '@/app/models/ApprovalFlowGroupTenant'
// import { PENDING_REIMBURSEMENT_STATUS } from '@/app/declares/Enums'
// import ApprovalFlowTenant from '@/app/models/ApprovalFlowTenant'
// import EmployeeTenant from '@/app/models/EmployeeTenant'
// import LocationTenant from '@/app/models/LocationTenant'
// import OffBoardingRequestTenant from '@/app/models/OffBoardingRequestTenant'
const ResponseResult_1 = __importDefault(require("@/app/services/ResponseResult"));
const constant_1 = require("@/app/utils/constant");
const lodash_1 = require("lodash");
const mongoose_1 = require("mongoose");
const ApprovalFlowTenant_1 = __importDefault(require("../models/ApprovalFlowTenant"));
const EmployeeTenant_1 = __importDefault(require("../models/EmployeeTenant"));
const LocationTenant_1 = __importDefault(require("../models/LocationTenant"));
const OffBoardingRequestTenant_1 = __importDefault(require("../models/OffBoardingRequestTenant"));
class ApprovalFlowTenantController extends AbstractController_1.default {
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
            const tenantId = req.header('tenantId');
            const currentUser = req.user;
            const { body: { q, location = currentUser.employee.location.id }, } = req;
            const searchQ = { $regex: q, $options: 'i' };
            // Validate location by currentUser.company
            const item = yield LocationTenant_1.default.getInstance(tenantId)
                .findOne({
                _id: location,
                company: currentUser.employee.company,
            })
                .exec();
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
                data: yield ApprovalFlowTenant_1.default.getInstance(tenantId)
                    .find(filter)
                    .exec(),
                message: 'Get list successfully.',
            }));
        });
    }
    add(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tenantId = req.header('tenantId');
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
            const item = yield LocationTenant_1.default.getInstance(tenantId)
                .findOne({
                _id: location,
                company: currentUser.employee.company,
            })
                .exec();
            if (!item) {
                throw new AdvancedError_1.default({
                    location: { kind: 'not.found', message: 'Location not found' },
                });
            }
            body.company = currentUser.employee.company.id;
            body.location = location;
            res.send(new ResponseResult_1.default({
                message: 'Add ApprovalFlow successfully',
                data: yield ApprovalFlowTenant_1.default.getInstance(tenantId).create(body),
            }));
        });
    }
    /**
     * update
     */
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tenantId = req.header('tenantId');
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
            const item = yield ApprovalFlowTenant_1.default.getInstance(tenantId)
                .findOne({
                _id: id,
                company: currentUser.employee.company,
            })
                .exec();
            if (!item) {
                throw new AdvancedError_1.default({
                    ApprovalFlowGroup: {
                        kind: 'not.found',
                        message: 'ApprovalFlow not found',
                    },
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
            const tenantId = req.header('tenantId');
            let { body: { id }, } = req;
            const currentUser = req.user;
            const item = yield ApprovalFlowTenant_1.default.getInstance(tenantId)
                .findOne({
                _id: id,
                company: currentUser.employee.company,
            })
                .exec();
            if (!item) {
                throw new AdvancedError_1.default({
                    item: { kind: 'not.found', message: 'ApprovalFlow not found' },
                });
            }
            yield this.getTicketRequest(item, req);
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
    getTicketRequest(approvalFlowItem, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const tenantId = req.header('tenantId');
            let ticketRequest = null;
            switch (approvalFlowItem.type) {
                case constant_1.TYPE_TICKET_REQUEST.offBoarding:
                    ticketRequest = OffBoardingRequestTenant_1.default.getInstance(tenantId)
                        .findOne({
                        approvalFlow: approvalFlowItem.id,
                    })
                        .exec();
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
            const tenantId = req.header('tenantId');
            let { body: { id }, } = req;
            const currentUser = req.user;
            const item = yield ApprovalFlowTenant_1.default.getInstance(tenantId)
                .findOne({
                _id: id,
                company: currentUser.employee.company,
            })
                .exec();
            if (!item) {
                throw new AdvancedError_1.default({
                    item: { kind: 'not.found', message: 'ApprovalFlow not found' },
                });
            }
            // Inactive all ApprovalFlow
            yield ApprovalFlowTenant_1.default.getInstance(tenantId).updateMany({
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
    getByID(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tenantId = req.header('tenantId');
            const item = yield ApprovalFlowTenant_1.default.getInstance(tenantId)
                .findById(req.body.id)
                .exec();
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
            const tenantId = req.header('tenantId');
            const user = req.user;
            const item = yield ApprovalFlowTenant_1.default.getInstance(tenantId)
                .findOne({
                status: 'ACTIVE',
                location: user.location.id,
            })
                .exec();
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
            const tenantId = req.header('tenantId');
            const { body: { location }, } = req;
            const approvalFlowDefault = yield ApprovalFlowTenant_1.default.getInstance(tenantId).findOne({
                location,
                status: 'ACTIVE',
            });
            let approvalFlow;
            if (!approvalFlowDefault) {
                const locationCheck = yield LocationTenant_1.default.getInstance(tenantId).findById(location);
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
                const hrManager = yield EmployeeTenant_1.default.getInstance(tenantId).aggregate(aggregate);
                if (hrManager.length === 0) {
                    throw new AdvancedError_1.default({
                        hrManager: {
                            kind: 'not.found',
                            message: 'hrManager not found.',
                        },
                    });
                }
                const approvalFlowGroup = yield ApprovalFlowTenant_1.default.getInstance(tenantId).create({
                    name: 'HR Team USA',
                    members: [hrManager[0]._id],
                    description: 'approvalFlowGroup HR Team',
                    location: locationCheck,
                    company: locationCheck.company,
                });
                console.log(locationCheck);
                approvalFlow = yield ApprovalFlowTenant_1.default.getInstance(tenantId).create({
                    location: locationCheck._id,
                    company: locationCheck.company,
                    name: 'Default Approval Flow Off Boarding',
                    type: 'OffBoarding',
                    nodes: [
                        {
                            type: 'DirectManager',
                            value: 'Direct Manager',
                        },
                        {
                            type: 'ApprovalFlowGroup',
                            value: approvalFlowGroup._id.toString(),
                            data: null,
                        },
                    ],
                });
                res.send(new ResponseResult_1.default({
                    message: 'Add ApprovalFlow successfully',
                    data: approvalFlow,
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
exports.default = new ApprovalFlowTenantController();
//# sourceMappingURL=ApprovalFlowTenantController.js.map