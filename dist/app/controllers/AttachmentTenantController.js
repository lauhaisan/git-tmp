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
// import AttachmentTenant from '@/app/models/AttachmentTenant'
const ResponseResult_1 = __importDefault(require("@/app/services/ResponseResult"));
const UploadService_1 = __importDefault(require("@/app/services/UploadService"));
const bluebird_1 = __importDefault(require("bluebird"));
const fs_1 = __importDefault(require("fs"));
const flatten_1 = __importDefault(require("lodash/flatten"));
const AttachmentTenant_1 = __importDefault(require("../models/AttachmentTenant"));
class AttachmentTenantController extends AbstractController_1.default {
    constructor() {
        super(...arguments);
        this.name = 'attachmenttenants';
    }
    /**
     * upload
     */
    setInstanceModel(_req) {
        return __awaiter(this, void 0, void 0, function* () {
            // const header = req.header('tenantId')
            // const tenantId = header ? header : ''
            // this.model = this.model ? this.model : new AttachmentTenant(tenantId).getModel()
            // this.AttachmentTenantModel = this.AttachmentTenantModel
            //   ? this.AttachmentTenantModel
            //   : this.model
        });
    }
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
    uploadImage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { files, user } = req;
            const { _id: userId } = user;
            this.setInstanceModel(req);
            res.send(new ResponseResult_1.default({
                message: 'Upload Image',
                data: yield this.upload(req, 'images', userId, files),
            }));
        });
    }
    /**
     * uploadAttachment
     */
    uploadAttachment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { files, user } = req;
            this.setInstanceModel(req);
            const { _id: userId } = user;
            res.send(new ResponseResult_1.default({
                message: 'Upload Image',
                data: yield this.upload(req, 'attachments', userId, files),
            }));
        });
    }
    /**
     * languages
     */
    uploadLanguage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { files, user } = req;
            this.setInstanceModel(req);
            const { _id: userId } = user;
            res.send(new ResponseResult_1.default({
                message: 'Upload Language',
                data: yield this.upload(req, 'language', userId, files),
            }));
        });
    }
    upload(req, type, userId, files) {
        return __awaiter(this, void 0, void 0, function* () {
            //const tenantId: any = req.header('tenantId')
            const { tenantId } = req.body;
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
                    const attachment = yield AttachmentTenant_1.default.getInstance(tenantId).create({
                        name: file.originalname,
                        category: type,
                        fileName: file.filename,
                        path: file.path.replace(UPLOAD.path.root, ''),
                        type: file.mimetype,
                        size: file.size,
                        user: userId,
                    });
                    return attachment.toObject();
                }
                catch (e) {
                    return e;
                }
            }));
            return result;
        });
    }
    getAttachment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tenantId = req.header('tenantId');
            const { params: { id }, } = req;
            this.setInstanceModel(req);
            const attachment = yield AttachmentTenant_1.default.getInstance(tenantId)
                .findOne({
                _id: id,
            })
                .exec();
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
exports.default = new AttachmentTenantController();
//# sourceMappingURL=AttachmentTenantController.js.map