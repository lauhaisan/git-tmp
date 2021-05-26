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
exports.countrySchemaDefinition = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const mongoose_autopopulate_1 = __importDefault(require("mongoose-autopopulate"));
const mongoose_beautiful_unique_validation_1 = __importDefault(require("mongoose-beautiful-unique-validation"));
exports.countrySchemaDefinition = {
    _id: {
        type: String,
        uppercase: true,
        minlength: 1,
    },
    name: { type: String, maxlength: 255 },
    alpha2Code: { type: String, maxlength: 255 },
    alpha3Code: { type: String, maxlength: 255 },
    capital: { type: String, maxlength: 255 },
    region: { type: String, maxlength: 255 },
    subregion: { type: String, maxlength: 255 },
    population: { type: String, maxlength: 255 },
    demonym: { type: String, maxlength: 255 },
    nativeName: { type: String, maxlength: 255 },
    numericCode: { type: String, maxlength: 255 },
    flag: { type: String, maxlength: 255 },
    cioc: { type: String, maxlength: 255 },
    area: { type: Number },
    gini: { type: Number },
    topLevelDomain: { type: Object },
    callingCodes: { type: Object },
    altSpellings: { type: Object },
    latlng: { type: Object },
    timezones: { type: Object },
    borders: { type: Object },
    currencies: { type: Object },
    languages: { type: Object },
    translations: { type: Object },
    regionalBlocs: { type: Object },
    status: {
        type: String,
        enum: ['ACTIVE', 'INACTIVE', 'DELETED'],
        default: 'ACTIVE',
    },
    states: [
        {
            type: String,
        },
    ],
};
const countrySchema = new mongoose_1.Schema(exports.countrySchemaDefinition, {
    timestamps: true,
    versionKey: false,
});
countrySchema.plugin(mongoose_beautiful_unique_validation_1.default);
countrySchema.plugin(mongoose_autopopulate_1.default);
const Country = mongoose_1.default.model('Country', countrySchema);
exports.default = Country;
//# sourceMappingURL=Country.js.map