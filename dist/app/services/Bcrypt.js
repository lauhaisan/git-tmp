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
const bcrypt_1 = __importDefault(require("bcrypt"));
class Hash {
    constructor(originStr, rounds = 10) {
        this.rounds = rounds;
        this.originStr = originStr;
    }
    hash() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => bcrypt_1.default.hash(this.originStr, this.rounds, (err, hash) => {
                return err ? reject(err) : resolve(hash);
            }));
        });
    }
    compare(candidatePassword) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => bcrypt_1.default.compare(candidatePassword, this.originStr, (err, isMatch) => {
                return err ? reject(err) : resolve(isMatch);
            }));
        });
    }
}
exports.default = Hash;
//# sourceMappingURL=Bcrypt.js.map