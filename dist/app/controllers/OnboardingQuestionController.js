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
const OnboardingQuestion_1 = __importDefault(require("@/app/models/OnboardingQuestion"));
const ResponseResult_1 = __importDefault(require("@/app/services/ResponseResult"));
const lodash_1 = require("lodash");
const Employee_1 = __importDefault(require("../models/Employee"));
const OnboardingQuestionHistory_1 = __importDefault(require("../models/OnboardingQuestionHistory"));
class OnboardingQuestionController extends AbstractController_1.default {
    generateMethods() {
        return [
            {
                name: 'list',
                type: 'POST',
                _ref: this.list.bind(this),
            },
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
            // {
            //   name: 'get-by-company',
            //   type: 'POST',
            //   _ref: this.getByCompany.bind(this),
            // },
            {
                name: 'save-setting',
                type: 'POST',
                _ref: this.saveSetting.bind(this),
            },
        ];
    }
    add(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body, user } = req;
            let currentUser = user;
            let employee = currentUser.employee;
            employee = yield Employee_1.default.findById(currentUser.employee);
            if (!employee) {
                throw new AdvancedError_1.default({
                    employee: { kind: 'not.found', message: 'Employee not found' },
                });
            }
            body.company = employee.company;
            const onboardingQuestion = yield OnboardingQuestion_1.default.create(body);
            res.send(new ResponseResult_1.default({
                data: onboardingQuestion,
                message: 'Add item successfully',
            }));
        });
    }
    list({ user }, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let currentUser = user;
            let employee = currentUser.employee;
            employee = yield Employee_1.default.findById(currentUser.employee);
            const data = yield OnboardingQuestion_1.default.find({ company: employee.company });
            res.send(new ResponseResult_1.default({
                data,
                message: 'List items successfully',
            }));
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = req;
            const { id } = body;
            const data = (yield OnboardingQuestion_1.default.findById(id));
            if (!data) {
                throw new AdvancedError_1.default({
                    onboardingQuestion: {
                        kind: 'not.found',
                        message: 'Onboarding question not found',
                    },
                });
            }
            data.set(this.filterParams(body, ['_id', 'company']));
            yield data.save();
            res.send(new ResponseResult_1.default({
                data,
                message: 'Update item successfully',
            }));
        });
    }
    saveSetting(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user, body: { onboardingQuestions }, } = req;
            let currentUser = user;
            let employee = currentUser.employee;
            employee = yield Employee_1.default.findById(currentUser.employee);
            const data = lodash_1.map(onboardingQuestions, ({ _id, isChosen, question }) => ({
                updateOne: {
                    filter: { _id },
                    update: { $set: { isChosen, question } },
                    upsert: true,
                },
            }));
            yield OnboardingQuestion_1.default.bulkWrite(data);
            const lasted_questions = yield OnboardingQuestion_1.default.find({
                company: employee.company,
                isChosen: true,
            });
            const lasted_questions_id = lodash_1.map(lasted_questions, (per) => per._id);
            const existing_history = (yield OnboardingQuestionHistory_1.default.find().sort({
                createdAt: -1,
            }));
            if (existing_history.length) {
                yield OnboardingQuestionHistory_1.default.create({
                    version: existing_history[0].version + 1,
                    questions: [...lasted_questions_id],
                });
            }
            else {
                // FIRST TIME INITIALIZE
                yield OnboardingQuestionHistory_1.default.create({
                    questions: [...lasted_questions_id],
                });
            }
            res.send(new ResponseResult_1.default({
                data: {},
                message: 'Update item successfuly',
            }));
        });
    }
}
exports.default = new OnboardingQuestionController(OnboardingQuestion_1.default);
//# sourceMappingURL=OnboardingQuestionController.js.map