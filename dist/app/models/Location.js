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
const mongoose_1 = __importStar(require("mongoose"));
const mongoose_autopopulate_1 = __importDefault(require("mongoose-autopopulate"));
const mongoose_beautiful_unique_validation_1 = __importDefault(require("mongoose-beautiful-unique-validation"));
const locationSchemaDefinition = {
    name: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 125,
    },
    logoUrl: {
        type: String,
    },
    unicodeIcon: {
        type: String,
        minlength: 2,
        maxlength: 16,
    },
    address: { type: String },
    country: {
        type: String,
        ref: 'Country',
        autopopulate: {
            select: 'name _id',
        },
    },
    state: { type: String },
    zipCode: { type: String },
    headQuarterAddress: {
        address: { type: String },
        state: { type: String },
        zipCode: { type: String },
    },
    legalAddress: {
        address: { type: String },
        state: { type: String },
        zipCode: { type: String },
    },
    isHeadQuarter: { type: Boolean, default: false },
    phone: {
        type: String,
    },
    code: { type: String, default: '' },
    status: {
        type: String,
        enum: ['ACTIVE', 'INACTIVE'],
        default: 'ACTIVE',
    },
    company: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Company',
        required: true,
        autopopulate: {
            select: '-createdAt -updatedAt -suiteEdition',
        },
    },
};
const locationSchema = new mongoose_1.default.Schema(locationSchemaDefinition, {
    versionKey: false,
    timestamps: true,
    toJSON: { minimize: true, virtuals: true },
    toObject: { minimize: true, virtuals: true },
});
locationSchema.plugin(mongoose_beautiful_unique_validation_1.default);
locationSchema.plugin(mongoose_autopopulate_1.default);
locationSchema.post('save', postSave);
const Location = mongoose_1.default.model('Location', locationSchema);
exports.default = Location;
function postSave(doc, next) {
    return __awaiter(this, void 0, void 0, function* () {
        yield doc
            .populate([
            {
                path: 'country',
                select: 'id',
            },
            {
                path: 'company',
                select: 'id',
            },
        ])
            .execPopulate();
        next();
    });
}
//# sourceMappingURL=Location.js.map