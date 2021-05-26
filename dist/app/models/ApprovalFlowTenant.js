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
const ApprovalFlowGroupTenant_1 = __importDefault(require("@/app/models/ApprovalFlowGroupTenant"));
const UserTenant_1 = __importDefault(require("@/app/models/UserTenant"));
const constant_1 = require("@/app/utils/constant");
const bluebird_1 = __importDefault(require("bluebird"));
const mongoose_1 = __importStar(require("mongoose"));
const mongoose_autopopulate_1 = __importDefault(require("mongoose-autopopulate"));
const mongoose_beautiful_unique_validation_1 = __importDefault(require("mongoose-beautiful-unique-validation"));
// import CompanyTenant from './CompanyTenant'
// import LocationTenant from './LocationTenant'
class ApprovalFlowTenant {
    constructor() { }
    static getInstance(tenantId) {
        if (this.tenantId != tenantId) {
            this.tenantId = tenantId;
        }
        let UserTenantModel;
        let ApprovalFlowGroupTenantModel;
        const setInstanceModel = (tenantId) => {
            UserTenantModel = UserTenantModel
                ? UserTenantModel
                : UserTenant_1.default.getInstance(tenantId);
            ApprovalFlowGroupTenantModel = ApprovalFlowGroupTenantModel
                ? ApprovalFlowGroupTenantModel
                : ApprovalFlowGroupTenant_1.default.getInstance(tenantId);
        };
        setInstanceModel(this.tenantId);
        const schema = new mongoose_1.Schema({
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
                    type: {
                        type: String,
                        enum: ['DirectManager', 'ApprovalFlowGroup'],
                    },
                    value: { type: String },
                    data: { type: Object },
                },
            ],
            status: {
                type: String,
                enum: ['ACTIVE', 'INACTIVE'],
                default: 'ACTIVE',
            },
            company: {
                type: mongoose_1.Schema.Types.ObjectId,
                //ref: CompanyTenant.getInstance(this.tenantId),
                required: true,
            },
            location: {
                type: mongoose_1.Schema.Types.ObjectId,
                //ref: () => LocationTenant.getInstance(this.tenantId),
                required: true,
            },
        }, { timestamps: true, versionKey: false });
        // Make the group unique:
        schema.index({ name: 1, location: 1 }, { unique: [1, 'Name {VALUE} already exists'] });
        schema.set('toJSON', {
            transform: (_, ret) => {
                delete ret.__v;
                ret.id = ret._id;
            },
        });
        schema.plugin(mongoose_beautiful_unique_validation_1.default);
        schema.plugin(mongoose_autopopulate_1.default);
        schema.post('findOne', (doc, next) => __awaiter(this, void 0, void 0, function* () {
            if (doc) {
                yield bluebird_1.default.map(doc.nodes, (obj, _index) => __awaiter(this, void 0, void 0, function* () {
                    const { type, value } = obj;
                    if (type === 'UserTenant') {
                        obj.data = yield UserTenantModel.findById(value);
                    }
                    if (type === 'ApprovalFlowGroupTenant') {
                        obj.data = yield ApprovalFlowGroupTenantModel.findById(value);
                    }
                }));
            }
            next();
        }));
        schema.post('find', (docs, next) => __awaiter(this, void 0, void 0, function* () {
            yield bluebird_1.default.map(docs, (doc, _index) => __awaiter(this, void 0, void 0, function* () {
                yield bluebird_1.default.map(doc.nodes, (obj, _index) => __awaiter(this, void 0, void 0, function* () {
                    const { type, value } = obj;
                    if (type === 'UserTenant') {
                        obj.data = yield UserTenantModel.findById(value);
                    }
                    if (type === 'ApprovalFlowGroupTenant') {
                        obj.data = yield ApprovalFlowGroupTenantModel.findById(value);
                    }
                }));
            }));
            next();
        }));
        schema.post('save', postSave);
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
                    if (type === 'ApprovalFlowGroupTenant') {
                        obj.data = yield ApprovalFlowGroupTenantModel.findById(value);
                    }
                }));
                next();
            });
        }
        let modelObject = mongoose_1.default.models[this.tenantId + '_approvalflow'];
        if (!modelObject) {
            modelObject = mongoose_1.default.model(this.tenantId + '_approvalflow', schema);
        }
        return modelObject;
    }
}
exports.default = ApprovalFlowTenant;
//# sourceMappingURL=ApprovalFlowTenant.js.map