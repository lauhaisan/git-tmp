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
const AdvancedError_1 = __importDefault(require("../declares/AdvancedError"));
const Insurance_1 = __importDefault(require("../models/Insurance"));
const ResponseResult_1 = __importDefault(require("../services/ResponseResult"));
class InsuranceController extends AbstractController_1.default {
    constructor(model) {
        super(model);
    }
    generateMethods() {
        return [
            {
                name: 'fetch-setting',
                type: 'POST',
                _ref: this.fetchedSettings.bind(this),
            },
            {
                name: 'add',
                type: 'POST',
                _ref: this.add,
            },
            {
                name: 'remove',
                type: 'POST',
                _ref: this.remove.bind(this),
                validationSchema: {
                    id: {
                        in: 'body',
                        exists: {
                            errorMessage: ['required', 'Id is missing'],
                        },
                    },
                },
            },
        ];
    }
    fetchedSettings(__, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const insurance = yield Insurance_1.default.findOne({});
            if (insurance) {
                res.send(new ResponseResult_1.default({
                    message: 'Successfully fetched insurance setting',
                    data: insurance,
                }));
            }
            else {
                res.send(new AdvancedError_1.default({
                    insurance: {
                        message: 'Insurance settings not found',
                        kind: 'not.found',
                    },
                }));
            }
        });
    }
    add(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const existed = yield Insurance_1.default.exists({});
            console.log(existed);
            if (existed) {
                const insurance = yield Insurance_1.default.findOne();
                if (insurance) {
                    insurance.set(req.body);
                    yield insurance.save();
                }
                res.send(new ResponseResult_1.default({
                    message: 'Successfully updated existing insurance',
                    data: insurance,
                }));
            }
            else {
                res.send(new ResponseResult_1.default({
                    message: 'Successfully added an insurance',
                    data: yield Insurance_1.default.create(req.body),
                }));
            }
        });
    }
}
exports.default = new InsuranceController(Insurance_1.default);
//# sourceMappingURL=InsuranceController.js.map