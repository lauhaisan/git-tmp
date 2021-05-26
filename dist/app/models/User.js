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
exports.PrivateFields = void 0;
const Bcrypt_1 = __importDefault(require("@/app/services/Bcrypt"));
const mongoose_1 = __importStar(require("mongoose"));
const mongoose_autopopulate_1 = __importDefault(require("mongoose-autopopulate"));
const mongoose_beautiful_unique_validation_1 = __importDefault(require("mongoose-beautiful-unique-validation"));
exports.PrivateFields = {
    email: {
        type: String,
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'INACTIVE'],
        default: 'ACTIVE',
    },
    employee: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Employee',
        autopopulate: {
            select: 'company',
        },
    },
    candidate: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Candidate' },
    roles: {
        type: [{ type: String, ref: 'Role' }],
        default: ['EMPLOYEE'],
    },
    firstCreated: {
        type: Boolean,
        default: false,
    },
};
const userSchema = new mongoose_1.default.Schema(Object.assign(Object.assign({}, exports.PrivateFields), { password: { type: String }, fcmToken: String }), {
    versionKey: false,
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
// Make the group unique:
userSchema.index({ email: 1, company: 1 }, { unique: [1, 'Email {VALUE} already exists'] });
userSchema.plugin(mongoose_beautiful_unique_validation_1.default);
userSchema.plugin(mongoose_autopopulate_1.default);
userSchema.pre('findOne', preFindUser);
userSchema.pre('findByIdAndUpdate', preFindUser);
userSchema.pre('find', preFindManyUser);
userSchema.post('findOne', postFindOne);
userSchema.post('save', postSave);
// tslint:disable-next-line:prettier
const comparePassword = function (candidatePassword) {
    return new Bcrypt_1.default(this.password).compare(candidatePassword);
};
userSchema.methods.comparePassword = comparePassword;
// tslint:disable-next-line:prettier
const hasPermission = function (possiblePermissions) {
    if (!possiblePermissions)
        return true;
    let { roles } = this;
    if (roles && !Array.isArray(roles))
        roles = [roles];
    let hasPer = false;
    hasPer = roles.some((role) => {
        const { permissions: ownPers = [], _id } = role;
        if (_id === 'ADMIN-SA')
            return true;
        return possiblePermissions.some(per => ownPers.includes(per));
    });
    return hasPer;
};
userSchema.methods.hasPermission = hasPermission;
// tslint:disable-next-line:prettier
const hasRoles = function (subRoles) {
    let { roles } = this;
    if (roles && !Array.isArray(roles))
        roles = [roles];
    const hasRoles = roles.some((role) => subRoles.includes(role.id));
    return hasRoles;
};
userSchema.methods.hasRoles = hasRoles;
userSchema.set('toJSON', {
    transform: (_user, ret) => {
        delete ret.__v;
        ret.id = ret._id;
        delete ret.password;
        for (const v in ret) {
            if (!ret[v])
                delete ret[v];
        }
    },
});
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;
// Manual functions:
function postFindOne(doc, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (doc) {
        }
        next();
    });
}
function postSave(doc, next) {
    return __awaiter(this, void 0, void 0, function* () {
        yield doc
            .populate([
            {
                path: 'roles',
            },
        ])
            .execPopulate();
        next();
    });
}
function preFindUser(next) {
    const populateList = [
        {
            path: 'roles',
        },
    ];
    this.populate(populateList);
    next();
}
function preFindManyUser(next) {
    const populateList = [
        {
            path: 'roles',
        },
    ];
    this.populate(populateList);
    next();
}
//# sourceMappingURL=User.js.map