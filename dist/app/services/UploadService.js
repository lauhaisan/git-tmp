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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("@/app/config/index"));
const { HOST_URL, UPLOAD } = index_1.default;
const flatten_1 = __importDefault(require("lodash/flatten"));
const mime_types_1 = __importDefault(require("mime-types"));
const multer_1 = __importStar(require("multer"));
const path_1 = __importDefault(require("path"));
const shell = __importStar(require("shelljs"));
const v4_1 = __importDefault(require("uuid/v4"));
class UploadService {
    /**
     * getYearMonth
     */
    static getYearMonth() {
        const date = new Date();
        return path_1.default.join(date.getFullYear().toString(), String(date.getMonth() + 1));
    }
    /**
     * createFilePath
     * @param {String} rootPath
     * @param {String | undefined} fileName
     */
    static createFilePath(rootPath, filename) {
        const filePath = path_1.default.join(rootPath, this.getYearMonth());
        if (!shell.test('-e', filePath)) {
            shell.mkdir('-p', filePath);
        }
        return [filePath, filename].filter(v => !!v).join('/');
    }
    /**
     * setUploader
     */
    static setUploader(options) {
        const that = this;
        const storage = multer_1.diskStorage({
            destination(_req, _file, cb) {
                cb(null, that.createFilePath(UPLOAD.path[options.type]));
            },
            filename(_req, file, cb) {
                const ext = mime_types_1.default.extension(file.mimetype);
                cb(null, [v4_1.default(), ext].join('.'));
            },
        });
        const upload = multer_1.default({
            limits: {
                fileSize: UPLOAD.limits.fileSize[options.type],
                files: UPLOAD.limits.maxCount[options.type],
            },
            storage,
            fileFilter: (_req, file, cb) => {
                try {
                    if (!flatten_1.default(Object.keys(UPLOAD.availableMime).map(field => UPLOAD.availableMime[field])).includes(file.mimetype)) {
                        throw new Error('Uploaded file is not a valid image. Only image and pdf');
                    }
                    cb(null, true);
                }
                catch (error) {
                    cb(error, false);
                }
            },
        });
        return upload;
    }
    /**
     * Get public URL of a file. The file must have public access
     * @param {string} filePath
     */
    static getPublicUrl(category, objectId, originFileName) {
        return [HOST_URL, `api/${category}`, objectId, originFileName].join('/');
    }
}
exports.default = UploadService;
//# sourceMappingURL=UploadService.js.map