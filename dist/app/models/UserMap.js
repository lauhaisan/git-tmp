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
const Bcrypt_1 = __importDefault(require("@/app/services/Bcrypt"));
const mongoose_1 = __importStar(require("mongoose"));
const mongoose_autopopulate_1 = __importDefault(require("mongoose-autopopulate"));
const mongoose_beautiful_unique_validation_1 = __importDefault(require("mongoose-beautiful-unique-validation"));
const schema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Attachment',
        autopopulate: { select: 'id url' },
    },
    firstName: {
        type: String,
        required: true,
    },
    manageTenant: [
        {
            type: String,
        },
    ],
    signInRole: [
        {
            type: String,
        },
    ],
    status: {
        type: String,
        default: 'INACTIVE',
    },
}, { timestamps: true, versionKey: false });
// tslint:disable-next-line:prettier
const comparePassword = function (candidatePassword) {
    return new Bcrypt_1.default(this.password).compare(candidatePassword);
};
schema.methods.comparePassword = comparePassword;
schema.plugin(mongoose_beautiful_unique_validation_1.default);
schema.plugin(mongoose_autopopulate_1.default);
exports.default = mongoose_1.default.model('UserMap', schema);
//# sourceMappingURL=UserMap.js.map