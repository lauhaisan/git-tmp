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
const AdvancedError_1 = __importDefault(require("../declares/AdvancedError"));
const OffBoardingRequest_1 = __importDefault(require("../models/OffBoardingRequest"));
const TemplateRelieving_1 = __importDefault(require("../models/TemplateRelieving"));
const ResponseResult_1 = __importDefault(require("../services/ResponseResult"));
class TemplateRelievingController extends AbstractController_1.default {
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
            },
            {
                name: 'list',
                type: 'POST',
                _ref: this.list.bind(this),
            },
        ];
    }
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { offBoardingId, packageType, company, templateType } = req.body;
            if (!company)
                res.send(new AdvancedError_1.default({
                    templateRelieving: {
                        kind: 'request.invalid',
                        message: 'Company Id is required',
                    },
                }));
            let filter = {
                company,
                packageType,
                templateType,
            };
            filter = lodash_1.pickBy(filter, lodash_1.identity);
            const templates = yield TemplateRelieving_1.default.find(filter);
            // Add the templates to the waitting list in if list for sending package off boarding request
            if (offBoardingId) {
                if (templates) {
                    const offBoardingRequest = yield OffBoardingRequest_1.default.findById(offBoardingId);
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
                        OffBoardingRequest_1.default.findById(offBoardingId).then(response => {
                            if (response)
                                res.send(new ResponseResult_1.default({
                                    message: 'Successfully fetched templates for this off boarding request',
                                    data: response[searchField],
                                }));
                        });
                    }
                }
            }
            else {
                res.send(new ResponseResult_1.default({
                    message: 'Successfully fetched templates for this off boarding request',
                    data: templates,
                }));
            }
        });
    }
}
exports.default = new TemplateRelievingController(TemplateRelieving_1.default);
//# sourceMappingURL=TemplateRelievingController.js.map