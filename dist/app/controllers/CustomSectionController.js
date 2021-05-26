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
const bluebird_1 = __importDefault(require("bluebird"));
const AbstractController_1 = __importDefault(require("../declares/AbstractController"));
const AdvancedError_1 = __importDefault(require("../declares/AdvancedError"));
const CustomField_1 = __importDefault(require("../models/CustomField"));
const CustomSection_1 = __importDefault(require("../models/CustomSection"));
const ResponseResult_1 = __importDefault(require("../services/ResponseResult"));
class CustomSectionController extends AbstractController_1.default {
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
                _ref: this.add.bind(this),
            },
            {
                name: 'remove',
                type: 'POST',
                _ref: this.removeSection,
            },
        ];
    }
    removeSection(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.body;
            const section = yield CustomSection_1.default.findById(id);
            if (section) {
                const fields = yield CustomField_1.default.find({ section: id });
                if (fields) {
                    yield bluebird_1.default.map(fields, (item) => __awaiter(this, void 0, void 0, function* () {
                        yield item.remove();
                    }));
                    yield section.remove();
                    res.send(new ResponseResult_1.default({
                        message: 'Successfully deleted entire section',
                    }));
                }
            }
            else {
                res.send(new AdvancedError_1.default({
                    section: { kind: 'not.found', message: 'Section does not exist' },
                }));
            }
        });
    }
}
exports.default = new CustomSectionController(CustomSection_1.default);
//# sourceMappingURL=CustomSectionController.js.map