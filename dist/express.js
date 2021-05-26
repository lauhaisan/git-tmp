"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("@/app/config/index"));
const { MONGODB_URI, SESSION_SECRET } = index_1.default;
const SaveToFileService_1 = __importDefault(require("@/app/services/SaveToFileService"));
const errorHandler_1 = __importDefault(require("@/app/utils/errorHandler"));
const router_1 = __importDefault(require("@/router"));
const bluebird_1 = __importDefault(require("bluebird"));
const body_parser_1 = __importDefault(require("body-parser"));
const compression_1 = __importDefault(require("compression")); // compresses requests
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const helmet_1 = __importDefault(require("helmet"));
const mongoose_1 = __importDefault(require("mongoose"));
const morgan_1 = __importDefault(require("morgan"));
const passport_1 = __importDefault(require("passport"));
const path_1 = __importDefault(require("path"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
// auto import Models
require("@/models");
// Passport provider
require("@/app/providers/intranet");
require("@/app/providers/jwt");
require("@/app/providers/local");
require("@/app/providers/localTenant");
require("@/app/providers/thirdParty");
// Creates and configures an ExpressJS web server.
class App {
    // Run configuration methods on the Express instance.
    constructor() {
        this.express = express_1.default();
        // Connect to MongoDB
        this.connectDB = this.connectDB.bind(this);
        this.middleware = this.middleware.bind(this);
        this.connectDB();
        this.middleware();
        this.routes();
    }
    connectDB() {
        this.MongoStore = connect_mongo_1.default(express_session_1.default);
        const mongoUrl = MONGODB_URI;
        mongoose_1.default
            .connect(mongoUrl, {
            useCreateIndex: true,
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
        })
            .then()
            .catch(() => {
            process.exit();
        });
        mongoose_1.default.Promise = bluebird_1.default;
        this.connection = mongoose_1.default.connection;
    }
    // Configure Express middleware.
    middleware() {
        // required for passport to initlize it
        this.express.use(passport_1.default.initialize());
        // initlize session
        this.express.use(express_session_1.default({
            resave: false,
            saveUninitialized: true,
            secret: SESSION_SECRET,
            store: new this.MongoStore({
                mongooseConnection: this.connection,
            }),
        }));
        this.express.use(passport_1.default.session());
        this.express.use(morgan_1.default('dev'));
        this.express.disable('x-powered-by');
        this.express.disable('etag');
        this.express.use(helmet_1.default());
        this.express.use(helmet_1.default.noCache({ noEtag: true })); // set Cache-Control header
        this.express.use(helmet_1.default.noSniff()); // set X-Content-Type-Options header
        this.express.use(helmet_1.default.frameguard()); // set X-Frame-Options header
        this.express.use(helmet_1.default.xssFilter()); // set X-XSS-Protection header
        this.express.use(body_parser_1.default.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
        this.express.use(body_parser_1.default.json()); // parse application/json
        // enable CORS
        this.express.use((_req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT, PATCH, OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, api_key, Authorization, Referer');
            next();
        });
        // register all custom Middleware
        this.express.use(cors_1.default({ optionsSuccessStatus: 200 }));
        // manage session by cookies
        this.express.use(cookie_parser_1.default()); // cookie parser
        this.express.set('port', process.env.PORT || 3000);
        // server side template rendering
        this.express.use(body_parser_1.default.json());
        this.express.use(body_parser_1.default.urlencoded({ extended: false }));
        this.express.use(compression_1.default());
        this.express.use('/image', express_1.default.static(path_1.default.join(__dirname, 'public/image'), {
            maxAge: 1000 * 60 * 60 * 24 * 30,
        }));
    }
    // Configure API endpoints.
    routes() {
        /* This is just to get up and running, and to make sure what we've got is
         * working so far. This function will change when we start to add more
         * API endpoints */
        this.express.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(SaveToFileService_1.default.swaggerConfiguration({ token: '' })));
        this.express.use('/', router_1.default);
        this.express.use(errorHandler_1.default.internalServerError);
        this.express.use(errorHandler_1.default.PageNotFound);
    }
}
exports.default = new App().express;
//# sourceMappingURL=express.js.map