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
const index_1 = __importDefault(require("@/app/config/index"));
const { SESSION_SECRET } = index_1.default;
const User_1 = __importDefault(require("@/app/models/User"));
const passport_1 = __importDefault(require("passport"));
const passport_jwt_1 = __importDefault(require("passport-jwt"));
const UserMap_1 = __importDefault(require("../models/UserMap"));
const ExtractJWT = passport_jwt_1.default.ExtractJwt;
const JWTStrategy = passport_jwt_1.default.Strategy;
function jwtStrategy(options) {
    let defaultOptions = {
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: SESSION_SECRET,
    };
    if (typeof options === 'object') {
        defaultOptions = Object.assign(Object.assign({}, defaultOptions), options);
    }
    return new JWTStrategy(defaultOptions, ({ id }, cb) => __awaiter(this, void 0, void 0, function* () {
        // find the user in db if needed
        let user;
        let err;
        try {
            user = yield User_1.default.findById(id).exec();
            if (!user) {
                throw { user: { kind: 'not.found', message: 'User not found.' } };
            }
        }
        catch (errors) {
            err = errors;
        }
        return cb(err, user);
    }));
}
const JWTStrategyTenant = passport_jwt_1.default.Strategy;
function jwtStrategyTenant(options) {
    let defaultOptions = {
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: SESSION_SECRET,
    };
    if (typeof options === 'object') {
        defaultOptions = Object.assign(Object.assign({}, defaultOptions), options);
    }
    return new JWTStrategyTenant(defaultOptions, ({ id }, cb) => __awaiter(this, void 0, void 0, function* () {
        // find the user in db if needed
        let user;
        let err;
        try {
            user = yield UserMap_1.default.findById(id).exec();
            if (!user) {
                throw { user: { kind: 'not.found', message: 'User not found.' } };
            }
        }
        catch (errors) {
            err = errors;
        }
        return cb(err, user);
    }));
}
passport_1.default.use(jwtStrategy());
passport_1.default.use('jwt-ignoreExpiration', jwtStrategy({ ignoreExpiration: true }));
passport_1.default.use(jwtStrategyTenant());
passport_1.default.use('jwt-ignoreExpiration', jwtStrategyTenant({ ignoreExpiration: true }));
//# sourceMappingURL=jwt.js.map