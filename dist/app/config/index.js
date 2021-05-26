"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("@/app/utils/logger"));
const utils_1 = require("@/app/utils/utils");
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const { env } = process;
class AppConfig {
    constructor() {
        this.UPLOAD = {
            availableMime: {
                image: [
                    'image/jpeg',
                    'image/jpg',
                    'image/png',
                    'image/svg+xml',
                    'image/tiff',
                    'image/webp',
                ],
                pdf: ['application/pdf'],
                xlsx: [
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                ],
                csv: ['text/csv'],
                language: ['application/json'],
            },
            path: {
                image: path_1.default.join(__dirname, '../public/images'),
                attachment: path_1.default.join(__dirname, '../store/attachments'),
                pdf: path_1.default.join(__dirname, '../store/pdfs'),
                language: path_1.default.join(__dirname, '../store/languages'),
                root: path_1.default.join(__dirname, '..'),
            },
            limits: {
                fileSize: {
                    image: 5 * 1024 * 1024,
                    attachment: 20 * 1024 * 1024,
                },
                maxCount: {
                    image: 5,
                    attachment: 1,
                },
            },
        };
        this.DEFAULT_ACCOUNT = '';
        this.opt = [
            { name: 'CONTAINER_NAME' },
            { name: 'INTRANET_HOST' },
            { name: 'HOST_URL' },
            { name: 'WEB_URL' },
            { name: 'ADMIN_URL' },
            { name: 'MOBILE_URL' },
            { name: 'DEFAULT_ACCOUNT' },
        ];
        this.requires = [
            {
                name: 'MONGODB_URI',
                check: (val) => utils_1.isString(val) && !utils_1.isBlank(val),
                message: 'No mongo connection string. Set MONGODB_URI environment variable.',
            },
            {
                name: 'SESSION_SECRET',
                check: (val) => utils_1.isString(val) && !utils_1.isBlank(val),
                message: 'No client secret. Set SESSION_SECRET environment variable.',
            },
            {
                name: 'EMAIL_SERVICE_ACCOUNT',
                check: (val) => utils_1.isString(val) && !utils_1.isBlank(val),
                message: 'No email service account. Set EMAIL_SERVICE_ACCOUNT',
            },
            {
                name: 'EMAIL_SERVICE_PASSWORD',
                check: (val) => utils_1.isString(val) && !utils_1.isBlank(val),
                message: 'No email service account. Set EMAIL_SERVICE_PASSWORD',
            },
            {
                name: 'EXCHANGE_API_KEY',
                check: (val) => utils_1.isString(val) && !utils_1.isBlank(val),
                message: 'No exhange api key. Set EXCHANGE_API_KEY environment variable. View more info at https://free.currencyconverterapi.com',
            },
            {
                name: 'EXCHANGE_URI',
                check: (val) => utils_1.isString(val) && !utils_1.isBlank(val),
                message: 'No exhange uri. Set EXCHANGE_URI environment variable. View more info at https://free.currencyconverterapi.com',
            },
            {
                name: 'EXCHANGE_KEY_2',
                check: (val) => utils_1.isString(val) && !utils_1.isBlank(val),
                message: 'No exhange uri. Set EXCHANGE_KEY_2 environment variable. View more info at https://openexchangerates.org',
            },
            {
                name: 'EXCHANGE_URI_2',
                check: (val) => utils_1.isString(val) && !utils_1.isBlank(val),
                message: 'No exhange uri. Set EXCHANGE_URI_2 environment variable. View more info at https://openexchangerates.org',
            },
        ];
        this.useDotEnv();
        this.processEnvironment();
    }
    useDotEnv() {
        if (!utils_1.isString(env.CONTAINER_NAME) || !utils_1.isBlank(env.CONTAINER_NAME)) {
            if (fs_1.default.existsSync('.env')) {
                logger_1.default.debug('Using .env file to supply config environment variables');
                dotenv_1.default.config({ path: '.env' });
            }
            else {
                logger_1.default.debug('Using .env.example file to supply config environment variables');
                dotenv_1.default.config({ path: '.env.example' }); // you can delete this after you create your own .env file!
            }
            this.ENVIRONMENT = env.NODE_ENV;
        }
    }
    processEnvironment() {
        try {
            ;
            [...this.opt, ...this.requires].forEach(declares => {
                const { name } = declares;
                const val = process.env[name];
                if (this.isRequireEnv(declares)) {
                    const { message, check } = declares;
                    if (!check(val))
                        throw new Error(message);
                }
                if (val)
                    this.setValue(name, val);
            });
        }
        catch (error) {
            logger_1.default.error(error.message);
            process.exit(1);
        }
    }
    isRequireEnv(val) {
        return val && val.name && val.message && val.check;
    }
    setValue(name, val) {
        Object.assign(this, { [name]: val });
    }
}
exports.default = new AppConfig();
//# sourceMappingURL=index.js.map