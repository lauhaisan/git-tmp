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
const Dependent_1 = __importDefault(require("@/app/models/Dependent"));
const ResponseResult_1 = __importDefault(require("@/app/services/ResponseResult"));
class DependentController extends AbstractController_1.default {
    generateMethods() {
        return [
            {
                name: 'list',
                type: 'POST',
                _ref: this.list.bind(this),
            },
            {
                name: 'get-by-employee',
                type: 'POST',
                _ref: this.getByEmployee.bind(this),
            },
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
                name: 'update',
                type: 'POST',
                _ref: this.update.bind(this),
            },
        ];
    }
    getByEmployee(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { employee } = req.body;
            const dependents = yield Dependent_1.default.findOne({ employee });
            if (dependents) {
                res.send(new ResponseResult_1.default({
                    message: 'Successfully found the dependents',
                    data: dependents,
                }));
            }
            else
                res.send(new AdvancedError_1.default({
                    dependent: {
                        kind: 'not.found',
                        message: 'Cannot find the dependents of this employee',
                    },
                }));
        });
    }
}
exports.default = new DependentController(Dependent_1.default);
//# sourceMappingURL=DependentController.js.map