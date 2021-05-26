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
const lodash_1 = require("lodash");
const mongoose_1 = require("mongoose");
const AdvancedError_1 = __importDefault(require("../declares/AdvancedError"));
const OffBoardingRequestTenant_1 = __importDefault(require("../models/OffBoardingRequestTenant"));
const TemplateRelieving_1 = __importDefault(require("../models/TemplateRelieving"));
const TemplateRelievingTenant_1 = __importDefault(require("../models/TemplateRelievingTenant"));
const ResponseResult_1 = __importDefault(require("../services/ResponseResult"));
class TemplateRelievingTenantController extends AbstractController_1.default {
    generateMethods() {
        return [
            {
                name: 'add',
                type: 'POST',
                _ref: this.add.bind(this),
            },
            {
                name: 'update',
                type: 'POST',
                _ref: this.update.bind(this),
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
                name: 'get-by-id',
                type: 'POST',
                _ref: this.getByID.bind(this),
            },
            {
                name: 'remove',
                type: 'POST',
                _ref: this.remove.bind(this),
                validationSchema: {
                    id: {
                        in: 'body',
                        exists: {
                            errorMessage: ['required', 'Id must be provided'],
                        },
                    },
                    offBoardingId: {
                        in: 'body',
                        exists: {
                            errorMessage: ['required', 'offBoardingId must be provided'],
                        },
                    },
                },
            },
            {
                name: 'list',
                type: 'POST',
                _ref: this.list.bind(this),
            },
        ];
    }
    add(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId } = req.body;
            res.send(new ResponseResult_1.default({
                data: yield TemplateRelievingTenant_1.default.getInstance(tenantId).create(req.body),
                message: 'Add item successfully',
            }));
        });
    }
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId, offBoardingId, packageType, company, templateType, } = req.body;
            // if (!company)
            //   res.send(
            //     new AdvancedError({
            //       templateRelieving: {
            //         kind: 'request.invalid',
            //         message: 'Company Id is required',
            //       },
            //     }),
            //   )
            let templates = null;
            if (templateType === 'DEFAULT') {
                let filter = {
                    packageType,
                    templateType,
                };
                filter = lodash_1.pickBy(filter, lodash_1.identity);
                templates = yield TemplateRelieving_1.default.find(filter);
            }
            else {
                let filter = {
                    company,
                    packageType,
                    templateType,
                };
                filter = lodash_1.pickBy(filter, lodash_1.identity);
                templates = yield TemplateRelievingTenant_1.default.getInstance(tenantId).find(filter);
            }
            // Add the templates to the waitting list in if list for sending package off boarding request
            if (offBoardingId) {
                if (templates.length > 0) {
                    const offBoardingRequest = yield OffBoardingRequestTenant_1.default.getInstance(tenantId).findById(offBoardingId);
                    let templateRes = templates.map(item => ({
                        packageName: item.name,
                        settings: item.settings,
                        templateRelieving: item._id,
                    }));
                    if (offBoardingRequest) {
                        let searchField = '';
                        switch (packageType) {
                            case 'EXIT-INTERVIEW-FEEDBACKS':
                                searchField = 'exitInterviewFeedbacks';
                                if (offBoardingRequest.exitInterviewFeedbacks.waitList.length === 0) {
                                    yield offBoardingRequest.updateOne({
                                        $push: {
                                            'exitInterviewFeedbacks.waitList': { $each: templateRes },
                                        },
                                    }, { upsert: true });
                                }
                                break;
                            case 'CLOSING-PACKAGE':
                                searchField = 'closingPackage';
                                if (offBoardingRequest.closingPackage.waitList.length === 0) {
                                    yield offBoardingRequest.updateOne({
                                        $push: {
                                            'closingPackage.waitList': { $each: templateRes },
                                        },
                                    }, { upsert: true });
                                }
                                break;
                            case 'EXIT-PACKAGE':
                                searchField = 'exitPackage';
                                if (offBoardingRequest.exitPackage.waitList.length === 0) {
                                    yield offBoardingRequest.updateOne({
                                        $push: {
                                            'exitPackage.waitList': { $each: templateRes },
                                        },
                                    }, { upsert: true });
                                }
                                break;
                            default:
                                res.send(new AdvancedError_1.default({
                                    offBoardingRequest: {
                                        kind: 'invalid',
                                        message: 'The package type does not match within database',
                                    },
                                }));
                        }
                        yield offBoardingRequest.save();
                        OffBoardingRequestTenant_1.default.getInstance(tenantId)
                            .findById(offBoardingId)
                            .then(response => {
                            if (response)
                                res.send(new ResponseResult_1.default({
                                    message: 'Successfully fetched templates for this off boarding request',
                                    data: response[searchField],
                                }));
                        });
                    }
                }
                else {
                    throw new AdvancedError_1.default({
                        template: {
                            kind: 'not.found',
                            message: 'template not found',
                        },
                    });
                }
            }
            else {
                res.send(new ResponseResult_1.default({
                    message: 'Get list template relieving successfully',
                    data: templates,
                }));
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId, company, offBoardingId, id, name, packageType, settings, templateType = 'CUSTOM', } = req.body;
            const data = {
                company,
                name,
                packageType,
                templateType,
                settings,
            };
            const templateRelieving = yield TemplateRelieving_1.default.findById(id);
            let template;
            if (templateRelieving) {
                template = yield TemplateRelievingTenant_1.default.getInstance(tenantId).create(data);
            }
            else {
                template = yield TemplateRelievingTenant_1.default.getInstance(tenantId).findById(id);
                if (template) {
                    yield template.set(data).save();
                }
                else {
                    throw new AdvancedError_1.default({
                        id: {
                            kind: 'not.found',
                            message: 'Id not found',
                        },
                    });
                }
            }
            let offBoarding = yield OffBoardingRequestTenant_1.default.getInstance(tenantId).findById(offBoardingId);
            if (!offBoarding) {
                throw new AdvancedError_1.default({
                    offBoardingId: {
                        kind: 'not.found',
                        message: 'off boarding request Id not found',
                    },
                });
            }
            let templateRes = {
                packageName: template.name,
                settings: template.settings,
                templateRelieving: template._id,
            };
            let searchField = '';
            let templateIds = [];
            switch (packageType) {
                case 'EXIT-INTERVIEW-FEEDBACKS':
                    searchField = 'exitInterviewFeedbacks';
                    templateIds = offBoarding.exitInterviewFeedbacks.waitList.map((item) => item.templateRelieving);
                    offBoarding.exitInterviewFeedbacks.waitList[templateIds.indexOf(id)] = templateRes;
                    yield offBoarding.save();
                    break;
                case 'CLOSING-PACKAGE':
                    searchField = 'closingPackage';
                    templateIds = offBoarding.closingPackage.waitList.map((item) => item.templateRelieving);
                    offBoarding.closingPackage.waitList[templateIds.indexOf(id)] = templateRes;
                    yield offBoarding.save();
                    break;
                case 'EXIT-PACKAGE':
                    searchField = 'exitPackage';
                    templateIds = offBoarding.exitPackage.waitList.map((item) => item.templateRelieving);
                    offBoarding.exitPackage.waitList[templateIds.indexOf(id)] = templateRes;
                    yield offBoarding.save();
                    break;
                default:
                    res.send(new AdvancedError_1.default({
                        offBoardingRequest: {
                            kind: 'invalid',
                            message: 'The package type does not match within database',
                        },
                    }));
            }
            if (templateIds.indexOf(id) >= 0) {
                res.send(new ResponseResult_1.default({
                    message: 'Update template relieving of off boarding request successfully',
                    data: offBoarding[searchField],
                }));
            }
            else
                res.send(new ResponseResult_1.default({
                    message: 'Update template successfully',
                    data: template,
                }));
        });
    }
    // remove template relieving from offBoardingRequest
    remove(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId, id, offBoardingId, packageType } = req.body;
            let offBoarding = yield OffBoardingRequestTenant_1.default.getInstance(tenantId).findById(offBoardingId);
            if (!offBoarding) {
                throw new AdvancedError_1.default({
                    offBoardingId: {
                        kind: 'not.found',
                        message: 'off boarding request id not found',
                    },
                });
            }
            let searchField = '';
            switch (packageType) {
                case 'EXIT-INTERVIEW-FEEDBACKS':
                    searchField = 'exitInterviewFeedbacks';
                    offBoarding.exitInterviewFeedbacks.waitList = offBoarding.exitInterviewFeedbacks.waitList.filter((item) => String(item.templateRelieving) !== String(id));
                    yield offBoarding.save();
                    break;
                case 'CLOSING-PACKAGE':
                    searchField = 'closingPackage';
                    offBoarding.closingPackage.waitList = offBoarding.closingPackage.waitList.filter((item) => String(item.templateRelieving) !== String(id));
                    yield offBoarding.save();
                    break;
                case 'EXIT-PACKAGE':
                    searchField = 'exitPackage';
                    offBoarding.exitPackage.waitList = offBoarding.exitPackage.waitList.filter((item) => String(item.templateRelieving) !== String(id));
                    yield offBoarding.save();
                    break;
                default:
                    res.send(new AdvancedError_1.default({
                        offBoardingRequest: {
                            kind: 'invalid',
                            message: 'The package type does not match within database',
                        },
                    }));
            }
            res.send(new ResponseResult_1.default({
                message: 'Remove template relieving from off boarding request successfully',
                data: offBoarding[searchField],
            }));
        });
    }
    getByID(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId, company, id } = req.body;
            let item = null;
            if (!company) {
                item = yield TemplateRelieving_1.default.findOne({
                    _id: mongoose_1.Types.ObjectId(id),
                });
            }
            else {
                item = yield TemplateRelievingTenant_1.default.getInstance(tenantId).findOne({
                    _id: id,
                });
            }
            if (!item) {
                throw new AdvancedError_1.default({
                    item: { kind: 'not.found', message: 'Item not found' },
                });
            }
            res.send(new ResponseResult_1.default({
                data: item,
                message: 'Get item successfully',
            }));
        });
    }
}
exports.default = new TemplateRelievingTenantController();
//# sourceMappingURL=TemplateRelievingTenantController.js.map