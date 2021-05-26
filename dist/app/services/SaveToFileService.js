"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const write_file_atomic_1 = __importDefault(require("write-file-atomic"));
const routes_json_1 = __importDefault(require("../../swagger/routes.json"));
const DEFAULT_DATA = {
    number: new Date().getTime(),
    string: 'swagger',
    date: new Date().toISOString(),
    boolean: false,
    email: 'test@gmail.com',
};
class SaveToFileService {
    routesToFile(routes) {
        write_file_atomic_1.default('src/swagger/routes.json', JSON.stringify({ routes }), {
            chown: { uid: 100, gid: 50 },
        }, (err) => {
            console.log('Init routes.json file');
            if (err) {
                console.log(err);
            }
        });
    }
    swaggerConfiguration({ token = '' }) {
        const { routes = [] } = routes_json_1.default || {};
        const swaggerStr = {
            swagger: '2.0',
            info: {
                description: 'This is a sample server Routestore server.  You can find out more about Swagger at [http://swagger.io](http://swagger.io) or on [irc.freenode.net, #swagger](http://swagger.io/irc/).  For this sample, you can use the api key `special-key` to test the authorization filters.',
                version: '1.0.2',
                title: 'Swagger Routestore',
                termsOfService: 'http://swagger.io/terms/',
                contact: {
                    email: 'apiteam@swagger.io',
                },
                license: {
                    name: 'Apache 2.0',
                    url: 'http://www.apache.org/licenses/LICENSE-2.0.html',
                },
            },
            host: 'localhost:4000',
            basePath: '',
            tags: [
                {
                    name: 'setting',
                    description: 'Access to Routestore settings',
                },
            ],
            schemes: ['http', 'https'],
            paths: {},
            definitions: {},
            externalDocs: {
                description: 'Find out more',
                url: 'http://swagger.io',
            },
        };
        const tagNameExisted = {};
        // Init tags:
        lodash_1.forEach(routes, (o) => {
            const { path = '', methods } = o;
            const tagName = path.split('/')[2];
            if (!tagNameExisted[tagName] && methods) {
                const tag = {
                    name: tagName,
                    description: `Everything about your ${tagName}`,
                };
                swaggerStr.tags.push(tag);
                tagNameExisted[tagName] = true;
            }
        });
        // Init path
        lodash_1.forEach(routes, (o) => {
            const { path = '', methods } = o;
            const tagName = path.split('/')[2];
            if (methods) {
                lodash_1.forEach(methods, (obj) => {
                    const { name = '', type = 'POST', swagger, isRoot, authorized = true, } = obj;
                    const newPath = isRoot ? `/api/${name}` : `${path}/${name}`;
                    const routeInfo = {
                        tags: [tagName],
                        // 'summary': 'Finds Routes by status',
                        // 'description': 'Multiple status values can be provided with comma separated strings',
                        // 'operationId': 'findRoutesByStatus',
                        produces: ['application/json'],
                        security: [
                            {
                                Bearer: ['asdasdasdd'],
                            },
                        ],
                        responses: {
                            '200': {
                                description: 'successful operation',
                            },
                            '400': {
                                description: 'Invalid status value',
                            },
                        },
                    };
                    lodash_1.set(routeInfo, 'parameters', []);
                    if (type !== 'GET') {
                        const schema = {
                            type: 'object',
                            properties: {},
                        };
                        if (swagger) {
                            lodash_1.forEach(swagger, (object) => {
                                const { name, type, required = false } = object;
                                let property = {
                                    required,
                                    example: DEFAULT_DATA[type],
                                };
                                switch (type) {
                                    case 'string':
                                        property.type = 'string';
                                        break;
                                    case 'email':
                                        property.type = 'email';
                                        break;
                                    case 'date':
                                        property.type = 'string';
                                        property.format = 'date-time';
                                        break;
                                    case 'boolean':
                                        property.type = 'boolean';
                                        break;
                                    default:
                                        // number
                                        property.type = 'integer';
                                        property.format = 'int64';
                                }
                                lodash_1.set(schema.properties, name, property);
                            });
                        }
                        const parameter = {
                            in: 'body',
                            name: 'body',
                            required: true,
                            schema,
                        };
                        routeInfo.parameters.push(parameter);
                    }
                    // Init Authorization parameter:
                    if (authorized) {
                        const authProperty = {
                            in: 'header',
                            name: 'Authorization',
                            value: `bearer ${token}`,
                        };
                        routeInfo.parameters.push(authProperty);
                    }
                    // Init path parameters:
                    const pathArr = newPath.split('/');
                    lodash_1.forEach(pathArr, (v) => {
                        if (v.indexOf(':') > -1) {
                            const name = v.replace(':', '');
                            const parameter = {
                                in: 'path',
                                required: true,
                                type: 'string',
                                name,
                                example: name,
                            };
                            routeInfo.parameters.push(parameter);
                        }
                    });
                    lodash_1.set(swaggerStr.paths, `${newPath}.${type.toLowerCase()}`, routeInfo);
                });
            }
        });
        return swaggerStr;
    }
}
exports.default = new SaveToFileService();
//# sourceMappingURL=SaveToFileService.js.map