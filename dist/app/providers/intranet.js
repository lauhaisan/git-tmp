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
const { INTRANET_HOST } = index_1.default;
const User_1 = __importDefault(require("@/app/models/User"));
const Bcrypt_1 = __importDefault(require("@/app/services/Bcrypt"));
const request_1 = __importDefault(require("@/app/utils/request"));
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = __importDefault(require("passport-local"));
const LocalStrategy = passport_local_1.default.Strategy;
const parseMessage = (error) => {
    const { statusCode, message } = error;
    const messageObject = {
        400: { password: { kind: 'invalid', message: 'Invalid password' } },
        401: { email: { kind: 'invalid', message: 'Email invalid' } },
        402: { token: { kind: 'invalid', message: 'Token invalid' } },
        403: {
            manager: {
                kind: 'fail',
                message: 'Process manager of employee is failed',
            },
        },
    };
    return messageObject[statusCode] || { register: { kind: 'fail', message } };
};
function isIOauthIntranetType(result) {
    return !result.httpErrorCode;
}
/**
 * Call login intranet api
 */
const loginIntranet = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield request_1.default(`${INTRANET_HOST}/oauth/token`, {
        method: 'post',
        requestType: 'form',
        data: {
            username: email,
            password,
            grant_type: 'password',
            client_id: 'restapp',
            client_secret: 'restapp',
            token_device: Math.random() * 10e16,
            api_key: '2312322',
        },
    });
    if (!isIOauthIntranetType(result)) {
        throw { statusCode: result.httpErrorCode };
    }
    const { value } = result;
    if (!value || value === 'null') {
        throw { statusCode: 402 };
    }
    return result;
});
/**
 * Call employee details api
 * Target: get manager information to assign to user on local db
 */
const getManagerOfEmployee = (pssid) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield request_1.default(`${INTRANET_HOST}/public/api/GetSupervisorByEmployeeId`, {
            headers: {
                Accept: 'application/json',
            },
            params: {
                pssid,
            },
        });
        const { employeeDetail } = response;
        if (!employeeDetail ||
            !employeeDetail.mId ||
            !employeeDetail.managerEmail) {
            return undefined;
        }
        const { employeeDetail: { mId, managerName, managerEmail, managerID, designation, }, } = response;
        const nameArray = managerName.split(' ');
        const [firstName, lastName, ...middleName] = nameArray;
        let manager = yield User_1.default.findOne({ email: managerEmail }).exec();
        const modifyObject = {
            firstName,
            lastName,
            email: managerEmail,
            middleName: Array.isArray(middleName) ? middleName.join(' ') : '',
            title: designation,
            userCode: managerID,
        };
        if (!manager)
            manager = new User_1.default({ _id: mId });
        manager.set(modifyObject);
        yield manager.save();
        return manager._id;
    }
    catch (err) {
        throw { statusCode: 403 };
    }
});
const getUser = (email, password, additionalInformation) => __awaiter(void 0, void 0, void 0, function* () {
    const { userCode, userId, locationId: location } = additionalInformation;
    let { mId } = additionalInformation;
    if (!mId) {
        mId = yield getManagerOfEmployee(userCode);
    }
    let user = yield User_1.default.findOne({ email }).exec();
    if (!user)
        user = new User_1.default({ _id: userId });
    user.set(Object.assign(Object.assign({}, additionalInformation), { email, manager: mId, password: yield new Bcrypt_1.default(password).hash(), location }));
    return user.save();
});
/**
 * Sign in using Email and Password via Intranet-API.
 */
passport_1.default.use('intranet-local', new LocalStrategy({ usernameField: 'email' }, (email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    let err;
    let user;
    try {
        const { additionalInformation } = yield loginIntranet(email, password);
        user = yield getUser(email, password, additionalInformation);
    }
    catch (error) {
        err = parseMessage(error);
    }
    return done(err, user);
})));
//# sourceMappingURL=intranet.js.map