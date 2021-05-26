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
const ResponseResult_1 = __importDefault(require("@/app/services/ResponseResult"));
const SettingCountry_1 = __importDefault(require("../models/SettingCountry"));
// import VietNamPolicy from '../inits/countryPolicyDefault'
class SettingCountryController extends AbstractController_1.default {
    generateMethods() {
        return [
            {
                name: 'add',
                type: 'POST',
                _ref: this.add.bind(this),
            },
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
                name: 'remove',
                type: 'POST',
                _ref: this.remove.bind(this),
            },
        ];
    }
    // protected async add(_req: Request, res: Response) {
    //   const data = new SettingCountry(VietNamPolicy)
    //   await data.save()
    //   res.send(
    //     new ResponseResult({
    //       data,
    //       message: 'Add successfully',
    //     }),
    //   )
    // }
    getByID(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.body;
            const existData = yield this.model.findById(id);
            if (!existData) {
                throw new AdvancedError_1.default({
                    settingcountry: {
                        kind: 'not.found',
                        message: 'Setting country not found',
                    },
                });
            }
            res.send(new ResponseResult_1.default({
                data: existData,
                message: 'Get by id successfully',
            }));
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, settingType } = req.body;
            const data = yield this.model.findById(id);
            if (!data) {
                throw new AdvancedError_1.default({
                    settingcountry: {
                        kind: 'not.found',
                        message: 'Setting country not found',
                    },
                });
            }
            data.set(settingType);
            yield data.save();
            res.send(new ResponseResult_1.default({
                data,
                message: 'Update successfully',
            }));
        });
    }
    remove(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.body;
            const data = yield this.model.findById(id);
            if (!data) {
                throw new AdvancedError_1.default({
                    settingcountry: {
                        kind: 'not.found',
                        message: 'Setting country not found',
                    },
                });
            }
            yield data.remove();
            res.send(new ResponseResult_1.default({
                message: 'Remove successfully',
            }));
        });
    }
}
exports.default = new SettingCountryController(SettingCountry_1.default);
//# sourceMappingURL=SettingCountryController.js.map