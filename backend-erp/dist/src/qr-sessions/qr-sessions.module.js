"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QrSessionsModule = void 0;
const common_1 = require("@nestjs/common");
const qr_sessions_service_1 = require("./qr-sessions.service");
const qr_sessions_controller_1 = require("./qr-sessions.controller");
let QrSessionsModule = class QrSessionsModule {
};
exports.QrSessionsModule = QrSessionsModule;
exports.QrSessionsModule = QrSessionsModule = __decorate([
    (0, common_1.Module)({
        providers: [qr_sessions_service_1.QrSessionsService],
        controllers: [qr_sessions_controller_1.QrSessionsController]
    })
], QrSessionsModule);
//# sourceMappingURL=qr-sessions.module.js.map