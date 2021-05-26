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
const AbstractController_1 = __importDefault(require("@/app/declares/AbstractController"));
// import { identity, pickBy } from 'lodash'
const path_1 = __importDefault(require("path"));
const puppeteer_1 = __importDefault(require("puppeteer"));
const v4_1 = __importDefault(require("uuid/v4"));
const AdvancedError_1 = __importDefault(require("../declares/AdvancedError"));
const Attachment_1 = __importDefault(require("../models/Attachment"));
const DocumentTenant_1 = __importDefault(require("../models/DocumentTenant"));
const TemplateTenant_1 = __importDefault(require("../models/TemplateTenant"));
const ResponseResult_1 = __importDefault(require("../services/ResponseResult"));
const UploadService_1 = __importDefault(require("../services/UploadService"));
const { UPLOAD } = index_1.default;
class TemplateTenantController extends AbstractController_1.default {
    constructor() {
        super(...arguments);
        this.filterEmptyField = (obj = {}) => {
            for (var propName in obj) {
                if (obj[propName] === null ||
                    obj[propName] === undefined ||
                    obj[propName] === '') {
                    delete obj[propName];
                }
            }
            return obj;
        };
    }
    // constructor(model: Model<ITemplate>) {
    //   super(model)
    // }
    generateMethods() {
        return [
            {
                name: 'get-by-id',
                type: 'POST',
                _ref: this.getByID.bind(this),
                validationSchema: {
                    id: {
                        in: 'body',
                        exists: {
                            errorMessage: ['required', 'Id is missing'],
                        },
                    },
                },
            },
            {
                name: 'get-default',
                type: 'POST',
                _ref: this.getDefault.bind(this),
            },
            {
                name: 'get-custom',
                type: 'POST',
                _ref: this.getCustom.bind(this),
            },
            {
                name: 'update',
                type: 'POST',
                _ref: this.update,
                validationSchema: {
                    id: {
                        in: 'body',
                        exists: {
                            errorMessage: ['required', 'Id is missing'],
                        },
                    },
                },
            },
            {
                name: 'offer-letter',
                type: 'POST',
                _ref: this.offerByCandidate.bind(this),
            },
            {
                name: 'list',
                type: 'POST',
                _ref: this.list.bind(this),
            },
            {
                name: 'add',
                type: 'POST',
                _ref: this.add.bind(this),
            },
            {
                name: 'remove',
                type: 'POST',
                _ref: this.remove.bind(this),
                validationSchema: {
                    id: {
                        in: 'body',
                        exists: {
                            errorMessage: ['required', 'Id is missing'],
                        },
                    },
                },
            },
        ];
    }
    getByID(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId, id } = req.body;
            const item = yield TemplateTenant_1.default.getInstance(tenantId)
                .findById(id)
                .exec();
            if (!item) {
                throw new AdvancedError_1.default({
                    item: { kind: 'not.found', message: 'Item not found' },
                });
            }
            res.send(new ResponseResult_1.default({
                data: item,
                message: 'Get item successfully',
            }));
        });
    }
    getDefault(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId } = req.body;
            const { type } = req.body;
            let filter = {
                type,
                default: true,
            };
            // filter = pickBy(filter, identity)
            const defaults = yield TemplateTenant_1.default.getInstance(tenantId).find(filter);
            if (defaults) {
                res.send(new ResponseResult_1.default({
                    message: 'Fetched default templates successfully',
                    data: defaults,
                }));
            }
            else {
                res.send(new AdvancedError_1.default({
                    template: {
                        kind: 'not.found',
                        message: 'System has not had any default templates yet',
                    },
                }));
            }
        });
    }
    getCustom(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId, type } = req.body;
            let filter = {
                type,
                default: false,
            };
            // filter = pickBy(filter, identity)
            const customs = yield TemplateTenant_1.default.getInstance(tenantId).find(filter);
            if (customs) {
                res.send(new ResponseResult_1.default({
                    message: 'Fetched custom templates successfully',
                    data: customs,
                }));
            }
            else {
                res.send(new AdvancedError_1.default({
                    template: {
                        kind: 'not.found',
                        message: 'System has not had any custom templates yet',
                    },
                }));
            }
        });
    }
    add(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId } = req.body;
            if (!tenantId) {
                throw new AdvancedError_1.default({
                    item: {
                        kind: 'not.found',
                        message: 'tenantId is not provided in body',
                    },
                });
            }
            this.filterEmptyField(req.body);
            req.body.settings = req.body.settings.filter((item) => item !== null || undefined);
            const { html, settings, fullname, signature } = req.body;
            const attachmentRes = yield Attachment_1.default.findById(signature);
            const PDF = yield this.generatePDF(html, settings, req.body.default, fullname, attachmentRes ? attachmentRes.toJSON().url : null);
            const { _id: userId } = req.user;
            req.body.fileName = PDF.fileName;
            req.body.filePath = PDF.filePath;
            const attachment = yield this.upload('attachments', userId, req.body, PDF.buffer);
            req.body.attachment = attachment;
            req.body.htmlContent = PDF.bodyHTML;
            req.body.thumbnail ? null : (req.body.thumbnail = attachment.url);
            req.body.settings = req.body.settings.filter((item) => !item.isEdited);
            const template = yield TemplateTenant_1.default.getInstance(tenantId).create(req.body);
            if (template)
                res.send(new ResponseResult_1.default({
                    message: 'Templated added successfully',
                    data: template,
                }));
        });
    }
    offerByCandidate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId } = req.body;
            this.filterEmptyField(req.body);
            const { templateId } = req.body;
            const template = yield TemplateTenant_1.default.getInstance(tenantId).findById(templateId);
            if (template) {
                const htmlBody = template.toJSON().htmlContent;
                const content = this.filterParams(req.body, ['templateId']);
                const settings = Object.keys(content).map(item => ({
                    key: item,
                    value: content[item],
                }));
                const PDF = yield this.generatePDF(htmlBody, settings, false);
                console.log('PDF', PDF);
                const { _id: userId } = req.user;
                req.body.fileName = PDF.fileName;
                req.body.filePath = PDF.filePath;
                req.body.title = `${req.body.candidateId}_Offer_Letter`;
                const attachment = yield this.upload('attachments', userId, req.body, PDF.buffer);
                res.send(new ResponseResult_1.default({
                    message: 'Successfully generated Offer Letter',
                    data: yield DocumentTenant_1.default.getInstance(tenantId).create({
                        key: req.body.title,
                        attachment,
                        candidate: req.body.candidateId,
                    }),
                }));
            }
            else {
                res.send(new AdvancedError_1.default({
                    template: {
                        kind: 'not.found',
                        message: 'Template not found',
                    },
                }));
            }
        });
    }
    generatePDF(html, settings, _default, fullname, signatureURL) {
        return __awaiter(this, void 0, void 0, function* () {
            const browser = yield puppeteer_1.default.launch({
                headless: true,
                args: ['--disable-web-security'],
            });
            const page = yield browser.newPage();
            yield page.setContent(html, { waitUntil: 'networkidle0' });
            if (settings && !_default) {
                yield page.evaluate((settings, fullname, signatureURL) => {
                    settings[0].map((item) => {
                        if (item) {
                            ;
                            [].slice
                                .call(document.querySelectorAll(`span[data-value='{{${item.key}}}']`))
                                .map((x) => {
                                x.innerText = item.value;
                                x.removeAttribute('data-value');
                                x.removeAttribute('style');
                            });
                            console.log(item.key);
                        }
                    });
                    if (fullname) {
                        const name = document.querySelector('#fullname');
                        if (name)
                            name.innerText = fullname;
                    }
                    if (signatureURL) {
                        const signaturePdf = document.querySelector('#signature');
                        if (signaturePdf) {
                            signaturePdf.innerHTML = `<img src="${signatureURL}" alt=""/>`;
                        }
                    }
                }, [settings, fullname || null, signatureURL || null]);
            }
            function imagesHaveLoaded() {
                return Array.from(document.images).every(i => i.complete);
            }
            yield page.waitForFunction(imagesHaveLoaded, { timeout: 30000 });
            const folder = UploadService_1.default.createFilePath(path_1.default.join(__dirname, '../store/pdfs'));
            const fileName = [v4_1.default(), 'pdf'].join('.');
            const filePath = [folder, fileName].join('/');
            const buffer = yield page.pdf({
                path: filePath,
                format: 'A4',
                printBackground: true,
                margin: {
                    left: '72px',
                    top: '72px',
                    right: '50px',
                    bottom: '139px',
                },
            });
            const bodyHTML = yield page.evaluate(() => document.body.innerHTML);
            yield browser.close();
            return { bodyHTML, fileName, filePath, buffer };
        });
    }
    upload(type, userId, content, buffer) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!content) {
                throw new AdvancedError_1.default({
                    content: {
                        kind: 'invalid',
                        message: 'Please provide your content',
                    },
                });
            }
            try {
                const attachment = yield Attachment_1.default.create({
                    name: [content.title, 'pdf'].join('.'),
                    category: type,
                    fileName: content.fileName,
                    path: content.filePath.replace(UPLOAD.path.root, ''),
                    type: 'application/pdf',
                    size: buffer.byteLength,
                    user: userId,
                });
                attachment.url = encodeURI(UploadService_1.default.getPublicUrl(attachment.category, attachment._id.toHexString(), attachment.name));
                yield attachment.save();
                return attachment;
            }
            catch (e) {
                return e;
            }
        });
    }
    remove(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId, id } = req.body;
            const item = yield TemplateTenant_1.default.getInstance(tenantId)
                .findById(id)
                .exec();
            if (!item) {
                throw new AdvancedError_1.default({
                    item: { kind: 'not.found', message: 'Item not found' },
                });
            }
            yield item.remove();
            res.send(new ResponseResult_1.default({
                message: 'Remove item successfully',
                data: item,
            }));
        });
    }
}
exports.default = new TemplateTenantController();
//# sourceMappingURL=TemplateTenantController.js.map