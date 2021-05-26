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
const bluebird_1 = __importDefault(require("bluebird"));
const lodash_1 = require("lodash");
const Visa_1 = __importDefault(require("../models/Visa"));
const AdvancedError_1 = __importDefault(require("../declares/AdvancedError"));
class VisaController extends AbstractController_1.default {
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
                _ref: this.updateMany.bind(this),
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
            {
                name: 'upsert',
                type: 'POST',
                _ref: this.upsert.bind(this),
            },
            {
                name: 'remove',
                type: 'POST',
                _ref: this.remove.bind(this),
            },
        ];
    }
    upsert(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Array.isArray(req.body)) {
                const visa = yield bluebird_1.default.map(req.body, (item) => __awaiter(this, void 0, void 0, function* () {
                    const { id } = item;
                    if (!id) {
                        return yield Visa_1.default.create(item);
                    }
                    else {
                        const visa = yield Visa_1.default.findById(id);
                        yield visa.set(this.filterParams(item, ['employee', 'id']));
                        yield visa.save();
                        return visa;
                    }
                }));
                res.send(new ResponseResult_1.default({
                    message: 'Successfully updated information',
                    data: visa,
                }));
            }
            else {
                const { id } = req.body;
                const visa = yield Visa_1.default.findById(id);
                visa.set(this.filterParams(req.body, ['employee']));
                yield visa.save();
                res.send(new ResponseResult_1.default({
                    message: 'Successfully updated information',
                    data: visa,
                }));
            }
        });
    }
    updateMany(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = req;
            if (lodash_1.isArray(body)) {
                const updateItems = [];
                const insertItems = [];
                lodash_1.map(body, (per) => {
                    const { _id } = per;
                    if (!_id)
                        insertItems.push(per);
                    else {
                        updateItems.push({
                            updateOne: {
                                filter: { _id },
                                update: { $set: this.filterParams(per, ['_id', 'employee']) },
                                upsert: false,
                            },
                        });
                    }
                });
                if (updateItems.length)
                    yield Visa_1.default.bulkWrite(updateItems);
                if (insertItems.length)
                    yield Visa_1.default.insertMany(insertItems);
            }
            else {
                const { _id } = body;
                if (!_id) {
                    throw new AdvancedError_1.default({
                        visa: { kind: 'invalid', message: 'Id must be provided' },
                    });
                }
                const visa = (yield Visa_1.default.findById(_id));
                if (!visa) {
                    throw new AdvancedError_1.default({
                        visa: { kind: 'not.found', message: 'Visa not found' },
                    });
                }
                visa.set(this.filterParams(body, ['employee', '_id']));
                yield visa.save();
            }
            res.send(new ResponseResult_1.default({
                data: [],
                message: 'Update items successfully',
            }));
        });
    }
    getByEmployee({ body }, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { employee } = body;
            const visa = yield Visa_1.default.find({ employee });
            res.send(new ResponseResult_1.default({
                data: visa,
                message: 'get passport successfully',
            }));
        });
    }
}
exports.default = new VisaController(Visa_1.default);
//# sourceMappingURL=VisaController.js.map