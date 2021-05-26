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
const Enums_1 = require("@/app/declares/Enums");
// import ApprovalFlow from '@/app/models/ApprovalFlow'
// import ApprovalFlowGroup from '@/app/models/ApprovalFlowGroup'
// import Company from '@/app/models/Company'
const CompoffRequest_1 = __importDefault(require("@/app/models/CompoffRequest"));
const Project_1 = __importDefault(require("@/app/models/Project"));
// import Location from '@/app/models/Location'
const ResponseResult_1 = __importDefault(require("@/app/services/ResponseResult"));
const constant_1 = require("@/app/utils/constant");
const bluebird_1 = __importDefault(require("bluebird"));
// import admin from 'firebase-admin'
const lodash_1 = require("lodash");
// import moment from 'moment'
// import {identity, pickBy, sumBy } from 'lodash'
const mongoose_1 = require("mongoose");
const Employee_1 = __importDefault(require("../models/Employee"));
const User_1 = __importDefault(require("../models/User"));
// import Project from '../models/Project'
const HistoryService_1 = __importDefault(require("../services/HistoryService"));
const SendMail_1 = require("../services/SendMail");
class CompoffRequestController extends AbstractController_1.default {
    generateMethods() {
        return [
            {
                name: 'add',
                type: 'POST',
                _ref: this.add.bind(this),
                validationSchema: {
                    action: {
                        isIn: {
                            options: [['saveDraft', 'submit']],
                            errorMessage: [
                                'isIn',
                                ['saveDraft', 'submit'].join(', '),
                                `Action (action) argument must be one of the words: '{isIn}'`,
                            ],
                        },
                        trim: {
                            options: ' ',
                        },
                    },
                },
            },
            {
                name: 'remove',
                type: 'POST',
                _ref: this.remove.bind(this),
                // possiblePers: ['HR'],
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
                name: 'update',
                type: 'POST',
                _ref: this.update.bind(this),
                // possiblePers: ['HR'],
                validationSchema: {
                    _id: {
                        in: 'body',
                        exists: {
                            errorMessage: ['required', 'Id must be provided'],
                        },
                    },
                },
            },
            {
                name: 'get-by-employee',
                type: 'POST',
                _ref: this.getByEmployee.bind(this),
            },
            {
                name: 'get-by-id',
                type: 'POST',
                _ref: this.getByID.bind(this),
            },
            // {
            //   name: 'get-upcoming-request',
            //   type: 'POST',
            //   _ref: this.getUpcomingRequest.bind(this),
            //   // possiblePers: ['HR'],
            // },
            {
                name: 'get-team-request',
                type: 'POST',
                _ref: this.getTeamRequest.bind(this),
            },
            {
                name: 'get-my-request',
                type: 'POST',
                _ref: this.getUserRequest.bind(this),
            },
            // {
            //   name: 'approval-by-user',
            //   type: 'POST',
            //   _ref: this.approvalByUser.bind(this),
            // },
            // {
            //   name: 'approval-by-other',
            //   type: 'POST',
            //   _ref: this.approvalByOther.bind(this),
            // },
            {
                name: 'update-draft',
                type: 'POST',
                _ref: this.updateDraft.bind(this),
            },
            {
                name: 'get-approval-flow',
                type: 'POST',
                _ref: this.getApprovalFlow.bind(this),
                // possiblePers: ['HR'],
                validationSchema: {
                    projectId: {
                        in: 'body',
                        exists: {
                            errorMessage: ['required', 'projectId must be provided'],
                        },
                    },
                    employeeId: {
                        in: 'body',
                        exists: {
                            errorMessage: ['required', 'employeeId must be provided'],
                        },
                    },
                },
            },
            {
                name: 'approve-compoff-request',
                type: 'POST',
                _ref: this.approveRequest.bind(this),
                // possiblePers: ['HR'],
                validationSchema: {
                    _id: {
                        in: 'body',
                        exists: {
                            errorMessage: [
                                'required',
                                'Compoff request id must be provided (_id)',
                            ],
                        },
                    },
                },
            },
            {
                name: 'reject-compoff-request',
                type: 'POST',
                _ref: this.rejectRequest.bind(this),
                // possiblePers: ['HR'],
                validationSchema: {
                    _id: {
                        in: 'body',
                        exists: {
                            errorMessage: [
                                'required',
                                'Compoff request id must be provided (_id)',
                            ],
                        },
                    },
                },
            },
            {
                name: 'approve-multiple-compoff-request',
                type: 'POST',
                _ref: this.approveMultipleRequests.bind(this),
                // possiblePers: ['HR'],
                validationSchema: {
                    ticketList: {
                        in: 'body',
                        exists: {
                            errorMessage: [
                                'required',
                                'Array of compoff requests id must be provided (ticketList)',
                            ],
                        },
                    },
                },
            },
            {
                name: 'reject-multiple-compoff-request',
                type: 'POST',
                _ref: this.rejectMultipleRequests.bind(this),
                // possiblePers: ['HR'],
                validationSchema: {
                    ticketList: {
                        in: 'body',
                        exists: {
                            errorMessage: [
                                'required',
                                'Array of compoff requests id must be provided (ticketList)',
                            ],
                        },
                    },
                },
            },
        ];
    }
    isCreator({ body: { reId, id = reId, _id = id }, user, }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const item = yield this.model
                    .findOne({ _id, user: user._id })
                    .exec();
                return !!item;
            }
            catch (err) {
                return false;
            }
        });
    }
    hasManager({ approvalFlow = {} } = {}) {
        let isHas = false;
        lodash_1.forEach(approvalFlow.nodes, (obj = {}) => {
            if (obj.type === 'DirectManager') {
                isHas = true;
            }
        });
        return isHas;
    }
    getApprovalFlowFunc(employeeId, projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (employeeId === '' || projectId === '') {
                throw new AdvancedError_1.default({
                    leaverequest: {
                        kind: 'empty.body',
                        message: 'Compoff flow API: employeeId and projectId is required!',
                    },
                });
            }
            // get project manager
            const projectManagerDB = yield Project_1.default.findOne({
                _id: projectId,
            });
            const { manager } = projectManagerDB;
            const projectManager = {
                _id: manager._id,
                generalInfo: manager.generalInfo,
            };
            // get region head (ADMIN-CLA)
            const employeeDB = yield Employee_1.default.findOne({
                _id: employeeId,
            });
            if (!employeeDB) {
                throw new AdvancedError_1.default({
                    leaverequest: {
                        kind: 'not.found',
                        message: 'Compoff flow API: employeeId is not found!',
                    },
                });
            }
            const locationId = employeeDB.location._id;
            const employees = yield Employee_1.default.aggregate([
                {
                    $match: {
                        location: locationId,
                    },
                },
            ]);
            const users = yield User_1.default.aggregate([
                {
                    $match: {
                        roles: 'ADMIN-CLA',
                    },
                },
            ]);
            const adminCLAId = users
                .map(user => {
                return employees
                    .map(employee => {
                    if (String(user.employee) === String(employee._id)) {
                        return employee;
                    }
                    return 0;
                })
                    .filter(employee => employee !== 0)[0];
            })
                .filter(user => user !== undefined)[0]._id;
            const adminCLA = yield Employee_1.default.findOne({
                _id: adminCLAId,
            });
            if (adminCLA.length === 0 || Object.keys(projectManager).length === 0) {
                throw new AdvancedError_1.default({
                    leaverequest: {
                        kind: 'not.found',
                        message: 'Compoff flow API: Unable to get your project manager/region head. Contact backend developer!',
                    },
                });
            }
            const data = {
                step1: {
                    employee: employeeDB._id,
                    generalInfo: employeeDB.generalInfo,
                    name: 'Requested Employee',
                },
                step2: {
                    employee: projectManager._id,
                    generalInfo: projectManager.generalInfo,
                    name: 'Project Manager',
                },
                step3: {
                    employee: adminCLA._id,
                    generalInfo: adminCLA.generalInfo,
                    name: 'Region Head (ADMIN-CLA)',
                },
            };
            return data;
        });
    }
    getApprovalFlow(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { employeeId, projectId } = req.body;
            const data = yield this.getApprovalFlowFunc(employeeId, projectId);
            res.send(new ResponseResult_1.default({
                data,
                message: 'Get compoff flow of employee successfully.',
            }));
        });
    }
    add(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { project, extraTime, description, cc, action, onDate } = req.body;
            const user = req.user;
            const { employee = user.employee.id, location = user.employee.location.id, company = user.employee.company.id, manager = user.employee.manager ? user.employee.manager.id : '', } = user;
            if (manager === '') {
                throw new AdvancedError_1.default({
                    manager: {
                        path: 'method',
                        kind: 'not.found',
                        message: 'Manager not found',
                    },
                });
            }
            const approvalFlow = yield this.getApprovalFlowFunc(user.employee.id, project);
            if (!approvalFlow) {
                throw new AdvancedError_1.default({
                    leaverequest: {
                        kind: 'not.found',
                        message: 'Compoff flow API: Could not find approval flow. Make sure that employee is in this project.',
                    },
                });
            }
            let totalHours = 0;
            extraTime.forEach((value) => {
                totalHours += value.timeSpend;
            });
            let data = {
                project,
                extraTime,
                employee,
                description,
                cc,
                location,
                company,
                approvalFlow: {
                    step1: {
                        employee: mongoose_1.Types.ObjectId(approvalFlow.step1.employee),
                        name: approvalFlow.step1.name,
                    },
                    step2: {
                        employee: mongoose_1.Types.ObjectId(approvalFlow.step2.employee),
                        name: approvalFlow.step2.name,
                    },
                    step3: {
                        employee: mongoose_1.Types.ObjectId(approvalFlow.step3.employee),
                        name: approvalFlow.step3.name,
                    },
                },
                onDate,
                currentStep: 2,
                totalHours,
                status: action === 'submit'
                    ? constant_1.TYPE_COMPOFF_REQUEST.statusType.inProgress
                    : constant_1.TYPE_COMPOFF_REQUEST.statusType.draft,
            };
            if (action === 'submit') {
                data.date = new Date();
            }
            data.ticketID = '' + Math.floor(10000 + Math.random() * 90000);
            // let admins: any = await this.getEmployeeByRole(
            //   'ADMIN-CLA',
            //   employee.location._id,
            // )
            let hrManagers = yield this.getEmployeeByRole('HR-MANAGER', employee.location._id);
            const ccId = cc.map((person) => mongoose_1.Types.ObjectId(person));
            let ccEmployees;
            let ccEmails = [];
            if (cc.length > 0) {
                ccEmployees = yield Employee_1.default.find({ _id: { $in: ccId } });
                ccEmails = ccEmployees.map((employee) => {
                    return {
                        email: employee.generalInfo.workEmail,
                    };
                });
            }
            const times = extraTime.map((item) => `<li>Date: ${item.date}. Amount: ${item.timeSpend}</li>`);
            const requesteeName = `${user.employee.generalInfo.firstName} ${user.employee.generalInfo.lastName}`;
            let mailTitle = `[Compoff Request] New compoff request from ${requesteeName}`;
            let mailContent = `
        <p>New compoff request from ${requesteeName}</p>
        <ul>${times}</ul>`;
            // Mail notify to employee
            if (employee) {
                const employeeName = `${employee.generalInfo.firstName} ${employee.generalInfo.lastName}`;
                const employeeEmail = employee.generalInfo.workEmail;
                yield SendMail_1.sendNotificationCompoff({
                    email: employeeEmail,
                    fullName: employeeName,
                }, [], mailTitle, mailContent);
            }
            // Mail notify to Project manager
            const projectInfo = yield Project_1.default.findById(project);
            if (projectInfo.manager) {
                const managerInfo = projectInfo.manager;
                const managerName = `${managerInfo.generalInfo.firstName} ${managerInfo.generalInfo.lastName}`;
                const managerEmail = managerInfo.generalInfo.workEmail;
                yield SendMail_1.sendNotificationCompoff({
                    email: managerEmail,
                    fullName: managerName,
                }, ccEmails, mailTitle, mailContent);
            }
            // Mail notify to ADMIN-CLA
            // if (admins.length > 0) {
            //   Bluebird.map(admins, async (admin: any) => {
            //     const adminName = `${admin.employee.generalInfo.firstName} ${admin.employee.generalInfo.lastName}`
            //     const adminEmail = admin.employee.generalInfo.workEmail
            //     const times = extraTime.map(
            //       (item: { date: Date; timeSpend: number }) =>
            //         `<li>Date: ${item.date}. Amount: ${item.timeSpend}</li>`,
            //     )
            //     const adminMailContent = `
            //       <p>${requesteeName} has been requested a compensatory off:</p>
            //       <ul>${times}</ul>
            //     `
            //     await sendNotificationCompoff(
            //       {
            //         email: adminEmail,
            //         fullName: adminName,
            //       },
            //       [],
            //       'Offboarding notification to Admin CLA',
            //       adminMailContent,
            //     )
            //   })
            // }
            // Mail notify to HR Managers
            if (hrManagers.length > 0) {
                bluebird_1.default.map(hrManagers, (manager) => __awaiter(this, void 0, void 0, function* () {
                    const hrManagerName = `${manager.employee.generalInfo.firstName} ${manager.employee.generalInfo.lastName}`;
                    const hrManagerEmail = manager.employee.generalInfo.workEmail;
                    yield SendMail_1.sendNotificationCompoff({
                        email: hrManagerEmail,
                        fullName: hrManagerName,
                    }, [], mailTitle, mailContent);
                }));
            }
            let item = yield new CompoffRequest_1.default(data).save();
            res.send(new ResponseResult_1.default({
                data: item,
                message: 'Create successfully',
            }));
        });
    }
    // Update
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { _id } = req.body;
            const user = req.user;
            const { employee } = user;
            // const currentUser = req.user as IUser
            // const employee = currentUser.employee as IEmployee
            // const checkUser = await this.model.findById({ employee: employee })
            const data = yield this.model.findById(_id);
            // if (!checkUser) {
            //   throw new AdvancedError({
            //     compoffrequest: {
            //       kind: 'permission',
            //       message: 'You are not the author of this request',
            //     },
            //   })
            // }
            if (!data) {
                throw new AdvancedError_1.default({
                    compoffRequest: {
                        kind: 'not.found',
                        message: 'Compoff request not found',
                    },
                });
            }
            data.set(req.body);
            yield data.save();
            let hrManagers = yield this.getEmployeeByRole('HR-MANAGER', employee.location._id);
            const { cc } = data;
            const ccId = cc.map((person) => mongoose_1.Types.ObjectId(person));
            let ccEmployees;
            let ccEmails = [];
            if (cc.length > 0) {
                ccEmployees = yield Employee_1.default.find({ _id: { $in: ccId } });
                ccEmails = ccEmployees.map((employee) => {
                    return {
                        fullName: `${employee.generalInfo.firstName} ${employee.generalInfo.lastName}`,
                        email: employee.generalInfo.workEmail,
                    };
                });
            }
            const requesteeName = `${user.employee.generalInfo.firstName} ${user.employee.generalInfo.lastName}`;
            let mailTitle = `[Compoff Request] Compoff request of ${requesteeName} has been updated`;
            let mailContent = `
        <p>Compoff request of ${requesteeName} has been updated</p>
      `;
            // Mail notify to employee
            if (employee) {
                const employeeName = `${employee.generalInfo.firstName} ${employee.generalInfo.lastName}`;
                const employeeEmail = employee.generalInfo.workEmail;
                yield SendMail_1.sendNotificationCompoff({
                    email: employeeEmail,
                    fullName: employeeName,
                }, [], mailTitle, mailContent);
            }
            // Mail notify to Project manager
            const projectInfo = yield Project_1.default.findById(data.project._id);
            if (projectInfo.manager) {
                const managerInfo = projectInfo.manager;
                const managerName = `${managerInfo.generalInfo.firstName} ${managerInfo.generalInfo.lastName}`;
                const managerEmail = managerInfo.generalInfo.workEmail;
                yield SendMail_1.sendNotificationCompoff({
                    email: managerEmail,
                    fullName: managerName,
                }, ccEmails, mailTitle, mailContent);
            }
            // Mail notify to HR Managers
            if (hrManagers.length > 0) {
                bluebird_1.default.map(hrManagers, (manager) => __awaiter(this, void 0, void 0, function* () {
                    const hrManagerName = `${manager.employee.generalInfo.firstName} ${manager.employee.generalInfo.lastName}`;
                    const hrManagerEmail = manager.employee.generalInfo.workEmail;
                    yield SendMail_1.sendNotificationCompoff({
                        email: hrManagerEmail,
                        fullName: hrManagerName,
                    }, [], mailTitle, mailContent);
                }));
            }
            res.send(new ResponseResult_1.default({
                data,
                message: 'Update successfully',
            }));
        });
    }
    // Remove
    remove(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body: { id }, } = req;
            const currentUser = req.user;
            const { employee, _id: userId } = currentUser;
            const item = yield CompoffRequest_1.default.findById(id).exec();
            if (!item) {
                throw new AdvancedError_1.default({
                    report: {
                        kind: 'not.found',
                        message: 'Report not found',
                    },
                });
            }
            const { status } = item;
            const reportStatus = lodash_1.get(item, 'assign.manager.status');
            if (Enums_1.PENDING_REIMBURSEMENT_STATUS.includes(status) &&
                reportStatus &&
                // reportStatus !== 'PENDING'
                reportStatus !== constant_1.TYPE_COMPOFF_REQUEST.statusType.inProgress) {
                throw new AdvancedError_1.default({
                    report: {
                        kind: 'processing',
                        message: `You are not allowed to update this request at the moment, because it was reviewed!`,
                    },
                });
            }
            if (status === constant_1.TYPE_COMPOFF_REQUEST.statusType.deleted) {
                throw new AdvancedError_1.default({
                    report: {
                        kind: 'deleted',
                        message: 'Compoff request has been already deleted.',
                    },
                });
            }
            yield item
                .set({ status: constant_1.TYPE_COMPOFF_REQUEST.statusType.deleted, bills: [] })
                .save();
            yield HistoryService_1.default.put({
                object: item._id,
                onModel: 'CompoffRequest',
                performer: userId,
                action: constant_1.TYPE_COMPOFF_REQUEST.statusType.deleted,
                company: currentUser.employee.company.id,
                location: currentUser.employee.location.id,
            });
            let hrManagers = yield this.getEmployeeByRole('HR-MANAGER', employee.location._id);
            const { cc } = item;
            const ccId = cc.map((person) => mongoose_1.Types.ObjectId(person));
            let ccEmployees;
            let ccEmails = [];
            if (cc.length > 0) {
                ccEmployees = yield Employee_1.default.find({ _id: { $in: ccId } });
                ccEmails = ccEmployees.map((employee) => {
                    return {
                        fullName: `${employee.generalInfo.firstName} ${employee.generalInfo.lastName}`,
                        email: employee.generalInfo.workEmail,
                    };
                });
            }
            const requesteeName = `${currentUser.employee.generalInfo.firstName} ${currentUser.employee.generalInfo.lastName}`;
            let mailTitle = `[Compoff Request] Compoff request of ${requesteeName} has been withdrawn.`;
            let mailContent = `<p>Compoff request of ${requesteeName} has been withdrawn.</p>`;
            // Mail notify to employee
            if (employee) {
                const employeeName = `${employee.generalInfo.firstName} ${employee.generalInfo.lastName}`;
                const employeeEmail = employee.generalInfo.workEmail;
                yield SendMail_1.sendNotificationCompoff({
                    email: employeeEmail,
                    fullName: employeeName,
                }, [], mailTitle, mailContent);
            }
            // Mail notify to Project manager
            const projectInfo = yield Project_1.default.findById(item.project._id);
            if (projectInfo.manager) {
                const managerInfo = projectInfo.manager;
                const managerName = `${managerInfo.generalInfo.firstName} ${managerInfo.generalInfo.lastName}`;
                const managerEmail = managerInfo.generalInfo.workEmail;
                yield SendMail_1.sendNotificationCompoff({
                    email: managerEmail,
                    fullName: managerName,
                }, ccEmails, mailTitle, mailContent);
            }
            // Mail notify to HR Managers
            if (hrManagers.length > 0) {
                bluebird_1.default.map(hrManagers, (manager) => __awaiter(this, void 0, void 0, function* () {
                    const hrManagerName = `${manager.employee.generalInfo.firstName} ${manager.employee.generalInfo.lastName}`;
                    const hrManagerEmail = manager.employee.generalInfo.workEmail;
                    yield SendMail_1.sendNotificationCompoff({
                        email: hrManagerEmail,
                        fullName: hrManagerName,
                    }, [], mailTitle, mailContent);
                }));
            }
            const result = new ResponseResult_1.default({
                message: 'Remove compoffrequest successfully.',
                data: item,
            });
            res.send(result);
        });
    }
    // Get By Employee
    getByEmployee(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { employee } = req.body;
            const existRequest = yield this.model.findById(employee);
            if (!existRequest) {
                throw new AdvancedError_1.default({
                    compoffRequest: {
                        kind: 'not.found',
                        message: 'Employee not found',
                    },
                });
            }
            res.send(new ResponseResult_1.default({
                data: existRequest,
                message: 'List by employee successfully',
            }));
        });
    }
    // Get By Id
    getByID(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.body;
            let aggregate = [];
            let matchOne = { $match: {} };
            matchOne.$match._id = mongoose_1.Types.ObjectId(id);
            aggregate.push(matchOne);
            const lookup = [
                {
                    $lookup: {
                        from: 'users',
                        localField: 'employee',
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
                {
                    $lookup: {
                        from: 'locations',
                        localField: 'location',
                        foreignField: '_id',
                        as: 'location',
                    },
                },
                {
                    $unwind: {
                        path: '$location',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'projects',
                        localField: 'project',
                        foreignField: '_id',
                        as: 'project',
                    },
                },
                {
                    $unwind: {
                        path: '$project',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'employees',
                        localField: 'employee',
                        foreignField: '_id',
                        as: 'employee',
                    },
                },
                {
                    $unwind: {
                        path: '$employee',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'generalinfos',
                        localField: 'employee.generalInfo',
                        foreignField: '_id',
                        as: 'employee.generalInfo',
                    },
                },
                {
                    $unwind: {
                        path: '$employee.generalInfo',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'employees',
                        localField: 'manager',
                        foreignField: '_id',
                        as: 'manager',
                    },
                },
                {
                    $unwind: {
                        path: '$manager',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'generalinfos',
                        localField: 'manager.generalInfo',
                        foreignField: '_id',
                        as: 'manager.generalInfo',
                    },
                },
                {
                    $unwind: {
                        path: '$manager.generalInfo',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'employees',
                        localField: 'project.manager',
                        foreignField: '_id',
                        as: 'project.manager',
                    },
                },
                {
                    $unwind: {
                        path: '$project.manager',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'generalinfos',
                        localField: 'project.manager.generalInfo',
                        foreignField: '_id',
                        as: 'project.manager.generalInfo',
                    },
                },
                {
                    $unwind: {
                        path: '$project.manager.generalInfo',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                // {
                //   $lookup: {
                //     from: 'employees',
                //     localField: 'project.manager',
                //     foreignField: '_id',
                //     as: 'project.manager',
                //   },
                // },
                // {
                //   $unwind: {
                //     path: '$project.manager',
                //     preserveNullAndEmptyArrays: true,
                //   },
                // },
                {
                    $lookup: {
                        from: 'titles',
                        localField: 'employee.title',
                        foreignField: '_id',
                        as: 'employee.position',
                    },
                },
                {
                    $unwind: {
                        path: '$employee.position',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'employees',
                        localField: 'approvalFlow.step1.employee',
                        foreignField: '_id',
                        as: 'approvalFlow.step1.employee',
                    },
                },
                {
                    $unwind: {
                        path: '$approvalFlow.step1.employee',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'employees',
                        localField: 'approvalFlow.step2.employee',
                        foreignField: '_id',
                        as: 'approvalFlow.step2.employee',
                    },
                },
                {
                    $unwind: {
                        path: '$approvalFlow.step2.employee',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'employees',
                        localField: 'approvalFlow.step3.employee',
                        foreignField: '_id',
                        as: 'approvalFlow.step3.employee',
                    },
                },
                {
                    $unwind: {
                        path: '$approvalFlow.step3.employee',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                // get steps general info
                {
                    $lookup: {
                        from: 'generalinfos',
                        localField: 'approvalFlow.step1.employee.generalInfo',
                        foreignField: '_id',
                        as: 'approvalFlow.step1.employee.generalInfo',
                    },
                },
                {
                    $unwind: {
                        path: '$approvalFlow.step1.employee.generalInfo',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'generalinfos',
                        localField: 'approvalFlow.step2.employee.generalInfo',
                        foreignField: '_id',
                        as: 'approvalFlow.step2.employee.generalInfo',
                    },
                },
                {
                    $unwind: {
                        path: '$approvalFlow.step2.employee.generalInfo',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'generalinfos',
                        localField: 'approvalFlow.step3.employee.generalInfo',
                        foreignField: '_id',
                        as: 'approvalFlow.step3.employee.generalInfo',
                    },
                },
                {
                    $unwind: {
                        path: '$approvalFlow.step3.employee.generalInfo',
                        preserveNullAndEmptyArrays: true,
                    },
                },
            ];
            aggregate = [...aggregate, ...lookup];
            const project = {
                $project: {
                    ticketID: 1,
                    project: {
                        _id: 1,
                        name: 1,
                        beginDate: 1,
                        endDate: 1,
                        type: 1,
                        projectHealth: 1,
                    },
                    duration: {
                        from: 1,
                        to: 1,
                    },
                    extraTime: 1,
                    description: 1,
                    onDate: 1,
                    // cc: {
                    //   $map: {
                    //     input: '$cc',
                    //     as: 'cc',
                    //     in: {
                    //       firstName: '$employee.generalInfo.firstName',
                    //       lastName: '$employee.generalInfo.lastName',
                    //       avatar: '$employee.generalInfo.avatar',
                    //       _id: '$employee._id',
                    //     },
                    //   },
                    // },
                    cc: 1,
                    status: 1,
                    totalHours: 1,
                    location: {
                        _id: 1,
                        name: 1,
                        country: 1,
                        phone: 1,
                        company: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        address: 1,
                        state: 1,
                        zipCode: 1,
                    },
                    company: {
                        _id: 1,
                        locationCode: 1,
                        name: 1,
                        phone: 1,
                        address: 1,
                    },
                    approvalFlow: {
                        step1: {
                            employee: {
                                _id: 1,
                                generalInfo: 1,
                            },
                            name: 1,
                        },
                        step2: {
                            employee: {
                                _id: 1,
                                generalInfo: 1,
                            },
                            name: 1,
                        },
                        step3: {
                            employee: {
                                _id: 1,
                                generalInfo: 1,
                            },
                            name: 1,
                        },
                    },
                    currentStep: 1,
                    'manager.generalInfo': {
                        _id: 1,
                        firstName: 1,
                        lastName: 1,
                        avatar: 1,
                    },
                    'project.manager.generalInfo': {
                        _id: 1,
                        firstName: 1,
                        lastName: 1,
                        avatar: 1,
                    },
                    'project.manager': {
                        _id: 1,
                    },
                    employee: {
                        _id: 1,
                        employeeId: 1,
                        generalInfo: {
                            firstName: 1,
                            lastName: 1,
                            legalName: 1,
                            avatar: '',
                        },
                        position: {
                            name: 1,
                        },
                    },
                    commentPM: 1,
                    commentCLA: 1,
                },
            };
            aggregate.push(project);
            const items = (yield CompoffRequest_1.default.aggregate(aggregate));
            if (!items.length) {
                throw new AdvancedError_1.default({
                    compoffrequest: {
                        kind: 'not.found',
                        message: 'Compoff request not found',
                    },
                });
            }
            res.send(new ResponseResult_1.default({
                data: items[0],
                message: 'Get by id successfully',
            }));
        });
    }
    getTeamRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = req.user;
            let employee = currentUser.employee;
            employee = yield Employee_1.default.findById(currentUser.employee);
            const { body: { 
            // limit = 0, page = 1, skip = 0,
            status: inputStatus = [], location = [], }, } = req;
            const company = [];
            company.push(employee.company.id);
            let locationId = location.map((s) => {
                return mongoose_1.Types.ObjectId(s);
            });
            let companyId = company.map((s) => {
                return mongoose_1.Types.ObjectId(s);
            });
            let aggregate = [];
            let aggregateTotal = [];
            const matchOne = { $match: {} };
            if (locationId.length > 0) {
                matchOne.$match.location = {};
                matchOne.$match.location = { $in: locationId };
            }
            if (companyId.length > 0) {
                matchOne.$match.company = {};
                matchOne.$match.company = { $in: companyId };
            }
            if (inputStatus.length !== 0) {
                const st = {
                    $or: [],
                };
                inputStatus.map((value) => {
                    st.$or.push({ status: value });
                });
                matchOne.$match.$or = st.$or;
            }
            aggregate.push(matchOne);
            aggregateTotal.push(matchOne);
            const lookup = [
                {
                    $lookup: {
                        from: 'users',
                        localField: 'employee',
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
                {
                    $lookup: {
                        from: 'locations',
                        localField: 'location',
                        foreignField: '_id',
                        as: 'location',
                    },
                },
                {
                    $unwind: {
                        path: '$location',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'projects',
                        localField: 'project',
                        foreignField: '_id',
                        as: 'project',
                    },
                },
                {
                    $unwind: {
                        path: '$project',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'employees',
                        localField: 'employee',
                        foreignField: '_id',
                        as: 'employee',
                    },
                },
                {
                    $unwind: {
                        path: '$employee',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'generalinfos',
                        localField: 'employee.generalInfo',
                        foreignField: '_id',
                        as: 'employee.generalInfo',
                    },
                },
                {
                    $unwind: {
                        path: '$employee.generalInfo',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'employees',
                        localField: 'manager',
                        foreignField: '_id',
                        as: 'manager',
                    },
                },
                {
                    $unwind: {
                        path: '$manager',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'generalinfos',
                        localField: 'manager.generalInfo',
                        foreignField: '_id',
                        as: 'manager.generalInfo',
                    },
                },
                {
                    $unwind: {
                        path: '$manager.generalInfo',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'employees',
                        localField: 'project.manager',
                        foreignField: '_id',
                        as: 'project.manager',
                    },
                },
                {
                    $unwind: {
                        path: '$project.manager',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'generalinfos',
                        localField: 'project.manager.generalInfo',
                        foreignField: '_id',
                        as: 'project.manager.generalInfo',
                    },
                },
                {
                    $unwind: {
                        path: '$project.manager.generalInfo',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                // {
                //   $addFields: {
                //     generalInfoID1: { $toObjectId: '$approvalFlow.step1.generalInfo' },
                //   },
                // },
                {
                    $lookup: {
                        from: 'employees',
                        localField: 'approvalFlow.step1.employee',
                        foreignField: '_id',
                        as: 'approvalFlow.step1.employee',
                    },
                },
                {
                    $unwind: {
                        path: '$approvalFlow.step1.employee',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'employees',
                        localField: 'approvalFlow.step2.employee',
                        foreignField: '_id',
                        as: 'approvalFlow.step2.employee',
                    },
                },
                {
                    $unwind: {
                        path: '$approvalFlow.step2.employee',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'employees',
                        localField: 'approvalFlow.step3.employee',
                        foreignField: '_id',
                        as: 'approvalFlow.step3.employee',
                    },
                },
                {
                    $unwind: {
                        path: '$approvalFlow.step3.employee',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                // get steps general info
                {
                    $lookup: {
                        from: 'generalinfos',
                        localField: 'approvalFlow.step1.employee.generalInfo',
                        foreignField: '_id',
                        as: 'approvalFlow.step1.employee.generalInfo',
                    },
                },
                {
                    $unwind: {
                        path: '$approvalFlow.step1.employee.generalInfo',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'generalinfos',
                        localField: 'approvalFlow.step2.employee.generalInfo',
                        foreignField: '_id',
                        as: 'approvalFlow.step2.employee.generalInfo',
                    },
                },
                {
                    $unwind: {
                        path: '$approvalFlow.step2.employee.generalInfo',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'generalinfos',
                        localField: 'approvalFlow.step3.employee.generalInfo',
                        foreignField: '_id',
                        as: 'approvalFlow.step3.employee.generalInfo',
                    },
                },
                {
                    $unwind: {
                        path: '$approvalFlow.step3.employee.generalInfo',
                        preserveNullAndEmptyArrays: true,
                    },
                },
            ];
            aggregate = [...aggregate, ...lookup];
            // const matchOr: any = {
            //   $or: [],
            // }
            let checkRoleHR = false;
            lodash_1.map(currentUser.roles, (per) => per._id).forEach(function (item) {
                if (lodash_1.includes(['HR', 'HR-MANAGER', 'HR-GLOBAL'], item)) {
                    checkRoleHR = true;
                    return true;
                }
            });
            if (!checkRoleHR) {
                const matchTwo = { $match: {} };
                matchTwo.$match = {
                    $or: [
                        {
                            'approvalFlow.step2.employee._id': mongoose_1.Types.ObjectId(employee._id),
                        },
                        {
                            'approvalFlow.step3.employee._id': mongoose_1.Types.ObjectId(employee._id),
                            currentStep: { $gte: 3 },
                        },
                    ],
                };
                aggregate.push(matchTwo);
            }
            else {
                const matchThree = { $match: {} };
                matchThree.$match = {
                    // location: Types.ObjectId(employee.location.id),
                    company: mongoose_1.Types.ObjectId(employee.company._id),
                };
                aggregate.push(matchThree);
                // matchOr.$or.push({
                //   'manager._id': employee._id,
                // })
                // matchOr.$or.push({
                //   'project.manager': employee._id,
                // })
                // matchTwo.$match = matchOr
                // aggregate.push(matchTwo)
                // aggregateTotal.push({
                //   $match: {
                //     $or: [
                //       {
                //         manager: Types.ObjectId(employee.id),
                //       },
                //     ],
                //   },
                // })
            }
            const project = {
                $project: {
                    ticketID: 1,
                    status: 1,
                    totalHours: 1,
                    user: { roles: 1, _id: 1 },
                    location: { name: 1, _id: 1 },
                    company: { name: 1, _id: 1 },
                    department: { name: 1, _id: 1 },
                    project: { name: 1, _id: 1, beginDate: 1, endDate: 1 },
                    duration: {
                        from: 1,
                        to: 1,
                    },
                    description: 1,
                    onDate: 1,
                    cc: [
                        {
                            $map: {
                                input: '$cc',
                                as: 'cc',
                                in: {
                                    firstName: '$employee.generalInfo.firstName',
                                    lastName: '$employee.generalInfo.lastName',
                                    avatar: '$employee.generalInfo.avatar',
                                    _id: '$employee._id',
                                },
                            },
                        },
                    ],
                    extraTime: 1,
                    employee: {
                        _id: 1,
                        employeeId: 1,
                    },
                    'employee.generalInfo': {
                        firstName: 1,
                        lastName: 1,
                        avatar: 1,
                        _id: 1,
                    },
                    'manager.generalInfo': {
                        _id: 1,
                        firstName: 1,
                        lastName: 1,
                        avatar: 1,
                    },
                    'project.manager.generalInfo': {
                        _id: 1,
                        firstName: 1,
                        lastName: 1,
                        avatar: 1,
                    },
                    approvalFlow: {
                        step1: {
                            employee: {
                                _id: 1,
                                generalInfo: 1,
                            },
                            name: 1,
                        },
                        step2: {
                            employee: {
                                _id: 1,
                                generalInfo: 1,
                            },
                            name: 1,
                        },
                        step3: {
                            employee: {
                                _id: 1,
                                generalInfo: 1,
                            },
                            name: 1,
                        },
                    },
                    currentStep: 1,
                    commentPM: 1,
                    commentCLA: 1,
                },
            };
            aggregate.push(project);
            const items = yield CompoffRequest_1.default.aggregate(aggregate);
            const hrManager = yield User_1.default.aggregate([
                {
                    $match: {
                        $and: [{ roles: { $in: ['HR-MANAGER'] } }],
                    },
                },
                {
                    $lookup: {
                        from: 'employees',
                        localField: 'employee',
                        foreignField: '_id',
                        as: 'employee',
                    },
                },
                { $unwind: { path: '$employee', preserveNullAndEmptyArrays: true } },
                {
                    $lookup: {
                        from: 'generalinfos',
                        localField: 'employee.generalInfo',
                        foreignField: '_id',
                        as: 'generalInfo',
                    },
                },
                {
                    $unwind: {
                        path: '$generalInfo',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $match: {
                        'employee.location': employee.location._id,
                    },
                },
                {
                    $project: {
                        _id: 0,
                        generalInfo: {
                            avatar: 1,
                            firstName: 1,
                            lastName: 1,
                            workEmail: 1,
                        },
                    },
                },
            ]);
            //Total
            aggregate.pop();
            aggregate[0].$match.status = {
                $in: [...constant_1.TYPE_COMPOFF_REQUEST.action, ...constant_1.TYPE_COMPOFF_REQUEST.status],
            };
            aggregate.push({ $group: { _id: '$status', count: { $sum: 1 } } });
            const total = yield CompoffRequest_1.default.aggregate(aggregate);
            res.send(new ResponseResult_1.default({
                data: {
                    items,
                    total,
                    hrManager: hrManager.length ? hrManager[0] : null,
                },
                message: 'List team member request successfully',
            }));
        });
    }
    getUserRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = req.user;
            let employee = yield Employee_1.default.findById(currentUser.employee);
            const { body: { 
            // limit = 0, page = 1, skip = 0,
            status: inputStatus = [], }, } = req;
            let aggregate = [];
            const matchOne = { $match: {} };
            matchOne.$match.employee = employee._id;
            if (inputStatus.length !== 0) {
                const st = {
                    $or: [],
                };
                inputStatus.map((value) => {
                    st.$or.push({ status: value });
                });
                matchOne.$match.$or = st.$or;
            }
            aggregate.push(matchOne);
            const lookup = [
                {
                    $lookup: {
                        from: 'users',
                        localField: 'employee',
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
                {
                    $lookup: {
                        from: 'locations',
                        localField: 'location',
                        foreignField: '_id',
                        as: 'location',
                    },
                },
                {
                    $unwind: {
                        path: '$location',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'projects',
                        localField: 'project',
                        foreignField: '_id',
                        as: 'project',
                    },
                },
                {
                    $unwind: {
                        path: '$project',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'employees',
                        localField: 'employee',
                        foreignField: '_id',
                        as: 'employee',
                    },
                },
                {
                    $unwind: {
                        path: '$employee',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'generalinfos',
                        localField: 'employee.generalInfo',
                        foreignField: '_id',
                        as: 'employee.generalInfo',
                    },
                },
                {
                    $unwind: {
                        path: '$employee.generalInfo',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'employees',
                        localField: 'manager',
                        foreignField: '_id',
                        as: 'manager',
                    },
                },
                {
                    $unwind: {
                        path: '$manager',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'generalinfos',
                        localField: 'manager.generalInfo',
                        foreignField: '_id',
                        as: 'manager.generalInfo',
                    },
                },
                {
                    $unwind: {
                        path: '$manager.generalInfo',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'employees',
                        localField: 'project.manager',
                        foreignField: '_id',
                        as: 'project.manager',
                    },
                },
                {
                    $unwind: {
                        path: '$project.manager',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'generalinfos',
                        localField: 'project.manager.generalInfo',
                        foreignField: '_id',
                        as: 'project.manager.generalInfo',
                    },
                },
                {
                    $unwind: {
                        path: '$project.manager.generalInfo',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'employees',
                        localField: 'approvalFlow.step1.employee',
                        foreignField: '_id',
                        as: 'approvalFlow.step1.employee',
                    },
                },
                {
                    $unwind: {
                        path: '$approvalFlow.step1.employee',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'employees',
                        localField: 'approvalFlow.step2.employee',
                        foreignField: '_id',
                        as: 'approvalFlow.step2.employee',
                    },
                },
                {
                    $unwind: {
                        path: '$approvalFlow.step2.employee',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'employees',
                        localField: 'approvalFlow.step3.employee',
                        foreignField: '_id',
                        as: 'approvalFlow.step3.employee',
                    },
                },
                {
                    $unwind: {
                        path: '$approvalFlow.step3.employee',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                // get steps general info
                {
                    $lookup: {
                        from: 'generalinfos',
                        localField: 'approvalFlow.step1.employee.generalInfo',
                        foreignField: '_id',
                        as: 'approvalFlow.step1.employee.generalInfo',
                    },
                },
                {
                    $unwind: {
                        path: '$approvalFlow.step1.employee.generalInfo',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'generalinfos',
                        localField: 'approvalFlow.step2.employee.generalInfo',
                        foreignField: '_id',
                        as: 'approvalFlow.step2.employee.generalInfo',
                    },
                },
                {
                    $unwind: {
                        path: '$approvalFlow.step2.employee.generalInfo',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'generalinfos',
                        localField: 'approvalFlow.step3.employee.generalInfo',
                        foreignField: '_id',
                        as: 'approvalFlow.step3.employee.generalInfo',
                    },
                },
                {
                    $unwind: {
                        path: '$approvalFlow.step3.employee.generalInfo',
                        preserveNullAndEmptyArrays: true,
                    },
                },
            ];
            aggregate = [...aggregate, ...lookup];
            const project = {
                $project: {
                    ticketID: 1,
                    status: 1,
                    totalHours: 1,
                    user: { roles: 1, _id: 1 },
                    location: { name: 1, _id: 1 },
                    company: { name: 1, _id: 1 },
                    department: { name: 1, _id: 1 },
                    project: { name: 1, _id: 1, beginDate: 1, endDate: 1 },
                    duration: {
                        from: 1,
                        to: 1,
                    },
                    description: 1,
                    onDate: 1,
                    cc: [
                        {
                            $map: {
                                input: '$cc',
                                as: 'cc',
                                in: {
                                    firstName: '$employee.generalInfo.firstName',
                                    lastName: '$employee.generalInfo.lastName',
                                    avatar: '$employee.generalInfo.avatar',
                                    _id: '$employee._id',
                                },
                            },
                        },
                    ],
                    extraTime: {
                        date: 1,
                        timeSpend: 1,
                    },
                    employee: {
                        _id: 1,
                        employeeId: 1,
                    },
                    'employee.generalInfo': {
                        firstName: 1,
                        lastName: 1,
                        avatar: 1,
                        _id: 1,
                    },
                    'manager.generalInfo': {
                        _id: 1,
                        firstName: 1,
                        lastName: 1,
                        avatar: 1,
                    },
                    'project.manager.generalInfo': {
                        _id: 1,
                        firstName: 1,
                        lastName: 1,
                        avatar: 1,
                    },
                    approvalFlow: {
                        step1: {
                            employee: {
                                _id: 1,
                                generalInfo: 1,
                            },
                            name: 1,
                        },
                        step2: {
                            employee: {
                                _id: 1,
                                generalInfo: 1,
                            },
                            name: 1,
                        },
                        step3: {
                            employee: {
                                _id: 1,
                                generalInfo: 1,
                            },
                            name: 1,
                        },
                    },
                    currentStep: 1,
                    commentPM: 1,
                    commentCLA: 1,
                },
            };
            aggregate.push(project);
            // const facet: any = [
            //   {
            //     $facet: {
            //       paginatedResults: [
            //         { $skip: (page - 1) * limit + skip },
            //         { $limit: limit },
            //       ],
            //       totalCount: [
            //         {
            //           $count: 'total',
            //         },
            //       ],
            //     },
            //   },
            // ]
            // aggregate.push(facet)
            const items = yield CompoffRequest_1.default.aggregate(aggregate);
            //Total
            aggregate.pop();
            aggregate[0].$match.status = {
                $in: [...constant_1.TYPE_COMPOFF_REQUEST.action, ...constant_1.TYPE_COMPOFF_REQUEST.status],
            };
            aggregate.push({ $group: { _id: '$status', count: { $sum: 1 } } });
            const total = yield CompoffRequest_1.default.aggregate(aggregate);
            res.send(new ResponseResult_1.default({
                message: 'Get compoff Request list successfully.',
                data: { items, total },
            }));
        });
    }
    // protected async getUpcomingRequest(req: Request, res: Response) {
    //   const { limit = 0, page = 1, skip = 0 } = req.body
    //   const dataUpcoming = await this.model
    //     .find({
    //       extraTime: { date: { $gte: Date.now() } },
    //     })
    //     .skip((page - 1) * limit + skip)
    //     .limit(limit)
    //     .sort({ createdAt: -1 })
    //     .exec()
    //   res.send(
    //     new ResponseResult({
    //       data: dataUpcoming,
    //       message: 'Successfully',
    //     }),
    //   )
    // }
    // public async approvalByOther(_req: Request, _res: Response) {}
    // public async approvalByUser(req: Request, res: Response) {
    //   const currentUser = req.user as IUser
    //   const {
    //     page = 1,
    //     limit = 0,
    //     skip = 0,
    //     amount, // { $gte: 50, $lte: 50}
    //     creators, // { $in: ['6574646']}
    //     location = currentUser.employee.location.id,
    //     q,
    //   } = req.body
    //   let { date, year = new Date().getFullYear().toString() } = req.body
    //   // Fiter by date
    //   year = Number(year)
    //   if (!date) {
    //     date = {
    //       $gte: new Date(`${year}`).toISOString(),
    //       $lte: new Date(`${year + 1}`).toISOString(),
    //     }
    //   }
    //   date.$gte =
    //     !date.$gte || new Date(date.$gte) < new Date(`${year}`)
    //       ? new Date(`${year}`).toISOString()
    //       : date.$gte
    //   date.$lte =
    //     !date.$lte || date.$lte > new Date(`${year + 1}`)
    //       ? new Date(`${year + 1}`).toISOString()
    //       : date.$lte
    //   // Filter
    //   let filter: any = {
    //     status: { $in: PENDING_REIMBURSEMENT_STATUS },
    //     location,
    //     company: currentUser.employee.company.id,
    //     date,
    //     user: creators,
    //     amount,
    //   }
    //   if (currentUser.appRole === 'Direct Manager') {
    //     filter.$and = [
    //       { $or: [{ manager: currentUser.id, nodeStep: 'Direct Manager' }] },
    //     ]
    //   } else {
    //     filter.$and = [
    //       {
    //         $or: [
    //           { manager: currentUser.id, nodeStep: 'Direct Manager' },
    //           { nodeStep: { $in: currentUser.approvalFlowGroups } },
    //         ],
    //       },
    //     ]
    //   }
    //   // Filter by input
    //   if (q) {
    //     const searchQ = { $regex: q, $options: 'i' }
    //     filter.$and.push({
    //       $or: [
    //         { title: searchQ },
    //         { code: searchQ },
    //         { description: { $regex: q, $options: 'mi' } },
    //       ],
    //     })
    //   }
    //   filter = pickBy(filter, identity)
    //   const items = await CompoffRequest.find(filter)
    //     .sort({ date: -1 })
    //     .limit(limit)
    //     .skip((page - 1) * limit + skip)
    //     .exec()
    //   const itemsSum = await CompoffRequest.find(filter)
    //     .sort({ date: -1 })
    //     .exec()
    //   const total = await CompoffRequest.count(filter).exec()
    //   res.send(
    //     new ResponseResult({
    //       message: 'Show report list should be reviewed.',
    //       data: items,
    //       total: total,
    //       sum: sumBy(itemsSum, 'amount'),
    //     }),
    //   )
    // }
    approveATicketFunc(_id, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = req.user;
            const existRequest = yield this.model.findById(_id);
            const employee = yield Employee_1.default.findById(existRequest.employee);
            const employeeCurrentUser = currentUser.employee;
            if (!existRequest) {
                throw new AdvancedError_1.default({
                    compoffrequest: {
                        kind: 'not.found',
                        message: 'Request not found',
                    },
                });
            }
            const { approvalFlow } = existRequest;
            // check role
            let checkRoleHR = false;
            lodash_1.map(currentUser.roles, (per) => per._id).forEach(function (item) {
                if (lodash_1.includes(['HR', 'HR-MANAGER', 'HR-GLOBAL'], item)) {
                    checkRoleHR = true;
                    return true;
                }
            });
            if (String(currentUser.employee._id) ===
                String(approvalFlow.step2.employee) ||
                String(currentUser.employee._id) ===
                    String(approvalFlow.step3.employee) ||
                checkRoleHR) {
                if (existRequest.currentStep === 2) {
                    // project manager or hr-manager will approve
                    existRequest.status = constant_1.TYPE_COMPOFF_REQUEST.statusType.inProgressNext;
                    existRequest.currentStep = existRequest.currentStep + 1;
                }
                else if (existRequest.currentStep === 3) {
                    // admin-cla or hr-manager will approve
                    existRequest.status = constant_1.TYPE_COMPOFF_REQUEST.statusType.accepted;
                    existRequest.currentStep = existRequest.currentStep + 1;
                }
                else {
                    throw new AdvancedError_1.default({
                        compoffrequest: {
                            kind: 'wrong.step',
                            message: `Wrong step`,
                        },
                    });
                }
            }
            else {
                throw new AdvancedError_1.default({
                    compoffrequest: {
                        kind: 'no.permission',
                        message: `You don't have permission to approve this compoff request`,
                    },
                });
            }
            // Mail notification
            const { cc } = existRequest;
            let admins = yield this.getEmployeeByRole('ADMIN-CLA', employeeCurrentUser.location._id);
            let hrManagers = yield this.getEmployeeByRole('HR-MANAGER', employeeCurrentUser.location._id);
            const ccId = cc.map((person) => mongoose_1.Types.ObjectId(person));
            let ccEmployees;
            let ccEmails = [];
            if (cc.length > 0) {
                ccEmployees = yield Employee_1.default.find({ _id: { $in: ccId } });
                ccEmails = ccEmployees.map((employee) => {
                    return {
                        email: employee.generalInfo.workEmail,
                    };
                });
            }
            const requesteeName = `${employee.generalInfo.firstName} ${employee.generalInfo.lastName}`;
            const currentApprover = existRequest.currentStep === 3
                ? 'Project Manager'
                : existRequest.currentStep === 4
                    ? 'Region Head'
                    : '';
            let mailTitle = `[Compoff Request] Compoff request of ${requesteeName} has been approved by ${currentApprover}`;
            let mailContent = `<p>Compoff request of ${requesteeName} has been approved by ${currentApprover}</p>`;
            // Mail notify to employee
            if (employee) {
                const employeeName = `${employee.generalInfo.firstName} ${employee.generalInfo.lastName}`;
                const employeeEmail = employee.generalInfo.workEmail;
                yield SendMail_1.sendNotificationCompoff({
                    email: employeeEmail,
                    fullName: employeeName,
                }, [], mailTitle, mailContent);
            }
            // Mail notify to Project manager
            const projectInfo = yield Project_1.default.findById(existRequest.project._id);
            if (projectInfo.manager) {
                const managerInfo = projectInfo.manager;
                const managerName = `${managerInfo.generalInfo.firstName} ${managerInfo.generalInfo.lastName}`;
                const managerEmail = managerInfo.generalInfo.workEmail;
                yield SendMail_1.sendNotificationCompoff({
                    email: managerEmail,
                    fullName: managerName,
                }, ccEmails, mailTitle, mailContent);
            }
            // Mail notify to ADMIN-CLA
            if (admins.length > 0 && existRequest.currentStep === 3) {
                bluebird_1.default.map(admins, (admin) => __awaiter(this, void 0, void 0, function* () {
                    const adminName = `${admin.employee.generalInfo.firstName} ${admin.employee.generalInfo.lastName}`;
                    const adminEmail = admin.employee.generalInfo.workEmail;
                    yield SendMail_1.sendNotificationCompoff({
                        email: adminEmail,
                        fullName: adminName,
                    }, [], mailTitle, mailContent);
                }));
            }
            // Mail notify to HR Managers
            if (hrManagers.length > 0) {
                bluebird_1.default.map(hrManagers, (manager) => __awaiter(this, void 0, void 0, function* () {
                    const hrManagerName = `${manager.employee.generalInfo.firstName} ${manager.employee.generalInfo.lastName}`;
                    const hrManagerEmail = manager.employee.generalInfo.workEmail;
                    yield SendMail_1.sendNotificationCompoff({
                        email: hrManagerEmail,
                        fullName: hrManagerName,
                    }, [], mailTitle, mailContent);
                }));
            }
            // existRequest.set()
            yield existRequest.save();
            return existRequest;
        });
    }
    approveRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { _id } = req.body;
            const response = yield this.approveATicketFunc(_id, req);
            if (!response) {
                throw new AdvancedError_1.default({
                    compoffrequest: {
                        kind: 'not.found',
                        message: 'Error in approveATicketFunc function',
                    },
                });
            }
            res.send(new ResponseResult_1.default({
                data: response,
                message: 'Compoff request has been approved.',
            }));
        });
    }
    approveMultipleRequests(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ticketList } = req.body;
            const promises = ticketList.map((ticket) => __awaiter(this, void 0, void 0, function* () {
                const response = yield this.approveATicketFunc(ticket, req);
                return response;
            }));
            yield Promise.all(promises);
            res.send(new ResponseResult_1.default({
                data: {},
                message: 'Multiple compoff requests has been approved.',
            }));
        });
    }
    rejectATicketFunc(_id, comment, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = req.user;
            const existRequest = yield this.model.findById(_id);
            const employee = yield Employee_1.default.findById(existRequest.employee);
            const employeeCurrentUser = currentUser.employee;
            if (!existRequest) {
                throw new AdvancedError_1.default({
                    compoffrequest: {
                        kind: 'not.found',
                        message: 'Request not found',
                    },
                });
            }
            const { approvalFlow } = existRequest;
            // check role
            let checkRoleHR = false;
            lodash_1.map(currentUser.roles, (per) => per._id).forEach(function (item) {
                if (lodash_1.includes(['HR', 'HR-MANAGER', 'HR-GLOBAL'], item)) {
                    checkRoleHR = true;
                    return true;
                }
            });
            if (String(currentUser.employee._id) ===
                String(approvalFlow.step2.employee) ||
                String(currentUser.employee._id) ===
                    String(approvalFlow.step3.employee) ||
                checkRoleHR) {
                existRequest.status = constant_1.TYPE_COMPOFF_REQUEST.statusType.rejected;
                if (existRequest.currentStep === 2) {
                    // project manager or hr-manager will reject
                    existRequest.commentPM = comment;
                }
                else if (existRequest.currentStep === 3) {
                    // admin-cla or hr-manager will reject
                    existRequest.commentCLA = comment;
                }
                else {
                    throw new AdvancedError_1.default({
                        compoffrequest: {
                            kind: 'wrong.step',
                            message: `Wrong step`,
                        },
                    });
                }
            }
            else {
                throw new AdvancedError_1.default({
                    compoffrequest: {
                        kind: 'no.permission',
                        message: `You don't have permission to reject this compoff request`,
                    },
                });
            }
            // Mail notification
            const { cc } = existRequest;
            let admins = yield this.getEmployeeByRole('ADMIN-CLA', employeeCurrentUser.location._id);
            let hrManagers = yield this.getEmployeeByRole('HR-MANAGER', employeeCurrentUser.location._id);
            const ccId = cc.map((person) => mongoose_1.Types.ObjectId(person));
            let ccEmployees;
            let ccEmails = [];
            if (cc.length > 0) {
                ccEmployees = yield Employee_1.default.find({ _id: { $in: ccId } });
                ccEmails = ccEmployees.map((employee) => {
                    return {
                        email: employee.generalInfo.workEmail,
                    };
                });
            }
            const requesteeName = `${employee.generalInfo.firstName} ${employee.generalInfo.lastName}`;
            const currentApprover = existRequest.currentStep === 2
                ? 'Project Manager'
                : existRequest.currentStep === 3
                    ? 'Region Head'
                    : '';
            let mailTitle = `[Compoff Request] Compoff request of ${requesteeName} has been rejected by ${currentApprover}`;
            let mailContent = `<p>Compoff request of ${requesteeName} has been rejected by ${currentApprover}</p>
    <p>Comment: ${comment}</p>`;
            // Mail notify to employee
            if (employee) {
                const employeeName = `${employee.generalInfo.firstName} ${employee.generalInfo.lastName}`;
                const employeeEmail = employee.generalInfo.workEmail;
                yield SendMail_1.sendNotificationCompoff({
                    email: employeeEmail,
                    fullName: employeeName,
                }, [], mailTitle, mailContent);
            }
            // Mail notify to Project manager
            const projectInfo = yield Project_1.default.findById(existRequest.project._id);
            if (projectInfo.manager) {
                const managerInfo = projectInfo.manager;
                const managerName = `${managerInfo.generalInfo.firstName} ${managerInfo.generalInfo.lastName}`;
                const managerEmail = managerInfo.generalInfo.workEmail;
                yield SendMail_1.sendNotificationCompoff({
                    email: managerEmail,
                    fullName: managerName,
                }, ccEmails, mailTitle, mailContent);
            }
            // Mail notify to ADMIN-CLA
            if (admins.length > 0 && existRequest.currentStep === 3) {
                bluebird_1.default.map(admins, (admin) => __awaiter(this, void 0, void 0, function* () {
                    const adminName = `${admin.employee.generalInfo.firstName} ${admin.employee.generalInfo.lastName}`;
                    const adminEmail = admin.employee.generalInfo.workEmail;
                    yield SendMail_1.sendNotificationCompoff({
                        email: adminEmail,
                        fullName: adminName,
                    }, [], mailTitle, mailContent);
                }));
            }
            // Mail notify to HR Managers
            if (hrManagers.length > 0) {
                bluebird_1.default.map(hrManagers, (manager) => __awaiter(this, void 0, void 0, function* () {
                    const hrManagerName = `${manager.employee.generalInfo.firstName} ${manager.employee.generalInfo.lastName}`;
                    const hrManagerEmail = manager.employee.generalInfo.workEmail;
                    yield SendMail_1.sendNotificationCompoff({
                        email: hrManagerEmail,
                        fullName: hrManagerName,
                    }, [], mailTitle, mailContent);
                }));
            }
            // existRequest.set()
            yield existRequest.save();
            return existRequest;
        });
    }
    rejectRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { _id, comment } = req.body;
            const response = yield this.rejectATicketFunc(_id, comment, req);
            if (!response) {
                throw new AdvancedError_1.default({
                    compoffrequest: {
                        kind: 'not.found',
                        message: 'Error in approveATicketFunc function',
                    },
                });
            }
            res.send(new ResponseResult_1.default({
                data: response,
                message: 'Compoff request has been rejected.',
            }));
        });
    }
    rejectMultipleRequests(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ticketList, comment } = req.body;
            const promises = ticketList.map((ticket) => __awaiter(this, void 0, void 0, function* () {
                const response = yield this.rejectATicketFunc(ticket, comment, req);
                return response;
            }));
            yield Promise.all(promises);
            res.send(new ResponseResult_1.default({
                data: {},
                message: 'Multiple compoff requests has been rejected.',
            }));
        });
    }
    updateDraft(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.body;
            // const currentUser = req.user as IUser
            // const employee = currentUser.employee as IEmployee
            const existRequest = yield this.model.findById(id);
            if (!existRequest) {
                throw new AdvancedError_1.default({
                    compoffrequest: {
                        kind: 'not.found',
                        message: 'Request not found',
                    },
                });
            }
            if (existRequest.status !== 'DRAFTS') {
                new AdvancedError_1.default({
                    compoffRequest: {
                        kind: 'processing',
                        message: 'This request cannot be updated',
                    },
                });
            }
            existRequest.set(req.body);
            yield existRequest.save();
            res.send(new ResponseResult_1.default({
                data: existRequest,
                message: 'Update draft successfully',
            }));
            // if (employee !== existRequest.employee) {
            //   throw new AdvancedError({
            //     compoffRequest: {
            //       kind: 'not.permission',
            //       message: 'You are not allowed to update this request',
            //     },
            //   })
            // }
            // res.send(
            //   new AdvancedError({
            //     compoffRequest: {
            //       kind: 'processing',
            //       message: 'This request cannot be updated',
            //     },
            //   }),
            // )
        });
    }
    getEmployeeByRole(role, locationId) {
        return __awaiter(this, void 0, void 0, function* () {
            let hrManagers;
            let admins;
            let result = [];
            if (!role) {
                throw new AdvancedError_1.default({
                    compoffRequest: {
                        kind: 'not.found',
                        message: 'Role is missing',
                    },
                });
            }
            if (!locationId) {
                throw new AdvancedError_1.default({
                    compoffRequest: {
                        kind: 'not.found',
                        message: 'Location parameter is missing',
                    },
                });
            }
            if (role === 'HR-MANAGER') {
                hrManagers = yield User_1.default.aggregate([
                    {
                        $lookup: {
                            from: 'employees',
                            localField: 'employee',
                            foreignField: '_id',
                            as: 'employee',
                        },
                    },
                    {
                        $unwind: {
                            path: '$employee',
                            preserveNullAndEmptyArrays: true,
                        },
                    },
                    {
                        $match: {
                            $and: [
                                {
                                    roles: {
                                        $in: ['HR-MANAGER'],
                                    },
                                },
                                {
                                    // location: Types.ObjectId(locationId),
                                    'employee.location': mongoose_1.Types.ObjectId(locationId),
                                },
                            ],
                        },
                    },
                    {
                        $lookup: {
                            from: 'generalinfos',
                            localField: 'employee.generalInfo',
                            foreignField: '_id',
                            as: 'employee.generalInfo',
                        },
                    },
                    {
                        $unwind: {
                            path: '$employee.generalInfo',
                            preserveNullAndEmptyArrays: true,
                        },
                    },
                    {
                        $project: {
                            employee: {
                                _id: 1,
                                generalInfo: {
                                    firstName: 1,
                                    lastName: 1,
                                    workEmail: 1,
                                },
                            },
                        },
                    },
                ]);
            }
            else if (role === 'ADMIN-CLA') {
                admins = yield User_1.default.aggregate([
                    {
                        $lookup: {
                            from: 'employees',
                            localField: 'employee',
                            foreignField: '_id',
                            as: 'employee',
                        },
                    },
                    {
                        $unwind: {
                            path: '$employee',
                            preserveNullAndEmptyArrays: true,
                        },
                    },
                    {
                        $match: {
                            // roles: {
                            //   $in: ['ADMIN-CLA'],
                            // },
                            $and: [
                                {
                                    roles: {
                                        $in: ['ADMIN-CLA'],
                                    },
                                },
                                {
                                    // location: Types.ObjectId(locationId),
                                    'employee.location': mongoose_1.Types.ObjectId(locationId),
                                },
                            ],
                        },
                    },
                    {
                        $lookup: {
                            from: 'generalinfos',
                            localField: 'employee.generalInfo',
                            foreignField: '_id',
                            as: 'employee.generalInfo',
                        },
                    },
                    {
                        $unwind: {
                            path: '$employee.generalInfo',
                            preserveNullAndEmptyArrays: true,
                        },
                    },
                    {
                        $project: {
                            employee: {
                                _id: 1,
                                generalInfo: {
                                    firstName: 1,
                                    lastName: 1,
                                    workEmail: 1,
                                },
                            },
                        },
                    },
                ]);
            }
            if (hrManagers && hrManagers.length > 0) {
                result = hrManagers;
            }
            else if (admins && admins.length > 0) {
                result = admins;
            }
            return result;
        });
    }
}
exports.default = new CompoffRequestController(CompoffRequest_1.default);
//# sourceMappingURL=CompoffRequestController.js.map