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
// import User from '@/app/models/User'
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UserMap_1 = __importDefault(require("../models/UserMap"));
class TokenGenerator {
    constructor(secret = '', options) {
        this.secret = secret;
        this.options = options || {}; // algorithm + keyid + noTimestamp + expiresIn + notBefore
    }
    /**
     * sign
     */
    sign(payload, signOptions) {
        const jwtSignOptions = Object.assign({}, signOptions, this.options);
        return jsonwebtoken_1.default.sign(payload, this.secret, jwtSignOptions);
    }
    refresh(token, refreshOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            const email = refreshOptions && typeof refreshOptions.email === 'string'
                ? refreshOptions.email.slice(0)
                : false;
            delete refreshOptions.email;
            const jwtSignOptions = Object.assign({}, refreshOptions, this.options);
            const payload = jsonwebtoken_1.default.verify(token, this.secret, jwtSignOptions);
            const user = yield UserMap_1.default.findById(payload.id).exec();
            if (!user)
                throw new Error('User not found refresh.');
            if (user.email !== email) {
                throw new Error('Token is invalid.');
            }
            delete payload.iat;
            delete payload.exp;
            delete payload.nbf;
            delete payload.jti;
            return jsonwebtoken_1.default.sign(payload, this.secret, jwtSignOptions);
        });
    }
}
exports.default = TokenGenerator;
//# sourceMappingURL=TokenGeneratorTenant.js.map