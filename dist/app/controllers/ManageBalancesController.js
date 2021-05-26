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
const Attachment_1 = __importDefault(require("@/app/models/Attachment"));
const Location_1 = __importDefault(require("@/app/models/Location"));
const ResponseResult_1 = __importDefault(require("@/app/services/ResponseResult"));
const ManageBalance_1 = __importDefault(require("../models/ManageBalance"));
class ManageBalancesController extends AbstractController_1.default {
    generateMethods() {
        return [
            {
                name: 'upload-file',
                type: 'POST',
                _ref: this.uploadFile.bind(this),
            },
            {
                name: 'active',
                type: 'POST',
                _ref: this.active,
            },
            {
                name: 'inactive',
                type: 'POST',
                _ref: this.inactive,
            },
        ];
    }
    createDefault({ user }) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = user;
            const employee = currentUser.employee;
            const existLocation = yield Location_1.default.findById(employee.location);
            if (!existLocation) {
                throw new AdvancedError_1.default({
                    location: {
                        kind: 'not.found',
                        message: 'Location not found',
                    },
                });
            }
            const data = {
                manageBalance: [],
                location: employee.location,
            };
            return data;
        });
    }
    initDefault(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = req.user;
            const employee = currentUser.employee;
            const location = yield Location_1.default.findById(employee.location);
            if (!location) {
                throw new AdvancedError_1.default({
                    location: {
                        kind: 'not.found',
                        message: 'Location not found',
                    },
                });
            }
            const newData = new ManageBalance_1.default({
                manageBalance: [],
                location,
            });
            yield newData.save();
            res.send(new ResponseResult_1.default({
                data: newData,
                message: 'Init succefully',
            }));
        });
    }
    uploadFile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { attachment } = req.body;
            const existFile = yield Attachment_1.default.findById(attachment);
            if (!existFile) {
                throw new AdvancedError_1.default({
                    attachment: {
                        kind: 'not.found',
                        message: 'File not found',
                    },
                });
            }
            const data = yield this.model.create(req.body);
            res.send(new ResponseResult_1.default({
                data,
                message: 'Upload successfully',
            }));
        });
    }
}
exports.default = new ManageBalancesController(ManageBalance_1.default);
//# sourceMappingURL=ManageBalancesController.js.map