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
exports.approvalFlowSchemaDefinition = void 0;
const ApprovalFlowGroup_1 = __importDefault(require("@/app/models/ApprovalFlowGroup"));
const User_1 = __importDefault(require("@/app/models/User"));
const constant_1 = require("@/app/utils/constant");
const bluebird_1 = __importDefault(require("bluebird"));
const mongoose_1 = __importStar(require("mongoose"));
const mongoose_autopopulate_1 = __importDefault(require("mongoose-autopopulate"));
const mongoose_beautiful_unique_validation_1 = __importDefault(require("mongoose-beautiful-unique-validation"));
exports.approvalFlowSchemaDefinition = {
    name: {
        type: String,
        required: true,
        trim: true,
    },
    type: {
        type: String,
        enum: constant_1.TYPE_TICKET_REQUEST.enum,
    },
    nodes: [
        {
            type: { type: String, enum: ['DirectManager', 'ApprovalFlowGroup'] },
            value: { type: String },
            data: { type: Object },
        },
    ],
    status: {
        type: String,
        enum: ['ACTIVE', 'INACTIVE'],
        default: 'ACTIVE',
    },
    company: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Company', required: true },
    location: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Location', required: true },
};
const approvalFlowSchema = new mongoose_1.default.Schema(exports.approvalFlowSchemaDefinition, {
    versionKey: false,
    timestamps: true,
});
// Make the group unique:
approvalFlowSchema.index({ name: 1, location: 1 }, { unique: [1, 'Name {VALUE} already exists'] });
approvalFlowSchema.set('toJSON', {
    transform: (_, ret) => {
        delete ret.__v;
        ret.id = ret._id;
    },
});
approvalFlowSchema.plugin(mongoose_beautiful_unique_validation_1.default);
approvalFlowSchema.plugin(mongoose_autopopulate_1.default);
approvalFlowSchema.post('findOne', (doc, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (doc) {
        yield bluebird_1.default.map(doc.nodes, (obj, _index) => __awaiter(void 0, void 0, void 0, function* () {
            const { type, value } = obj;
            if (type === 'User') {
                obj.data = yield User_1.default.findById(value);
            }
            if (type === 'ApprovalFlowGroup') {
                obj.data = yield ApprovalFlowGroup_1.default.findById(value);
            }
        }));
    }
    next();
}));
approvalFlowSchema.post('find', (docs, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield bluebird_1.default.map(docs, (doc, _index) => __awaiter(void 0, void 0, void 0, function* () {
        yield bluebird_1.default.map(doc.nodes, (obj, _index) => __awaiter(void 0, void 0, void 0, function* () {
            const { type, value } = obj;
            if (type === 'User') {
                obj.data = yield User_1.default.findById(value);
            }
            if (type === 'ApprovalFlowGroup') {
                obj.data = yield ApprovalFlowGroup_1.default.findById(value);
            }
        }));
    }));
    next();
}));
approvalFlowSchema.post('save', postSave);
const ApprovalFlow = mongoose_1.default.model('ApprovalFlow', approvalFlowSchema);
exports.default = ApprovalFlow;
/* Internal functions */
function postSave(doc, next) {
    return __awaiter(this, void 0, void 0, function* () {
        yield doc
            .populate([
            {
                path: 'nodes',
                select: constant_1.MODEL_POPULATE.approvalFlowGroup,
            },
        ])
            .execPopulate();
        yield bluebird_1.default.map(doc.nodes, (obj, _index) => __awaiter(this, void 0, void 0, function* () {
            const { type, value } = obj;
            if (type === 'ApprovalFlowGroup') {
                obj.data = yield ApprovalFlowGroup_1.default.findById(value);
            }
        }));
        next();
    });
}
//# sourceMappingURL=ApprovalFlow.js.map