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
exports.sendNotificationCompoff = exports.shareDocument = exports.sendNotificationOffboarding = exports.sendLeaveRequestMail = exports.sendOffBoardingCloseTenantPackage = exports.sendOffBoardingTenantPackage = exports.sendOffBoardingPackage = exports.sendMulitpleCustomEmail = exports.sendCustomEmail = exports.sendOneOnOneMail = exports.sendEligibilityForm = exports.sendNotificationCandidateOnboarding = exports.sendNotificationNewCandidate = exports.sendNotificationNewEmployee = exports.sendNotificationNewAdmin = exports.sendConfirmInvitationEmail = exports.sendSignupInvitationEmail = exports.sendActiveUserEmail = exports.sendSecurityRegisterCodeEmail = exports.sendRecoverPasswordRequestEmail = exports.sendCreditCardRequestEmail = exports.waitApprovalMail = exports.notifyApprovalMail = void 0;
// import { sendNotification } from './FcmService';
const index_1 = __importDefault(require("@/app/config/index"));
const { EMAIL_SERVICE_ACCOUNT, EMAIL_SERVICE_PASSWORD, HOST_URL, WEB_URL, } = index_1.default;
const mailgen_1 = __importDefault(require("mailgen"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const constant_1 = require("../utils/constant");
const genMailHTML_1 = require("../utils/genMailHTML");
class SendMail {
    initTransport() {
        this.transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            // host: 'smtp.zoho.com',
            port: 465,
            // secure: true, // use SSL
            auth: {
                user: EMAIL_SERVICE_ACCOUNT,
                pass: EMAIL_SERVICE_PASSWORD,
            },
        });
        return this;
    }
    initMailGenerator() {
        this.mailGenerator = new mailgen_1.default({
            theme: 'default',
            product: {
                name: 'HRMS',
                link: WEB_URL,
            },
        });
        return this;
    }
    init(subject, to, cc) {
        this.to = to;
        this.cc = cc;
        this.subject = subject;
        this.initTransport();
        this.initMailGenerator();
        return this;
    }
    initMulti(subject, toMulti, cc) {
        this.toMulti = toMulti;
        this.cc = cc;
        this.subject = subject;
        this.initTransport();
        this.initMailGenerator();
        return this;
    }
    createContent(content) {
        this.html = this.mailGenerator.generate(content);
        return this;
    }
    createContentHTML({ content, style } = {}) {
        this.html = genMailHTML_1.genHTML({ style, content });
        return this;
    }
    send({ attachments = [] } = {}) {
        const { subject, to, cc, html, toMulti } = this;
        return new Promise((resolve, reject) => {
            this.transporter.sendMail({
                from: constant_1.LINK.email,
                to: to ? to : toMulti,
                cc,
                subject,
                attachments,
                html,
            }, err => (err ? reject(err) : resolve(true)));
        });
    }
}
exports.default = SendMail;
const BTN_COLOR = '#fca00a';
const APP_NAME = '[HRMS]';
function notifyApprovalMail(to, cc) {
    return __awaiter(this, void 0, void 0, function* () {
        const subject = `${APP_NAME} - Approval pending -`;
        const mailer = new SendMail();
        mailer.init(subject, to.email, cc.map(u => u.email)).createContentHTML({
            content: genMailHTML_1.genApprovalReportMail({
                name: to.fullName,
                approver: to,
                title: 'Approval pending ',
                startMsg: 'Please find details of expense report awaiting your approval.',
            }),
        });
        return mailer.send();
    });
}
exports.notifyApprovalMail = notifyApprovalMail;
function waitApprovalMail(to, cc) {
    return __awaiter(this, void 0, void 0, function* () {
        const subject = `${APP_NAME} - Report Submitted For Approval`;
        const mailer = new SendMail();
        mailer.init(subject, to.email, cc.map(u => u.email)).createContentHTML({
            content: genMailHTML_1.genApprovalReportMail({
                name: to.fullName,
                title: 'Report Submitted For Approval',
                startMsg: 'Your expense report has been successfully submitted for approval.',
                endMsg: 'For any approval related queries, please reach out to your approver (details above) directly.',
                link: `${HOST_URL}/api/redirect/report-view-`,
                showApprovalFlow: true,
            }),
        });
        return mailer.send();
    });
}
exports.waitApprovalMail = waitApprovalMail;
function sendCreditCardRequestEmail(to, cc, creditCard, assignUser) {
    const subject = `${APP_NAME} - A Corporate Card Assigned`;
    const mailer = new SendMail();
    mailer.init(subject, to.email, cc.map(u => u.email)).createContentHTML({
        content: genMailHTML_1.genAssignCreditCardMail({
            name: to.fullName,
            title: 'A Corporate Card Assigned',
            startMsg: 'There is a corporated card has just been assigned to you.',
            endMsg: `If you did not request to have the card assigned on Expenso or have any other questions, please write to us at ${constant_1.LINK.email} and we'll take care of it.`,
            link: `${HOST_URL}/api/redirect/creditcard`,
            creditCard,
            assignUser,
        }),
    });
    return mailer.send();
}
exports.sendCreditCardRequestEmail = sendCreditCardRequestEmail;
function sendRecoverPasswordRequestEmail(to, cc, _code, link) {
    const subject = `${APP_NAME} - Recover Account Password`;
    // const intro = `Your code: ${code}`
    const mailer = new SendMail();
    mailer.init(subject, to.email, cc.map(u => u.email)).createContentHTML({
        content: genMailHTML_1.genContentResetPassword({ name: to.fullName, link }),
    });
    return mailer.send();
}
exports.sendRecoverPasswordRequestEmail = sendRecoverPasswordRequestEmail;
function sendSecurityRegisterCodeEmail(to, cc, code, _link) {
    const subject = `${APP_NAME} - Security Code Register`;
    // const intro = `Your code: ${code}`
    const mailer = new SendMail();
    mailer.init(subject, to.email, cc.map(u => u.email)).createContentHTML({
        content: genMailHTML_1.genSecurityRegisterCodeEmail({ name: to.fullName, code }),
    });
    return mailer.send();
}
exports.sendSecurityRegisterCodeEmail = sendSecurityRegisterCodeEmail;
function sendActiveUserEmail(to, cc, _code, link, password) {
    const subject = `${APP_NAME} - Active User`;
    // const intro = `Your code: ${code}`
    const mailer = new SendMail();
    mailer.init(subject, to.email, cc.map(u => u.email)).createContentHTML({
        content: genMailHTML_1.genActiveUserEmail({
            name: to.fullName,
            link,
            email: to.email,
            password,
        }),
    });
    return mailer.send();
}
exports.sendActiveUserEmail = sendActiveUserEmail;
function sendSignupInvitationEmail(to, cc) {
    const subject = `${APP_NAME} - Invitation`;
    const intro = `sent you an invitation.`;
    const mailer = new SendMail();
    const content = {
        body: {
            name: to.email,
            intro,
            action: {
                instructions: `To sign up my app please click here.`,
                button: {
                    color: BTN_COLOR,
                    text: 'Sign up',
                    link: `${HOST_URL}/api/redirect/signup`,
                },
            },
        },
    };
    mailer.init(subject, to.email, cc.map(u => u.email)).createContent(content);
    return mailer.send();
}
exports.sendSignupInvitationEmail = sendSignupInvitationEmail;
function sendConfirmInvitationEmail(to, cc) {
    const subject = `${APP_NAME} - Detect user signup`;
    const intro = ` signup successfully via your invitation email`;
    const mailer = new SendMail();
    const content = {
        body: {
            name: to.email,
            intro,
        },
    };
    mailer.init(subject, to.email, cc.map(u => u.email)).createContent(content);
    return mailer.send();
}
exports.sendConfirmInvitationEmail = sendConfirmInvitationEmail;
function sendNotificationNewAdmin(to, cc, companyName, companyCode, locationName, roles, url) {
    const subject = `${APP_NAME} - Activate your account`;
    // const intro = `Your code: ${code}`
    const mailer = new SendMail();
    mailer.init(subject, to.email, cc.map(u => u.email)).createContentHTML({
        content: genMailHTML_1.genNotificationNewAdmin({
            name: to.fullName,
            companyName,
            companyCode,
            locationName,
            roles,
            url,
        }),
    });
    return mailer.send();
}
exports.sendNotificationNewAdmin = sendNotificationNewAdmin;
function sendNotificationNewEmployee(to, cc, companyName, companyCode, locationName, url) {
    const subject = `${APP_NAME} - Activate your account`;
    // const intro = `Your code: ${code}`
    const mailer = new SendMail();
    mailer.init(subject, to.email, cc.map(u => u.email)).createContentHTML({
        content: genMailHTML_1.genNotificationNewEmployee({
            name: to.fullName,
            companyName,
            companyCode,
            locationName,
            url,
        }),
    });
    return mailer.send();
}
exports.sendNotificationNewEmployee = sendNotificationNewEmployee;
function sendNotificationNewCandidate(to, cc, password, url) {
    const subject = `${APP_NAME} - Your account`;
    const mailer = new SendMail();
    mailer.init(subject, to.email, cc.map(u => u.email)).createContentHTML({
        content: genMailHTML_1.genNotificationNewCandidate({
            name: to.fullName,
            email: to.email,
            password,
            url,
        }),
    });
    return mailer.send();
}
exports.sendNotificationNewCandidate = sendNotificationNewCandidate;
function sendNotificationCandidateOnboarding(to, cc, ticketID, name, link, title, content) {
    const subject = `${APP_NAME} - Your account`;
    const mailer = new SendMail();
    mailer.init(subject, to.email, cc.map(u => u.email)).createContentHTML({
        content: genMailHTML_1.genNotificationCandidateOnboarding({
            ticketID,
            name,
            link,
            title,
            content,
        }),
    });
    return mailer.send();
}
exports.sendNotificationCandidateOnboarding = sendNotificationCandidateOnboarding;
function sendEligibilityForm(to, cc, url, candidate) {
    const subject = `${APP_NAME} - CANDIDATE No.${candidate._id}`;
    const mailer = new SendMail();
    mailer.init(subject, to.email, cc.map(u => u.email)).createContentHTML({
        content: genMailHTML_1.genNotificationEligibilityHR({
            candidate,
            link: url,
        }),
    });
    return mailer.send();
}
exports.sendEligibilityForm = sendEligibilityForm;
function sendOneOnOneMail(to, cc, content) {
    const subject = `${APP_NAME} - Meeting 1-on-1`;
    const mailer = new SendMail();
    mailer.init(subject, to.email, cc.map(u => u.email)).createContentHTML({
        content: genMailHTML_1.genOneOnOneMail({
            name: to.fullName,
            // email: to.email,
            content,
        }),
    });
    return mailer.send();
}
exports.sendOneOnOneMail = sendOneOnOneMail;
function sendCustomEmail(to, cc, name, subject, content) {
    const emailSubject = `${APP_NAME} - ${subject}`;
    const mailer = new SendMail();
    mailer.init(emailSubject, to.email, cc.map(u => u.email)).createContentHTML({
        content: genMailHTML_1.genCustomEmail({
            name,
            content,
        }),
    });
    return mailer.send();
}
exports.sendCustomEmail = sendCustomEmail;
function sendMulitpleCustomEmail(toMulti, cc, subject, content) {
    const emailSubject = `${APP_NAME} - ${subject}`;
    const mailer = new SendMail();
    mailer
        .initMulti(emailSubject, toMulti, cc.map(u => u.email))
        .createContentHTML({
        content: genMailHTML_1.genMultiCustomEmail({
            content,
        }),
    });
    return mailer.send();
}
exports.sendMulitpleCustomEmail = sendMulitpleCustomEmail;
function sendOffBoardingPackage(to, cc, packageType, employee, HRRepresentative, attachments) {
    const subject = `${APP_NAME} - ${packageType} - Employee No.${employee.generalInfo.employeeId}`;
    const mailer = new SendMail();
    mailer.init(subject, to, cc.map(u => u.email)).createContentHTML({
        content: genMailHTML_1.genOffBoardingMail(HRRepresentative),
    });
    return mailer.send({
        attachments,
    });
}
exports.sendOffBoardingPackage = sendOffBoardingPackage;
function sendOffBoardingTenantPackage(to, cc, packageType, generalInfo, HRRepresentative) {
    const subject = `${APP_NAME} - ${packageType} - Employee No.${generalInfo.employeeId}`;
    const mailer = new SendMail();
    mailer.init(subject, to, cc.map(u => u.email)).createContentHTML({
        content: genMailHTML_1.genOffBoardingMail(HRRepresentative),
    });
    return mailer.send();
}
exports.sendOffBoardingTenantPackage = sendOffBoardingTenantPackage;
function sendOffBoardingCloseTenantPackage(to, cc, packageType, generalInfo, HRRepresentative, attachments) {
    const subject = `${APP_NAME} - ${packageType} - Employee No.${generalInfo.employeeId}`;
    const mailer = new SendMail();
    mailer.init(subject, to, cc.map(u => u.email)).createContentHTML({
        content: genMailHTML_1.genOffBoardingMail(HRRepresentative),
    });
    return mailer.send({
        attachments,
    });
}
exports.sendOffBoardingCloseTenantPackage = sendOffBoardingCloseTenantPackage;
function sendLeaveRequestMail(to, cc, title, content) {
    // const subject = `${APP_NAME} - Time off`
    const mailer = new SendMail();
    mailer.init(title, to.email, cc.map(u => u.email)).createContentHTML({
        content: genMailHTML_1.genLeaveRequestMail({
            content,
        }),
    });
    return mailer.send();
    // return null
}
exports.sendLeaveRequestMail = sendLeaveRequestMail;
function sendNotificationOffboarding(to, cc, title, content) {
    const subject = `${APP_NAME} - Offboarding`;
    const mailer = new SendMail();
    mailer.init(subject, to.email, cc.map(u => u.email)).createContentHTML({
        content: genMailHTML_1.genNotificationOffboardingMail({
            name: to.fullName,
            title,
            // email: to.email,
            content,
        }),
    });
    return mailer.send();
    // return null
}
exports.sendNotificationOffboarding = sendNotificationOffboarding;
function shareDocument(to, cc, title, content) {
    const subject = `${APP_NAME} - Document sharing`;
    const mailer = new SendMail();
    mailer.init(subject, to.email, cc.map(u => u.email)).createContentHTML({
        content: genMailHTML_1.genShareDocumentMail({
            name: to.fullName,
            title,
            // email: to.email,
            content,
        }),
    });
    return mailer.send();
    // return null
}
exports.shareDocument = shareDocument;
function sendNotificationCompoff(to, cc, title, content) {
    // const subject = `${APP_NAME} - Compoff request`
    const mailer = new SendMail();
    mailer.init(title, to.email, cc.map(u => u.email)).createContentHTML({
        content: genMailHTML_1.genNotificationCompoffMail({
            content,
        }),
    });
    return mailer.send();
    // return null
}
exports.sendNotificationCompoff = sendNotificationCompoff;
//# sourceMappingURL=SendMail.js.map