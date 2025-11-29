"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    var _a, _b;
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: (_b = (_a = process.env.FRONTEND_URL) === null || _a === void 0 ? void 0 : _a.split(',')) !== null && _b !== void 0 ? _b : '*',
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
    }));
    const port = process.env.PORT || 4000;
    await app.listen(port);
    console.log(`Hostelia API running on port ${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map