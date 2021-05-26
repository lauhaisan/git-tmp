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
exports.typeFields = void 0;
const utils_1 = require("@/app/utils/utils");
const CommonValidateField_1 = require("@/app/validates/CommonValidateField");
const mongoose_1 = __importStar(require("mongoose"));
const mongoose_beautiful_unique_validation_1 = __importDefault(require("mongoose-beautiful-unique-validation"));
const typeSchemaDefinition = {
    status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
    thumbnailUrl: {
        required: true,
        type: String,
        validate: CommonValidateField_1.validateImageType,
    },
    type: {
        required: true,
        type: String,
        validate: {
            validator(v) {
                return __awaiter(this, void 0, void 0, function* () {
                    const { _id } = this;
                    const existType = yield Type.findOne(Object.assign(Object.assign({}, (_id ? { _id: { $ne: _id } } : {})), { type: new RegExp(v, 'i') }))
                        .select({ _id: 1 })
                        .lean()
                        .exec();
                    return !existType;
                });
            },
            msg: 'Type ({VALUE}) already exists',
            type: 'unique',
        },
    },
    company: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Company' },
    location: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Location' },
};
const typeSchema = new mongoose_1.default.Schema(typeSchemaDefinition, {
    timestamps: true,
    versionKey: false,
});
exports.typeFields = utils_1.generateFields(typeSchema, typeSchemaDefinition, [
    'type',
    'status',
]);
typeSchema.plugin(mongoose_beautiful_unique_validation_1.default);
typeSchema.set('toJSON', {
    transform: (_, ret) => {
        delete ret.__v;
        ret.id = ret._id;
        delete ret._id;
    },
});
const Type = mongoose_1.default.model('Type', typeSchema);
exports.default = Type;
//# sourceMappingURL=Type.js.map