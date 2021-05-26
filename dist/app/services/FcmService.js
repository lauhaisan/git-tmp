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
exports.sendGroupNotification = exports.sendNotification = void 0;
const bluebird_1 = __importDefault(require("bluebird"));
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const expenso_2019_firebase_adminsdk_ws2zq_8334e61b31_json_1 = __importDefault(require("../../assets/expenso-2019-firebase-adminsdk-ws2zq-8334e61b31.json"));
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(expenso_2019_firebase_adminsdk_ws2zq_8334e61b31_json_1.default),
    databaseURL: 'https://expenso-2019.firebaseio.com',
});
exports.sendNotification = ({ fcmTokens, data, title, body, }) => __awaiter(void 0, void 0, void 0, function* () {
    if (!fcmTokens)
        throw new Error('fcmTokenList undefined');
    return bluebird_1.default.map(fcmTokens, token => {
        if (token) {
            firebase_admin_1.default.messaging().send({
                notification: {
                    title,
                    body,
                },
                data,
                token,
            });
        }
    });
});
exports.sendGroupNotification = ({ fcmTokens, title, body, }) => __awaiter(void 0, void 0, void 0, function* () {
    if (!fcmTokens)
        throw new Error('fcmTokenList undefined');
    return bluebird_1.default.map(fcmTokens, token => {
        if (token) {
            firebase_admin_1.default.messaging().send({
                notification: {
                    title,
                    body,
                },
                token,
            });
        }
    });
});
//# sourceMappingURL=FcmService.js.map