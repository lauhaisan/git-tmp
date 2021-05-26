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
const ResponseResult_1 = __importDefault(require("@/app/services/ResponseResult"));
const Compensation_1 = __importDefault(require("../models/Compensation"));
class CompensationController extends AbstractController_1.default {
    constructor(model) {
        super(model);
    }
    generateMethods() {
        return [
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
                name: 'update',
                type: 'POST',
                _ref: this.update,
            },
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
        ];
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.body;
            const compensation = yield Compensation_1.default.findById(id);
            compensation.set(this.filterParams(req.body, ['employee', 'company']));
            yield compensation.save();
            res.send(new ResponseResult_1.default({
                message: 'Successfully updated information',
                data: compensation,
            }));
        });
    }
    getByEmployee({ body }, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { employee } = body;
            const compensation = yield Compensation_1.default.findOne({ employee });
            res.send(new ResponseResult_1.default({
                data: compensation,
                message: 'get compensation successfully',
            }));
        });
    }
}
exports.default = new CompensationController(Compensation_1.default);
//# sourceMappingURL=CompensationController.js.map