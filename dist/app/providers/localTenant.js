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
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = __importDefault(require("passport-local"));
const UserMap_1 = __importDefault(require("../models/UserMap"));
const Bcrypt_1 = __importDefault(require("../services/Bcrypt"));
const LocalStrategy = passport_local_1.default.Strategy;
passport_1.default.use('localTenant', new LocalStrategy({ usernameField: 'email', passReqToCallback: true }, ({}, email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    let err;
    let user;
    try {
        user = yield UserMap_1.default.findOne({
            email: email,
            status: 'ACTIVE',
        }).exec();
        if (!user) {
            throw {
                user: {
                    kind: 'invalid',
                    message: 'Invalid user',
                },
            };
        }
        const isMatch = user && (yield new Bcrypt_1.default(user.password).compare(password));
        if (!isMatch) {
            throw {
                password: {
                    kind: 'invalid',
                    message: 'Invalid password',
                },
            };
        }
    }
    catch (error) {
        err = error;
    }
    return done(err, user);
})));
//# sourceMappingURL=localTenant.js.map