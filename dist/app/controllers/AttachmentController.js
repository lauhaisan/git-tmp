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
const { UPLOAD } = index_1.default;
const AbstractController_1 = __importDefault(require("@/app/declares/AbstractController"));
const AdvancedError_1 = __importDefault(require("@/app/declares/AdvancedError"));
const Attachment_1 = __importDefault(require("@/app/models/Attachment"));
const ResponseResult_1 = __importDefault(require("@/app/services/ResponseResult"));
const UploadService_1 = __importDefault(require("@/app/services/UploadService"));
const bluebird_1 = __importDefault(require("bluebird"));
const fs_1 = __importDefault(require("fs"));
const flatten_1 = __importDefault(require("lodash/flatten"));
class AttachmentController extends AbstractController_1.default {
    constructor() {
        super(...arguments);
        this.name = 'attachments';
    }
    /**
     * upload
     */
    generateMethods() {
        return [
            {
                name: 'upload-image',
                type: 'POST',
                middleware: [UploadService_1.default.setUploader({ type: 'image' }).any()],
                _ref: this.uploadImage.bind(this),
            },
            {
                name: 'upload',
                type: 'POST',
                middleware: [UploadService_1.default.setUploader({ type: 'attachment' }).any()],
                _ref: this.uploadAttachment.bind(this),
            },
            {
                name: 'upload-language',
                type: 'POST',
                middleware: [UploadService_1.default.setUploader({ type: 'language' }).any()],
                _ref: this.uploadLanguage.bind(this),
            },
            {
                name: ':id/:filename',
                type: 'GET',
                authorized: false,
                _ref: this.getAttachment.bind(this),
            },
            {
                name: 'images/:id/:filename',
                isRoot: true,
                authorized: false,
                type: 'GET',
                _ref: this.getAttachment.bind(this),
            },
        ];
    }
    uploadImage({ files, user }, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { _id: userId } = user;
            res.send(new ResponseResult_1.default({
                message: 'Upload Image',
                data: yield this.upload('images', userId, files),
            }));
        });
    }
    /**
     * uploadAttachment
     */
    uploadAttachment({ files, user }, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { _id: userId } = user;
            res.send(new ResponseResult_1.default({
                message: 'Upload Image',
                data: yield this.upload('attachments', userId, files),
            }));
        });
    }
    /**
     * languages
     */
    uploadLanguage({ files, user }, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { _id: userId } = user;
            res.send(new ResponseResult_1.default({
                message: 'Upload Language',
                data: yield this.upload('language', userId, files),
            }));
        });
    }
    upload(type, userId, files) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!files) {
                throw new AdvancedError_1.default({
                    files: {
                        kind: 'invalid',
                        message: 'Please provide your files',
                    },
                });
            }
            let fileList = [];
            if (Array.isArray(files)) {
                fileList = files;
            }
            else {
                fileList = flatten_1.default(Object.keys(files).map(fieldName => files[fieldName]));
            }
            const result = yield bluebird_1.default.map(fileList, (file) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const attachment = yield Attachment_1.default.create({
                        name: file.originalname,
                        category: type,
                        fileName: file.filename,
                        path: file.path.replace(UPLOAD.path.root, ''),
                        type: file.mimetype,
                        size: file.size,
                        user: userId,
                    });
                    attachment.url = encodeURI(UploadService_1.default.getPublicUrl(attachment.category, attachment._id.toHexString(), attachment.name));
                    yield attachment.save();
                    return attachment.toObject();
                }
                catch (e) {
                    return e;
                }
            }));
            return result;
        });
    }
    getAttachment({ params: { id } }, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const attachment = yield Attachment_1.default.findOne({ _id: id }).exec();
            if (!attachment) {
                res.writeHead(404, { 'Content-Type': 'text' });
                res.write('File Not Found!');
                res.end();
            }
            else {
                attachment.path = `${UPLOAD.path.root}${attachment.path}`;
                fs_1.default.readFile(attachment.path, (err, content) => {
                    if (err) {
                        res.writeHead(404, { 'Content-Type': 'text' });
                        res.write('File Not Found!');
                        res.end();
                    }
                    else {
                        res.writeHead(200, { 'Content-Type': attachment.type });
                        res.write(content);
                        res.end();
                    }
                });
            }
        });
    }
}
exports.default = new AttachmentController(Attachment_1.default);
//# sourceMappingURL=AttachmentController.js.map