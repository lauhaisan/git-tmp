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
const AdvancedError_1 = __importDefault(require("@/app/declares/AdvancedError"));
const countryDefault_1 = __importDefault(require("@/app/inits/countryDefault"));
// import CountryPolicyDefault from '@/app/inits/countryPolicyDefault'
const departmentDefault_1 = __importDefault(require("@/app/inits/departmentDefault"));
const employeeScheduleDefault_1 = __importDefault(require("@/app/inits/employeeScheduleDefault"));
// import HolidayDefault from '@/app/inits/holidayDefault'
const permissionDefault_1 = __importDefault(require("@/app/inits/permissionDefault"));
const roleDefault_1 = __importDefault(require("@/app/inits/roleDefault"));
const templateOnBoardingDefault_1 = __importDefault(require("@/app/inits/templateOnBoardingDefault"));
// import TemplateDefault from '@/app/inits/templateDefault'
const templateRelievingDefault_1 = __importDefault(require("@/app/inits/templateRelievingDefault"));
const timeOffTypeDefault_1 = __importDefault(require("@/app/inits/timeOffTypeDefault"));
const Attachment_1 = __importDefault(require("@/app/models/Attachment"));
const Country_1 = __importDefault(require("@/app/models/Country"));
const Department_1 = __importDefault(require("@/app/models/Department"));
const Permission_1 = __importDefault(require("@/app/models/Permission"));
const Role_1 = __importDefault(require("@/app/models/Role"));
const Template_1 = __importDefault(require("@/app/models/Template"));
const Title_1 = __importDefault(require("@/app/models/Title"));
const UploadService_1 = __importDefault(require("@/app/services/UploadService"));
const axios_1 = __importDefault(require("axios"));
const bluebird_1 = __importDefault(require("bluebird"));
const path_1 = __importDefault(require("path"));
const puppeteer_1 = __importDefault(require("puppeteer"));
const v4_1 = __importDefault(require("uuid/v4"));
const EmployeeSchedule_1 = __importDefault(require("../models/EmployeeSchedule"));
const HolidayCalendar_1 = __importDefault(require("../models/HolidayCalendar"));
const TemplateRelieving_1 = __importDefault(require("../models/TemplateRelieving"));
// import SettingCompanyCountry from '../models/SettingCompanyCountry'
const TimeoffType_1 = __importDefault(require("../models/TimeoffType"));
const { UPLOAD } = index_1.default;
const initDefault = () => {
    initDepartment();
    initPayRoll();
    initPermissions();
    initRoles();
    initCountries();
    initHoliday();
    //   initCountryPolicy()
    initEmployeeSchedule();
    initTimeOffType();
    // initTemplates()
    initTemplateRelieving();
    initTemplateOnBoarding();
};
const initDepartment = () => __awaiter(void 0, void 0, void 0, function* () {
    // console.log('initDepartment')
    const departments = yield Department_1.default.find();
    if (departments.length === 0) {
        let departments = [];
        let titles = [];
        departmentDefault_1.default.map(item => {
            departments.push({ name: item.name });
            item.title.map(title => titles.push({ name: title, departmentName: item.name }));
        });
        yield Department_1.default.insertMany(departments);
        yield Title_1.default.insertMany(titles);
    }
});
const initHoliday = () => __awaiter(void 0, void 0, void 0, function* () {
    // const holiday = await HolidayCalendar.find()
    const countryList = ['VN', 'IN', 'US'];
    const date = new Date();
    yield bluebird_1.default.map(countryList, (item) => __awaiter(void 0, void 0, void 0, function* () {
        const holidayList = yield HolidayCalendar_1.default.find({
            country: item,
            year: date.getFullYear(),
        });
        if (holidayList.length === 0) {
            yield axios_1.default.get('https://calendarific.com/api/v2/holidays', {
                params: {
                    api_key: '95a083cee58aac21474594edf28cffaf29f26030',
                    country: item,
                    year: date.getFullYear(),
                    type: 'national',
                },
            })
                .then((response) => __awaiter(void 0, void 0, void 0, function* () {
                const { holidays } = response.data.response;
                // console.log(holidays)
                let listData = [];
                holidays.map((item) => {
                    const country = item.country.id;
                    const dataCountry = country.toUpperCase();
                    const data = {
                        name: item.name,
                        description: item.description,
                        date: {
                            iso: item.date.iso,
                            dateTime: {
                                year: item.date.datetime.year,
                                month: item.date.datetime.month,
                                day: item.date.datetime.day,
                            },
                        },
                        type: item.type,
                        country: dataCountry,
                    };
                    listData.push(data);
                    return {
                        name: item.name,
                        description: item.description,
                        date: item.date,
                        type: item.type,
                        country: dataCountry,
                    };
                });
                // console.log('aaa', listData)
                yield HolidayCalendar_1.default.insertMany(listData);
            }))
                .catch((err) => {
                console.log(err);
            });
        }
    }));
});
const initTimeOffType = () => __awaiter(void 0, void 0, void 0, function* () {
    const timeOffType = yield TimeoffType_1.default.find();
    if (timeOffType.length === 0) {
        yield TimeoffType_1.default.insertMany(timeOffTypeDefault_1.default);
    }
});
const initEmployeeSchedule = () => __awaiter(void 0, void 0, void 0, function* () {
    const employeeSchedule = yield EmployeeSchedule_1.default.findOne({
        country: null,
    });
    if (!employeeSchedule) {
        yield EmployeeSchedule_1.default.insertMany(employeeScheduleDefault_1.default);
    }
});
// const initCountryPolicy = async () => {
//   const countryPolicy = await SettingCompanyCountry.find()
//   if (countryPolicy.length === 0) {
//     await SettingCompanyCountry.insertMany(CountryPolicyDefault)
//   }
// }
const initPayRoll = () => __awaiter(void 0, void 0, void 0, function* () {
    // console.log('initPayRoll')
});
const initPermissions = () => __awaiter(void 0, void 0, void 0, function* () {
    // console.log('initPermissions')
    const permissions = yield Permission_1.default.find();
    if (permissions.length === 0) {
        yield Permission_1.default.insertMany(permissionDefault_1.default);
    }
});
const initRoles = () => __awaiter(void 0, void 0, void 0, function* () {
    // console.log('initRoles')
    const roles = yield Role_1.default.find();
    if (roles.length === 0) {
        yield Role_1.default.insertMany(roleDefault_1.default);
    }
});
const initCountries = () => __awaiter(void 0, void 0, void 0, function* () {
    // console.log('initCountry')
    const countries = yield Country_1.default.find();
    if (countries.length === 0) {
        yield Country_1.default.insertMany(countryDefault_1.default);
    }
});
// const initTemplates = async () => {
//   // console.log('initTemplate')
//   const templates = await Template.find()
//   if (templates.length === 0) {
//     await Template.insertMany(TemplateDefault)
//   }
// }
const initTemplateOnBoarding = () => __awaiter(void 0, void 0, void 0, function* () {
    // console.log('initTemplateOnBoarding')
    const templateOnBoardings = yield Template_1.default.find({ type: 'ON_BOARDING' });
    if (templateOnBoardings.length === 0) {
        yield bluebird_1.default.map(templateOnBoardingDefault_1.default, (template) => __awaiter(void 0, void 0, void 0, function* () {
            const PDF = yield generatePDF(template.htmlContent, template.settings, template.default);
            let temp = template;
            temp.fileName = PDF.fileName;
            temp.filePath = PDF.filePath;
            const attachment = yield upload('attachments', temp, PDF.buffer);
            temp.attachment = attachment;
            temp.htmlContent = PDF.bodyHTML;
            temp.thumbnail ? null : (temp.thumbnail = attachment.url);
            temp.settings = temp.settings.filter((item) => !item.isEdited);
            yield Template_1.default.create(temp);
        }));
    }
});
const initTemplateRelieving = () => __awaiter(void 0, void 0, void 0, function* () {
    // console.log('initTemplateRelieving')
    const templateRelievings = yield TemplateRelieving_1.default.find();
    if (templateRelievings.length === 0) {
        yield TemplateRelieving_1.default.insertMany(templateRelievingDefault_1.default);
    }
});
const generatePDF = (html, settings, _default, fullname, signatureURL) => __awaiter(void 0, void 0, void 0, function* () {
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
const upload = (type, content, buffer) => __awaiter(void 0, void 0, void 0, function* () {
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
        });
        attachment.url = encodeURI(UploadService_1.default.getPublicUrl(attachment.category, attachment._id.toHexString(), attachment.name));
        yield attachment.save();
        return attachment;
    }
    catch (e) {
        return e;
    }
});
exports.default = initDefault;
//# sourceMappingURL=InitDefault.js.map