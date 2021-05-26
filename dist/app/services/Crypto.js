"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
class Crypto {
    static encrypt(text) {
        const iv = crypto_1.default.randomBytes(this.IV_LENGTH);
        const bufferPassword = Buffer.from(this.password, 'utf8');
        const cipher = crypto_1.default.createCipheriv(this.algorithm, bufferPassword, iv);
        let encrypted = cipher.update(Buffer.from(String(text), 'utf8'));
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
    }
    static decrypt(text) {
        if (typeof text !== 'string' || text.split(':').length !== 2) {
            return text;
        }
        const textParts = text.split(':');
        const iv = Buffer.from(textParts.shift(), 'hex');
        const bufferPassword = Buffer.from(this.password, 'utf8');
        const encryptedText = Buffer.from(textParts.join(':'), 'hex');
        const decipher = crypto_1.default.createDecipheriv(this.algorithm, bufferPassword, iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    }
}
exports.default = Crypto;
Crypto.algorithm = 'aes-256-cbc';
Crypto.password = '5f4dcc3b5aa765d61d8327deb882cf99';
Crypto.IV_LENGTH = 16; // For AES, this is always 16
//# sourceMappingURL=Crypto.js.map