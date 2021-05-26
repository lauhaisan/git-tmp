"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const lodash_1 = require("lodash");
const path_1 = __importDefault(require("path"));
const phantom_html2pdf_1 = __importDefault(require("phantom-html2pdf"));
class SavePdfService {
    constructor() {
        this.initReportSummary = ({ billTypes = [], bills = [] } = {}) => {
            let str = '';
            lodash_1.forEach(billTypes, (billType = {}) => {
                let count = 0;
                let amountTotal = 0;
                lodash_1.forEach(bills, (bill = {}) => {
                    const { type, amount } = bill;
                    if (billType === type.type) {
                        count++;
                        amountTotal += amount;
                    }
                });
                str += `<tr>
        <td>${billType}</td>
        <td>${count}</td>
        <td>${amountTotal}</td>
      </tr>`;
            });
            return str;
        };
        this.initReportDetail = ({ billTypes = [], bills = [], currency, } = {}) => {
            let str = '';
            lodash_1.forEach(billTypes, (billType = {}) => {
                let subStr = '';
                lodash_1.forEach(bills, (bill = {}) => {
                    const { type, amount, createdAt, date, reimbursable, description, } = bill;
                    if (billType === type.type) {
                        subStr += `<tr>
                      <td>${new Date(date || createdAt).toDateString()}</td>
                      <td>${new Date(createdAt).toDateString()}</td>
                      <td></td>
                      <td>${description}</td>
                      <td>${reimbursable ? 'Yes' : 'No'}</td>
                      <td>${amount}</td>
                      <td>0</td>
                    </tr>`;
                    }
                });
                str += `<div class="detail-title">${billType}</div>
              <div>
                <table>
                  <tr>
                    <th>Spend Dt</th>
                    <th>Created Dt</th>
                    <th>Vendor</th>
                    <th>Purpose</th>
                    <th>Reimburse</th>
                    <th>Amount (${currency})</th>
                    <th>Attachments</th>
                  </tr>
                  ${subStr}
                </table>
              </div>`;
            });
            return str;
        };
        this.logoSrc = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAIAAABMXPacAAAACXBIWXMAAC4jAAAuIwF4pT92AAAME2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIiB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDE5LTAxLTE3VDExOjMxKzA3OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDE5LTAyLTE5VDE2OjMzOjIxKzA3OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAxOS0wMi0xOVQxNjozMzoyMSswNzowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OWVkMjRiY2MtMGMzNy03ZDRjLTllNjQtZjZiOGY1NWE3ZDg1IiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6NGVlZTk0MGYtM2ZkMy1kNjRjLTg5YzEtNzIyZTk4NzI0MWM4IiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6NGRhM2RlNDUtNDY5MC00OTRjLThlMDItMzMxNjA0ZTQ1ZTc5IiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiIHRpZmY6T3JpZW50YXRpb249IjEiIHRpZmY6WFJlc29sdXRpb249IjMwMDAwMDAvMTAwMDAiIHRpZmY6WVJlc29sdXRpb249IjMwMDAwMDAvMTAwMDAiIHRpZmY6UmVzb2x1dGlvblVuaXQ9IjIiIGV4aWY6Q29sb3JTcGFjZT0iMSIgZXhpZjpQaXhlbFhEaW1lbnNpb249IjEwMjQiIGV4aWY6UGl4ZWxZRGltZW5zaW9uPSIxMDI0Ij4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo0ZGEzZGU0NS00NjkwLTQ5NGMtOGUwMi0zMzE2MDRlNDVlNzkiIHN0RXZ0OndoZW49IjIwMTktMDEtMTdUMTE6MzErMDc6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE4IChXaW5kb3dzKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6NzQyZDc0YmYtMTE4Mi1hNzQwLTg3OWEtODI0MDc0MWIwMGUxIiBzdEV2dDp3aGVuPSIyMDE5LTAxLTE3VDEzOjA1OjQ5KzA3OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjUzMTRkOGM1LWZlNTQtYTM0OC04NTE1LWFmMTNiNGJlOWQ3MSIgc3RFdnQ6d2hlbj0iMjAxOS0wMS0xN1QxNTowNDo0NyswNzowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjb252ZXJ0ZWQiIHN0RXZ0OnBhcmFtZXRlcnM9ImZyb20gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCB0byBpbWFnZS9wbmciLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImRlcml2ZWQiIHN0RXZ0OnBhcmFtZXRlcnM9ImNvbnZlcnRlZCBmcm9tIGFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5waG90b3Nob3AgdG8gaW1hZ2UvcG5nIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDoxZjdhOWQ5ZC1hN2FiLTlmNGYtYjBlNC1jZDExNWZhODk3MWYiIHN0RXZ0OndoZW49IjIwMTktMDEtMTdUMTU6MDQ6NDcrMDc6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE4IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6OWVkMjRiY2MtMGMzNy03ZDRjLTllNjQtZjZiOGY1NWE3ZDg1IiBzdEV2dDp3aGVuPSIyMDE5LTAyLTE5VDE2OjMzOjIxKzA3OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDx4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';
    }
    writeFile({ html = '', _id = 0, callback, loopNumber = 0 } = {}) {
        const filename = path_1.default.join(__dirname, `../../../src/public/pdfs/${_id}-${new Date().getTime()}.pdf`);
        phantom_html2pdf_1.default.convert({ html }, (err, result) => {
            if (!err) {
                // Convert successfull:
                result.toFile(filename, () => {
                    callback({ filename });
                    // Remove file
                    this.removeFile({ filename });
                });
            }
            else {
                // Convert fail:
                loopNumber++;
                console.log(loopNumber, 'loopNumber: ', err);
                if (loopNumber <= 2) {
                    // allow resend 2 times
                    this.writeFile({ html, _id, callback, loopNumber });
                }
                else {
                    callback({ error: true });
                }
            }
        });
    }
    removeFile({ filename = '' } = {}) {
        setTimeout(() => {
            fs_1.default.unlink(filename, (err) => {
                if (err) {
                    console.error(err);
                    return;
                }
            });
        }, 10000);
    }
}
exports.default = new SavePdfService();
//# sourceMappingURL=SavePdfService.js.map