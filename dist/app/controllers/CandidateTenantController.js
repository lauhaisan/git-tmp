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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CustomEmailTenantController_1 = __importDefault(require("@/app/controllers/CustomEmailTenantController"));
const AbstractController_1 = __importDefault(require("@/app/declares/AbstractController"));
const AdvancedError_1 = __importDefault(require("@/app/declares/AdvancedError"));
// import AttachmentTenant from '@/app/models/AttachmentTenant'
// import BenefitTenant from '@/app/models/BenefitTenant'
// import CandidateTenant from '@/app/models/CandidateTenant'
// import DocumentTenant from '@/app/models/DocumentTenant'
// import EmployeeTenant from '@/app/models/EmployeeTenant'
// import GeneralInfoTenant from '@/app/models/GeneralInfoTenant'
// import OnboardingQuestionTenant from '@/app/models/OnboardingQuestionTenant'
// import PasswordRequestTenant from '@/app/models/PasswordRequestTenant'
// import UserTenant from '@/app/models/UserTenant'
// import WorkHistoryTenant from '@/app/models/WorkHistoryTenant'
const Bcrypt_1 = __importDefault(require("@/app/services/Bcrypt"));
const ResponseResult_1 = __importDefault(require("@/app/services/ResponseResult"));
const SendMail_1 = require("@/app/services/SendMail");
const constant_1 = require("@/app/utils/constant");
const bluebird_1 = __importDefault(require("bluebird"));
const lodash_1 = require("lodash");
const mongoose_1 = require("mongoose");
const Attachment_1 = __importDefault(require("../models/Attachment"));
// import AttachmentTenant from '../models/AttachmentTenant'
const BenefitTenant_1 = __importDefault(require("../models/BenefitTenant"));
const CandidateTenant_1 = __importDefault(require("../models/CandidateTenant"));
const DocumentTenant_1 = __importDefault(require("../models/DocumentTenant"));
const EmployeeTenant_1 = __importDefault(require("../models/EmployeeTenant"));
const GeneralInfoTenant_1 = __importDefault(require("../models/GeneralInfoTenant"));
const ManagePermission_1 = __importDefault(require("../models/ManagePermission"));
const OnboardingQuestionTenant_1 = __importDefault(require("../models/OnboardingQuestionTenant"));
const PasswordRequestTenant_1 = __importDefault(require("../models/PasswordRequestTenant"));
const UserMap_1 = __importDefault(require("../models/UserMap"));
const UserTenant_1 = __importDefault(require("../models/UserTenant"));
const WorkHistoryTenant_1 = __importDefault(require("../models/WorkHistoryTenant"));
const utils_1 = require("../utils/utils");
class CandidateTenantController extends AbstractController_1.default {
    constructor() {
        super(...arguments);
        this.isString = (str) => {
            let flag = true;
            if (typeof str !== 'string' || !str)
                flag = false;
            return flag;
        };
        this.filterEmptyField = (obj = {}) => {
            lodash_1.forEach(obj, (v, k) => {
                if (typeof v !== 'number') {
                    if (lodash_1.isEmpty(v)) {
                        // if (typeof v === 'object') return
                        delete obj[k];
                    }
                }
            });
            return obj;
        };
        // private hasAccess = (user: any, allowAccess: string[]) => {
        //   if (includes(allowAccess, user.email)) return true
        //   else return false
        // }
        this.currentProcess = [
            'SENT-PROVISIONAL-OFFER',
            'PENDING-BACKGROUND-CHECK',
            'ELIGIBLE-CANDIDATE',
            'INELIGIBLE-CANDIDATE',
            'ACCEPT-PROVISIONAL-OFFER',
            'RENEGOTIATE-PROVISONAL-OFFER',
            'DISCARDED-PROVISONAL-OFFER',
            'RECEIVED-SUBMITTED-DOCUMENTS',
            'PENDING-APPROVAL-FINAL-OFFER',
            'APPROVED-FINAL-OFFER',
            'REJECT-FINAL-OFFER-HR',
            'REJECT-FINAL-OFFER-CANDIDATE',
            'SENT-FINAL-OFFER',
            'ACCEPT-FINAL-OFFER',
            'FINAL-OFFER-DRAFT',
        ];
        this.genRandomPassword = (length) => {
            var result = '';
            var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var charactersLength = characters.length;
            for (var i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        };
        // private async accessCheck(userId: any, access: string[]) {
        //   let check: boolean = true
        //   const user = (await User.findById(userId)) as IUser
        //   if (!user) {
        //     check = false
        //     throw new AdvancedError({
        //       user: { kind: 'not.found', message: 'User not found' },
        //     })
        //   }
        //   if (!includes(access, user.email)) {
        //     check = false
        //     throw new AdvancedError({
        //       user: {
        //         kind: 'not.permission',
        //         message: 'User does not have permission',
        //       },
        //     })
        //   }
        //   check = true
        //   return check
        // }
        // private validateBasicInformation = (basicInfomation: object = {}) => {
        //   const errors: Error[] = []
        //   forEach(basicInfomation, (value, key) => {
        //     if (!value)
        //       errors.push(
        //         new AdvancedError({
        //           candidate: {
        //             kind: 'invalid',
        //             message: `${key} is invalid`,
        //           },
        //         }),
        //       )
        //   })
        //   return errors
        // }
        // private validateJobDetail = (jobDetail: object = {}) => {
        //   const errors: Error[] = []
        //   forEach(jobDetail, (value, key) => {
        //     if (!value)
        //       errors.push(
        //         new AdvancedError({
        //           candidate: {
        //             kind: 'invalid',
        //             message: `${key} is invalid`,
        //           },
        //         }),
        //       )
        //   })
        //   return errors
        // }
        // private validateDocument = (documents: any) => {
        //   const errors: Error[] = []
        //   forEach(documents, document => {
        //     if (typeof document.type !== 'string') {
        //       errors.push(
        //         new AdvancedError({
        //           document: { kind: 'isString', message: 'Type is invalid' },
        //         }),
        //       )
        //     }
        //     if (typeof document.name !== 'string') {
        //       errors.push(
        //         new AdvancedError({
        //           document: { kind: 'isString', message: 'Name is invalid' },
        //         }),
        //       )
        //     }
        //     if (typeof document.data !== 'object') {
        //       errors.push(
        //         new AdvancedError({
        //           document: { kind: 'isObjectArray', message: 'Data is invalid' },
        //         }),
        //       )
        //     }
        //   })
        //   return errors
        // }
        // private validateEmail = (email: string) => {
        //   const emailReg = new RegExp(
        //     /^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        //   )
        //   return emailReg.test(email)
        // }
        // protected async addRoleManagerForAll(_req: Request, res: Response) {
        //   // Add role MANAGER for all reporting manager
        //   let aggregates: any = []
        //   const match = [
        //     {
        //       $match: {
        //         reportingManager: { $ne: null },
        //       },
        //     },
        //   ]
        //   const lookup: any = [
        //     {
        //       // Get all reporting manager information
        //       $lookup: {
        //         from: 'employees',
        //         localField: 'reportingManager',
        //         foreignField: '_id',
        //         as: 'reportingManager',
        //       },
        //     },
        //     {
        //       $unwind: {
        //         path: '$reportingManager',
        //         preserveNullAndEmptyArrays: true,
        //       },
        //     },
        //     {
        //       $lookup: {
        //         from: 'users',
        //         localField: 'reportingManager._id',
        //         foreignField: 'employee',
        //         as: 'reportingManager.user',
        //       },
        //     },
        //     {
        //       $unwind: {
        //         path: '$reportingManager.user',
        //         preserveNullAndEmptyArrays: true,
        //       },
        //     },
        //     {
        //       $match: {
        //         'reportingManager.user.roles': { $nin: ['MANAGER'] },
        //       },
        //     },
        //   ]
        //   aggregates = [...match, ...lookup]
        //   const candidates = await Candidate.aggregate(aggregates)
        //   let result: any = []
        //   if (candidates.length > 0) {
        //     await Bluebird.map(candidates, async candidate => {
        //       const newItem = await User.findOneAndUpdate(
        //         {
        //           _id: candidate.reportingManager.user._id,
        //           roles: { $nin: ['MANAGER'] },
        //         },
        //         {
        //           $push: { roles: 'MANAGER' },
        //         },
        //       )
        //       result.push(newItem)
        //     })
        //   }
        //   res.send(
        //     new ResponseResult({
        //       message: 'Add MANAGER role for all reporting manager successfully',
        //       data: {
        //         result,
        //         resultLength: result.length,
        //       },
        //     }),
        //   )
        // }
    }
    generateMethods() {
        return [
            {
                name: 'list',
                type: 'POST',
                _ref: this.list.bind(this),
            },
            {
                name: 'get-status-summary',
                type: 'POST',
                _ref: this.getStatusSummary.bind(this),
            },
            {
                name: 'get-by-id',
                type: 'POST',
                _ref: this.getByID.bind(this),
            },
            {
                name: 'basic-info',
                type: 'POST',
                _ref: this.basicInfo.bind(this),
            },
            {
                name: 'delete-draft',
                type: 'POST',
                _ref: this.deleteDraft.bind(this),
            },
            {
                name: 'phase-one-candidate',
                type: 'POST',
                _ref: this.phaseOneCandidate.bind(this),
            },
            {
                name: 'add-attachment-candidate',
                type: 'POST',
                _ref: this.addAttachmentByCandidate.bind(this),
                validationSchema: {
                    document: {
                        in: 'body',
                        isString: {
                            errorMessage: ['isString', 'Document ID is invalid'],
                        },
                        exists: {
                            errorMessage: ['required', 'Document ID must be provided'],
                        },
                    },
                    attachment: {
                        in: 'body',
                        isString: {
                            errorMessage: ['isString', 'Attachment ID is invalid'],
                        },
                        exists: {
                            errorMessage: ['required', 'Attachment ID must be provided'],
                        },
                    },
                },
            },
            {
                name: 'phase-one-hr',
                type: 'POST',
                _ref: this.phaseOneHR.bind(this),
            },
            {
                name: 'submitRequiredDocument',
                type: 'POST',
                _ref: this.submitRequiredDocument.bind(this),
            },
            {
                name: 'add-new-member',
                type: 'POST',
                _ref: this.addNewMember.bind(this),
            },
            {
                name: 'update-by-hr',
                type: 'POST',
                _ref: this.updateByHR.bind(this),
                validationSchema: {
                    candidate: {
                        in: 'body',
                        isString: {
                            errorMessage: ['isString', 'Candidate ID is invalid'],
                        },
                        exists: {
                            errorMessage: ['required', 'Candidate ID must be provided'],
                        },
                    },
                },
            },
            {
                name: 'approve-final-offer',
                type: 'POST',
                _ref: this.approveFinalOffer.bind(this),
                validationSchema: {
                    candidate: {
                        in: 'body',
                        isString: {
                            errorMessage: ['isString', 'Candidate ID is invalid'],
                        },
                        exists: {
                            errorMessage: ['required', 'Candidate ID must be provided'],
                        },
                    },
                    hrManagerSignature: {
                        in: 'body',
                        isString: {
                            errorMessage: ['isString', 'HR manager signature is invalid'],
                        },
                        exists: {
                            errorMessage: [
                                'required',
                                'HR manager signature must be provided',
                            ],
                        },
                    },
                    options: {
                        in: 'body',
                        isNumeric: {
                            errorMessage: ['isNumeric', 'Option is invalid'],
                        },
                        exists: {
                            errorMessage: ['required', 'Option must be provided'],
                        },
                    },
                },
            },
            {
                name: 'final-offer-draft',
                type: 'POST',
                _ref: this.finalOfferDraft.bind(this),
                validationSchema: {
                    candidate: {
                        in: 'body',
                        isString: {
                            errorMessage: ['isString', 'Candidate ID is invalid'],
                        },
                        exists: {
                            errorMessage: ['required', 'Candidate ID must be provided'],
                        },
                    },
                    hrSignature: {
                        in: 'body',
                        isString: {
                            errorMessage: ['isString', 'HR signature is invalid'],
                        },
                        exists: {
                            errorMessage: ['required', 'HR signature must be provided'],
                        },
                    },
                },
            },
            {
                name: 'document-check',
                type: 'POST',
                _ref: this.documentCheck.bind(this),
                validationSchema: {
                    document: {
                        in: 'body',
                        isString: {
                            errorMessage: ['isString', 'Document is invalid'],
                        },
                        exists: {
                            errorMessage: ['required', 'Document must be provided'],
                        },
                    },
                    candidateDocumentStatus: {
                        in: 'body',
                        isNumeric: {
                            errorMessage: ['isNumeric', 'Status is invalid'],
                        },
                        exists: {
                            errorMessage: ['required', 'Status must be provided'],
                        },
                    },
                },
            },
            {
                name: 'update-by-candidate',
                type: 'POST',
                _ref: this.updateByCandidate.bind(this),
            },
            {
                name: 'background-check',
                type: 'POST',
                _ref: this.backgroundCheck.bind(this),
                validationSchema: {
                    candidate: {
                        in: 'body',
                        isString: {
                            errorMessage: ['isString', 'Candidate is invalid'],
                        },
                        exists: {
                            errorMessage: ['required', 'Candidate must be provided'],
                        },
                    },
                    options: {
                        in: 'body',
                        isNumeric: {
                            errorMessage: ['isNumeric', 'Candidate is invalid'],
                        },
                        exists: {
                            errorMessage: ['required', 'Candidate must be provided'],
                        },
                    },
                },
            },
            {
                name: 'schedule',
                type: 'POST',
                _ref: this.scheduleHR.bind(this),
                validationSchema: {
                    candidate: {
                        in: 'body',
                        isString: {
                            errorMessage: ['isString', 'Candidate is invalid'],
                        },
                        exists: {
                            errorMessage: ['required', 'Candidate must be provided'],
                        },
                    },
                    schedule: {
                        in: 'body',
                        exists: {
                            errorMessage: ['required', 'Schedule must be provided'],
                        },
                    },
                },
            },
            {
                name: 'close-candidate',
                type: 'POST',
                _ref: this.closeCandidate.bind(this),
                validationSchema: {
                    candidate: {
                        in: 'body',
                        isString: {
                            errorMessage: ['isString', 'Candidate is invalid'],
                        },
                        exists: {
                            errorMessage: ['required', 'Candidate must be provided'],
                        },
                    },
                },
            },
            {
                name: 'edit-salarystructure',
                type: 'POST',
                _ref: this.editSalaryStructure.bind(this),
            },
            {
                name: 'sent-for-approval',
                type: 'POST',
                _ref: this.sendApproval.bind(this),
                validationSchema: {
                    candidate: {
                        in: 'body',
                        isString: {
                            errorMessage: ['isString', 'Candidate is invalid'],
                        },
                        exists: {
                            errorMessage: ['required', 'Candidate must be provided'],
                        },
                    },
                    hrSignature: {
                        in: 'body',
                        isString: {
                            errorMessage: ['isString', 'HR signature is invalid'],
                        },
                        exists: {
                            errorMessage: ['required', 'HR signature must be provided'],
                        },
                    },
                },
            },
            {
                name: 'candidate-final-offer',
                type: 'POST',
                _ref: this.candidateFinalOffer.bind(this),
                validationSchema: {
                    options: {
                        in: 'body',
                        isNumeric: {
                            errorMessage: ['isNumeric', 'Option is invalid'],
                        },
                        exists: {
                            errorMessage: ['required', 'Option must be provided'],
                        },
                    },
                    candidateFinalSignature: {
                        in: 'body',
                        isString: {
                            errorMessage: ['isString', 'Candidate signature is invalid'],
                        },
                        exists: {
                            errorMessage: [
                                'required',
                                'Candidate signature must be provided',
                            ],
                        },
                    },
                },
            },
            {
                name: 'update-step',
                type: 'POST',
                _ref: this.updateStep.bind(this),
                validationSchema: {
                    candidate: {
                        in: 'body',
                        isString: {
                            errorMessage: ['isString', 'Candidate ID is invalid'],
                        },
                        exists: {
                            errorMessage: ['required', 'Candidate must be provided'],
                        },
                    },
                    currentStep: {
                        in: 'body',
                        isString: {
                            errorMessage: ['isString', 'Current step is invalid'],
                        },
                        exists: {
                            errorMessage: ['required', 'Current step must be provided'],
                        },
                    },
                },
            },
            {
                name: 'add-manager-signature',
                type: 'POST',
                _ref: this.addManagerSignature.bind(this),
                validationSchema: {
                    candidate: {
                        in: 'body',
                        isString: {
                            errorMessage: ['isString', 'Candidate ID is invalid'],
                        },
                        exists: {
                            errorMessage: ['required', 'Candidate ID must be provided'],
                        },
                    },
                    hrManagerSignature: {
                        in: 'body',
                        isString: {
                            errorMessage: ['isString', 'HR Manager signature is invalid'],
                        },
                        exists: {
                            errorMessage: [
                                'required',
                                'HR Manager signature must be provided',
                            ],
                        },
                    },
                },
            },
            {
                name: 'initiate-background-check',
                type: 'POST',
                _ref: this.initiateBackgroundCheck.bind(this),
                validationSchema: {
                    rookieID: {
                        in: 'body',
                        isString: {
                            errorMessage: ['isString', 'Rookie ID is invalid'],
                        },
                        exists: {
                            errorMessage: ['required', 'Rookie ID must be provided'],
                        },
                    },
                },
            },
            {
                name: 'get-candidate-manager',
                type: 'POST',
                _ref: this.getCandidateManager.bind(this),
                validationSchema: {
                    candidate: {
                        in: 'body',
                        isString: {
                            errorMessage: ['isString', 'Candidate ID is invalid'],
                        },
                        exists: {
                            errorMessage: ['required', 'Candidate ID must be provided'],
                        },
                    },
                },
            },
            {
                name: 'get-email-list',
                type: 'POST',
                _ref: this.getEmailList.bind(this),
            },
            {
                name: 'create-profile',
                type: 'POST',
                _ref: this.createProfile.bind(this),
            },
        ];
    }
    getByID(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId } = req.body;
            const { body } = req;
            const { candidate, rookieID } = body;
            // if (
            //   !(await this.checkRole(user, [
            //     'HR',
            //     'HR-MANAGER',
            //     'CANDIDATE',
            //     'HR-GLOBAL',
            //   ]))
            // ) {
            //   throw new AdvancedError({
            //     candidate: {
            //       kind: 'not.permission',
            //       message: 'User does not have permission',
            //     },
            //   })
            // }
            // let currentUser: any = user as IUser
            let aggregates = [];
            const match = { $match: {} };
            if (!candidate && !rookieID) {
                throw new AdvancedError_1.default({
                    candidate: {
                        kind: 'required',
                        message: 'Candidate ID or rookieID must be provided',
                    },
                });
            }
            if (candidate) {
                if (typeof candidate !== 'string') {
                    throw new AdvancedError_1.default({
                        candidate: { kind: 'isString', message: 'Candidate ID is invalid' },
                    });
                }
                match.$match._id = mongoose_1.Types.ObjectId(candidate);
            }
            if (rookieID) {
                if (typeof rookieID !== 'string') {
                    throw new AdvancedError_1.default({
                        candidate: { kind: 'isString', message: 'Rookie ID is invalid' },
                    });
                }
                match.$match.ticketID = rookieID;
            }
            const lookup = [
                {
                    $lookup: {
                        from: 'employeetypes',
                        localField: 'employeeType',
                        foreignField: '_id',
                        as: 'employeeType',
                    },
                },
                {
                    $unwind: {
                        path: '$employeeType',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: `${tenantId}_departments`,
                        localField: 'department',
                        foreignField: '_id',
                        as: 'department',
                    },
                },
                {
                    $unwind: {
                        path: '$department',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: `${tenantId}_titles`,
                        localField: 'title',
                        foreignField: '_id',
                        as: 'title',
                    },
                },
                {
                    $unwind: {
                        path: '$title',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: `${tenantId}_locations`,
                        localField: 'workLocation',
                        foreignField: '_id',
                        as: 'workLocation',
                    },
                },
                {
                    $unwind: {
                        path: '$workLocation',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: `${tenantId}_employees`,
                        localField: 'reportingManager',
                        foreignField: '_id',
                        as: 'reportingManager',
                    },
                },
                {
                    $unwind: {
                        path: '$reportingManager',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: `${tenantId}_companies`,
                        localField: 'company',
                        foreignField: '_id',
                        as: 'company',
                    },
                },
                {
                    $unwind: {
                        path: '$company',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: `${tenantId}_documents`,
                        localField: 'offerLetter',
                        foreignField: '_id',
                        as: 'offerLetter',
                    },
                },
                {
                    $unwind: {
                        path: '$offerLetter',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: `${tenantId}_generalinfos`,
                        localField: 'reportingManager.generalInfo',
                        foreignField: '_id',
                        as: 'reportingManager.generalInfo',
                    },
                },
                {
                    $unwind: {
                        path: '$reportingManager.generalInfo',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: `${tenantId}_employees`,
                        localField: 'generatedBy',
                        foreignField: '_id',
                        as: 'generatedBy',
                    },
                },
                {
                    $unwind: {
                        path: '$generatedBy',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: `${tenantId}_generalinfos`,
                        localField: 'generatedBy.generalInfo',
                        foreignField: '_id',
                        as: 'generatedBy.generalInfo',
                    },
                },
                {
                    $unwind: {
                        path: '$generatedBy.generalInfo',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: `${tenantId}_titles`,
                        localField: 'salaryStructure.title',
                        foreignField: '_id',
                        as: 'salaryStructure.title',
                    },
                },
                {
                    $unwind: {
                        path: '$salaryStructure.title',
                        preserveNullAndEmptyArrays: true,
                    },
                },
            ];
            const project = [
                {
                    $project: {
                        processStatus: 1,
                        employeeId: 1,
                        fullName: 1,
                        workEmail: 1,
                        privateEmail: 1,
                        previousExperience: 1,
                        position: 1,
                        employeeType: { _id: 1, name: 1 },
                        department: { _id: 1, name: 1 },
                        title: { _id: 1, name: 1 },
                        noticePeriod: 1,
                        dateOfJoining: 1,
                        workLocation: {
                            _id: 1,
                            name: 1,
                            headQuarterAddress: 1,
                            legalAddress: 1,
                        },
                        reportingManager: {
                            _id: 1,
                            generalInfo: {
                                _id: 1,
                                firstName: 1,
                                lastName: 1,
                                avatar: 1,
                            },
                        },
                        benefits: 1,
                        salaryStructure: {
                            title: {
                                _id: 1,
                                name: 1,
                            },
                            settings: 1,
                        },
                        ticketID: 1,
                        comments: 1,
                        hrSignature: 1,
                        hrManagerSignature: 1,
                        staticOfferLetter: 1,
                        finalOfferCandidateSignature: 1,
                        candidateSignature: 1,
                        currentStep: 1,
                        generatedBy: {
                            _id: 1,
                            generalInfo: {
                                _id: 1,
                                workEmail: 1,
                            },
                        },
                        offerLetter: {
                            attachment: 1,
                            _id: 1,
                        },
                        allowAccess: 1,
                        documentChecklistSetting: 1,
                        additionalQuestions: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        amountIn: 1,
                        timeOffPolicy: 1,
                        compensationType: 1,
                        includeOffer: 1,
                    },
                },
            ];
            aggregates.push(match);
            aggregates = [...aggregates, ...lookup, ...project];
            const candidates = yield CandidateTenant_1.default.getInstance(tenantId)
                .aggregate(aggregates)
                .exec();
            // if (!this.hasAccess(user, candidates[0].allowAccess)) {
            //   throw new AdvancedError({
            //     candidate: {
            //       kind: 'not.permission',
            //       message: 'User does not have permission',
            //     },
            //   })
            // }
            if (!candidates.length || !candidates[0]) {
                throw new AdvancedError_1.default({
                    candidate: { kind: 'not.found', message: 'Candidate not found' },
                });
            }
            let hrSignatureData = {};
            if (candidates[0].hrSignature) {
                hrSignatureData = yield this.getAttachment(candidates[0].hrSignature);
            }
            let hrManagerSignatureData = {};
            if (candidates[0].hrManagerSignature) {
                hrManagerSignatureData = yield this.getAttachment(candidates[0].hrManagerSignature);
            }
            let candidateSignatureData = {};
            if (candidates[0].candidateSignature) {
                candidateSignatureData = yield this.getAttachment(candidates[0].candidateSignature);
            }
            let candidateFinalSignatureData = {};
            if (candidates[0].finalOfferCandidateSignature) {
                candidateFinalSignatureData = yield this.getAttachment(candidates[0].finalOfferCandidateSignature);
            }
            let offerLetterAttachmentData = {};
            if (candidates[0].offerLetter) {
                if (candidates[0].offerLetter.attachment) {
                    offerLetterAttachmentData = yield this.getAttachment(candidates[0].offerLetter.attachment);
                }
            }
            let staticOfferLetterData = {};
            if (candidates[0].staticOfferLetter) {
                staticOfferLetterData = yield this.getAttachment(candidates[0].staticOfferLetter);
            }
            const benefitsData = yield BenefitTenant_1.default.getInstance(tenantId).find({
                _id: { $in: candidates[0].benefits },
            });
            const _a = candidates[0], { candidateSignature, finalOfferCandidateSignature, hrManagerSignature, hrSignature, benefits, offerLetter, staticOfferLetter } = _a, included = __rest(_a, ["candidateSignature", "finalOfferCandidateSignature", "hrManagerSignature", "hrSignature", "benefits", "offerLetter", "staticOfferLetter"]);
            if (!lodash_1.isEmpty(offerLetter)) {
                offerLetter.attachment = offerLetterAttachmentData;
            }
            const data = Object.assign({ candidateSignature: candidateSignatureData, finalOfferCandidateSignature: candidateFinalSignatureData, benefits: benefitsData, hrSignature: hrSignatureData, hrManagerSignature: hrManagerSignatureData, staticOfferLetter: staticOfferLetterData, offerLetter }, included);
            res.send(new ResponseResult_1.default({
                data: data,
                message: 'Get item successfully',
            }));
        });
    }
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId } = req.body;
            const { body } = req;
            const { processStatus } = body;
            let aggregates = [];
            const match = {
                $match: {
                    processStatus: {
                        $in: processStatus,
                    },
                },
            };
            if (processStatus.length) {
                aggregates.push(match);
            }
            const lookup = [
                {
                    $lookup: {
                        from: 'employeetypes',
                        localField: 'employeeType',
                        foreignField: '_id',
                        as: 'employeeType',
                    },
                },
                {
                    $unwind: {
                        path: '$employeeType',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: `${tenantId}_departments`,
                        localField: 'department',
                        foreignField: '_id',
                        as: 'department',
                    },
                },
                {
                    $unwind: {
                        path: '$department',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: `${tenantId}_titles`,
                        localField: 'title',
                        foreignField: '_id',
                        as: 'title',
                    },
                },
                {
                    $unwind: {
                        path: '$title',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: `${tenantId}_locations`,
                        localField: 'workLocation',
                        foreignField: '_id',
                        as: 'workLocation',
                    },
                },
                {
                    $unwind: {
                        path: '$workLocation',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: `${tenantId}_employees`,
                        localField: 'reportingManager',
                        foreignField: '_id',
                        as: 'reportingManager',
                    },
                },
                {
                    $unwind: {
                        path: '$reportingManager',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: `${tenantId}_companies`,
                        localField: 'company',
                        foreignField: '_id',
                        as: 'company',
                    },
                },
                {
                    $unwind: {
                        path: '$company',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: `${tenantId}_generalinfos`,
                        localField: 'reportingManager.generalInfo',
                        foreignField: '_id',
                        as: 'reportingManager.generalInfo',
                    },
                },
                {
                    $unwind: {
                        path: '$reportingManager.generalInfo',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: `${tenantId}_employees`,
                        localField: 'generatedBy',
                        foreignField: '_id',
                        as: 'generatedBy',
                    },
                },
                {
                    $unwind: {
                        path: '$generatedBy',
                        preserveNullAndEmptyArrays: true,
                    },
                },
            ];
            const project = [
                {
                    $project: {
                        processStatus: 1,
                        fullName: 1,
                        privateEmail: 1,
                        previousExperience: 1,
                        position: 1,
                        // employeeType: { _id: 1, name: 1 },
                        department: { _id: 1, name: 1 },
                        title: { _id: 1, name: 1 },
                        workLocation: {
                            _id: 1,
                            name: 1,
                            legalAddress: 1,
                            headQuarterAddress: 1,
                        },
                        'reportingManager.generalInfo': {
                            _id: 1,
                            firstName: 1,
                            lastName: 1,
                            avatar: 1,
                        },
                        ticketID: 1,
                        comments: 1,
                        generatedBy: { _id: 1 },
                        createdAt: 1,
                        updatedAt: 1,
                        total: 1,
                        _id: 1,
                    },
                },
            ];
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
            aggregates = [...aggregates, ...lookup, ...project];
            const candidates = yield CandidateTenant_1.default.getInstance(tenantId)
                .aggregate(aggregates)
                // .skip((page - 1) * limit + skip)
                // .limit(limit)
                .sort({ createdAt: -1 })
                .exec();
            if (!candidates) {
                throw new AdvancedError_1.default({
                    candidate: { kind: 'not.found', message: 'Candidate not found' },
                });
            }
            res.send(new ResponseResult_1.default({
                data: candidates,
                message: 'List items successfully',
            }));
        });
    }
    getStatusSummary(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId, company } = req.body;
            let aggregates = [];
            const match = {
                $match: {
                    company: mongoose_1.Types.ObjectId(company),
                },
            };
            aggregates.push(match);
            const group = {
                $group: {
                    _id: '$processStatus',
                    count: { $sum: 1 },
                },
            };
            aggregates.push(group);
            const status = yield CandidateTenant_1.default.getInstance(tenantId)
                .aggregate(aggregates)
                .exec();
            res.send(new ResponseResult_1.default({
                data: status,
                message: 'Get Status Summary Successfully',
            }));
        });
    }
    addNewMember(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId, company } = req.body;
            const { user } = req;
            let currentUser = yield UserMap_1.default.findById(user.id);
            let permission = yield ManagePermission_1.default.findOne({
                userMap: currentUser._id,
                tenant: tenantId,
                company: company,
            });
            // employee = await EmployeeTenant.getInstance(tenantId).findById(
            //   currentUser.employee,
            // )
            // if (!(await this.checkRole(user, ['HR']))) {
            //   throw new AdvancedError({
            //     candidate: {
            //       kind: 'not.permission',
            //       message: 'User does not have permission',
            //     },
            //   })
            // }
            const ticketID = '' + Math.floor(100000000 + Math.random() * 900000000);
            const candidate = yield CandidateTenant_1.default.getInstance(tenantId).findOne({
                ticketID,
            });
            if (candidate) {
                throw new AdvancedError_1.default({
                    candidate: { kind: 'exists', message: 'Ticket id exists' },
                });
            }
            const allowAccess = [currentUser.email];
            let additionalQuestions = [];
            const onboardingQuestions = yield OnboardingQuestionTenant_1.default.getInstance(tenantId).find({
                company: company,
            });
            if (onboardingQuestions.length) {
                additionalQuestions = [
                    ...lodash_1.map(lodash_1.filter(onboardingQuestions, ['isChosen', true]), ({ question, defaultAnswer, type, description }) => ({
                        question,
                        answer: '',
                        defaultAnswer,
                        type,
                        description,
                    })),
                ];
            }
            const newTicket = yield CandidateTenant_1.default.getInstance(tenantId).create({
                ticketID,
                generatedBy: permission.employee,
                company: company,
                allowAccess,
                additionalQuestions,
            });
            res.send(new ResponseResult_1.default({
                data: newTicket,
                message: 'Add item successfully',
            }));
        });
    }
    basicInfo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body: { tenantId }, } = req;
            const { candidate, privateEmail } = req.body;
            const candidateData = (yield CandidateTenant_1.default.getInstance(tenantId).findById(candidate));
            if (privateEmail) {
                const foundUserWithPrivateEmail = (yield UserTenant_1.default.getInstance(tenantId).findOne({
                    email: privateEmail,
                }));
                if (foundUserWithPrivateEmail) {
                    const foundTicket = (yield CandidateTenant_1.default.getInstance(tenantId).findById(foundUserWithPrivateEmail.candidate));
                    if (foundTicket) {
                        if (lodash_1.includes(this.currentProcess, foundTicket.processStatus) &&
                            foundTicket.status === 'ACTIVE') {
                            throw new AdvancedError_1.default({
                                candidate: {
                                    kind: 'invalid',
                                    message: 'A ticket with this private email is currently processing',
                                },
                            });
                        }
                    }
                    // candidateData.set(body)
                }
                // candidateData.set(body)
            }
            candidateData.set(req.body);
            yield candidateData.save();
            res.send(new ResponseResult_1.default({
                data: candidateData,
                message: 'Update item successfully',
            }));
        });
    }
    phaseOneHR(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId } = req.body;
            const { body } = req;
            const { candidate, action, joineeEmail, options, generatedLink, company, } = body;
            const tempBody = Object.assign({}, body);
            // currentUser = await UserTenant.getInstance(tenantId).findById(
            //   currentUser._id,
            // )
            // if (!(await this.checkRole(user, ['HR']))) {
            //   throw new AdvancedError({
            //     candidate: {
            //       kind: 'not.permission',
            //       message: 'User does not have permission',
            //     },
            //   })
            // }
            const candidateData = yield CandidateTenant_1.default.getInstance(tenantId).findById(candidate);
            if (!candidateData) {
                throw new AdvancedError_1.default({
                    candidate: { kind: 'not.found', message: 'Candidate not found' },
                });
            }
            if (action !== 'draft' && action !== 'submit') {
                throw new AdvancedError_1.default({
                    candidate: {
                        kind: 'invalid',
                        message: 'Invalid action',
                    },
                });
            }
            if (action === 'draft') {
                if (candidateData.processStatus !== 'DRAFT') {
                    throw new AdvancedError_1.default({
                        candidate: {
                            kind: 'not.permission',
                            message: 'User does not have permission',
                        },
                    });
                }
                candidateData.set(this.filterEmptyField(utils_1.filterParams(body, ['ticketID', '_id', 'candidateSignature'])));
                yield candidateData.save();
                res.send(new ResponseResult_1.default({
                    data: candidateData,
                    message: 'Update item successfully',
                }));
            }
            if (action === 'submit') {
                let errors = [];
                lodash_1.forEach(this.filterEmptyField(utils_1.filterParams(tempBody, [
                    'salaryStructure',
                    'documentChecklistSetting',
                    'ticketID',
                    'options',
                ])), (value, key) => {
                    if (!this.isString(value)) {
                        errors.push(key);
                    }
                });
                if (errors.length) {
                    throw new AdvancedError_1.default({
                        candidate: {
                            kind: 'invalid',
                            message: `Field ${lodash_1.map(errors, (err) => err)} ${errors.length > 1 ? 'are' : 'is'} invalid`,
                        },
                    });
                }
                const requiredFields = [
                    'fullName',
                    'position',
                    'employeeType',
                    'title',
                    'workLocation',
                    'department',
                    'reportingManager',
                    'salaryStructure',
                    'documentChecklistSetting',
                ];
                const updateData = utils_1.filterParams(this.filterEmptyField(body), [
                    'candidate',
                    'ticketID',
                    '_id',
                    'company',
                    'action',
                    'generatedBy',
                    'processStatus',
                    'workEmail',
                    'privateEmail',
                ]);
                const updateDataKey = lodash_1.map(updateData, (_v, k) => k);
                if (lodash_1.intersection(updateDataKey, requiredFields).length !==
                    requiredFields.length) {
                    throw new AdvancedError_1.default({
                        candidate: {
                            kind: 'invalid',
                            message: `Fields ${lodash_1.difference(requiredFields, updateDataKey).join(', ')} are missing`,
                        },
                    });
                }
                candidateData.set(updateData);
                candidateData.allowAccess.push(candidateData.privateEmail);
                yield candidateData.save();
                yield CandidateTenant_1.default.getInstance(tenantId).updateOne({ _id: candidateData }, {
                    $set: {
                        processStatus: 'SENT-PROVISIONAL-OFFER',
                        company: company,
                    },
                }, { $upsert: true });
                // START CREATE CANDIDATE DOCUMENT
                const documentArr = candidateData.documentChecklistSetting;
                const getDocumentArr = lodash_1.flatten(lodash_1.map(documentArr, (document) => {
                    let _a = Object.assign({}, document), { data = [] } = _a, included = __rest(_a, ["data"]);
                    return lodash_1.map(document.data, item => (Object.assign(Object.assign({}, included), item)));
                }));
                const filteredArray = lodash_1.filter(getDocumentArr, (per) => per.value);
                lodash_1.forEach(filteredArray, (per) => {
                    per.candidateKey = per.key;
                    per.candidateGroup = per.type;
                    per.displayName = per.alias;
                    per.shareDocument = [candidateData.privateEmail];
                });
                const standarizedData = lodash_1.map(filteredArray, (item) => (Object.assign(Object.assign({}, item), { company: candidateData.company, candidate: candidateData })));
                yield DocumentTenant_1.default.getInstance(tenantId).insertMany(standarizedData);
                const typeDDocument = lodash_1.filter(candidateData.documentChecklistSetting, (per) => per.employer);
                const saveWorkHistory = [];
                yield bluebird_1.default.map(typeDDocument, (per) => __awaiter(this, void 0, void 0, function* () {
                    let workHistory = yield DocumentTenant_1.default.getInstance(tenantId)
                        .find({
                        candidateGroup: 'D',
                        candidate: candidateData._id,
                        employer: per.employer,
                    })
                        .select('-id')
                        .exec();
                    if (workHistory) {
                        saveWorkHistory.push({
                            employer: per.employer,
                            // workDuration: per.workDuration,
                            company: candidateData.company,
                            candidate: candidateData,
                            document: workHistory,
                        });
                    }
                }));
                yield WorkHistoryTenant_1.default.getInstance(tenantId).insertMany(saveWorkHistory);
                // END CANDIDATE CREATE DOCUMENT
                let tempUser = {};
                const foundUser = yield UserMap_1.default.findOne({
                    email: candidateData.privateEmail,
                });
                console.log('candidateDat', candidateData);
                let randomPassword = this.genRandomPassword(10);
                if (!foundUser) {
                    const newUser = yield UserMap_1.default.create({
                        firstName: candidateData.fullName,
                        email: tempBody.privateEmail,
                        password: yield new Bcrypt_1.default(randomPassword).hash(),
                        status: 'ACTIVE',
                    });
                    // const existManagePermission = await ManagePermission.findOne({
                    //   candidate: candidateData._id,
                    // })
                    // if(!existManagePermission){
                    yield ManagePermission_1.default.create({
                        tenant: tenantId,
                        company: company,
                        candidate: candidateData._id,
                        signInRole: ['CANDIDATE'],
                        userMap: newUser,
                    });
                    // }
                    // newUser.candidate = candidateData._id
                    newUser.signInRole = ['CANDIDATE'];
                    yield newUser.save();
                    tempUser = newUser;
                    // Create password request
                    const code = Math.round(Math.random() * (999999 - 100000) + 100000);
                    yield PasswordRequestTenant_1.default.getInstance(tenantId).deleteMany({ code });
                    yield PasswordRequestTenant_1.default.getInstance(tenantId).create({
                        user: newUser.id,
                        email: newUser.email,
                        time: new Date().getTime() + constant_1.COMMON.expiredTimeForNewMember,
                        code,
                        isClient: true,
                    });
                }
                else {
                    foundUser.signInRole.push('CANDIDATE');
                    const existUser = yield ManagePermission_1.default.findOne({
                        userMap: foundUser._id,
                        company: company,
                        tenant: tenantId,
                        signInRole: { $in: ['CANDIDATE'] },
                    });
                    if (existUser) {
                        throw new AdvancedError_1.default({
                            managepermission: {
                                kind: 'exists',
                                message: 'Candidate existed',
                            },
                        });
                    }
                    foundUser.candidate = candidateData._id;
                    foundUser.password = yield new Bcrypt_1.default(randomPassword).hash();
                    yield foundUser.save();
                    tempUser = foundUser;
                }
                if (!lodash_1.inRange(options, 1, 3)) {
                    throw new AdvancedError_1.default({
                        candidate: { kind: 'invalid', message: 'Option is invalid' },
                    });
                }
                switch (options) {
                    case 1:
                        {
                            const content = `
        <h1>Your account to access</h1>
        <p>Email: ${tempUser.email}</p>
        <p>Password: ${randomPassword}</p>
        <b>Click the button below to navigate to the system</b>
        `;
                            const title = `<h3>CANDIDATE ONBOARDING STATUS</h3>`;
                            yield SendMail_1.sendNotificationCandidateOnboarding({
                                email: joineeEmail || tempUser.email,
                                fullName: candidateData.fullName,
                            }, [], candidateData.ticketID, candidateData.fullName, constant_1.HOST_URL, title, content);
                        }
                        break;
                    case 2:
                        {
                            const ccEmails = [];
                            const content = `
            <h1>Your account to access</h1>
            <p>Email: ${tempUser.email}</p>
            <p>Password: ${randomPassword}</p>
            <b>Click the button below to navigate to the system</b>
            `;
                            const title = `<h3>CANDIDATE ONBOARDING STATUS</h3>`;
                            yield SendMail_1.sendNotificationCandidateOnboarding({
                                email: joineeEmail || tempUser.email,
                                fullName: candidateData.fullName,
                            }, ccEmails, candidateData.ticketID, candidateData.fullName, generatedLink, title, content);
                        }
                        break;
                    default:
                        break;
                }
                // START SEND CUSTOM EMAIL
                const { processStatus, generatedBy, reportingManager, department, workLocation, employeeType, title, } = (yield CandidateTenant_1.default.getInstance(tenantId).findById(candidateData._id));
                yield CustomEmailTenantController_1.default.generateEmails(processStatus, [generatedBy._id, reportingManager._id], {
                    candidateId: candidateData._id,
                    departmentId: department._id,
                    titleId: title._id,
                    locationId: workLocation._id,
                    employeeTypeId: employeeType._id,
                }, req);
                // END SEND CUSTOM EMAIL
                res.send(new ResponseResult_1.default({
                    data: {},
                    message: 'Update item successfully',
                }));
            }
        });
    }
    getEmailList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId } = req.body;
            const { user } = req;
            let currentUser = user;
            let candidate = currentUser.candidate;
            candidate = yield CandidateTenant_1.default.getInstance(tenantId).findById(currentUser.candidate);
            if (!candidate) {
                throw new AdvancedError_1.default({
                    candidate: { kind: 'not.found', message: 'Candidate not found' },
                });
            }
            let generatedBy = (yield EmployeeTenant_1.default.getInstance(tenantId).findById(candidate.generatedBy._id));
            if (!candidate) {
                throw new AdvancedError_1.default({
                    candidate: { kind: 'not.found', message: 'Candidate not found' },
                });
            }
            const matches = {
                $match: {
                    'employee.location': generatedBy.location._id,
                    roles: true,
                },
            };
            const lookups = [
                {
                    $lookup: {
                        from: 'employees',
                        localField: 'employee',
                        foreignField: '_id',
                        as: 'employee',
                    },
                },
                {
                    $unwind: { path: '$employee', preserveNullAndEmptyArrays: false },
                },
                {
                    $unwind: { path: '$roles' },
                },
            ];
            const group = {
                $group: {
                    _id: '$_id',
                    email: { $first: '$email' },
                    employee: { $first: '$employee' },
                    roles: { $first: '$roles' },
                },
            };
            const projects = {
                $project: {
                    _id: 1,
                    email: 1,
                    roles: { $in: ['$roles', ['HR', 'HR-MANAGER']] },
                    employee: {
                        _id: 1,
                        location: 1,
                    },
                },
            };
            const aggregates = [...lookups, projects, group, matches];
            const users = yield UserTenant_1.default.getInstance(tenantId)
                .aggregate(aggregates)
                .exec();
            const emails = lodash_1.map(users, (per) => ({
                email: per.email,
                employee: per.employee._id,
            }));
            emails.push({
                email: candidate.privateEmail,
                employee: null,
            });
            res.send(new ResponseResult_1.default({
                data: emails,
                message: 'List items successfully',
            }));
        });
    }
    deleteDraft(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId } = req.body;
            const { body } = req;
            const { candidate, rookieID } = body;
            // if (!(await this.checkRole(user, ['HR']))) {
            //   throw new AdvancedError({
            //     candidate: {
            //       kind: 'not.permission',
            //       message: 'User does not have permission',
            //     },
            //   })
            // }
            let candidateData;
            if (!candidate && !rookieID) {
                throw new AdvancedError_1.default({
                    candidate: {
                        kind: 'required',
                        message: 'Candidate ID or rookieID must be provided',
                    },
                });
            }
            if (rookieID) {
                candidateData = yield CandidateTenant_1.default.getInstance(tenantId).findOne({
                    ticketID: rookieID,
                });
            }
            if (candidate) {
                candidateData = yield CandidateTenant_1.default.getInstance(tenantId).findOne({
                    _id: candidate,
                });
            }
            if (!candidateData) {
                throw new AdvancedError_1.default({
                    candidate: { kind: 'not.found', message: 'Candidate not found' },
                });
            }
            if (candidateData.processStatus !== 'DRAFT') {
                throw new AdvancedError_1.default({
                    candidate: {
                        kind: 'not.allowed',
                        message: 'Only draft can be deleted',
                    },
                });
            }
            yield CandidateTenant_1.default.getInstance(tenantId).deleteOne({
                _id: candidateData._id,
            });
            res.send(new ResponseResult_1.default({
                data: {},
                message: 'Delete item successfully',
            }));
        });
    }
    phaseOneCandidate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId, candidate: candidateId } = req.body;
            const { body } = req;
            const { noticePeriod, dateOfJoining, workHistories, hrEmail } = body;
            let { options } = body;
            let candidate = yield CandidateTenant_1.default.getInstance(tenantId)
                .findById(candidateId)
                .populate({ path: 'generatedBy', options: { autopopulate: false } })
                .populate({ path: 'reportingManager', options: { autopopulate: false } });
            if (!candidate) {
                throw new AdvancedError_1.default({
                    candidate: {
                        kind: 'not.permission',
                        message: 'User does not have permission',
                    },
                });
            }
            // let title: string = ''
            // let content: string = ''
            if (!lodash_1.inRange(options, 1, 5)) {
                throw new AdvancedError_1.default({
                    candidate: { kind: 'invalid', message: 'Options are invalid' },
                });
            }
            const emails = yield this.getEmail(
            // [candidate.generatedBy._id, candidate.reportingManager._id],
            [candidate.generatedBy, candidate.reportingManager], req);
            if (hrEmail) {
                emails.push({
                    email: hrEmail,
                    fullName: '',
                    employee: '',
                    candidate: null,
                });
            }
            const existedDocuments = (yield DocumentTenant_1.default.getInstance(tenantId).find({
                candidate: candidate._id,
            }));
            if (existedDocuments.length &&
                candidate.processStatus === 'ACCEPT-PROVISIONAL-OFFER') {
                options = 4;
            }
            switch (options) {
                case 1:
                    let tempBody = Object.assign({}, body);
                    const requiredFields = [
                        'noticePeriod',
                        'dateOfJoining',
                        'workHistories',
                        'options',
                    ];
                    if (lodash_1.intersection(lodash_1.map(tempBody, (_val, key) => key), requiredFields).length !== requiredFields.length) {
                        throw new AdvancedError_1.default({
                            candidate: {
                                kind: 'required',
                                message: `Fields ${lodash_1.difference(requiredFields, lodash_1.map(tempBody, (_val, key) => key)).join(', ')} are missing`,
                            },
                        });
                    }
                    const updateWorkHistory = lodash_1.map(workHistories, (per) => ({
                        updateOne: {
                            filter: { _id: per.id },
                            update: { $set: { workDuration: per.workDuration } },
                            upsert: true,
                        },
                    }));
                    yield WorkHistoryTenant_1.default.getInstance(tenantId).bulkWrite(updateWorkHistory);
                    yield CandidateTenant_1.default.getInstance(tenantId).updateOne({ _id: candidate._id }, {
                        $set: {
                            noticePeriod,
                            dateOfJoining,
                            // processStatus: 'PENDING-BACKGROUND-CHECK',
                            processStatus: 'ACCEPT-PROVISIONAL-OFFER',
                        },
                    }, { upsert: true });
                    // title = `<h3>Candidate onboarding status</h3>`
                    // content = `<b><h4>Candidate has submit their document</h4></b>`
                    break;
                case 2:
                    yield CandidateTenant_1.default.getInstance(tenantId).updateOne({ _id: candidate._id }, { $set: { processStatus: 'RENEGOTIATE-PROVISONAL-OFFER' } });
                    // title = `<h3>Candidate onboarding status</h3>`
                    // content = `<b><h4>Candidate has request to re-negotiate the salary structure</h4></b>`
                    break;
                case 3:
                    yield CandidateTenant_1.default.getInstance(tenantId).updateOne({ _id: candidate._id }, { $set: { processStatus: 'DISCARDED-PROVISONAL-OFFER' } });
                    // title = `<h3>Candidate onboarding status</h3>`
                    // content = '<b><h4>Candidate has reject provisional offer</h4></b>'
                    break;
                case 4:
                    yield CandidateTenant_1.default.getInstance(tenantId).updateOne({ _id: candidate._id }, { $set: { processStatus: 'PENDING-BACKGROUND-CHECK' } });
                // title = `<h3>Candidate onboarding status</h3>`
                // content = '<b><h4>Candidate has resubmit required documents</h4></b>'
                default:
                    break;
            }
            // const generatedBy: any = find(emails, [
            //   'employee',
            //   candidate.generatedBy._id,
            // ])
            // START SEND CUSTOM EMAIL
            const { processStatus, generatedBy, reportingManager, department, workLocation, employeeType, title: jobTitle, } = (yield CandidateTenant_1.default.getInstance(tenantId).findById(candidate._id));
            yield CustomEmailTenantController_1.default.generateEmails(processStatus, [generatedBy._id, reportingManager._id], {
                candidateId: candidate._id,
                departmentId: department._id,
                titleId: jobTitle._id,
                locationId: workLocation._id,
                employeeTypeId: employeeType._id,
            }, req);
            // END SEND CUSTOM EMAIL
            // const ccMails = [...emails]
            // ccMails.shift()
            // await sendNotificationCandidateOnboarding(
            //   generatedBy,
            //   [],
            //   candidate.ticketID,
            //   generatedBy.fullName,
            //   HOST_URL,
            //   title,
            //   content,
            // )
            res.send(new ResponseResult_1.default({
                data: {},
                message: 'Update items successfully',
            }));
        });
    }
    submitRequiredDocument(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId } = req.body;
            const { body: { hrEmail }, user, } = req;
            let currentUser = user;
            currentUser = yield UserTenant_1.default.getInstance(tenantId).findById(currentUser._id);
            let candidateData = (yield CandidateTenant_1.default.getInstance(tenantId).findById(currentUser.candidate));
            // if (!(await this.checkRole(user, ['CANDIDATE']))) {
            //   throw new AdvancedError({
            //     candidate: {
            //       kind: 'not.permission',
            //       message: 'User does not have permission',
            //     },
            //   })
            // }
            yield CandidateTenant_1.default.getInstance(tenantId).updateOne({ _id: candidateData._id }, { $set: { processStatus: 'RECEIVED-SUBMITTED-DOCUMENTS' } });
            const title = `<h3>CANDIDATE ONBOARDING STATUS</h3>`;
            const content = '<b>Candidate has submitted the required documents</b>';
            const emails = yield this.getEmail([candidateData.generatedBy, candidateData.reportingManager], req);
            if (hrEmail) {
                emails.append({ email: hrEmail, fullName: '' });
            }
            let ccEmails = [...emails];
            ccEmails.shift();
            yield SendMail_1.sendNotificationCandidateOnboarding(emails[0], ccEmails, `${candidateData.ticketID}`, emails[0].fullName, constant_1.HOST_URL, title, content);
            // START SEND CUSTOM EMAIL
            const { processStatus, generatedBy, reportingManager, department, workLocation, employeeType, title: jobTitle, } = (yield CandidateTenant_1.default.getInstance(tenantId).findById(candidateData._id));
            yield CustomEmailTenantController_1.default.generateEmails(processStatus, [generatedBy._id, reportingManager._id], {
                candidateId: `${candidateData._id}`,
                departmentId: department._id,
                titleId: jobTitle._id,
                locationId: workLocation._id,
                employeeTypeId: employeeType._id,
            }, req);
            // END SEND CUSTOM EMAIL
            res.send(new ResponseResult_1.default({
                data: {},
                message: 'Update item successfully',
            }));
        });
    }
    addAttachmentByCandidate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId, candidate } = req.body;
            const { body } = req;
            const { document, attachment } = body;
            let opts = {
                $set: {
                    attachment,
                },
            };
            const hadAttachmentDocument = (yield DocumentTenant_1.default.getInstance(tenantId).findById(document));
            if (hadAttachmentDocument.attachment) {
                opts.$set.candidateDocumentStatus = 'PENDING';
            }
            yield DocumentTenant_1.default.getInstance(tenantId).findOneAndUpdate({ _id: document, candidate: candidate }, opts, { upsert: true });
            res.send(new ResponseResult_1.default({
                data: yield DocumentTenant_1.default.getInstance(tenantId).findById(document),
                message: 'Update item successfully',
            }));
        });
    }
    closeCandidate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId } = req.body;
            const { body } = req;
            const { candidate } = body;
            // if (!(await this.checkRole(user, ['HR']))) {
            //   throw new AdvancedError({
            //     candidate: {
            //       kind: 'not.permission',
            //       message: 'User does not have permission',
            //     },
            //   })
            // }
            const candidateData = (yield CandidateTenant_1.default.getInstance(tenantId).findById(candidate));
            if (!candidateData) {
                throw new AdvancedError_1.default({
                    candidate: { kind: 'not.found', message: 'Candidate not found' },
                });
            }
            const process = candidateData.processStatus;
            let updateStatus = '';
            switch (process) {
                case 'RENEGOTIATE-PROVISONAL-OFFER':
                    updateStatus = 'DISCARDED-PROVISONAL-OFFER';
                    break;
                case 'ACCEPT-PROVISIONAL-OFFER':
                    updateStatus = 'REJECT-FINAL-OFFER-HR';
                    break;
                case 'SENT-FINAL-OFFER':
                    updateStatus = 'REJECT-FINAL-OFFER-CANDIDATE';
                    break;
                default:
                    updateStatus = process;
                    break;
            }
            yield CandidateTenant_1.default.getInstance(tenantId).updateOne({ _id: candidateData }, { $set: { processStatus: updateStatus } });
            const ccEmails = yield this.getEmail([candidateData.generatedBy._id, candidateData.reportingManager._id], req);
            const title = `<h3>CANDIDATE ONBOARDING STATUS</h3>`;
            const content = `<b>Candidate ticket has been closed for having been provided insufficient or ineligible information</b>`;
            yield SendMail_1.sendNotificationCandidateOnboarding({ email: candidateData.privateEmail, fullName: candidateData.fullName }, ccEmails, candidateData.ticketID, candidateData.fullName, constant_1.HOST_URL, title, content);
            // START SEND CUSTOM EMAIL
            const { processStatus, generatedBy, reportingManager, department, workLocation, employeeType, title: jobTitle, } = (yield CandidateTenant_1.default.getInstance(tenantId).findById(candidateData._id));
            yield CustomEmailTenantController_1.default.generateEmails(processStatus, [generatedBy._id, reportingManager._id], {
                candidateId: `${candidateData._id}`,
                departmentId: department._id,
                titleId: jobTitle._id,
                locationId: workLocation._id,
                employeeTypeId: employeeType._id,
            }, req);
            // END SEND CUSTOM EMAIL
            res.send(new ResponseResult_1.default({
                data: {},
                message: 'Update item successfully',
            }));
        });
    }
    editSalaryStructure(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId } = req.body;
            const { body } = req;
            const { candidate, settings } = body;
            // if (!(await this.checkRole(user, ['HR']))) {
            //   throw new AdvancedError({
            //     candidate: {
            //       kind: 'not.permission',
            //       message: 'User does not have permission',
            //     },
            //   })
            // }
            const candidateData = (yield CandidateTenant_1.default.getInstance(tenantId).findById(candidate));
            if (!candidateData) {
                throw new AdvancedError_1.default({
                    candidate: { kind: 'not.found', message: 'Candidate not found' },
                });
            }
            if (lodash_1.isEmpty(settings)) {
                throw new AdvancedError_1.default({
                    candidate: { kind: 'invalid', message: 'Salary structure is invalid' },
                });
            }
            yield CandidateTenant_1.default.getInstance(tenantId).updateOne({ _id: candidateData }, {
                $set: {
                    'salaryStructure.settings': settings,
                    processStatus: 'SENT-PROVISIONAL-OFFER',
                },
            }, { $upsert: true });
            res.send(new ResponseResult_1.default({
                data: {},
                message: 'Update item successfully',
            }));
        });
    }
    updateByCandidate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId, candidate } = req.body;
            const { body } = req;
            let candidateData = yield CandidateTenant_1.default.getInstance(tenantId).findById(candidate);
            // if (!(await this.checkRole(user, ['CANDIDATE']))) {
            //   throw new AdvancedError({
            //     candidate: {
            //       kind: 'not.permission',
            //       message: 'User does not have permission',
            //     },
            //   })
            // }
            const possibleFields = [
                'fullName',
                'noticePeriod',
                'dateOfJoining',
                'finalOfferCandidateSignature',
                'candidateSignature',
                'additionalQuestions',
            ];
            lodash_1.forEach(body, (_val, key) => {
                !lodash_1.includes(possibleFields, key) && delete body[key];
            });
            candidateData.set(body);
            yield candidateData.save();
            res.send(new ResponseResult_1.default({
                data: {},
                message: 'Update item successfully',
            }));
        });
    }
    documentCheck(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId } = req.body;
            const { body } = req;
            const { candidate, document, candidateDocumentStatus } = body;
            // if (!(await this.checkRole(user, ['HR']))) {
            //   throw new AdvancedError({
            //     candidate: {
            //       kind: 'not.permission',
            //       message: 'User does not have permission',
            //     },
            //   })
            // }
            if (!lodash_1.inRange(candidateDocumentStatus, 0, 4)) {
                throw new AdvancedError_1.default({
                    candidate: {
                        kind: 'invalid',
                        message: 'Invalid options',
                    },
                });
            }
            let status = '';
            switch (candidateDocumentStatus) {
                case 0:
                    status = 'PENDING';
                    break;
                case 1:
                    status = 'VERIFIED';
                    break;
                case 2:
                    status = 'RE-SUBMIT';
                    break;
                case 3:
                    status = 'INELIGIBLE';
                    break;
                default:
                    break;
            }
            const updated = yield DocumentTenant_1.default.getInstance(tenantId).findOneAndUpdate({ _id: document, candidate }, { $set: { candidateDocumentStatus: status } }, { upsert: true, new: true });
            if (!updated) {
                throw new AdvancedError_1.default({
                    document: { kind: 'not.found', message: 'Document not found' },
                });
            }
            res.send(new ResponseResult_1.default({
                data: updated,
                message: 'Update item successfully',
            }));
        });
    }
    backgroundCheck(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId } = req.body;
            const { body } = req;
            const { candidate, options, comments } = body;
            // if (!(await this.checkRole(user, ['HR']))) {
            //   throw new AdvancedError({
            //     candidate: {
            //       kind: 'not.permission',
            //       message: 'User does not have permission',
            //     },
            //   })
            // }
            if (!lodash_1.inRange(options, 1, 4)) {
                throw new AdvancedError_1.default({
                    candidate: { kind: 'invalid', message: 'Invalid options' },
                });
            }
            const candidateData = (yield CandidateTenant_1.default.getInstance(tenantId).findById(candidate));
            if (!candidateData) {
                throw new AdvancedError_1.default({
                    candidate: { kind: 'not.found', message: 'Candidate not found' },
                });
            }
            const ineligibleDocuments = (yield DocumentTenant_1.default.getInstance(tenantId).find({
                candidate: candidateData._id,
                candidateDocumentStatus: 'RE-SUBMIT',
            }));
            const li = lodash_1.map(ineligibleDocuments, (per) => `<li style="color: red;">${per.displayName}</li>`);
            let processStatus = '';
            let content = '';
            let title = '';
            switch (options) {
                case 1:
                    processStatus = 'ELIGIBLE-CANDIDATE';
                    title = `<h3>CANDIDATE ONBOARDING STATUS</h3>`;
                    content = `<b>Candidate is eligible for final offer</b>`;
                    break;
                case 2:
                    processStatus = 'ACCEPT-PROVISIONAL-OFFER';
                    title = `<h3>CANDIDATE ONBOARDING STATUS</h3>`;
                    content = `<b>Ineligible document</b>
        <br />
        <b>List of required re-submitted documents: </b>
        <ol>
        ${li}
        </ol> 
        `;
                    break;
                case 3:
                    processStatus = 'INELIGIBLE-CANDIDATE';
                    title = `<h3>CANDIDATE ONBOARDING STATUS</h3>`;
                    content = `<b>Candidate's ticket has been marked as ineligible</b>`;
                    break;
                default:
                    break;
            }
            yield CandidateTenant_1.default.getInstance(tenantId).updateOne({ _id: candidateData }, { $set: { processStatus, comments } }, { $upsert: true });
            yield SendMail_1.sendNotificationCandidateOnboarding({
                email: `${candidateData.privateEmail}`,
                fullName: `${candidateData.fullName}`,
            }, [], `${candidateData.ticketID}`, `${candidateData.fullName}`, constant_1.HOST_URL, title, content);
            // START SEND CUSTOM EMAIL
            const { processStatus: customEmailStatus, generatedBy, reportingManager, department, workLocation, employeeType, title: jobTitle, } = (yield CandidateTenant_1.default.getInstance(tenantId).findById(candidateData._id));
            yield CustomEmailTenantController_1.default.generateEmails(customEmailStatus, [generatedBy._id, reportingManager._id], {
                candidateId: `${candidateData._id}`,
                departmentId: department._id,
                titleId: jobTitle._id,
                locationId: workLocation._id,
                employeeTypeId: employeeType._id,
            }, req);
            // END SEND CUSTOM EMAIL
            res.send(new ResponseResult_1.default({
                data: {},
                message: 'Update item successfully',
            }));
        });
    }
    sendApproval(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId } = req.body;
            const { user, body } = req;
            const { candidate, hrSignature, options } = body;
            let currentUser = user;
            let currentEmployee = (yield EmployeeTenant_1.default.getInstance(tenantId).findById(currentUser.employee));
            // if (!(await this.checkRole(user, ['HR']))) {
            //   throw new AdvancedError({
            //     candidate: {
            //       kind: 'not.permission',
            //       message: 'User does not have permission',
            //     },
            //   })
            // }
            if (!lodash_1.inRange(options, 0, 2)) {
                throw new AdvancedError_1.default({
                    candidate: { kind: 'invalid', message: 'Options is invalid' },
                });
            }
            if (options === 0) {
                const candidateData = (yield CandidateTenant_1.default.getInstance(tenantId).findByIdAndUpdate(candidate, {
                    $set: { hrSignature, processStatus: 'PENDING-APPROVAL-FINAL-OFFER' },
                }, { upsert: true, new: true }));
                if (!candidateData) {
                    throw new AdvancedError_1.default({
                        candidate: { kind: 'not.found', message: 'Candidate not found' },
                    });
                }
                const title = `<h3>CANDIDATE ONBOARDING STATUS</h3>`;
                const contentCandidate = `<b>Your ticket has been sent for approval by the HR Manager</b>`;
                const contentManager = `<b>Candidate ticket is awaiting for final offer approval by the HR Manager</b>`;
                const hrManager = yield this.getHRManagerByLocation(candidateData.workLocation._id, req);
                yield SendMail_1.sendNotificationCandidateOnboarding({ email: candidateData.privateEmail, fullName: candidateData.fullName }, [], candidateData.ticketID, candidateData.fullName, constant_1.HOST_URL, title, contentCandidate);
                const ccMails = [...hrManager];
                ccMails.shift();
                if (hrManager.length) {
                    yield SendMail_1.sendNotificationCandidateOnboarding({ email: hrManager.email, fullName: hrManager.fullName }, ccMails, candidateData.ticketID, hrManager[0].fullName, constant_1.HOST_URL, title, contentManager);
                }
                // START SEND CUSTOM EMAIL
                const { processStatus: customEmailStatus, generatedBy, reportingManager, department, workLocation, employeeType, title: jobTitle, } = (yield CandidateTenant_1.default.getInstance(tenantId).findById(candidateData._id));
                yield CustomEmailTenantController_1.default.generateEmails(customEmailStatus, [generatedBy._id, reportingManager._id], {
                    candidateId: `${candidateData._id}`,
                    departmentId: department._id,
                    titleId: jobTitle._id,
                    locationId: workLocation._id,
                    employeeTypeId: employeeType._id,
                }, req);
                // END SEND CUSTOM EMAIL
            }
            if (options === 1) {
                // const requiredFields = [
                //   'fullName',
                //   'position',
                //   'employeeType',
                //   'workLocation',
                //   'department',
                //   'title',
                //   'reportingManager',
                //   'salaryStructure',
                //   'documentChecklistSetting',
                //   'compensationType',
                //   'amountIn',
                //   'timeOffPolicy',
                //   'benefits',
                // ]
                // const tempBody = { ...body }
                // const updateData = filterParams(this.filterEmptyField(tempBody), [
                //   'ticketID',
                //   '_id',
                //   'company',
                //   'generatedBy',
                //   'processStatus',
                //   'workEmail',
                //   'privateEmail',
                //   'options',
                // ])
                const candidateData = (yield CandidateTenant_1.default.getInstance(tenantId).findById(candidate));
                // if (intersection(keys, requiredFields).length !== requiredFields.length) {
                //   throw new AdvancedError({
                //     candidate: {
                //       kind: 'invalid',
                //       message: `Fields ${difference(requiredFields, keys).join(
                //         ', ',
                //       )} are missing`,
                //     },
                //   })
                // }
                // candidateData.set(updateData)
                candidateData.allowAccess.push(candidateData.privateEmail);
                yield candidateData.save();
                yield CandidateTenant_1.default.getInstance(tenantId).updateOne({ _id: candidateData }, {
                    $set: {
                        processStatus: 'SENT-PROVISIONAL-OFFER',
                        company: currentEmployee.company._id,
                    },
                }, { $upsert: true });
                // START CREATE CANDIDATE DOCUMENTS
                const documentArr = candidateData.documentChecklistSetting;
                const getDocumentArr = lodash_1.flatten(lodash_1.map(documentArr, (document) => {
                    let _a = Object.assign({}, document), { data = [] } = _a, included = __rest(_a, ["data"]);
                    return lodash_1.map(document.data, item => (Object.assign(Object.assign({}, included), item)));
                }));
                const filteredArray = lodash_1.filter(getDocumentArr, (per) => per.value);
                lodash_1.forEach(filteredArray, (per) => {
                    per.candidateKey = per.key;
                    per.candidateGroup = per.type;
                    per.displayName = per.alias;
                });
                const standarizedData = lodash_1.map(filteredArray, (item) => (Object.assign(Object.assign({}, item), { company: candidateData.company, candidate: candidateData })));
                yield DocumentTenant_1.default.getInstance(tenantId).insertMany(standarizedData);
                const typeDDocument = lodash_1.filter(candidateData.documentChecklistSetting, (per) => per.employer);
                const saveWorkHistory = [];
                yield bluebird_1.default.map(typeDDocument, (per) => __awaiter(this, void 0, void 0, function* () {
                    let workHistory = yield DocumentTenant_1.default.getInstance(tenantId)
                        .find({
                        candidateGroup: 'D',
                        candidate: candidateData._id,
                        employer: per.employer,
                    })
                        .select('-id')
                        .exec();
                    if (workHistory) {
                        saveWorkHistory.push({
                            employer: per.employer,
                            // workDuration: per.workDuration,
                            company: candidateData.company,
                            candidate: candidateData,
                            document: workHistory,
                        });
                    }
                }));
                yield WorkHistoryTenant_1.default.getInstance(tenantId).insertMany(saveWorkHistory);
                // END CANDIDATE CREATE DOCUMENT
                let tempUser = {};
                const foundUser = (yield UserTenant_1.default.getInstance(tenantId).findOne({
                    email: candidateData.privateEmail,
                }));
                let randomPassword = this.genRandomPassword(10);
                if (!foundUser) {
                    const newUser = yield UserTenant_1.default.getInstance(tenantId).create({
                        email: candidateData.privateEmail,
                        password: yield new Bcrypt_1.default(randomPassword).hash(),
                    });
                    newUser.candidate = candidateData._id;
                    newUser.roles = ['CANDIDATE'];
                    yield newUser.save();
                    tempUser = newUser;
                    // Create password request
                    const code = Math.round(Math.random() * (999999 - 100000) + 100000);
                    yield PasswordRequestTenant_1.default.getInstance(tenantId).deleteMany({ code });
                    yield PasswordRequestTenant_1.default.getInstance(tenantId).create({
                        user: newUser.id,
                        email: newUser.email,
                        time: new Date().getTime() + constant_1.COMMON.expiredTimeForNewMember,
                        code,
                        isClient: true,
                    });
                }
                else {
                    foundUser.candidate = candidateData._id;
                    foundUser.password = yield new Bcrypt_1.default(randomPassword).hash();
                    yield foundUser.save();
                    tempUser = foundUser;
                }
                const content = `
      <h1>Your account to access</h1>
      <p>Email: ${tempUser.email}</p>
      <p>Password: ${randomPassword}</p>
      <b>Click the button below to navigate to the system</b>
      `;
                const title = `<h3>Candidate no.${candidateData.ticketID} Provisional offer</h3>`;
                yield SendMail_1.sendNotificationCandidateOnboarding({
                    email: tempUser.email,
                    fullName: candidateData.fullName,
                }, [], candidateData.ticketID, candidateData.fullName, constant_1.HOST_URL, title, content);
                /**
                 * Send custom email
                 */
                // const { processStatus }: any = (await Candidate.findById(
                //   candidateData._id,
                // )) as ICandidate
                // await CustomEmailController.generateEmails(processStatus, {
                //   candidateId: '' + candidateData._id,
                //   departmentId: '' + candidateData.department._id,
                //   titleId: '' + candidateData.title._id,
                //   locationId: '' + candidateData.workLocation._id,
                //   employeeTypeId: '' + candidateData.employeeType._id,
                // })
            }
            res.send(new ResponseResult_1.default({
                data: {},
                message: 'Update items successfully',
            }));
        });
    }
    updateByHR(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId } = req.body;
            const { body } = req;
            const { candidate, currentStep } = body;
            // if (!(await this.checkRole(user, ['HR', 'HR-MANAGER']))) {
            //   throw new AdvancedError({
            //     candidate: {
            //       kind: 'not.permission',
            //       message: 'User does not have permission',
            //     },
            //   })
            // }
            const candidateData = yield CandidateTenant_1.default.getInstance(tenantId).findById(candidate);
            if (!candidateData) {
                throw new AdvancedError_1.default({
                    candidate: { kind: 'not.found', message: 'Candidate not found' },
                });
            }
            if (candidateData.processStatus !== 'DRAFT') {
                utils_1.filterParams(body, ['privateEmail', 'workEmail']);
            }
            if (currentStep) {
                if (!lodash_1.inRange(currentStep, 0, 8)) {
                    throw new AdvancedError_1.default({
                        candidate: { kind: 'invalid', message: 'Current step is invalid' },
                    });
                }
            }
            candidateData.set(utils_1.filterParams(this.filterEmptyField(body), [
                '_id',
                'ticketID',
                'processStatus',
                'company',
                'generatedBy',
                'createdAt',
                'updatedAt',
            ]));
            yield candidateData.save();
            const data = yield CandidateTenant_1.default.getInstance(tenantId).findByIdAndUpdate(candidateData._id, {
                $set: { currentStep },
            }, { upsert: true, new: true });
            res.send(new ResponseResult_1.default({
                data: data,
                message: 'Update item successfully',
            }));
        });
    }
    approveFinalOffer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId } = req.body;
            const { user, body } = req;
            const { hrManagerSignature, candidate, options } = body;
            // if (!(await this.checkRole(user, ['HR-MANAGER']))) {
            //   throw new AdvancedError({
            //     candidate: {
            //       kind: 'not.permission',
            //       message: 'User does not have permission',
            //     },
            //   })
            // }
            let currentUser = user;
            if (!currentUser) {
                throw new AdvancedError_1.default({
                    user: { kind: 'not.found', message: 'User not found' },
                });
            }
            const candidateData = (yield CandidateTenant_1.default.getInstance(tenantId).findById(candidate));
            if (!candidateData) {
                throw new AdvancedError_1.default({
                    candidate: { kind: 'not.found', message: 'Candidate not found' },
                });
            }
            if (!lodash_1.inRange(options, 1, 3)) {
                throw new AdvancedError_1.default({
                    candidate: { kind: 'invalid', message: 'Invalid options' },
                });
            }
            let status = '';
            let title = `<b>CANDIDATE ONBOARDING STATUS</b>`;
            let contentCandidate = '';
            // let contentGeneratedBy: string = ''
            const { company, title: jobTitle } = candidateData;
            switch (options) {
                case 1:
                    status = 'APPROVED-FINAL-OFFER';
                    contentCandidate = `
        <b>
        <h3>
        Congratulations, We are happy to inform you that ${company.name} has accepted your offer for the position of ${jobTitle.name}. We consider you the best candidate for the position after interviewing a large selection of excellent candidates. 
        </h3> 
        </b>
        <b>Please use your account which has been formerly provided to you, to proceed the final offer</b>
        `;
                    // contentGeneratedBy = `
                    // <h3>
                    // <b>Candidate onboarding ticket has been approved by the HR manager</b>
                    // </h3>
                    // `
                    break;
                case 2:
                    status = 'REJECT-FINAL-OFFER-HR';
                    contentCandidate = `<b>Candidate no.${candidateData.ticketID} Your offer has been discarded by the HR Manager</b>`;
                    // contentGeneratedBy = `<b>Candidate no.${candidateData.ticketID}'s offer letter has been discarded by the HR Manager</b>`
                    break;
                default:
                    break;
            }
            yield CandidateTenant_1.default.getInstance(tenantId).updateOne({ _id: candidateData._id }, { $set: { hrManagerSignature, processStatus: status } }, { $upsert: true });
            // const emails: any = await this.getEmail([
            //   candidateData.reportingManager._id,
            //   candidateData.generatedBy._id,
            // ])
            // const generatedBy = find(emails, [
            //   'employee',
            //   candidateData.generatedBy._id,
            // ])
            // Send email for candidate
            yield SendMail_1.sendNotificationCandidateOnboarding({ email: candidateData.privateEmail, fullName: candidateData.fullName }, [], candidateData.ticketID, candidateData.fullName, constant_1.HOST_URL, title, contentCandidate);
            // Send email for ticket owner
            // await sendNotificationCandidateOnboarding(
            //   { email: generatedBy.email, fullName: generatedBy.fullName },
            //   [],
            //   candidateData.ticketID,
            //   generatedBy.fullName,
            //   HOST_URL,
            //   title,
            //   contentGeneratedBy,
            // )
            // START SEND CUSTOM EMAIL
            const { processStatus: customEmailStatus, generatedBy, department, workLocation, employeeType, title: jobTitleCustomEmail, } = (yield CandidateTenant_1.default.getInstance(tenantId).findById(candidateData._id));
            yield CustomEmailTenantController_1.default.generateEmails(customEmailStatus, [generatedBy._id], {
                candidateId: `${candidateData._id}`,
                departmentId: department._id,
                titleId: jobTitleCustomEmail._id,
                locationId: workLocation._id,
                employeeTypeId: employeeType._id,
            }, req);
            // END SEND CUSTOM EMAIL
            res.send(new ResponseResult_1.default({
                data: {},
                message: 'Update item successfully',
            }));
        });
    }
    candidateFinalOffer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId, candidate: candidateId } = req.body;
            const { body } = req;
            const { options, candidateFinalSignature } = body;
            // let candidate: any = await CandidateTenant.getInstance(tenantId).findById(
            //   candidateId,
            // )
            let aggregates = [];
            const match = { $match: {} };
            match.$match._id = mongoose_1.Types.ObjectId(candidateId);
            aggregates.push(match);
            const lookup = [
                {
                    $lookup: {
                        from: `${tenantId}_locations`,
                        localField: 'workLocation',
                        foreignField: '_id',
                        as: 'workLocation',
                    },
                },
                {
                    $unwind: {
                        path: '$workLocation',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: `employeetypes`,
                        localField: 'employeeType',
                        foreignField: '_id',
                        as: 'employeeType',
                    },
                },
                {
                    $unwind: {
                        path: '$employeeType',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: `${tenantId}_departments`,
                        localField: 'department',
                        foreignField: '_id',
                        as: 'department',
                    },
                },
                {
                    $unwind: {
                        path: '$department',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: `${tenantId}_titles`,
                        localField: 'title',
                        foreignField: '_id',
                        as: 'title',
                    },
                },
                {
                    $unwind: {
                        path: '$title',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: `${tenantId}_employees`,
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
                        from: `${tenantId}_companies`,
                        localField: 'company',
                        foreignField: '_id',
                        as: 'company',
                    },
                },
                {
                    $unwind: {
                        path: '$company',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: `${tenantId}_employees`,
                        localField: 'reportingManager',
                        foreignField: '_id',
                        as: 'reportingManager',
                    },
                },
                {
                    $unwind: {
                        path: '$reportingManager',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: `${tenantId}_generalinfos`,
                        localField: 'reportingManager.generalInfo',
                        foreignField: '_id',
                        as: 'reportingManager.generalInfo',
                    },
                },
                {
                    $unwind: {
                        path: '$reportingManager.generalInfo',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: `${tenantId}_employees`,
                        localField: 'generatedBy',
                        foreignField: '_id',
                        as: 'generatedBy',
                    },
                },
                {
                    $unwind: {
                        path: '$generatedBy',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: `${tenantId}_generalinfos`,
                        localField: 'generatedBy.generalInfo',
                        foreignField: '_id',
                        as: 'generatedBy.generalInfo',
                    },
                },
                {
                    $unwind: {
                        path: '$generatedBy.generalInfo',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: `attachments`,
                        localField: 'candidateSignature',
                        foreignField: '_id',
                        as: 'candidateSignature',
                    },
                },
                {
                    $unwind: {
                        path: '$candidateSignature',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: `attachments`,
                        localField: 'hrManagerSignature',
                        foreignField: '_id',
                        as: 'hrManagerSignature',
                    },
                },
                {
                    $unwind: {
                        path: '$hrManagerSignature',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: `attachments`,
                        localField: 'hrSignature',
                        foreignField: '_id',
                        as: 'hrSignature',
                    },
                },
                {
                    $unwind: {
                        path: '$hrSignature',
                        preserveNullAndEmptyArrays: true,
                    },
                },
            ];
            const project = [
                {
                    $project: {
                        _id: 1,
                        ticketID: 1,
                        fullName: 1,
                        privateEmail: 1,
                        workEmail: 1,
                        previousExperience: 1,
                        workLocation: 1,
                        position: 1,
                        employeeType: 1,
                        department: 1,
                        title: 1,
                        employee: 1,
                        company: 1,
                        processStatus: 1,
                        noticePeriod: 1,
                        dateOfJoining: 1,
                        reportingManager: {
                            _id: 1,
                        },
                        'reportingManager.generalInfo': 1,
                        compensationType: 1,
                        amountIn: 1,
                        timeOffPolicy: 1,
                        documentChecklistSetting: 1,
                        candidateSignature: 1,
                        finalOfferCandidateSignature: 1,
                        hrManagerSignature: 1,
                        hrSignature: 1,
                        hiringAgreements: 1,
                        companyHandbook: 1,
                        benefits: 1,
                        comments: 1,
                        generatedBy: {
                            _id: 1,
                        },
                        'generatedBy.generalInfo': 1,
                        salaryStructure: 1,
                        offerLetter: 1,
                        additionalTerms: 1,
                        offerExpirationDate: 1,
                        schedule: 1,
                        currentStep: 1,
                        candidateFinalSignature: 1,
                        staticOfferLetter: 1,
                        additionalQuestions: 1,
                        allowAccess: 1,
                        employeeId: 1,
                        status: 1,
                    },
                },
            ];
            aggregates = [...aggregates, ...lookup, ...project];
            const candidateData = yield CandidateTenant_1.default.getInstance(tenantId).aggregate(aggregates);
            const candidate = candidateData[0];
            console.log('candidate', candidate);
            if (!candidate) {
                throw new AdvancedError_1.default({
                    candidate: { kind: 'not.found', message: 'Candidate not found' },
                });
            }
            if (!lodash_1.inRange(options, 1, 3)) {
                throw new AdvancedError_1.default({
                    candidate: { kind: 'invalid', message: 'Option is invalid' },
                });
            }
            let processStatus = '';
            let content = '';
            if (options === 1) {
                processStatus = 'ACCEPT-FINAL-OFFER';
                content = `<h3><b>Candidate has accepted the final offer</b></h3>`;
            }
            if (options === 2) {
                processStatus = 'REJECT-FINAL-OFFER-CANDIDATE';
                content = `<b>Candidate has reject the final offer</b>`;
            }
            yield CandidateTenant_1.default.getInstance(tenantId).updateOne({ _id: candidate._id }, { $set: { processStatus, candidateFinalSignature } }, { $upsert: true });
            // const emails = await this.getEmail(
            //   [candidate.generatedBy._id, candidate.reportingManager._id],
            //   req,
            // )
            const emails = [
                {
                    email: candidate.generatedBy.generalInfo.workEmail,
                    fullName: candidate.generatedBy.generalInfo.legalName,
                    employee: null,
                    candidate: null,
                },
                {
                    email: candidate.reportingManager.generalInfo.workEmail,
                    fullName: candidate.reportingManager.generalInfo.legalName,
                    employee: null,
                    candidate: null,
                },
            ];
            const ccMails = [...emails];
            ccMails.shift();
            // START SEND CUSTOM EMAIL
            const { processStatus: customEmailStatus, generatedBy, department, workLocation, employeeType, title, } = (yield CandidateTenant_1.default.getInstance(tenantId).findById(candidate._id));
            yield CustomEmailTenantController_1.default.generateEmails(customEmailStatus, [generatedBy._id], {
                candidateId: `${candidate._id}`,
                departmentId: department._id,
                titleId: title._id,
                locationId: workLocation._id,
                employeeTypeId: employeeType._id,
            }, req);
            // END SEND CUSTOM EMAIL
            yield SendMail_1.sendNotificationCandidateOnboarding({ email: emails[0].email, fullName: emails[0].fullName }, ccMails, candidate.ticketID, emails[0].fullName, constant_1.HOST_URL, `<h3>CANDIDATE FINAL OFFER</h3>`, content);
            res.send(new ResponseResult_1.default({
                data: {},
                message: 'Update item successfully',
            }));
        });
    }
    scheduleHR(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId } = req.body;
            const { body } = req;
            const { candidate, schedule } = body;
            // let currentUser: any = user as IUser
            const candidateData = yield CandidateTenant_1.default.getInstance(tenantId).findById(candidate);
            // if (!(await this.checkRole(user, ['HR']))) {
            //   throw new AdvancedError({
            //     candidate: {
            //       kind: 'not.permission',
            //       message: 'User does not have permission',
            //     },
            //   })
            // }
            if (!candidateData) {
                throw new AdvancedError_1.default({
                    candidate: { kind: 'not.found', message: 'Candidate not found' },
                });
            }
            yield CandidateTenant_1.default.getInstance(tenantId).updateOne({ _id: candidateData._id }, { $set: { schedule } }, { $upsert: true });
            const infos = yield GeneralInfoTenant_1.default.getInstance(tenantId).findOne({
                employee: candidateData.schedule.meetingWith,
            });
            if (!infos) {
                throw new AdvancedError_1.default({
                    generalInfo: { kind: 'not.found', message: 'General info not found' },
                });
            }
            const { meetingAt, meetingOn } = candidateData.schedule;
            let title = 'CANDIDATE RE-NEGOTIATE SALARY STRUCTURE';
            let content = `Candidate no.${candidateData.ticketID} HR has schedule an 1 on 1 meeting
    Appointment detail: Meeting on${meetingOn} - at: ${meetingAt} with Mr/Mrs. ${infos.firstName +
                infos.lastName}
    `;
            yield SendMail_1.sendNotificationCandidateOnboarding({ email: candidateData.privateEmail, fullName: candidateData.fullName }, [], candidate.ticketID, candidateData.fullName, constant_1.HOST_URL, title, content);
            // START SEND CUSTOM EMAIL
            const { processStatus: customEmailStatus, generatedBy, department, workLocation, employeeType, title: jobTitle, } = (yield CandidateTenant_1.default.getInstance(tenantId).findById(candidate._id));
            yield CustomEmailTenantController_1.default.generateEmails(customEmailStatus, [generatedBy._id], {
                candidateId: `${candidate._id}`,
                departmentId: department._id,
                titleId: jobTitle._id,
                locationId: workLocation._id,
                employeeTypeId: employeeType._id,
            }, req);
            // END SEND CUSTOM EMAIL
            res.send(new ResponseResult_1.default({
                data: {},
                message: 'Update item successfully',
            }));
        });
    }
    addManagerSignature(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId } = req.body;
            const { body } = req;
            const { candidate, hrManagerSignature } = body;
            // if (!(await this.checkRole(user, ['HR-MANAGER']))) {
            //   throw new AdvancedError({
            //     candidate: {
            //       kind: 'not.permission',
            //       message: 'User does not have permission',
            //     },
            //   })
            // }
            const candidateData = yield CandidateTenant_1.default.getInstance(tenantId).findByIdAndUpdate(candidate, {
                $set: { hrManagerSignature },
            }, { upsert: true });
            if (!candidateData) {
                throw new AdvancedError_1.default({
                    candidate: { kind: 'not.found', message: 'Candidate not found' },
                });
            }
            res.send(new ResponseResult_1.default({
                data: {},
                message: 'Update item successfully',
            }));
        });
    }
    initiateBackgroundCheck(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId } = req.body;
            const { body } = req;
            const { rookieID } = body;
            // if (!(await this.checkRole(user, ['HR']))) {
            //   throw new AdvancedError({
            //     candidate: {
            //       kind: 'not.permission',
            //       message: 'User does not have permission',
            //     },
            //   })
            // }
            const candidateData = (yield CandidateTenant_1.default.getInstance(tenantId).findOne({
                ticketID: rookieID,
            }));
            if (!candidateData) {
                throw new AdvancedError_1.default({
                    candidate: { kind: 'not.found', message: 'Candidate not found' },
                });
            }
            yield CandidateTenant_1.default.getInstance(tenantId).updateOne({ ticketID: candidateData.ticketID }, { $set: { processStatus: 'PENDING-BACKGROUND-CHECK' } });
            res.send(new ResponseResult_1.default({
                data: {},
                message: 'Update item successfully',
            }));
        });
    }
    updateStep(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId } = req.body;
            const { body } = req;
            const { candidate, currentStep } = body;
            if (!lodash_1.inRange(currentStep, 0, 8)) {
                throw new AdvancedError_1.default({
                    candidate: { kind: 'invalid', message: 'Current step is invalid' },
                });
            }
            const candidateData = yield CandidateTenant_1.default.getInstance(tenantId).findByIdAndUpdate(candidate, {
                $set: { currentStep },
            });
            if (!candidateData) {
                throw new AdvancedError_1.default({
                    candidate: { kind: 'not.found', message: 'Candidate not found' },
                });
            }
            res.send(new ResponseResult_1.default({
                data: {},
                message: 'Update item successfully',
            }));
        });
    }
    finalOfferDraft(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId } = req.body;
            const { body } = req;
            const { candidate, hrSignature } = body;
            const candidateData = (yield CandidateTenant_1.default.getInstance(tenantId).findById(candidate));
            if (!candidateData) {
                throw new AdvancedError_1.default({
                    candidate: { kind: 'not.found', message: 'Candidate not found' },
                });
            }
            yield CandidateTenant_1.default.getInstance(tenantId).updateOne({ _id: candidateData._id }, { $set: { hrSignature, processStatus: 'FINAL-OFFER-DRAFT' } }, { $upsert: true });
            res.send(new ResponseResult_1.default({
                data: {},
                message: 'Update item successfully',
            }));
        });
    }
    createProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = req;
            const { rookieID, employeeId, tenantId } = body;
            // if (!(await this.checkRole(user, ['HR']))) {
            //   throw new AdvancedError({
            //     candidate: {
            //       kind: 'not.permission',
            //       message: 'User does not have permission',
            //     },
            //   })
            // }
            const existingEmployee = (yield EmployeeTenant_1.default.getInstance(tenantId).findOne({
                employeeId,
            }));
            if (existingEmployee) {
                throw new AdvancedError_1.default({
                    employee: {
                        kind: 'exists',
                        message: 'Employee with this ID is already exist',
                    },
                });
            }
            const candidate = (yield CandidateTenant_1.default.getInstance(tenantId).findOneAndUpdate({
                ticketID: rookieID,
            }, { $set: { employeeId } }, { upsert: true, new: true }));
            if (!candidate) {
                throw new AdvancedError_1.default({
                    candidate: { kind: 'not.found', message: 'Candidate not found' },
                });
            }
            res.send(new ResponseResult_1.default({
                data: {},
                message: 'Update item successfully',
            }));
        });
    }
    // HELPER FUCNTION
    getCandidateManager(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId } = req.body;
            const { body } = req;
            const { candidate } = body;
            const candidateData = (yield CandidateTenant_1.default.getInstance(tenantId).findById(candidate));
            if (!candidateData) {
                throw new AdvancedError_1.default({
                    candidate: { kind: 'not.found', message: 'Candidate not found' },
                });
            }
            const data = [candidateData.generatedBy, candidateData.reportingManager];
            res.send(new ResponseResult_1.default({
                data,
                message: 'List item successfully',
            }));
        });
    }
    getEmail(employees, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId } = req.body;
            if (!employees.length)
                return [];
            // Filter empty
            // const filtered = filter(employees, (per: any) => per)
            // const objectIds = map(filtered, (per: any) => Types.ObjectId(per))
            // Parse to ObjectID
            let aggregate = [];
            const lookup = [
                {
                    $match: {
                        //   $or: [
                        //     {
                        //       employee: {
                        //         $in: objectIds,
                        //       },
                        //     },
                        //     {
                        //       candidate: {
                        //         $in: objectIds,
                        //       },
                        //     },
                        //   ],
                        status: 'ACTIVE',
                    },
                },
                {
                    $lookup: {
                        from: `${tenantId}_employees`,
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
                        from: `${tenantId}_generalinfos`,
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
                        from: `${tenantId}_candidates`,
                        localField: 'candidate',
                        foreignField: '_id',
                        as: 'candidate',
                    },
                },
                {
                    $unwind: {
                        path: '$candidate',
                        preserveNullAndEmptyArrays: true,
                    },
                },
            ];
            const project = [
                {
                    $project: {
                        email: 1,
                        'employee.generalInfo': {
                            firstName: 1,
                            lastName: 1,
                        },
                        employee: {
                            _id: 1,
                        },
                        candidate: {
                            _id: 1,
                            fullName: 1,
                        },
                    },
                },
            ];
            aggregate = [...lookup, ...project];
            const userHR = yield UserMap_1.default.aggregate(aggregate);
            const emails = lodash_1.map(userHR, (per) => ({
                email: per.email,
                fullName: `${per.firstName}` || 'No name',
                employee: !lodash_1.isEmpty(per.employee) ? per.employee._id : null,
                candidate: !lodash_1.isEmpty(per.candidate) ? per.candidate._id : null,
            }));
            return emails;
        });
    }
    // private async checkRole(user: any, requiredRole: string[] = []) {
    //   let currentUser: any = user as IUser
    //   currentUser = await User.findById(currentUser._id)
    //   const userRoles = map(currentUser.roles, (per: any) => per._id)
    //   if (intersection(requiredRole, userRoles).length !== 0) {
    //     return true
    //   } else return false
    // }
    getAttachment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const attachment = yield Attachment_1.default.findById(mongoose_1.Types.ObjectId(id)).populate({
                path: 'user',
                select: '-roles',
                populate: {
                    path: 'employee',
                    options: { autopopulate: false },
                    select: '-department -location -workLocation -company',
                    populate: {
                        path: 'generalInfo',
                        select: '_id firstName lastName',
                    },
                },
            });
            // if (!attachment) {
            //   throw new AdvancedError({
            //     attachment: { kind: 'not.found', message: 'Attachment not found' },
            //   })
            // }
            return attachment;
        });
    }
    getHRManagerByLocation(location, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId } = req.body;
            const users = yield UserTenant_1.default.getInstance(tenantId).aggregate([
                {
                    $lookup: {
                        from: 'employees',
                        localField: 'employee',
                        foreignField: '_id',
                        as: 'employee',
                    },
                },
                {
                    $unwind: { path: '$employee', preserveNullAndEmptyArrays: false },
                },
                {
                    $lookup: {
                        from: 'generalinfos',
                        localField: 'generalInfo',
                        foreignField: '_id',
                        as: 'generalInfo',
                    },
                },
                {
                    $unwind: { path: '$generalInfo', preserveNullAndEmptyArrays: true },
                },
                {
                    $unwind: { path: '$roles' },
                },
                {
                    $group: {
                        _id: '$_id',
                        email: { $first: '$email' },
                        employee: { $first: '$employee' },
                        roles: { $first: '$roles' },
                    },
                },
                {
                    $project: {
                        _id: 1,
                        email: 1,
                        roles: { $in: ['$roles', ['HR-MANAGER']] },
                        employee: {
                            location: 1,
                            generalInfo: {
                                firstName: 1,
                                lastName: 1,
                            },
                        },
                    },
                },
                {
                    $match: { roles: true, 'employee.location': mongoose_1.Types.ObjectId(location) },
                },
            ]);
            const data = lodash_1.map(users, (per) => ({
                email: per.email,
                fullName: `${per.employee.generalInfo.firstName} ${per.employee.generalInfo.lastName}`,
            }));
            return data;
        });
    }
}
exports.default = new CandidateTenantController();
//# sourceMappingURL=CandidateTenantController.js.map