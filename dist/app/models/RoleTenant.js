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
const mongoose_1 = __importStar(require("mongoose"));
const mongoose_beautiful_unique_validation_1 = __importDefault(require("mongoose-beautiful-unique-validation"));
// import PermissionTenant from './PermissionTenant'
class RoleTenant {
    constructor() { }
    static getInstance(tenantId) {
        if (this.tenantId != tenantId) {
            this.tenantId = tenantId;
        }
        const schema = new mongoose_1.Schema({
            _id: {
                type: String,
            },
            name: {
                type: String,
                required: [true, 'Role name must be provided.'],
                index: true,
            },
            permissions: [
                {
                    type: String,
                },
            ],
            status: {
                type: String,
                enum: ['ACTIVE', 'INACTIVE'],
                default: 'ACTIVE',
            },
            description: {
                type: String,
            },
            company: {
                type: mongoose_1.Schema.Types.ObjectId,
            },
        }, { timestamps: true, versionKey: false });
        schema.plugin(mongoose_beautiful_unique_validation_1.default);
        let modelObject = mongoose_1.default.models[this.tenantId + '_role'];
        if (!modelObject) {
            modelObject = mongoose_1.default.model(this.tenantId + '_role', schema);
        }
        return modelObject;
    }
}
exports.default = RoleTenant;
//# sourceMappingURL=RoleTenant.js.map