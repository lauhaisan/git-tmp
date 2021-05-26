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
const constant_1 = require("@/app/utils/constant");
const json2csv_1 = require("json2csv");
const mongoose_1 = require("mongoose");
const AdvancedError_1 = __importDefault(require("../declares/AdvancedError"));
const Employee_1 = __importDefault(require("../models/Employee"));
const LeaveBalance_1 = __importDefault(require("../models/LeaveBalance"));
const LeaveRequest_1 = __importDefault(require("../models/LeaveRequest"));
const ResponseResult_1 = __importDefault(require("../services/ResponseResult"));
const utils_1 = require("../utils/utils");
const bluebird_1 = __importDefault(require("bluebird"));
const lodash_1 = require("lodash");
const moment_1 = __importDefault(require("moment"));
const TimeoffType_1 = __importDefault(require("../models/TimeoffType"));
const User_1 = __importDefault(require("../models/User"));
const SendMail_1 = require("../services/SendMail");
class LeaveRequestController extends AbstractController_1.default {
    generateMethods() {
        return [
            {
                name: 'add',
                type: 'POST',
                _ref: this.add.bind(this),
            },
            {
                name: 'remove',
                type: 'POST',
                _ref: this.remove.bind(this),
            },
            {
                name: 'get-by-id',
                type: 'POST',
                _ref: this.getByID.bind(this),
            },
            {
                name: 'get-by-employee',
                type: 'POST',
                _ref: this.getByEmployee.bind(this),
            },
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
            {
                name: 'get-upcoming-request',
                type: 'POST',
                _ref: this.getUpcomingRequest.bind(this),
            },
            {
                name: 'get-by-employee-date',
                type: 'POST',
                _ref: this.getByEmployeeAndDate.bind(this),
            },
            {
                name: 'download',
                type: 'POST',
                _ref: this.downloadAsCsv.bind(this),
            },
            {
                name: 'update',
                type: 'POST',
                _ref: this.update.bind(this),
            },
            {
                name: 'save-draft',
                type: 'POST',
                _ref: this.saveDraft.bind(this),
            },
            {
                name: 'update-draft',
                type: 'POST',
                _ref: this.updateDraft.bind(this),
            },
            {
                name: 'withdraw-progress',
                type: 'POST',
                _ref: this.withdrawInProgress.bind(this),
            },
            {
                name: 'withdraw-submit',
                type: 'POST',
                _ref: this.withdrawSubmit.bind(this),
            },
            {
                name: 'withdraw-approve',
                type: 'POST',
                _ref: this.withdrawApprove.bind(this),
            },
            {
                name: 'withdraw-reject',
                type: 'POST',
                _ref: this.withdrawReject.bind(this),
            },
            // reporting manager approve/reject leave request
            {
                name: 'reporting-manager-approve',
                type: 'POST',
                _ref: this.approveRequest.bind(this),
            },
            {
                name: 'reporting-manager-reject',
                type: 'POST',
                _ref: this.rejectRequest.bind(this),
            },
            // multiple tickets
            {
                name: 'rm-approve-multiple-tickets',
                type: 'POST',
                _ref: this.approveMultipleRequest.bind(this),
            },
            {
                name: 'rm-reject-multiple-tickets',
                type: 'POST',
                _ref: this.rejectMultipleRequest.bind(this),
            },
        ];
    }
    add(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { leaveDates, type, cc } = req.body;
            const currentUser = req.user;
            const { employee } = currentUser;
            const { company } = employee;
            const { WHOLE_DAY, MORNING, AFTERNOON } = utils_1.TIME_OF_DAY;
            const datePairs = [];
            leaveDates.forEach((dateItem) => {
                const { date, timeOfDay } = dateItem;
                const currentDate = moment_1.default(new Date(date)).format('YYYY-MM-DD') + 'T00:00:00.000Z'; // Reset to midnight
                const dateStart = new Date(currentDate);
                let dateEnd = new Date(dateStart);
                switch (timeOfDay) {
                    case WHOLE_DAY: {
                        dateEnd = utils_1.getEndDate(dateStart, WHOLE_DAY);
                        break;
                    }
                    case MORNING:
                    case AFTERNOON: {
                        dateEnd = utils_1.getEndDate(dateStart, MORNING);
                        break;
                    }
                    default:
                        break;
                }
                const datePair = {
                    from: dateStart,
                    to: dateEnd,
                };
                datePairs.push(datePair);
            });
            const isdateRangeOverlap = utils_1.multipleDateRangeOverlaps(datePairs);
            if (isdateRangeOverlap) {
                throw new AdvancedError_1.default({
                    leaveDates: {
                        kind: 'is.notvalid',
                        message: 'Leave dates are overlapped or not valid',
                    },
                });
            }
            let deductDate = utils_1.getDeductDay(leaveDates);
            const currentTimeoffType = yield TimeoffType_1.default.findOne({
                _id: type,
            }).select('baseAccrual accrualSchedule balance type');
            const leaveBalance = yield LeaveBalance_1.default.findOne({
                employee: employee._id,
            });
            const commonLeave = leaveBalance.commonLeaves.timeOffTypes;
            const specialLeave = leaveBalance.specialLeaves.timeOffTypes;
            // let leaveIndex: number = 0
            let currentLeave = null;
            if (currentTimeoffType.type !== 'D') {
                currentLeave = commonLeave.find((leave) => {
                    const { defaultSettings } = leave;
                    // leaveIndex = index
                    return String(defaultSettings._id) === String(currentTimeoffType._id);
                });
                if (!currentLeave) {
                    // leaveIndex = 0
                    currentLeave = specialLeave.find((leave) => {
                        const { defaultSettings } = leave;
                        // leaveIndex = index
                        return String(defaultSettings._id) === String(currentTimeoffType._id);
                    });
                }
                if (!currentLeave) {
                    // Leave not valid, not found
                    throw new AdvancedError_1.default({
                        leaveDates: {
                            kind: 'is.notvalid',
                            message: 'Timeoff type not found',
                        },
                    });
                }
                const { currentAllowance, defaultSettings: { type: type1 }, } = currentLeave;
                if (deductDate > currentAllowance && type1 !== 'B') {
                    // Leave dates reach limit
                    throw new AdvancedError_1.default({
                        leaveDates: {
                            kind: 'is.notvalid',
                            message: 'Leave dates reach limit',
                        },
                    });
                }
            }
            const ticketID = Math.floor(Math.random() * (99999999 - 10000000)) + 10000000;
            // Create new leave request
            req.body.ticketID = ticketID;
            const { _id: companyId = '' } = company;
            req.body.company = companyId;
            const newLeaveRequestData = Object.assign({}, req.body);
            const newLeaveRequest = yield this.model.create(newLeaveRequestData);
            // Send mail notification
            const ccEmployees = yield bluebird_1.default.map(cc, (ccPerson) => __awaiter(this, void 0, void 0, function* () {
                const foundCcPerson = yield Employee_1.default.findById(mongoose_1.Types.ObjectId(ccPerson));
                return foundCcPerson;
            }));
            const leaveContent = leaveDates.map((leave) => {
                const { date, timeOfDay } = leave;
                return `<li>Date: ${date} | Duration: ${timeOfDay}</li>`;
            });
            const requesteeName = `${employee.generalInfo.firstName} ${employee.generalInfo.lastName}`;
            let mailTitle = `[Leave Request] New leave request from ${requesteeName}</p>`;
            const mailContent = `<div>
      <p>${requesteeName} have created a new leave request: </p>
      <ul>${leaveContent}</ul>
    </div>`;
            let managerName = '';
            if (employee.manager) {
                managerName = `${employee.manager.generalInfo.firstName} ${employee.manager.generalInfo.lastName}`;
            }
            // Send mail to time off requestee
            yield SendMail_1.sendLeaveRequestMail({
                email: employee.generalInfo.workEmail,
                fullName: requesteeName,
            }, [], mailTitle, mailContent);
            // Send mail to time off requestee's manager
            yield SendMail_1.sendLeaveRequestMail({
                email: employee.manager ? employee.manager.generalInfo.workEmail : '',
                fullName: managerName,
            }, [], mailTitle, mailContent);
            // Send mails to time off CC
            yield bluebird_1.default.map(ccEmployees, (ccEmployee) => __awaiter(this, void 0, void 0, function* () {
                const ccEmployeeEmail = ccEmployee.generalInfo.workEmail;
                const ccEmployeeName = `${ccEmployee.generalInfo.firstName} ${ccEmployee.generalInfo.lastName}`;
                yield SendMail_1.sendLeaveRequestMail({
                    email: ccEmployeeEmail,
                    fullName: ccEmployeeName,
                }, [], mailTitle, mailContent);
            }));
            const hrManagers = yield this.getHrManagerByLocation(employee.location._id);
            // Send mail to HR Managers
            yield bluebird_1.default.map(hrManagers, (manager) => __awaiter(this, void 0, void 0, function* () {
                const email = manager.employee.generalInfo.workEmail;
                const fullName = `${manager.employee.generalInfo.firstName} ${manager.employee.generalInfo.lastName}`;
                yield SendMail_1.sendLeaveRequestMail({
                    email,
                    fullName,
                }, [], mailTitle, mailContent);
            }));
            res.send(new ResponseResult_1.default({
                data: newLeaveRequest,
                message: 'Add new leave request successfully',
            }));
        });
    }
    // protected async addLeaveRequest(req: Request, res: Response) {
    //   const { leaveDates, type } = req.body
    //   const currentUser = req.user as IUser
    //   // Calculate number of days leave from leaveDates, throw error if leaveDates is missing
    //   let duration = 0
    //   if (leaveDates) {
    //     await Bluebird.map(leaveDates, (item: any) => {
    //       item.timeOfDay === 'WHOLE-DAY' ? duration++ : (duration += 0.5)
    //     })
    //   } else {
    //     throw new AdvancedError({
    //       leaveDates: {
    //         kind: 'is.missing',
    //         message: 'Specified leave dates details are missing',
    //       },
    //     })
    //   }
    //   // Find leave balance by employee to deduct from
    //   const leaveBalance = await LeaveBalance.findOne({
    //     employee: currentUser.employee._id,
    //   })
    //   // Query update allowance of a leave
    //   if (leaveBalance) {
    //     //Check if type field from req.body matches any in user's leave balance, throw error if not
    //     const common = leaveBalance
    //       .toObject()
    //       .commonLeaves.timeOffTypes.find(
    //         (item: any) => item.defaultSettings === type,
    //       )
    //     const special = leaveBalance
    //       .toObject()
    //       .commonLeaves.timeOffTypes.find(
    //         (item: any) => item.defaultSettings === type,
    //       )
    //     const {
    //       max: specialMax,
    //       negative: specialNegative,
    //     } = special.defaultSettings.balance
    //     const {
    //       max: commonMax,
    //       negative: commonNegative,
    //     } = common.defaultSettings.balance
    //     if (common || special) {
    //       if (common)
    //         if (
    //           common.currentAllowance - duration < commonNegative.unto &&
    //           !commonNegative.unlimited
    //         ) {
    //           // Check minimum days leave allowance with settings for common leaves
    //           throw new AdvancedError({
    //             commonLeaves: {
    //               kind: 'minimum.exceeded',
    //               message: 'The minimum allowance exceeded',
    //             },
    //           })
    //         } else if (
    //           duration > commonMax.notGreaterThan &&
    //           !commonMax.unlimited
    //         ) {
    //           // Check maximum requested days with settings for common leaves
    //           throw new AdvancedError({
    //             commonLeaves: {
    //               kind: 'maximum.exceeded',
    //               message: 'The maximum allowance exceeded',
    //             },
    //           })
    //         }
    //       if (special)
    //         if (
    //           special.currentAllowance - duration < specialNegative.unto &&
    //           !specialNegative.unlimited
    //         ) {
    //           // Check minimum days leave allowance with settings for special leaves
    //           throw new AdvancedError({
    //             specialLeaves: {
    //               kind: 'minimum.exceeded',
    //               message: 'The minimum allowance exceeded',
    //             },
    //           })
    //         } else if (
    //           duration > specialMax.notGreaterThan &&
    //           !specialMax.unlimited
    //         ) {
    //           // Check maximum requested days with settings for special leaves
    //           throw new AdvancedError({
    //             specialLeaves: {
    //               kind: 'maximum.exceeded',
    //               message: 'The maximum allowance exceeded',
    //             },
    //           })
    //         }
    //     } else {
    //       throw new AdvancedError({
    //         timeOffType: {
    //           kind: 'not.found',
    //           message: 'Cannot find time off type for user matches input',
    //         },
    //       })
    //     }
    //     leaveBalance.update(
    //       {
    //         $or: [
    //           { 'commonLeaves.timeOffTypes.defaultSettings': type },
    //           {
    //             'specialLeaves.timeOffTypes.defaultSettings': type,
    //           },
    //         ],
    //       },
    //       {
    //         $or: [
    //           {
    //             $inc: {
    //               'commonLeaves.timeOffTypes.$.currentAllowance': -duration,
    //             },
    //           },
    //           {
    //             $inc: {
    //               'specialLeaves.timeOffTypes.$.currentAllowance': -duration,
    //             },
    //           },
    //         ],
    //       },
    //     )
    //     await leaveBalance.save()
    //   } else {
    //     throw new AdvancedError({
    //       leaveBalance: {
    //         kind: 'not.found',
    //         message: 'Leave balance is missing',
    //       },
    //     })
    //   }
    //   // Assign variables to req.body
    //   req.body.duration = duration
    //   req.body.employee = currentUser.employee
    //   res.send(
    //     new ResponseResult({
    //       message: 'Successfully requested a paid leave',
    //       data: await LeaveRequest.create(req.body),
    //     }),
    //   )
    // }
    getByEmployee(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { employee } = req.body;
            const requests = yield LeaveRequest_1.default.find({ employee });
            res.send(new ResponseResult_1.default({
                message: 'Successfully fetched leave request of employee',
                data: requests,
            }));
        });
    }
    getTeamRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = req.user;
            let employee = currentUser.employee;
            employee = yield Employee_1.default.findById(currentUser.employee);
            const { body: { 
            // limit = 0,
            status = '', location = [], } = {}, } = req;
            const company = [];
            company.push(employee.company.id);
            let locationId = location.map((s) => {
                return mongoose_1.Types.ObjectId(s);
            });
            let companyId = company.map((s) => {
                return mongoose_1.Types.ObjectId(s);
            });
            let aggregate = [];
            const matchOne = { $match: {} };
            if (locationId.length > 0) {
                matchOne.$match.location = {};
                matchOne.$match.location = { $in: locationId };
            }
            if (companyId.length > 0) {
                matchOne.$match.company = {};
                matchOne.$match.company = { $in: companyId };
            }
            if (status) {
                matchOne.$match.status = status;
            }
            aggregate.push(matchOne);
            const matchTwo = { $match: {} };
            matchTwo.$match.manager = employee.id;
            const matchOr = {
                $or: [],
            };
            let checkRoleHR = false;
            lodash_1.map(currentUser.roles, (per) => per._id).forEach(function (item) {
                if (lodash_1.includes(['HR', 'HR-MANAGER', 'HR-GLOBAL'], item)) {
                    checkRoleHR = true;
                    return true;
                }
            });
            if (!checkRoleHR) {
                matchOr.$or.push({
                    approvalManager: employee._id,
                });
                matchOr.$or.push({
                    'project.manager': employee._id,
                });
                matchTwo.$match = matchOr;
                aggregate.push(matchTwo);
            }
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
                        localField: 'approvalManager',
                        foreignField: '_id',
                        as: 'approvalManager',
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
                        localField: 'approvalManager.generalInfo',
                        foreignField: '_id',
                        as: 'approvalManager.generalInfo',
                    },
                },
                {
                    $unwind: {
                        path: '$approvalManager.generalInfo',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'timeofftypes',
                        localField: 'type',
                        foreignField: '_id',
                        as: 'type',
                    },
                },
                {
                    $unwind: {
                        path: '$type',
                        preserveNullAndEmptyArrays: true,
                    },
                },
            ];
            aggregate = [...aggregate, ...lookup];
            const project = {
                $project: {
                    ticketID: 1,
                    status: 1,
                    comment: 1,
                    user: { roles: 1, _id: 1 },
                    location: { name: 1, _id: 1 },
                    department: { name: 1, _id: 1 },
                    project: { name: 1, _id: 1 },
                    type: {
                        _id: 1,
                        name: 1,
                        type: 1,
                        typeName: 1,
                        shortType: 1,
                    },
                    subject: 1,
                    fromDate: 1,
                    toDate: 1,
                    leaveDates: [
                        {
                            date: 1,
                            timeOfDay: 1,
                        },
                    ],
                    duration: 1,
                    onDate: 1,
                    description: 1,
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
                    // approvalManager: {
                    'approvalManager.generalInfo': {
                        firstName: 1,
                        lastName: 1,
                        avatar: 1,
                        _id: 1,
                    },
                    updated: 1,
                },
            };
            aggregate.push(project);
            const items = yield LeaveRequest_1.default.aggregate(aggregate);
            //Total
            aggregate.pop();
            aggregate[0].$match.status = {
                $in: [...constant_1.TYPE_LEAVE_REQUEST.action, ...constant_1.TYPE_LEAVE_REQUEST.status],
            };
            aggregate.push({ $group: { _id: '$status', count: { $sum: 1 } } });
            const total = yield LeaveRequest_1.default.aggregate(aggregate);
            res.send(new ResponseResult_1.default({
                data: { items, total },
                message: 'List team member request successfully',
            }));
        });
    }
    getUserRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = req.user;
            let employee = yield Employee_1.default.findById(currentUser.employee);
            const { body: { 
            // limit = 0,
            status = '', }, } = req;
            let aggregate = [];
            const matchOne = { $match: {} };
            matchOne.$match.employee = employee._id;
            if (status) {
                matchOne.$match.status = status;
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
                        localField: 'approvalManager',
                        foreignField: '_id',
                        as: 'approvalManager',
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
                        localField: 'approvalManager.generalInfo',
                        foreignField: '_id',
                        as: 'approvalManager.generalInfo',
                    },
                },
                {
                    $unwind: {
                        path: '$approvalManager.generalInfo',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                // {
                //   $lookup: {
                //     from: 'employee',
                //     localField: 'approvalManager',
                //     foreignField: '_id',
                //     as: 'approvalManager',
                //   },
                // },
                // {
                //   $unwind: {
                //     path: '$employee',
                //     preserveNullAndEmptyArrays: true,
                //   },
                // },
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
                // {
                //   $lookup: {
                //     from: 'generalinfos',
                //     localField: 'project.manager.generalInfo',
                //     foreignField: '_id',
                //     as: 'project.manager.generalInfo',
                //   },
                // },
                // {
                //   $unwind: {
                //     path: '$project.manager.generalInfo',
                //     preserveNullAndEmptyArrays: true,
                //   },
                // },
                {
                    $lookup: {
                        from: 'timeofftypes',
                        localField: 'type',
                        foreignField: '_id',
                        as: 'type',
                    },
                },
                {
                    $unwind: {
                        path: '$type',
                        preserveNullAndEmptyArrays: true,
                    },
                },
            ];
            aggregate = [...aggregate, ...lookup];
            const project = {
                $project: {
                    ticketID: 1,
                    status: 1,
                    user: { roles: 1, _id: 1 },
                    location: { name: 1, _id: 1 },
                    department: { name: 1, _id: 1 },
                    project: { name: 1, _id: 1 },
                    type: {
                        _id: 1,
                        name: 1,
                        type: 1,
                        typeName: 1,
                        shortType: 1,
                    },
                    subject: 1,
                    fromDate: 1,
                    toDate: 1,
                    leaveDates: [
                        {
                            date: 1,
                            timeOfDay: 1,
                        },
                    ],
                    duration: 1,
                    onDate: 1,
                    description: 1,
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
                    // approvalManager: {
                    'approvalManager.generalInfo': {
                        firstName: 1,
                        lastName: 1,
                        avatar: 1,
                        _id: 1,
                    },
                    updated: 1,
                },
            };
            aggregate.push(project);
            const items = yield LeaveRequest_1.default.aggregate(aggregate);
            //Total
            aggregate.pop();
            aggregate[0].$match.status = {
                $in: [...constant_1.TYPE_LEAVE_REQUEST.action, ...constant_1.TYPE_LEAVE_REQUEST.status],
            };
            aggregate.push({ $group: { _id: '$status', count: { $sum: 1 } } });
            const total = yield LeaveRequest_1.default.aggregate(aggregate);
            res.send(new ResponseResult_1.default({
                message: 'Get offBoarding Request list successfully.',
                data: { items, total },
            }));
        });
    }
    // Get Upcoming Request
    getUpcomingRequest(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataUpcoming = yield this.model.find({
                extraTime: { date: { $gte: Date.now() } },
            });
            res.send(new ResponseResult_1.default({
                data: dataUpcoming,
                message: 'Successfully',
            }));
        });
    }
    getByEmployeeAndDate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { body: { employeeId, duration: { from, to }, status, }, } = req;
            from = new Date().toISOString();
            to = new Date().toISOString();
            const aggregate = [];
            // aggregate[0].$match.status = {
            //   $in: [...TYPE_LEAVE_REQUEST.action, ...TYPE_LEAVE_REQUEST.status],
            // }
            // aggregate.push({ $group: { _id: '$status', count: { $sum: 1 } } })
            const filterStatus = {
                $filter: {
                    input: aggregate,
                    as: 'string',
                    cond: {
                        $match: {
                            status: status,
                        },
                    },
                },
            };
            aggregate.push(filterStatus);
            const data = yield this.model
                .find({
                employee: employeeId,
                fromDate: { $gte: from },
                toDate: { $lt: to },
            })
                .sort({ createdAt: -1 })
                .exec();
            if (!data) {
                throw new AdvancedError_1.default({
                    leaverequest: {
                        kind: 'not.found',
                        message: 'Leave request of this employee not found',
                    },
                });
            }
            res.send(new ResponseResult_1.default({
                data,
                message: 'successful',
            }));
        });
    }
    downloadAsCsv(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { body: { employeeId, duration: { from, to }, }, } = req;
            from = new Date().toISOString();
            to = new Date().toISOString();
            const data = yield this.model
                .find({
                employee: employeeId,
                fromDate: { $gte: from },
                toDate: { $lt: to },
            })
                .sort({ createdAt: -1 })
                .exec();
            const fields = [
                {
                    label: 'No',
                    value: 'no',
                },
                {
                    label: 'Full Name',
                    value: 'full_name',
                },
                {
                    label: 'From Date',
                    value: 'from_date',
                },
                {
                    label: 'To Date',
                    value: 'to_date',
                },
                {
                    label: 'Country',
                    value: 'country',
                },
                {
                    label: 'Leave Type',
                    value: 'leave_type',
                },
                {
                    label: 'Status',
                    value: 'status',
                },
            ];
            const json2csv = new json2csv_1.Parser({ fields });
            const csv = json2csv.parse(data);
            res.header('Content-Type', 'text/csv');
            res.attachment('report.csv');
            res.send(csv);
            res.send(new ResponseResult_1.default({
                message: 'successfully',
            }));
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body: { _id }, } = req;
            const leaveRequest = yield this.model.findById(_id);
            const employee = yield Employee_1.default.findById(leaveRequest.employee);
            if (!leaveRequest) {
                throw new AdvancedError_1.default({
                    leaverequest: {
                        kind: 'not.found',
                        message: 'Leave request not found',
                    },
                });
            }
            // console.log('leaveRequest', leaveRequest)
            yield leaveRequest.set(Object.assign(Object.assign({}, req.body), { updated: true }));
            yield leaveRequest.save();
            // const employee: any = await Employee.findById(leaveRequest.employee)
            // const { cc, leaveDates } = leaveRequest
            // Send mail notification
            const ccEmployees = yield bluebird_1.default.map(leaveRequest.cc, (ccPerson) => __awaiter(this, void 0, void 0, function* () {
                const foundCcPerson = yield Employee_1.default.findById(mongoose_1.Types.ObjectId(ccPerson._id));
                return foundCcPerson;
            }));
            const leaveContent = leaveRequest.leaveDates.map((leave) => {
                const { date, timeOfDay } = leave;
                return `<li>Date: ${date} | Duration: ${timeOfDay}</li>`;
            });
            const requesteeName = `${employee.generalInfo.firstName} ${employee.generalInfo.lastName}`;
            const mailTitle = `[Leave Request] Leave request of ${requesteeName} has been updated.</p>`;
            const mailContent = `<div>
      <p>Leave request of ${requesteeName} has been updated.</p>
      <ul>${leaveContent}</ul>
    </div>`;
            let managerName = '';
            if (employee.manager) {
                managerName = `${employee.manager.generalInfo.firstName} ${employee.manager.generalInfo.lastName}`;
            }
            // Send mail to time off requestee
            yield SendMail_1.sendLeaveRequestMail({
                email: employee.generalInfo.workEmail,
                fullName: requesteeName,
            }, [], mailTitle, mailContent);
            // Send mail to time off requestee's manager
            yield SendMail_1.sendLeaveRequestMail({
                email: employee.manager ? employee.manager.generalInfo.workEmail : '',
                fullName: managerName,
            }, [], mailTitle, mailContent);
            // Send mails to time off CC
            yield bluebird_1.default.map(ccEmployees, (ccEmployee) => __awaiter(this, void 0, void 0, function* () {
                const ccEmployeeEmail = ccEmployee.generalInfo.workEmail;
                const ccEmployeeName = `${ccEmployee.generalInfo.firstName} ${ccEmployee.generalInfo.lastName}`;
                yield SendMail_1.sendLeaveRequestMail({
                    email: ccEmployeeEmail,
                    fullName: ccEmployeeName,
                }, [], mailTitle, mailContent);
            }));
            const hrManagers = yield this.getHrManagerByLocation(employee.location._id);
            // Send mail to HR Managers
            yield bluebird_1.default.map(hrManagers, (manager) => __awaiter(this, void 0, void 0, function* () {
                const email = manager.employee.generalInfo.workEmail;
                const fullName = `${manager.employee.generalInfo.firstName} ${manager.employee.generalInfo.lastName}`;
                yield SendMail_1.sendLeaveRequestMail({
                    email,
                    fullName,
                }, [], mailTitle, mailContent);
            }));
            res.send(new ResponseResult_1.default({
                data: {
                    leaveRequest,
                },
                message: 'Update leave request successfully',
            }));
        });
    }
    saveDraft(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = req;
            const currentUser = req.user;
            const { employee } = currentUser;
            const { company } = employee;
            const { type: typeData } = body;
            const type = (yield TimeoffType_1.default.findOne({
                _id: typeData,
            }));
            if (!type) {
                throw new AdvancedError_1.default({
                    leaverequest: {
                        kind: 'not.valid',
                        message: 'Type is not valid',
                    },
                });
            }
            body.ticketID = Math.floor(Math.random() * (99999999 - 10000000)) + 10000000;
            const { _id: companyId = '' } = company;
            body.company = companyId;
            const newLeaveRequestData = Object.assign(Object.assign({}, body), { status: constant_1.TYPE_LEAVE_REQUEST.statusType.draft, type: type._id });
            const newLeaveRequest = yield this.model.create(newLeaveRequestData);
            res.send(new ResponseResult_1.default({
                data: newLeaveRequest,
                message: 'Save leave request draft successfully',
            }));
        });
    }
    updateDraft(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body: { _id }, } = req;
            const leaveRequest = yield this.model.findById(_id);
            if (!leaveRequest) {
                throw new AdvancedError_1.default({
                    leaverequest: {
                        kind: 'not.found',
                        message: 'Leave request not found',
                    },
                });
            }
            if (leaveRequest.status !== 'DRAFTS') {
                throw new AdvancedError_1.default({
                    leaverequest: {
                        kind: 'not.found',
                        message: 'This is not a draft leave request',
                    },
                });
            }
            yield leaveRequest.set(Object.assign(Object.assign({}, req.body), { updated: true }));
            yield leaveRequest.save();
            res.send(new ResponseResult_1.default({
                data: {
                    leaveRequest,
                },
                message: 'Update leave request draft successfully',
            }));
        });
    }
    withdrawInProgress(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body: { _id }, } = req;
            const { employee } = req.user;
            const leaveRequest = yield this.model.findById(_id);
            if (!leaveRequest) {
                throw new AdvancedError_1.default({
                    leaverequest: {
                        kind: 'not.found',
                        message: 'Leave request not found',
                    },
                });
            }
            // Send email notify to requestee's manager
            // Manager exist
            if (!employee.manager) {
                throw new AdvancedError_1.default({
                    leaverequest: {
                        kind: 'not.found',
                        message: `Employee's manager not found`,
                    },
                });
            }
            let managerName = '';
            if (employee.manager) {
                managerName = `${employee.manager.generalInfo.firstName} ${employee.manager.generalInfo.lastName}`;
            }
            const ccEmployees = yield bluebird_1.default.map(leaveRequest.cc, (ccPerson) => __awaiter(this, void 0, void 0, function* () {
                const foundCcPerson = yield Employee_1.default.findById(mongoose_1.Types.ObjectId(ccPerson._id));
                return foundCcPerson;
            }));
            const STATUS = {
                IN_PROGRESS: 'IN-PROGRESS',
                ACCEPTED: 'ACCEPTED',
            };
            const leaveContent = leaveRequest.leaveDates.map((leave) => {
                const { date, timeOfDay } = leave;
                const formatDate = moment_1.default(date).format('YYYY-MM-DD');
                return `<li>Date: ${formatDate} | Duration: ${timeOfDay}</li>`;
            });
            const requesteeName = `${employee.generalInfo.firstName} ${employee.generalInfo.lastName}`;
            const mailTitle = `[Leave Request] Leave request of ${requesteeName} has been withdrawn.</p>`;
            const mailContent = `<div>
      <p>Leave request of ${requesteeName} has been withdrawn.</p>
      <ul>${leaveContent}</ul>
    </div>`;
            if (leaveRequest.status === STATUS.IN_PROGRESS) {
                // Send mail to time off requestee
                yield SendMail_1.sendLeaveRequestMail({
                    email: employee.generalInfo.workEmail,
                    fullName: requesteeName,
                }, [], mailTitle, mailContent);
                yield SendMail_1.sendLeaveRequestMail({
                    email: employee.manager.generalInfo.workEmail,
                    fullName: managerName,
                }, [], mailTitle, mailContent);
                // Send mails to time off CC
                yield bluebird_1.default.map(ccEmployees, (ccEmployee) => __awaiter(this, void 0, void 0, function* () {
                    const ccEmployeeEmail = ccEmployee.generalInfo.workEmail;
                    const ccEmployeeName = `${ccEmployee.generalInfo.firstName} ${ccEmployee.generalInfo.lastName}`;
                    yield SendMail_1.sendLeaveRequestMail({
                        email: ccEmployeeEmail,
                        fullName: ccEmployeeName,
                    }, [], mailTitle, mailContent);
                }));
                const hrManagers = yield this.getHrManagerByLocation(employee.location._id);
                // Send mail to HR Managers
                yield bluebird_1.default.map(hrManagers, (manager) => __awaiter(this, void 0, void 0, function* () {
                    const email = manager.employee.generalInfo.workEmail;
                    const fullName = `${manager.employee.generalInfo.firstName} ${manager.employee.generalInfo.lastName}`;
                    yield SendMail_1.sendLeaveRequestMail({
                        email,
                        fullName,
                    }, [], mailTitle, mailContent);
                }));
            }
            // Delete request
            // await this.model.deleteOne({ _id })
            yield leaveRequest.set(Object.assign(Object.assign({}, req.body), { status: constant_1.TYPE_LEAVE_REQUEST.statusType.deleted }));
            yield this.model.updateOne({ _id: mongoose_1.Types.ObjectId(_id) }, {
                status: constant_1.TYPE_LEAVE_REQUEST.statusType.deleted,
            });
            res.send(new ResponseResult_1.default({
                data: {
                    // deleteOne,
                    leaveRequest,
                },
                message: 'Withdraw leave request successfully',
            }));
        });
    }
    getHrManagerByLocation(locationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const hrManagers = yield User_1.default.aggregate([
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
            return hrManagers;
        });
    }
    getByID(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.body;
            let aggregates = [];
            let matchOne = { $match: { _id: mongoose_1.Types.ObjectId(id) } };
            aggregates.push(matchOne);
            const lookups = [
                {
                    $lookup: {
                        from: 'projects',
                        localField: 'employee',
                        foreignField: 'resource',
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
                        from: 'projects',
                        let: { emp_id: '$employee._id' },
                        pipeline: [{ $match: { $expr: { $in: ['$$emp_id', '$resource'] } } }],
                        as: 'projects',
                    },
                },
                {
                    $unwind: { path: '$projects', preserveNullAndEmptyArrays: true },
                },
                {
                    $lookup: {
                        from: 'timeofftypes',
                        localField: 'type',
                        foreignField: '_id',
                        as: 'type',
                    },
                },
                {
                    $unwind: { path: '$type', preserveNullAndEmptyArrays: true },
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
                    $unwind: { path: '$employee', preserveNullAndEmptyArrays: true },
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
                        localField: 'approvalManager',
                        foreignField: '_id',
                        as: 'approvalManager',
                    },
                },
                {
                    $unwind: { path: '$approvalManager', preserveNullAndEmptyArrays: true },
                },
                {
                    $lookup: {
                        from: 'generalinfos',
                        localField: 'approvalManager.generalInfo',
                        foreignField: '_id',
                        as: 'approvalManager.generalInfo',
                    },
                },
                {
                    $unwind: {
                        path: '$approvalManager.generalInfo',
                        preserveNullAndEmptyArrays: true,
                    },
                },
            ];
            const projects = {
                $project: {
                    ticketID: 1,
                    company: 1,
                    status: 1,
                    subject: 1,
                    fromDate: 1,
                    toDate: 1,
                    leaveDates: 1,
                    comment: 1,
                    duration: 1,
                    onDate: 1,
                    description: 1,
                    approvalManager: {
                        _id: 1,
                        employeeId: 1,
                        generalInfo: {
                            firstName: 1,
                            lastName: 1,
                            legalName: 1,
                            avatar: 1,
                            workEmail: 1,
                        },
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
                    type: {
                        _id: 1,
                        name: 1,
                        type: 1,
                        typeName: 1,
                        shortType: 1,
                        description: 1,
                        policyDoc: 1,
                    },
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
                    updated: 1,
                    project: 1,
                    projects: 1,
                    withdraw: 1,
                },
            };
            aggregates = [...aggregates, ...lookups, projects];
            const request = yield LeaveRequest_1.default.aggregate(aggregates);
            res.send(new ResponseResult_1.default({
                message: 'Leave request found',
                data: request[0],
            }));
        });
    }
    withdrawSubmit(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body: { _id, title, reason }, } = req;
            const { employee } = req.user;
            const leaveRequest = yield this.model.findById(_id);
            if (!leaveRequest) {
                throw new AdvancedError_1.default({
                    leaverequest: {
                        kind: 'not.found',
                        message: 'Leave request not found',
                    },
                });
            }
            if (!employee) {
                throw new AdvancedError_1.default({
                    leaverequest: {
                        kind: 'not.found',
                        message: 'Employee not found',
                    },
                });
            }
            // Send email notify to requestee's manager
            let managerName = '';
            if (employee.manager) {
                managerName = `${employee.manager.generalInfo.firstName} ${employee.manager.generalInfo.lastName}`;
            }
            const leaveContent = leaveRequest.leaveDates.map((leave) => {
                const { date, timeOfDay } = leave;
                const formatDate = moment_1.default(date).format('YYYY-MM-DD');
                return `<li>Date: ${formatDate} | Duration: ${timeOfDay}</li>`;
            });
            const requesteeName = `${employee.generalInfo.firstName} ${employee.generalInfo.lastName}`;
            const mailTitle = `[Leave Request] New withdraw request a leave request from ${requesteeName}.</p>`;
            const mailContent = `<div>
      <p>${requesteeName} created a withdraw request of a leave request.</p>
      <ul>${leaveContent}</ul>
      <p>Reason: ${reason}</p>
    </div>`;
            // Manager exist
            if (!employee.manager) {
                throw new AdvancedError_1.default({
                    leaverequest: {
                        kind: 'not.found',
                        message: `Employee's manager not found`,
                    },
                });
            }
            // Check leave request status
            if (leaveRequest.status !== constant_1.TYPE_LEAVE_REQUEST.statusType.accepted) {
                throw new AdvancedError_1.default({
                    leaverequest: {
                        kind: 'not.valid',
                        message: `The status of this leave request must be "${constant_1.TYPE_LEAVE_REQUEST.statusType.accepted}"`,
                    },
                });
            }
            let allLeaveDateValid = true;
            const { leaveDates } = leaveRequest;
            leaveDates.forEach((leave) => {
                if (!utils_1.checkWithdrawValid(leave.date)) {
                    allLeaveDateValid = false;
                }
            });
            if (!allLeaveDateValid) {
                throw new AdvancedError_1.default({
                    leaverequest: {
                        kind: 'not.valid',
                        message: 'The leave dates of this leave request is not valid!',
                    },
                });
            }
            // Get all HR Managers
            const hrManagers = yield this.getHrManagerByLocation(employee.location._id);
            const managerEmail = employee.manager.generalInfo.workEmail;
            // Send mail to time off requestee
            yield SendMail_1.sendLeaveRequestMail({
                email: employee.generalInfo.workEmail,
                fullName: requesteeName,
            }, [], mailTitle, mailContent);
            yield SendMail_1.sendLeaveRequestMail({
                email: managerEmail,
                fullName: managerName,
            }, [], mailTitle, mailContent);
            // Send mail to HR Managers
            yield bluebird_1.default.map(hrManagers, (manager) => __awaiter(this, void 0, void 0, function* () {
                const email = manager.employee.generalInfo.workEmail;
                const fullName = `${manager.employee.generalInfo.firstName} ${manager.employee.generalInfo.lastName}`;
                yield SendMail_1.sendLeaveRequestMail({
                    email,
                    fullName,
                }, [], mailTitle, mailContent);
            }));
            yield this.model.updateOne({ _id: mongoose_1.Types.ObjectId(_id) }, {
                status: constant_1.TYPE_LEAVE_REQUEST.statusType.onHold,
                withdraw: {
                    title,
                    reason,
                },
            });
            res.send(new ResponseResult_1.default({
                data: {
                    hrManagersLength: hrManagers.length,
                    hrManagers,
                    leaveRequest,
                },
                message: 'Withdraw leave request successfully',
            }));
        });
    }
    withdrawApprove(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body: { _id }, user, } = req;
            // const { employee } = user as IUser
            const leaveRequest = yield this.model.findById(_id);
            const { status } = leaveRequest;
            const { employee } = user;
            if (status !== constant_1.TYPE_LEAVE_REQUEST.statusType.onHold) {
                throw new AdvancedError_1.default({
                    leaverequest: {
                        kind: 'not.valid',
                        message: `Leave request's status must be "${constant_1.TYPE_LEAVE_REQUEST.statusType.onHold}"`,
                    },
                });
            }
            const employeeId = employee._id;
            const duration = leaveRequest.duration;
            const type = leaveRequest.type._id;
            if (!employeeId) {
                throw new AdvancedError_1.default({
                    employee: {
                        kind: 'not.found',
                        message: `Employee of this leave request not found`,
                    },
                });
            }
            // Check if Team manager/ HR Manager or not
            const isTeamManager = leaveRequest.approvalManager.toString() === user._id.toString();
            const hrManagers = yield this.getHrManagerByLocation(employee.location._id);
            const isHrManager = hrManagers.find(hrManager => hrManager._id.toString() === user._id.toString());
            if (!isHrManager && !isTeamManager) {
                throw new AdvancedError_1.default({
                    employee: {
                        kind: 'not.valid',
                        message: `Employee must be Team Manager or HR Manager to approve/reject this withdrawal`,
                    },
                });
            }
            if (leaveRequest.type.type !== 'D') {
                const leaveBalance = yield LeaveBalance_1.default.findOne({
                    employee: employeeId,
                });
                const LEAVE_TYPE = {
                    COMMON_LEAVE: 'commonLeaves',
                    SPECIAL_LEAVE: 'specialLeaves',
                };
                let leaveType = LEAVE_TYPE.COMMON_LEAVE;
                let currentTimeoffType = leaveBalance[leaveType].timeOffTypes.find((typeItem) => {
                    return (
                    // Types.ObjectId(typeItem.defaultSettings._id) === Types.ObjectId(type)
                    typeItem.defaultSettings._id.toString() === type.toString());
                });
                if (!currentTimeoffType) {
                    leaveType = LEAVE_TYPE.SPECIAL_LEAVE;
                    currentTimeoffType = leaveBalance[leaveType].timeOffTypes.find((typeItem) => {
                        return typeItem.defaultSettings._id.toString() === type.toString();
                    });
                }
                // Get index of current timeOffTypes
                const foundTimeOffIndex = leaveBalance[leaveType].timeOffTypes.findIndex((type) => mongoose_1.Types.ObjectId(type._id) === mongoose_1.Types.ObjectId(currentTimeoffType._id));
                // Update new leave balance with default current allowance
                let updatedLeaveBalance = Object.assign({}, leaveBalance.toObject());
                updatedLeaveBalance[leaveType].timeOffTypes[foundTimeOffIndex].currentAllowance =
                    updatedLeaveBalance[leaveType].timeOffTypes[foundTimeOffIndex]
                        .currentAllowance + duration;
                // updatedLeaveBalance[leaveType].timeOffTypes[
                //   foundTimeOffIndex
                // ].defaultSettings.baseAccrual.time
                // Update to leaveBalance database
                yield LeaveBalance_1.default.updateOne({ _id: mongoose_1.Types.ObjectId(updatedLeaveBalance._id) }, updatedLeaveBalance);
            }
            // Send email notify to requestee's manager
            // Manager exist
            if (!employee.manager) {
                throw new AdvancedError_1.default({
                    leaverequest: {
                        kind: 'not.found',
                        message: `Employee's manager not found`,
                    },
                });
            }
            let managerName = '';
            if (employee.manager) {
                managerName = `${employee.manager.generalInfo.firstName} ${employee.manager.generalInfo.lastName}`;
            }
            const ccEmployees = yield bluebird_1.default.map(leaveRequest.cc, (ccPerson) => __awaiter(this, void 0, void 0, function* () {
                const foundCcPerson = yield Employee_1.default.findById(mongoose_1.Types.ObjectId(ccPerson._id));
                return foundCcPerson;
            }));
            const leaveContent = leaveRequest.leaveDates.map((leave) => {
                const { date, timeOfDay } = leave;
                const formatDate = moment_1.default(date).format('YYYY-MM-DD');
                return `<li>Date: ${formatDate} | Duration: ${timeOfDay}</li>`;
            });
            const requesteeName = `${employee.generalInfo.firstName} ${employee.generalInfo.lastName}`;
            const mailTitle = `[Leave Request] Leave request of ${requesteeName} has been withdrawn.</p>`;
            const mailContent = `<div>
      <p>Reporting Manager of ${requesteeName} has accepted the withdraw request of leave request.</p>
      <ul>${leaveContent}</ul>
      <p>Reason: ${leaveRequest.comment}</p>
    </div>`;
            // Send mail to time off requestee
            yield SendMail_1.sendLeaveRequestMail({
                email: employee.generalInfo.workEmail,
                fullName: requesteeName,
            }, [], mailTitle, mailContent);
            yield SendMail_1.sendLeaveRequestMail({
                email: employee.manager.generalInfo.workEmail,
                fullName: managerName,
            }, [], mailTitle, mailContent);
            // Send mails to time off CC
            yield bluebird_1.default.map(ccEmployees, (ccEmployee) => __awaiter(this, void 0, void 0, function* () {
                const ccEmployeeEmail = ccEmployee.generalInfo.workEmail;
                const ccEmployeeName = `${ccEmployee.generalInfo.firstName} ${ccEmployee.generalInfo.lastName}`;
                yield SendMail_1.sendLeaveRequestMail({
                    email: ccEmployeeEmail,
                    fullName: ccEmployeeName,
                }, [], mailTitle, mailContent);
            }));
            // Send mail to HR Managers
            yield bluebird_1.default.map(hrManagers, (manager) => __awaiter(this, void 0, void 0, function* () {
                const email = manager.employee.generalInfo.workEmail;
                const fullName = `${manager.employee.generalInfo.firstName} ${manager.employee.generalInfo.lastName}`;
                yield SendMail_1.sendLeaveRequestMail({
                    email,
                    fullName,
                }, [], mailTitle, mailContent);
            }));
            // Remove leave request ticket from leaveRequest database
            // await LeaveRequest.deleteOne({ _id })
            yield this.model.updateOne({ _id: mongoose_1.Types.ObjectId(_id) }, { status: constant_1.TYPE_LEAVE_REQUEST.statusType.deleted });
            leaveRequest.status = constant_1.TYPE_LEAVE_REQUEST.statusType.deleted;
            res.send(new ResponseResult_1.default({
                data: {
                    hrManagers,
                    // leaveBalance,
                    leaveRequest,
                },
                message: 'Withdrawal approve successfully!',
            }));
        });
    }
    withdrawReject(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body: { _id }, user, } = req;
            const leaveRequest = yield this.model.findById(_id);
            if (!leaveRequest) {
                throw new AdvancedError_1.default({
                    leaverequest: {
                        kind: 'not.found',
                        message: `Leave request not found`,
                    },
                });
            }
            const { employee } = user;
            // Check if Team manager/ HR Manager or not
            const isTeamManager = leaveRequest.approvalManager.toString() === user._id.toString();
            const hrManagers = yield this.getHrManagerByLocation(employee.location._id);
            const isHrManager = hrManagers.find(hrManager => hrManager._id.toString() === user._id.toString());
            if (!isHrManager && !isTeamManager) {
                throw new AdvancedError_1.default({
                    employee: {
                        kind: 'not.valid',
                        message: `Employee must be Team Manager or HR Manager to approve/reject this withdrawal`,
                    },
                });
            }
            let managerName = '';
            if (employee.manager) {
                managerName = `${employee.manager.generalInfo.firstName} ${employee.manager.generalInfo.lastName}`;
            }
            const ccEmployees = yield bluebird_1.default.map(leaveRequest.cc, (ccPerson) => __awaiter(this, void 0, void 0, function* () {
                const foundCcPerson = yield Employee_1.default.findById(mongoose_1.Types.ObjectId(ccPerson._id));
                return foundCcPerson;
            }));
            const leaveContent = leaveRequest.leaveDates.map((leave) => {
                const { date, timeOfDay } = leave;
                const formatDate = moment_1.default(date).format('YYYY-MM-DD');
                return `<li>Date: ${formatDate} | Duration: ${timeOfDay}</li>`;
            });
            const requesteeName = `${employee.generalInfo.firstName} ${employee.generalInfo.lastName}`;
            const mailTitle = `[Leave Request] Withdraw request of ${requesteeName} has been rejected.</p>`;
            const mailContent = `<div>
      <p>Reporting Manager of ${requesteeName} has rejected the withdraw request of leave request.</p>
      <ul>${leaveContent}</ul>
      <p>Reason: ${leaveRequest.comment}</p>
    </div>`;
            // Send mail to time off requestee
            yield SendMail_1.sendLeaveRequestMail({
                email: employee.generalInfo.workEmail,
                fullName: requesteeName,
            }, [], mailTitle, mailContent);
            yield SendMail_1.sendLeaveRequestMail({
                email: employee.manager.generalInfo.workEmail,
                fullName: managerName,
            }, [], mailTitle, mailContent);
            // Send mails to time off CC
            yield bluebird_1.default.map(ccEmployees, (ccEmployee) => __awaiter(this, void 0, void 0, function* () {
                const ccEmployeeEmail = ccEmployee.generalInfo.workEmail;
                const ccEmployeeName = `${ccEmployee.generalInfo.firstName} ${ccEmployee.generalInfo.lastName}`;
                yield SendMail_1.sendLeaveRequestMail({
                    email: ccEmployeeEmail,
                    fullName: ccEmployeeName,
                }, [], mailTitle, mailContent);
            }));
            // Send mail to HR Managers
            yield bluebird_1.default.map(hrManagers, (manager) => __awaiter(this, void 0, void 0, function* () {
                const email = manager.employee.generalInfo.workEmail;
                const fullName = `${manager.employee.generalInfo.firstName} ${manager.employee.generalInfo.lastName}`;
                yield SendMail_1.sendLeaveRequestMail({
                    email,
                    fullName,
                }, [], mailTitle, mailContent);
            }));
            yield this.model.updateOne({ _id: mongoose_1.Types.ObjectId(_id) }, { status: constant_1.TYPE_LEAVE_REQUEST.statusType.accepted });
            leaveRequest.status = constant_1.TYPE_LEAVE_REQUEST.statusType.accepted;
            res.send(new ResponseResult_1.default({
                data: {
                    // user,
                    // hrManagers,
                    leaveRequest,
                },
                message: 'Withdrawal rejected succesfully!',
            }));
        });
    }
    approveATicketFunc(_id, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const leaveRequest = yield this.model.findById(mongoose_1.Types.ObjectId(_id));
            const employee = yield Employee_1.default.findById(leaveRequest.employee);
            if (!leaveRequest) {
                throw new AdvancedError_1.default({
                    leaverequest: {
                        kind: 'not.found',
                        message: 'Leave request not found',
                    },
                });
            }
            yield leaveRequest.set(Object.assign(Object.assign({}, req.body), { status: constant_1.TYPE_LEAVE_REQUEST.statusType.accepted }));
            yield leaveRequest.save();
            if (leaveRequest.type.type !== 'D') {
                const { employee, duration } = leaveRequest;
                const leaveBalance = yield LeaveBalance_1.default.findOne({
                    employee,
                });
                const type = leaveRequest.type._id;
                const LEAVE_TYPE = {
                    COMMON_LEAVE: 'commonLeaves',
                    SPECIAL_LEAVE: 'specialLeaves',
                };
                let leaveType = LEAVE_TYPE.COMMON_LEAVE;
                let currentTimeoffType = leaveBalance[leaveType].timeOffTypes.find((typeItem) => {
                    return (
                    // Types.ObjectId(typeItem.defaultSettings._id) === Types.ObjectId(type)
                    typeItem.defaultSettings._id.toString() === type.toString());
                });
                if (!currentTimeoffType) {
                    leaveType = LEAVE_TYPE.SPECIAL_LEAVE;
                    currentTimeoffType = leaveBalance[leaveType].timeOffTypes.find((typeItem) => {
                        return typeItem.defaultSettings._id.toString() === type.toString();
                    });
                }
                // Get index of current timeOffTypes
                const foundTimeOffIndex = leaveBalance[leaveType].timeOffTypes.findIndex((type) => mongoose_1.Types.ObjectId(type._id) === mongoose_1.Types.ObjectId(currentTimeoffType._id));
                // Update new leave balance with default current allowance
                let updatedLeaveBalance = Object.assign({}, leaveBalance.toObject());
                updatedLeaveBalance[leaveType].timeOffTypes[foundTimeOffIndex].currentAllowance =
                    updatedLeaveBalance[leaveType].timeOffTypes[foundTimeOffIndex]
                        .currentAllowance - duration;
                // Update to leaveBalance database
                yield LeaveBalance_1.default.updateOne({ _id: mongoose_1.Types.ObjectId(updatedLeaveBalance._id) }, updatedLeaveBalance);
            }
            // Send mail notification
            const ccEmployees = yield bluebird_1.default.map(leaveRequest.cc, (ccPerson) => __awaiter(this, void 0, void 0, function* () {
                const foundCcPerson = yield Employee_1.default.findById(mongoose_1.Types.ObjectId(ccPerson._id));
                return foundCcPerson;
            }));
            const leaveContent = leaveRequest.leaveDates.map((leave) => {
                const { date, timeOfDay } = leave;
                return `<li>Date: ${date} | Duration: ${timeOfDay}</li>`;
            });
            const requesteeName = `${employee.generalInfo.firstName} ${employee.generalInfo.lastName}`;
            const mailTitle = `[Leave Request] Leave request of ${requesteeName} has been approved.</p>`;
            const mailContent = `<div>
      <p>Leave request of ${requesteeName} has been approved.</p>
      <ul>${leaveContent}</ul>
    </div>`;
            let managerName = '';
            if (employee.manager) {
                managerName = `${employee.manager.generalInfo.firstName} ${employee.manager.generalInfo.lastName}`;
            }
            // Send mail to time off requestee
            yield SendMail_1.sendLeaveRequestMail({
                email: employee.generalInfo.workEmail,
                fullName: requesteeName,
            }, [], mailTitle, mailContent);
            // Send mail to time off requestee's manager
            yield SendMail_1.sendLeaveRequestMail({
                email: employee.manager ? employee.manager.generalInfo.workEmail : '',
                fullName: managerName,
            }, [], mailTitle, mailContent);
            // Send mails to time off CC
            yield bluebird_1.default.map(ccEmployees, (ccEmployee) => __awaiter(this, void 0, void 0, function* () {
                const ccEmployeeEmail = ccEmployee.generalInfo.workEmail;
                const ccEmployeeName = `${ccEmployee.generalInfo.firstName} ${ccEmployee.generalInfo.lastName}`;
                yield SendMail_1.sendLeaveRequestMail({
                    email: ccEmployeeEmail,
                    fullName: ccEmployeeName,
                }, [], mailTitle, mailContent);
            }));
            const hrManagers = yield this.getHrManagerByLocation(employee.location._id);
            // Send mail to HR Managers
            yield bluebird_1.default.map(hrManagers, (manager) => __awaiter(this, void 0, void 0, function* () {
                const email = manager.employee.generalInfo.workEmail;
                const fullName = `${manager.employee.generalInfo.firstName} ${manager.employee.generalInfo.lastName}`;
                yield SendMail_1.sendLeaveRequestMail({
                    email,
                    fullName,
                }, [], mailTitle, mailContent);
            }));
            return leaveRequest;
        });
    }
    rejectATicketFunc(_id, comment, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const leaveRequest = yield this.model.findById(_id);
            const employee = yield Employee_1.default.findById(leaveRequest.employee);
            if (!leaveRequest) {
                throw new AdvancedError_1.default({
                    leaverequest: {
                        kind: 'not.found',
                        message: 'Leave request not found',
                    },
                });
            }
            yield leaveRequest.set(Object.assign(Object.assign({}, req.body), { status: constant_1.TYPE_LEAVE_REQUEST.statusType.rejected, comment }));
            yield leaveRequest.save();
            // Send mail notification
            const ccEmployees = yield bluebird_1.default.map(leaveRequest.cc, (ccPerson) => __awaiter(this, void 0, void 0, function* () {
                const foundCcPerson = yield Employee_1.default.findById(mongoose_1.Types.ObjectId(ccPerson._id));
                return foundCcPerson;
            }));
            const leaveContent = leaveRequest.leaveDates.map((leave) => {
                const { date, timeOfDay } = leave;
                return `<li>Date: ${date} | Duration: ${timeOfDay}</li>`;
            });
            const requesteeName = `${employee.generalInfo.firstName} ${employee.generalInfo.lastName}`;
            const mailTitle = `[Leave Request] Leave request of ${requesteeName} has been approved.</p>`;
            const mailContent = `<div>
      <p>Leave request of ${requesteeName} has been approved.</p>
      <ul>${leaveContent}</ul>
    </div>`;
            let managerName = '';
            if (employee.manager) {
                managerName = `${employee.manager.generalInfo.firstName} ${employee.manager.generalInfo.lastName}`;
            }
            // Send mail to time off requestee
            yield SendMail_1.sendLeaveRequestMail({
                email: employee.generalInfo.workEmail,
                fullName: requesteeName,
            }, [], mailTitle, mailContent);
            // Send mail to time off requestee's manager
            yield SendMail_1.sendLeaveRequestMail({
                email: employee.manager ? employee.manager.generalInfo.workEmail : '',
                fullName: managerName,
            }, [], mailTitle, mailContent);
            // Send mails to time off CC
            yield bluebird_1.default.map(ccEmployees, (ccEmployee) => __awaiter(this, void 0, void 0, function* () {
                const ccEmployeeEmail = ccEmployee.generalInfo.workEmail;
                const ccEmployeeName = `${ccEmployee.generalInfo.firstName} ${ccEmployee.generalInfo.lastName}`;
                yield SendMail_1.sendLeaveRequestMail({
                    email: ccEmployeeEmail,
                    fullName: ccEmployeeName,
                }, [], mailTitle, mailContent);
            }));
            const hrManagers = yield this.getHrManagerByLocation(employee.location._id);
            // Send mail to HR Managers
            yield bluebird_1.default.map(hrManagers, (manager) => __awaiter(this, void 0, void 0, function* () {
                const email = manager.employee.generalInfo.workEmail;
                const fullName = `${manager.employee.generalInfo.firstName} ${manager.employee.generalInfo.lastName}`;
                yield SendMail_1.sendLeaveRequestMail({
                    email,
                    fullName,
                }, [], mailTitle, mailContent);
            }));
            return leaveRequest;
        });
    }
    approveRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body: { _id }, } = req;
            const result = yield this.approveATicketFunc(_id, req);
            if (result) {
                res.send(new ResponseResult_1.default({
                    data: {
                        leaveRequest: result,
                    },
                    message: 'Leave request has been approved',
                }));
            }
        });
    }
    rejectRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body: { _id, comment }, } = req;
            const result = yield this.rejectATicketFunc(_id, comment, req);
            if (result) {
                res.send(new ResponseResult_1.default({
                    data: {
                        leaveRequest: result,
                    },
                    message: 'Leave request has been rejected',
                }));
            }
        });
    }
    // multiple tickets
    approveMultipleRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body: { ticketList = [] }, } = req;
            const promises = ticketList.map((ticket) => __awaiter(this, void 0, void 0, function* () {
                const response = yield this.approveATicketFunc(ticket, req);
                return response;
            }));
            yield Promise.all(promises);
            res.send(new ResponseResult_1.default({
                data: {},
                message: 'Multiple leave requests has been approved',
            }));
        });
    }
    rejectMultipleRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body: { ticketList = [], comment = '' }, } = req;
            const promises = ticketList.map((ticket) => __awaiter(this, void 0, void 0, function* () {
                const response = yield this.rejectATicketFunc(ticket, comment, req);
                return response;
            }));
            yield Promise.all(promises);
            res.send(new ResponseResult_1.default({
                data: {},
                message: 'Multiple leave requests has been rejected',
            }));
        });
    }
}
exports.default = new LeaveRequestController(LeaveRequest_1.default);
//# sourceMappingURL=LeaveRequestController.js.map