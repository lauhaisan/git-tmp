"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constant_1 = require("@/app/utils/constant");
const mongoose_1 = __importStar(require("mongoose"));
const mongoose_autopopulate_1 = __importDefault(require("mongoose-autopopulate"));
const mongoose_beautiful_unique_validation_1 = __importDefault(require("mongoose-beautiful-unique-validation"));
// import UserTenant from './UserTenant'
class PasswordRequestTenant {
    constructor() { }
    static getInstance(tenantId) {
        if (this.tenantId != tenantId) {
            this.tenantId = tenantId;
        }
        const schema = new mongoose_1.Schema({
            email: {
                type: String,
                required: true,
                maxlength: 255,
                match: [
                    /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
                    constant_1.VALIDATE_MSG.emailValid,
                ],
            },
            time: {
                type: Number,
            },
            code: {
                type: Number,
                required: true,
            },
            isClient: {
                type: Boolean,
                default: false,
            },
            user: {
                type: mongoose_1.Schema.Types.ObjectId,
                //ref: UserTenant.getInstance(this.tenantId),
                autopopulate: {
                    select: '-createdAt -updatedAt -roles -manageLocations -password -manager -location',
                },
            },
        }, { timestamps: true, versionKey: false });
        schema.plugin(mongoose_beautiful_unique_validation_1.default);
        schema.plugin(mongoose_autopopulate_1.default);
        let modelObject = mongoose_1.default.models[this.tenantId + '_passwordrequest'];
        if (!modelObject) {
            modelObject = mongoose_1.default.model(this.tenantId + '_passwordrequest', schema);
        }
        return modelObject;
    }
}
exports.default = PasswordRequestTenant;
//# sourceMappingURL=PasswordRequestTenant.js.map