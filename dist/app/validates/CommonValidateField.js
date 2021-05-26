"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isISO31661Alpha3 = exports.isISO31661Alpha2 = exports.validateImageType = exports.validateEmail = exports.validatePhoneNumber = void 0;
const mongoose_validator_1 = __importDefault(require("mongoose-validator"));
exports.validatePhoneNumber = mongoose_validator_1.default({
    validator: 'isMobilePhone',
    type: 'isMobilePhone',
    passIfEmpty: true,
    arguments: 'any',
    message: '{PATH} is invalid',
});
exports.validateEmail = mongoose_validator_1.default({
    validator: 'isEmail',
    type: 'isEmail',
    passIfEmpty: true,
    message: '{PATH} is invalid',
});
exports.validateImageType = mongoose_validator_1.default({
    type: 'isURLImage',
    validator: (v) => typeof v === 'string' && /\.(jpg|jpeg|png|gif)$/i.test(v),
    message: 'Please provide a valid image URL',
    passIfEmpty: true,
});
exports.isISO31661Alpha2 = mongoose_validator_1.default({
    validator: 'isISO31661Alpha2',
    type: 'isISO31661Alpha2',
    passIfEmpty: true,
    message: 'Please provide a valid code (alpha-2 code).',
});
exports.isISO31661Alpha3 = mongoose_validator_1.default({
    validator: 'isISO31661Alpha3',
    type: 'isISO31661Alpha3',
    passIfEmpty: true,
    message: 'Please provide a valid alpha-3 code.',
});
//# sourceMappingURL=CommonValidateField.js.map