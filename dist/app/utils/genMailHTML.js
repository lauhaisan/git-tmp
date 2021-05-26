"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.genNotificationCompoffMail = exports.genShareDocumentMail = exports.genNotificationOffboardingMail = exports.genLeaveRequestMail = exports.genOffBoardingMail = exports.genOneOnOneMail = exports.genNotificationPaymentHistory = exports.genAssignCreditCardMail = exports.genMultiCustomEmail = exports.genCustomEmail = exports.genNotificationCandidateOnboarding = exports.genNotificationEligibilityHR = exports.genNotificationNewCandidate = exports.genNotificationNewEmployee = exports.genNotificationNewAdmin = exports.genApprovalReportMail = exports.assignCreditCard = exports.genReport = exports.genApprovalFlow = exports.genApproverForReported = exports.genApproverForApprover = exports.genActiveUserEmail = exports.genSecurityRegisterCodeEmail = exports.genContentResetPassword = exports.mainStyle = exports.genHTML = void 0;
const index_1 = __importDefault(require("@/app/config/index"));
const credit_card_type_1 = __importDefault(require("credit-card-type"));
const lodash_1 = require("lodash");
const moment_1 = __importDefault(require("moment"));
const numeral_1 = __importDefault(require("numeral"));
const constant_1 = require("./constant");
const { HOST_URL, WEB_URL } = index_1.default;
const DATE_FORMAT = 'MMM Do YYYY';
function genHTML({ style = '', content = '' } = {}) {
    return `
  <!DOCTYPE html
  PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link href='https://fonts.googleapis.com/css?family=Tajawal' rel='stylesheet'>
    <title>Recover Password Email</title>
    ${mainStyle()}
    ${style}
    </head>
    <body>
    <div class="layout">
        <div class="header">
            <img src="${HOST_URL}/image/icon_HRMS.png" width="219px"
                height="58px">
        </div>
        <div class="content">${content}</div>
        <div class="footer">
            <div class="left">
                <span>© 2020 Paxanimi Inc. All Rights Reserved</span>
            </div>
            <div class="right">
                <p>Experience HRMS by One Click</p>
                <div class="icon">
                  <a href="${constant_1.LINK.appStore}" ><img src="${HOST_URL}/image/email/appstore.png"/></a>
                  <div>|</div>
                  <a href="${constant_1.LINK.googlePlay}" ><img src="${HOST_URL}/image/email/google.png"/></a>
                  <div>|</div>
                  <a href="${WEB_URL}" ><img src="${HOST_URL}/image/email/world-wide-web.png"/></a>
                </div>
            </div>
        </div>
    </div>
    </body>
    </html>
    `;
}
exports.genHTML = genHTML;
function mainStyle() {
    const fontColor = 'black';
    const fontSize = '14px';
    return `
      <style type="text/css" media="screen">
        body {
          background: #eeeeee;
          color: ${fontColor};
          font-family: 'Tajawal Arial';
          font-size: ${fontSize};
        }
        p{
          color: ${fontColor};
          margin: 2px 0;
          font-size: ${fontSize};
        }
        .layout {
          box-sizing: border-box;
          width: 700px;
          border: 1px solid #e2e2e2;
          background-color: #F3F5F5;
          margin: auto;
          position: absolute;
          display: block;
        }
        .header {
          text-align: left;
          margin: 20px;
        }
        .content {
          width: 697px;
          background-color: #FFFFFF;
          overflow: hidden;
        }
        .footer {
          color: #313558;
          font-size: 12px;
          overflow: hidden;
          padding: 10px 20px;
        }
        .footer p{
          color: #999;
          font-size: 12px;
        }
        .footer .left{
          float: left;
          text-align: left;
          line-height: 60px;
        }
        .footer .right{
          float: right;
          text-align: center;
        }
        .footer .right .icon {
          display: inline-flex;
          color: #ddd;
          margin-top: 10px;
          font-size: 20px;
          line-height: 20px;
        }
        .footer .right .icon img {
          margin: 0 10px;
          cursor: pointer;
        }
        .content .hi-area{
          margin: 15px 50px;
          line-height: 25px;
        }
        .content .hi-area .name{
          font-weight: bold;
        }
        .content .hi-area .hi a{
          color: ${fontColor};
          text-decoration: initial;
        }
        .content .img-area{
          text-align: center;
          margin-top: 10px;
          margin-bottom: 15px;
        }
        .content .img-area .img-contain{
          max-width: 140px;
          max-height: 140px;
          margin: auto;
        }
        .content .img-area .img-contain img{
          max-width: 100%;
          max-height: 100%;
        }
        .content .title-area{
          text-align: center;
        }
        .content .title-area .title {
          height: 29px;
          width: 173px;
          color: #000000;
          font-size: 24px;
          font-weight: bold;
          letter-spacing: 0;
          line-height: 29px;
          margin: auto;
          text-transform: CAPITALIZE;
        }
        .content .button-area{
          text-align: center;
          margin-top:15px;
          margin-bottom:15px;
        }
        .content .notice-area{
          margin:15px 50px;
          line-height:25px;
        }
        .content .text-button {
          font-size: 16px;
          letter-spacing: 0;
          line-height: 50px;
          text-align: center;
          text-decoration: none;
          color: white;
        }
        .content .button {
          box-sizing: border-box;
          display: inline-block;
          border-radius: 3px;
          color: #ffffff;
          font-size: 15px;
          line-height: 45px;
          text-align: center;
          text-decoration: none;
          height: 50px;
          width: 200px;
          border-radius: 4px;
          background-color: #FBA343;
        }
        .report-area{
          border: 2px solid #E5E5E5;
          width: calc(100% - 120px);
          margin-left: 50px;
          padding: 10px;
          overflow: hidden;
        }
        .report-area p {
          font-size: 12px;
        }
        .report-area .left{
          float: left;
          width: calc(100% - 120px);
        }
        .report-area .right{
          float: right;
          width: 100px;
          text-align: right;
        }
        .report-area .title{
          font-weight: bold;
          margin-bottom: 5px;
        }
        
        .report-area .report-status{
          width: 120px;
          float: right;
        }
        .report-area .button-area{
          text-align: center;
          float: left;
          width: 100%;
          margin-top: 15px;
        }
        .report-area .button{
          height: 30px;
          width: 100px;
          cursor: pointer;
        }
        .report-area .text-button{
          font-size: 12px;
          line-height: 30px;
          font-weight: bold;
        }
        .report-area .node{
          padding: 5px;
        }
        .credit-card{
          overflow: hidden;
          margin: 0 50px;
        }
        .credit-card .uppercase{
          text-transform: uppercase;
        }
        .credit-card .info{
          overflow: hidden;
          margin-bottom: 10px;
        }
        .credit-card .left{
          float: left;
          margin-left: 40px;
          margin-right: 20px;
          margin-top: 10px;
        }
        .credit-card .button-area{
          margin-bottom: 0;
        }
        .paid-area {
          box-sizing: border-box;
		      min-height: 240.5px;
          width: 600.5px;
          border: 1px solid #e2e2e2;
		      margin:15px 50px;
        }
        .line-1{
          width:100%;
          margin:15px;
          font-weight: bold;
          margin-bottom:10px;
        }
        .line-2{
          width:100%;
          margin:15px;
          margin-top:0px;
        }
        .line-3{
          width:100%;
          margin:15px;
        }
        .line-4{
          margin:5px;
          margin-left:30px;
          font-weight: bold;
        }
        .line-row{
          margin:5px;
          margin-left:30px;
        }
        .line-left{
        display:inline-block; 
        text-align:left;
        }
        .line-right{
        display: inline-block;
        text-align:right;
        padding-right:20px;
        }
        .content .text-button-page-paid {
          letter-spacing: 0;
          font-weight: bold;
          font-size: 12px;
          line-height: 24px;
        }
        .content .button-page-paid {
          line-height: 24px;
          height: 30px;
          width: 100px;
        }
      </style>
    `;
}
exports.mainStyle = mainStyle;
function genContentResetPassword({ name = '', link = '' } = {}) {
    return `
        <div class="img-area">
            <div class="img-contain">
              <img src="${HOST_URL}/image/email/background_hrms.png">
            </div>
        </div>
        <div class="title-area">
          <span class="title">Password Reset</span>
        </div>
        <div class="hi-area">
            <p class="hi">Hi <span class="name">${name}</span>,</p>
            <p>Please click the button below to reset your password for HRMS.</p>
        </div>
        <div class="button-area">
            <a class="button" href="${link}">
                <p class="text-button">CHANGE PASSWORD</p>
            </a>
        </div>
        <div class="notice-area">
            <p>If you didn’t intend to change your password, please ignore this email. Your password won’t change.</p>
        </div>  
     `;
}
exports.genContentResetPassword = genContentResetPassword;
function genSecurityRegisterCodeEmail({ name = '', code = '' } = {}) {
    return `
        <div class="img-area">
            <div class="img-contain">
              <img src="${HOST_URL}/image/email/background_hrms.png">
            </div>
        </div>
        <div class="title-area">
          <span class="title">Security Code</span>
        </div>
        <div class="hi-area">
            <p class="hi">Hi <span class="name">${name}</span>,</p>
            <p>Please use this code below to access your register for HRMS.</p>
        </div>
        <div class="button-area">
          <div class="title-area">
            <span class="title">${code}</span>
          </div>
        </div>
        <div class="notice-area">
            <p>If you didn’t intend to access your register, please ignore this email</p>
        </div>  
     `;
}
exports.genSecurityRegisterCodeEmail = genSecurityRegisterCodeEmail;
function genActiveUserEmail({ name = '', link = '', email = '', password = '', } = {}) {
    return `
        <div class="img-area">
            <div class="img-contain">
              <img src="${HOST_URL}/image/email/background_hrms.png">
            </div>
        </div>
        <div class="title-area">
          <span class="title">Active User</span>
        </div>
        <div class="hi-area">
            <p class="hi">Hi <span class="name">${name}</span>,</p>
            <p>Please click the button below to active your account for HRMS.</p>
        </div>
        <div class="button-area">
            <a class="button" href="${link}">
                <p class="text-button">ACTIVE</p>
            </a>
        </div>
        <p>Your sign in email: <b>${email}</b></p>
<p>Your sign in password: <b>${password}</b></p>
  <p>Now you can start managing human resource with HRMS on both Mobile and Web application.</p>
        <div class="notice-area">
            <p>If you didn’t intend to active your account, please ignore this email</p>
        </div>  
     `;
}
exports.genActiveUserEmail = genActiveUserEmail;
function genApproverForApprover({ approver } = {}) {
    let html = '';
    if (!lodash_1.isEmpty(approver)) {
        html = `<p>Approver: ${approver.fullName} (${approver.email})</p>`;
    }
    return html;
}
exports.genApproverForApprover = genApproverForApprover;
function genApproverForReported({ report, isReport } = {}) {
    let html = '';
    if (isReport) {
        const { approvalFlow, approvalStep, manager } = report;
        const node = lodash_1.get(approvalFlow, `nodes.${approvalStep}`, {});
        if (node.type === 'ApprovalFlowGroup') {
            html = `<p>Approver: ${node.data.name} (Group)</p>`;
        }
        else {
            html = `<p>Approver: ${manager.fullName} (${manager.email})</p>`;
        }
    }
    return html;
}
exports.genApproverForReported = genApproverForReported;
function genApprovalFlow({ report, showApprovalFlow } = {}) {
    let html = '';
    if (showApprovalFlow) {
        const { approvalFlow: { nodes = [] } = {}, manager = {} } = report;
        html = '<p>Approval Flow:</p>';
        lodash_1.forEach(nodes, (node, i) => {
            if (node.type === 'none') {
                html += `<p class="node">${i + 1}. Direct Manager: ${manager.fullName} (${manager.email})</p>`;
            }
            else {
                html += `<p class="node">${i + 1}. ${lodash_1.get(node, 'data.name')} (Group)</p>`;
            }
        });
    }
    return html;
}
exports.genApprovalFlow = genApprovalFlow;
function genReport({ report = {}, link = '', approver = {}, showApprovalFlow, icon, isReport, } = {}) {
    const { createdAt, code = '', amount, currency, bills = [], user: { fullName = '', email = '' } = {}, } = report;
    return `<div class="report-area">
    <div class="left">
      <p class="title">${fullName}, ${moment_1.default(createdAt).format(DATE_FORMAT)}</p>
      <p>Created on ${moment_1.default(createdAt).format(DATE_FORMAT)} by ${fullName} (${email})</p>
      ${genApproverForApprover({ approver })}
      ${genApproverForReported({ report, isReport })}
      ${genApprovalFlow({ report, showApprovalFlow })}
      <p>Report Number: ${code}</p>
    </div>
    <div class="right">
      <p class="title">${currency} ${numeral_1.default(amount).format('0,0.00')}</p>
      <p>${bills.length} expense${bills.length > 1 ? 's' : ''}</p>
      <span class="report-status"><img src="${HOST_URL}/image/email/${icon}.png"></span>
    </div>
    <div class="button-area">
      <a class="button" href=${link}>
          <p class="text-button">OPEN IN APP</p>
      </a>
    </div>
  </div>`;
}
exports.genReport = genReport;
function assignCreditCard({ link, creditCard = {}, assignUser = {}, } = {}) {
    const { number = '', name = '' } = creditCard;
    const lastFourNum = number.slice(-4);
    const { niceType = '' } = credit_card_type_1.default(lastFourNum)[0] || {};
    return `
  <div class="credit-card">
    <div class="info">
      <div class="left">
        <img width="100" src="${HOST_URL}/image/email/assignCreditCard.png">
      </div>
      <div class="right">
        <p>Card Number: <b>xxxx-xxxx-xxxx-${lastFourNum}</b></p>
        <p>Card Type: <b class="uppercase">${niceType}</b></p>
        <p>Holder Name: <b class="uppercase">${name}</b></p>
        <p>Assigner: <b>${assignUser.email}</b></p>
      </div>
    </div>
    <p>In order to view all your assigned cards, please click on button bellow.</p>
    <div class="button-area">
      <a class="button" href="${link}">
          <p class="text-button">VIEW ALL CARDS</p>
      </a>
    </div>
  </div>`;
}
exports.assignCreditCard = assignCreditCard;
function genApprovalReportMail({ name = '', report = {}, title = '', startMsg = '', endMsg = '', link = '', approver = {}, showApprovalFlow, icon = 'reported', isReport, } = {}) {
    return `<div class="img-area">
    <div class="img-contain">
      <img src="${HOST_URL}/image/email/email_notification_2.png">
    </div>
    </div>
    <div class="title-area">
    <span class="title">${title}</span>
    </div>
    <div class="hi-area">
      <p class="hi">Hi <span class="name">${name}</span>,</p>
      <p>${startMsg}</p>
    </div>
    ${genReport({ report, link, approver, showApprovalFlow, icon, isReport })}
    <div class="notice-area">
      ${endMsg ? `<p class="bold">${endMsg}</p>` : ''}
    </div>  `;
}
exports.genApprovalReportMail = genApprovalReportMail;
function genNotificationNewAdmin({ name = '', companyName = '', companyCode = '', locationName = '', roles = '', url = '', } = {}) {
    return `
      <div class="img-area">
			  <div class="img-contain">
				  <img width="100%" src="${HOST_URL}/image/email/background_hrms.png">
				</div>
			</div>
			<div class="title-area">
				<span class="title">Activate your account</span>
			</div>
			<div class="hi-area">
				<p class="hi">Hi ${name},</p>
        <p>Thanks for signing up for HRMS. Please click the button below to verify your email and get started with HRMS AdminCP.</p>
        <div class="button-area">
				<a class="button" href="${url}">
					<p class="text-button">ACTIVATE ACCOUNT</p>
				</a>
			</div>
        <p>Your company name: <b>${companyName}</b></p>
        <p>Company code: <b>${companyCode}</b></p>
        ${locationName ? `<p>Location: <b>${locationName}</b></p>` : ''}
        <p>By the <b>${roles}</b> role, you can start to do initial configurations to have your location ready for Mobile and Web application usages</p>
        <br>
        <p>If you did not request to create an account on HRMS or have any other questions, please write to us at ${constant_1.LINK.email} and we'll take care of it</p>
			</div>
    `;
}
exports.genNotificationNewAdmin = genNotificationNewAdmin;
function genNotificationNewEmployee({ name = '', companyName = '', companyCode = '', locationName = '', url = '', } = {}) {
    return `
      <div class="img-area">
			  <div class="img-contain">
				  <img width="100%" src="${HOST_URL}/image/email/background_hrms.png">
				</div>
			</div>
			<div class="title-area">
				<span class="title">Activate your account</span>
			</div>
			<div class="hi-area">
				<p class="hi">Hi ${name},</p>
        <p>You has just been invited to be an HRMS user. Please click the button below to verify your email and get started with HRMS.</p>
        <div class="button-area">
				<a class="button" href="${url}">
					<p class="text-button">ACTIVATE ACCOUNT</p>
				</a>
			</div>
        <p>Your company name: <b>${companyName}</b></p>
        <p>Company code: <b>${companyCode}</b></p>
        ${locationName ? `<p>Location: <b>${locationName}</b></p>` : ''}
        <p>Now you can start managing human resource with HRMS on both Mobile and Web application.</p>
        <br>
        <p>If you have any questions or issues, please let us know at ${constant_1.LINK.email} and we'll take care of it.</b></p>
			</div>
    `;
}
exports.genNotificationNewEmployee = genNotificationNewEmployee;
function genNotificationNewCandidate({ name = '', email = '', password = '', url = '', } = {}) {
    return `
  <div class="img-area">
  <div class="img-contain">
    <img width="100%" src="${HOST_URL}/image/email/background_hrms.png">
  </div>
</div>
<div class="title-area">
  <span class="title">Activate your account</span>
</div>
<div class="hi-area">
  <p class="hi">Hi ${name},</p>
  <p>Below is your email and password to sign in our HRMS system</p>
  <div class="button-area">
  <a class="button" href="${url}">
    <p class="text-button">ACTIVATE ACCOUNT</p>
  </a>
</div>
<p>Your sign in email: <b>${email}</b></p>
<p>Your sign in password: <b>${password}</b></p>
  <p>Now you can start managing human resource with HRMS on both Mobile and Web application.</p>
  <br>
  <p>If you have any questions or issues, please let us know at ${constant_1.LINK.email} and we'll take care of it.</b></p>
</div>
  `;
}
exports.genNotificationNewCandidate = genNotificationNewCandidate;
function genNotificationEligibilityHR({ candidate = '', link = '', } = {}) {
    return `
  <div class="img-area">
  <div class="img-contain">
    <img width="100%" src="${HOST_URL}/image/email/background_hrms.png">
  </div>
</div>
<div class="title-area">
  <span class="title">Activate your account</span>
</div>
<div class="hi-area">
  <p>Candidate no.${candidate} has submit their required documents</p>
  <p>CLick the following link below to navigate</p>
  <div class="button-area">
  <a class="button" href="${link}">
    <p class="text-button>HERE</p>
  </a>
</div>
  <p>Now you can start managing human resource with HRMS on both Mobile and Web application.</p>
  <br>
  <p>If you have any questions or issues, please let us know at ${constant_1.LINK.email} and we'll take care of it.</b></p>
</div>
  `;
}
exports.genNotificationEligibilityHR = genNotificationEligibilityHR;
function genNotificationCandidateOnboarding({ ticketID = '', name = '', link = '', title = '', content = '', } = {}) {
    return `
  <div class="img-area">
    <div class="img-contain">
      <img width="100%" src="${HOST_URL}/image/email/background_hrms.png">
    </div>
  </div>
  <div class="title-area">
    <span class="title">${title}</span>
  </div>
  <div class="hi-area">
    <p>Dear, ${name}</p>
    <h4><b>Candidate No.${ticketID}</b></h4>
    <p>${content}</p>
    <div class="button-area">
    <a class="button" href="${link}">
      <p class="text-button">HERE</p>
    </a>
  </div>
    <p>Now you can start managing human resource with HRMS on both Mobile and Web application.</p>
    <br>
    <p>If you have any questions or issues, please let us know at ${constant_1.LINK.email} and we'll take care of it.</b></p>
  </div>
`;
}
exports.genNotificationCandidateOnboarding = genNotificationCandidateOnboarding;
function genCustomEmail({ name = '', content = '' } = {}) {
    return `<div class="img-area">
      <div class="img-contain">
        <img src="${HOST_URL}/image/email/background_hrms.png" />
      </div>
    </div>
    <div class="hi-area">
      <p class="hi">Hi <span class="name">${name}</span>,</p>
    </div>
    <div>${content}</div>
   `;
}
exports.genCustomEmail = genCustomEmail;
function genMultiCustomEmail({ content = '' } = {}) {
    return `<div class="img-area">
      <div class="img-contain">
        <img src="${HOST_URL}/image/email/background_hrms.png" />
      </div>
    </div>
    <div>${content}</div>
   `;
}
exports.genMultiCustomEmail = genMultiCustomEmail;
function genAssignCreditCardMail({ name = '', title = '', startMsg = '', endMsg = '', link, creditCard = {}, assignUser = {}, } = {}) {
    return `<div class="img-area">
      <div class="img-contain">
        <img src="${HOST_URL}/image/email/background_hrms.png" />
      </div>
    </div>
    <div class="title-area">
      <span class="title">${title}</span>
    </div>
    <div class="hi-area">
      <p class="hi">Hi <span class="name">${name}</span>,</p>
      <p>${startMsg}</p>
    </div>
    ${assignCreditCard({ link, creditCard, assignUser })}
    <div class="notice-area">
      ${endMsg ? `<p class="bold">${endMsg}</p>` : ''}
    </div>`;
}
exports.genAssignCreditCardMail = genAssignCreditCardMail;
function genNotificationPaymentHistory({ paymentHistory = {}, url = '', } = {}) {
    let genHTMLReport = '';
    lodash_1.forEach(paymentHistory.reportIds, (report, i) => {
        i = i + 1;
        let index = i;
        if (i < 10) {
            index = '0' + i;
        }
        genHTMLReport += `<div class='line-row'>
              <div class='line-left' style='width:5%;'>${index}</div>
              <div class='line-left' style='width:25%;'>${report.code}</div>
              <div class='line-left' style='width:30%;'>$ ${numeral_1.default(report.amount).format('0,0')}</div>	
            </div>`;
    });
    return `
      <div class="img-area">
        <div class="img-contain">
          <img width="100%" src="${HOST_URL}/image/email/paid.png">
        </div>
      </div>
      <div class="title-area">
        <span class="title">Report Paid</span>
      </div>
      <div class="hi-area">
        <p class="hi">Hi ${paymentHistory.user.fullName},</p>
        <p>The payment process of your reports has been done by Finance Team, please check for more detail below.</p>
      </div>
      <div class='paid-area'>
        <div class='line-1'>
          <div class='line-left'  style='width:47%;'>${paymentHistory.code} - Payment Detail</div>
          <div class='line-right' style='width:47%;'>${paymentHistory.currency} ${numeral_1.default(paymentHistory.reimbursable).format('0,0')}</div>
        </div>
        <div class='line-2'>
          <div class='line-left' style='width:12%;'>Employee:</div>
          <div class='line-left' style='width:35%;'>${paymentHistory.user.email}</div>
          <div class='line-right' style='width:47%;'>${paymentHistory.reportIds.length} reports</div>
        </div>
        <div class='line-3'>
            <div class='line-left' style='width:12%;'>Finance:</div>
            <div class='line-left' style='width:47%;'>${paymentHistory.finance.email}</div>
        </div>
        <div class='line-4'>
          <div class='line-left' style='width:5%;'>#</div>
          <div class='line-left' style='width:25%;'>Report Number</div>
          <div class='line-left' style='width:30%;'>Reimbursement</div>	
        </div>
          ${genHTMLReport}
          <div class="button-area">
          <a class="button button-page-paid" href="${url}">
            <p class="text-button text-button-page-paid">OPEN IN APP</p>
          </a>
        </div>
      </div>
    `;
}
exports.genNotificationPaymentHistory = genNotificationPaymentHistory;
function genOneOnOneMail({ name = '', 
// email = '',
content = '', } = {}) {
    return `
  <div class="img-area">
    <div class="img-contain">
      <img width="100%" src="${HOST_URL}/image/email/background_hrms.png">
    </div>
  </div>

  <div class="title-area">
    <span class="title">Meeting 1-on-1</span>
  </div>
  <div class="hi-area">
    <p class="hi">Hi ${name},</p>
    <div>${content}</div>
    <p>Please be on time.</p>
    <p>Thank you</p>
  </div>
    <br/>
    <p>If you have any questions or issues, please let us know at ${constant_1.LINK.email} and we'll take care of it.</br></p>`;
}
exports.genOneOnOneMail = genOneOnOneMail;
function genOffBoardingMail(hrRep) {
    return `<p class="western"><span style="font-family: Arial, sans-serif;">Thank you for your service to the Department. Because you are ending your employment here, I wish to conduct an exit interview with you. I&rsquo;d like to gain insight into your experiences, both good and bad, to help improve the working conditions of current and future employees.</span></p>
  <p class="western">&nbsp;</p>
  <p class="western"><span style="font-family: Arial, sans-serif;">Please review the attached questionnaire prior to your exit interview. You may complete it, or we can discuss the questions together. Your responses will remain confidential and will not be placed in your personnel file. Exit interview data from all departing employees are combined and presented to senior management in a summary report.</span></p>
  <p class="western">&nbsp;</p>
  <p class="western"><span style="font-family: Arial, sans-serif;">We typically talk with employees in the last few days of their employment. Please contact me with a time that is convenient for you to meet. The interview will last about 45 minutes.</span></p>
  <p class="western">&nbsp;</p>
  <p class="western"><span style="font-family: Arial, sans-serif;">I appreciate your willingness to participate in the interview.</span></p>
  <p class="western">&nbsp;</p>
  <p class="western"><span style="font-family: Arial, sans-serif;">Sincerely,</span></p>
  <p class="western"><span style="font-family: Arial, sans-serif;">${hrRep}</span></p>
  `;
}
exports.genOffBoardingMail = genOffBoardingMail;
function genLeaveRequestMail({ content = '' } = {}) {
    return `
  <div class="img-area">
    <div class="img-contain">
      <img width="100%" src="${HOST_URL}/image/email/background_hrms.png">
    </div>
  </div>

  <div class="hi-area">
    <div>${content}</div>
  </div>
    <br/>
    <p>If you have any questions or issues, please let us know at ${constant_1.LINK.email} and we'll take care of it.</br></p>`;
}
exports.genLeaveRequestMail = genLeaveRequestMail;
function genNotificationOffboardingMail({ name = '', title = '', 
// email = '',
content = '', } = {}) {
    return `
  <div class="img-area">
    <div class="img-contain">
      <img width="100%" src="${HOST_URL}/image/email/background_hrms.png">
    </div>
  </div>

  <div class="title-area">
    <span class="title">${title}</span>
  </div>
  <div class="hi-area">
    <p class="hi">Hi ${name},</p>
    <div>${content}</div>
    <p>Thank you</p>
  </div>
    <br/>
    <p>If you have any questions or issues, please let us know at ${constant_1.LINK.email} and we'll take care of it.</br></p>`;
}
exports.genNotificationOffboardingMail = genNotificationOffboardingMail;
function genShareDocumentMail({ name = '', title = '', 
// email = '',
content = '', } = {}) {
    return `
  <div class="img-area">
    <div class="img-contain">
      <img width="100%" src="${HOST_URL}/image/email/background_hrms.png">
    </div>
  </div>

  <div class="title-area">
    <span class="title">${title}</span>
  </div>
  <div class="hi-area">
    <p class="hi">Hi ${name},</p>
    <div>${content}</div>
    <p>Thank you</p>
  </div>
    <br/>
    <p>If you have any questions or issues, please let us know at ${constant_1.LINK.email} and we'll take care of it.</br></p>`;
}
exports.genShareDocumentMail = genShareDocumentMail;
function genNotificationCompoffMail({ content = '' } = {}) {
    return `
  <div class="img-area">
    <div class="img-contain">
      <img width="100%" src="${HOST_URL}/image/email/background_hrms.png">
    </div>
  </div>

  <div class="hi-area">
    <div>${content}</div>
  </div>
    <br/>
    <p>If you have any questions or issues, please let us know at ${constant_1.LINK.email} and we'll take care of it.</br></p>`;
}
exports.genNotificationCompoffMail = genNotificationCompoffMail;
//# sourceMappingURL=genMailHTML.js.map