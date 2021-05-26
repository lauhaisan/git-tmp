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
const mongoose_1 = require("mongoose");
const AbstractController_1 = __importDefault(require("../declares/AbstractController"));
const AdvancedError_1 = __importDefault(require("../declares/AdvancedError"));
const ChangeHistory_1 = __importDefault(require("../models/ChangeHistory"));
const Compensation_1 = __importDefault(require("../models/Compensation"));
const Employee_1 = __importDefault(require("../models/Employee"));
const ResponseResult_1 = __importDefault(require("../services/ResponseResult"));
class ChangeHistoryController extends AbstractController_1.default {
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
                _ref: this.getByEmployee,
            },
            {
                name: 'update',
                type: 'POST',
                _ref: this.update.bind(this),
            },
            {
                name: 'list',
                type: 'POST',
                _ref: this.list.bind(this),
            },
            {
                name: 'add',
                type: 'POST',
                _ref: this.add,
            },
            {
                name: 'revoke',
                type: 'POST',
                _ref: this.revoke.bind(this),
            },
        ];
    }
    add(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { effectiveDate, changeDate } = req.body;
            const employee = yield Employee_1.default.findById(req.body.employee);
            if (employee) {
                res.send(new ResponseResult_1.default({
                    message: "Changed employee's employment successfully",
                    data: yield ChangeHistory_1.default.create(req.body),
                }));
                if (effectiveDate <= changeDate) {
                    const compensation = yield Compensation_1.default.findOne({
                        employee: req.body.employee,
                    });
                    if (compensation) {
                        compensation.set(this.filterParams(req.body));
                        yield compensation.save();
                    }
                    employee.set(this.filterParams(req.body, [
                        'effectiveDate',
                        'changeDate',
                        'takeEffect',
                        'currentCTC',
                        'compensationType',
                        'employee',
                        'changedBy',
                    ]));
                    yield employee.save();
                }
            }
        });
    }
    getByEmployee(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { employee } = req.body;
            const changes = yield ChangeHistory_1.default.find({ employee });
            const data = changes.sort((a, b) => Date.parse(b.changeDate.toISOString()) -
                Date.parse(a.changeDate.toISOString()));
            res.send(new ResponseResult_1.default({
                message: 'Fetched change history of employee successfully',
                data,
            }));
        });
    }
    revoke(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = req;
            const { employee } = body;
            const changeList = yield this.model
                .find({ employee })
                .sort({ changeDate: -1 });
            if (!changeList) {
                throw new AdvancedError_1.default({
                    changeHistory: {
                        kind: 'not.found',
                        message: 'Change history not found',
                    },
                });
            }
            if (changeList.length === 0) {
                throw new AdvancedError_1.default({
                    changeHistory: {
                        kind: 'not.found',
                        message: 'No history found',
                    },
                });
            }
            let newChangeList = [...changeList];
            const deleteChange = newChangeList.shift(); // Remove most recent change
            yield this.model.deleteOne({ _id: deleteChange._id });
            if (newChangeList.length > 0) {
                const recentChange = newChangeList[0]; // Get new recent change
                if (recentChange.title) {
                    yield Employee_1.default.updateOne({ _id: mongoose_1.Types.ObjectId(employee) }, { title: recentChange.title._id });
                }
                if (recentChange.location) {
                    yield Employee_1.default.updateOne({ _id: mongoose_1.Types.ObjectId(employee) }, { location: recentChange.location._id });
                }
                if (recentChange.employeeType) {
                    yield Employee_1.default.updateOne({ _id: mongoose_1.Types.ObjectId(employee) }, { employeeType: recentChange.employeeType._id });
                }
                if (recentChange.compensationType) {
                    yield Compensation_1.default.updateOne({ employee: mongoose_1.Types.ObjectId(employee) }, { compensationType: recentChange.compensationType });
                }
                if (recentChange.manager) {
                    yield Employee_1.default.updateOne({ _id: mongoose_1.Types.ObjectId(employee) }, { manager: recentChange.manager._id });
                }
                if (recentChange.department) {
                    yield Employee_1.default.updateOne({ _id: mongoose_1.Types.ObjectId(employee) }, { department: recentChange.department._id });
                }
            }
            res.send(new ResponseResult_1.default({
                message: 'Revoke change history succesfully',
                data: {
                    newChangeList,
                },
            }));
        });
    }
}
exports.default = new ChangeHistoryController(ChangeHistory_1.default);
//# sourceMappingURL=ChangeHistoryController.js.map