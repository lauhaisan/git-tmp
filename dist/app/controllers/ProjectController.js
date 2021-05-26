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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractController_1 = __importDefault(require("@/app/declares/AbstractController"));
const Company_1 = __importDefault(require("@/app/models/Company"));
const Location_1 = __importDefault(require("@/app/models/Location"));
const ResponseResult_1 = __importDefault(require("@/app/services/ResponseResult"));
const AdvancedError_1 = __importDefault(require("@/app/declares/AdvancedError"));
const Project_1 = __importDefault(require("@/app/models/Project"));
const mongoose_1 = require("mongoose");
const Employee_1 = __importDefault(require("@/app/models/Employee"));
const bluebird_1 = require("bluebird");
// import Role from '@/app/models/Role'
class ProjectController extends AbstractController_1.default {
    generateMethods() {
        return [
            {
                name: 'list',
                type: 'POST',
                _ref: this.list.bind(this),
            },
            {
                name: 'get-by-id',
                type: 'POST',
                _ref: this.getByID,
                validationSchema: {
                    id: {
                        in: ['body', 'params'],
                        isString: {
                            errorMessage: ['isString', 'Id is invalid'],
                        },
                    },
                },
            },
            {
                name: 'list-by-company',
                type: 'POST',
                _ref: this.listByCompany.bind(this),
                validationSchema: {
                    company: {
                        in: ['body'],
                        isString: {
                            errorMessage: ['isString', 'Company is invalid'],
                        },
                        exists: {
                            errorMessage: ['Required', 'Company must be provided'],
                        },
                    },
                },
            },
            {
                name: 'list-by-location',
                type: 'POST',
                _ref: this.listByLocation.bind(this),
                validationSchema: {
                    location: {
                        in: ['body'],
                        isString: {
                            errorMessage: ['isString', 'Location is invalid'],
                        },
                        exists: {
                            errorMessage: ['Required', 'Location must be provided'],
                        },
                    },
                },
            },
            {
                name: 'add',
                type: 'POST',
                _ref: this.add.bind(this),
                validationSchema: {
                    name: {
                        in: ['body'],
                        isString: {
                            errorMessage: ['isString', 'Location is invalid'],
                        },
                        exists: {
                            errorMessage: ['Required', 'Location must be provided'],
                        },
                    },
                    location: {
                        isString: {
                            errorMessage: ['isString', 'Location is invalid'],
                        },
                    },
                    company: {
                        in: ['body'],
                        isString: {
                            errorMessage: ['isString', 'Company is invalid'],
                        },
                    },
                },
            },
            {
                name: 'update',
                type: 'POST',
                _ref: this.update.bind(this),
            },
            {
                name: 'get-by-employee',
                type: 'POST',
                _ref: this.getByEmployee.bind(this),
                validationSchema: {
                    employee: {
                        in: 'body',
                        isString: {
                            errorMessage: ['isString', 'Employee ID is invalid'],
                        },
                        exists: {
                            errorMessage: ['required', 'Employee ID must be provided'],
                        },
                    },
                },
            },
            {
                name: 'add-member',
                type: 'POST',
                _ref: this.addMember.bind(this),
                validationSchema: {
                    employee: {
                        in: ['body'],
                        isString: {
                            errorMessage: ['isString', 'Employee is invalid'],
                        },
                        exists: {
                            errorMessage: ['Required', 'Employee must be provided'],
                        },
                    },
                },
            },
            {
                name: 'list-role',
                type: 'POST',
                _ref: this.listRole.bind(this),
            },
        ];
    }
    add({ body }, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { location, company } = body;
            const foundCompany = yield Company_1.default.findById(company);
            const foundLocation = yield Location_1.default.findById(location);
            if (!foundCompany) {
                throw new AdvancedError_1.default({
                    company: { kind: 'not.found', message: 'Company not found' },
                });
            }
            if (!foundLocation) {
                throw new AdvancedError_1.default({
                    company: { kind: 'not.found', message: 'Location not found' },
                });
            }
            const project = yield this.model.create(body);
            res.send(new ResponseResult_1.default({
                data: project,
                message: 'Add item successfully',
            }));
        });
    }
    update(_a, res) {
        var _b = _a.body, { id } = _b, body = __rest(_b, ["id"]);
        return __awaiter(this, void 0, void 0, function* () {
            const project = yield this.model.findById(id);
            if (!project) {
                throw new AdvancedError_1.default({
                    project: { kind: 'not.found', message: 'Project not found' },
                });
            }
            project.set(this.filterParams(body, ['company', 'location']));
            yield project.save();
            res.send(new ResponseResult_1.default({
                data: project,
                message: 'Update item successfully',
            }));
        });
    }
    //Lít by company and location
    list({ body }, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { company, location, limit = 0, page = 1, skip = 0 } = body;
            const foundCompany = yield Company_1.default.findById(company);
            const foundLocation = yield Location_1.default.findById(location);
            if (!foundCompany) {
                throw new AdvancedError_1.default({
                    company: { kind: 'not.found', message: 'Company not found' },
                });
            }
            if (!foundLocation) {
                throw new AdvancedError_1.default({
                    company: { kind: 'not.found', message: 'Location not found' },
                });
            }
            let filter = {};
            filter.company = company;
            filter.location = location;
            const projects = yield this.model
                .find(filter)
                .skip((page - 1) * limit + skip)
                .limit(limit)
                .sort({ createdAt: -1 })
                .exec();
            res.send(new ResponseResult_1.default({
                data: projects,
                message: 'List items successfully',
                total: yield this.model.countDocuments(filter),
            }));
        });
    }
    listByCompany({ body }, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { company, limit = 0, page = 1, skip = 0 } = body;
            const foundCompany = yield Company_1.default.findById(company);
            if (!foundCompany) {
                throw new AdvancedError_1.default({
                    company: { kind: 'not.found', message: 'Company not found' },
                });
            }
            const projects = yield this.model
                .find({ company })
                .skip((page - 1) * limit + skip)
                .limit(limit)
                .sort({ createdAt: -1 })
                .exec();
            res.send(new ResponseResult_1.default({
                data: projects,
                message: 'List items successfully',
                total: yield this.model.countDocuments({ company }),
            }));
        });
    }
    listByLocation({ body }, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { location, limit = 0, page = 1, skip = 0 } = body;
            const foundLocation = yield Location_1.default.findById(location);
            if (!foundLocation) {
                throw new AdvancedError_1.default({
                    location: { kind: 'not.found', message: 'Location not found' },
                });
            }
            const projects = yield this.model
                .find({ location })
                .skip((page - 1) * limit + skip)
                .limit(limit)
                .sort({ createdAt: -1 })
                .exec();
            res.send(new ResponseResult_1.default({
                data: projects,
                message: 'List items successfully',
                total: yield this.model.countDocuments({ location }),
            }));
        });
    }
    getByEmployee(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body: { employee }, } = req;
            const filter = {
                'resource.employee': { $all: [employee] },
            };
            const projects = yield Project_1.default.find(filter);
            res.send(new ResponseResult_1.default({
                data: projects,
                message: 'List items successfully',
            }));
        });
    }
    addMember({ body }, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { employee } = body;
            const project = body.project;
            const members = body.members;
            const foundEmployee = yield Employee_1.default.findById(employee);
            const foundProject = yield Project_1.default.findById(mongoose_1.Types.ObjectId(project));
            const LIST_ROLE = [
                'Developer',
                'Project Manager',
                'Team Leader',
                'Quality Assurance',
                'Business Analyst',
                'Technical Architect',
            ];
            if (!members || members.length === 0) {
                throw new AdvancedError_1.default({
                    members: { kind: 'not.found', message: 'Members must be provided' },
                });
            }
            const foundMembers = yield bluebird_1.map(members, (member) => __awaiter(this, void 0, void 0, function* () {
                if (!member.id) {
                    throw new AdvancedError_1.default({
                        project: { kind: 'not.found', message: 'Employee is not valid!' },
                    });
                }
                const memberInfo = yield Employee_1.default.findById(member.id);
                const memberRole = LIST_ROLE.includes(member.role);
                if (!memberInfo) {
                    throw new AdvancedError_1.default({
                        project: { kind: 'not.found', message: 'Employee is not found!' },
                    });
                }
                if (!memberRole) {
                    throw new AdvancedError_1.default({
                        project: { kind: 'not.found', message: 'Role is not valid!' },
                    });
                }
                if (!member.effort) {
                    throw new AdvancedError_1.default({
                        project: { kind: 'not.found', message: 'Effort is not valid!' },
                    });
                }
                return memberInfo;
            }));
            if (!foundEmployee) {
                throw new AdvancedError_1.default({
                    employee: { kind: 'not.found', message: 'Company not found' },
                });
            }
            if (!foundProject) {
                throw new AdvancedError_1.default({
                    project: { kind: 'not.found', message: 'Project not found' },
                });
            }
            if (!foundMembers) {
                throw new AdvancedError_1.default({
                    project: { kind: 'not.found', message: 'Member not found' },
                });
            }
            const duplicateMember = yield Project_1.default.aggregate([
                {
                    $match: {
                        _id: mongoose_1.Types.ObjectId(project),
                        resource: {
                            $elemMatch: {
                                employee: {
                                    $in: members.map(member => mongoose_1.Types.ObjectId(member.id)),
                                },
                            },
                        },
                    },
                },
            ]);
            if (duplicateMember.length > 0) {
                throw new AdvancedError_1.default({
                    project: { kind: 'duplicate', message: 'Member is already exists' },
                });
            }
            yield Project_1.default.updateOne({ _id: project }, {
                $push: {
                    resource: body.members.map((item) => ({
                        employee: item.id,
                        role: item.role,
                        effort: item.effort,
                    })),
                },
            });
            res.send(new ResponseResult_1.default({
                data: {},
                message: 'Add member successfully',
            }));
        });
    }
    listRole(_, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const LIST_ROLE = [
                'Developer',
                'Project Manager',
                'Team Leader',
                'Quality Assurance',
                'Business Analyst',
                'Technical Architect',
            ];
            res.send(new ResponseResult_1.default({
                data: LIST_ROLE,
                message: 'Get role list successfully',
            }));
        });
    }
}
exports.default = new ProjectController(Project_1.default);
//# sourceMappingURL=ProjectController.js.map