"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const throttler_1 = require("@nestjs/throttler");
const cache_manager_1 = require("@nestjs/cache-manager");
const core_1 = require("@nestjs/core");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_module_1 = require("./prisma/prisma.module");
const users_module_1 = require("./users/users.module");
const auth_module_1 = require("./auth/auth.module");
const tables_module_1 = require("./tables/tables.module");
const orders_module_1 = require("./orders/orders.module");
const qr_sessions_module_1 = require("./qr-sessions/qr-sessions.module");
const categories_module_1 = require("./categories/categories.module");
const products_module_1 = require("./products/products.module");
const inventory_module_1 = require("./inventory/inventory.module");
const sunat_module_1 = require("./sunat/sunat.module");
const events_module_1 = require("./events/events.module");
const rewards_module_1 = require("./rewards/rewards.module");
const attendance_module_1 = require("./attendance/attendance.module");
const reservations_module_1 = require("./reservations/reservations.module");
const security_module_1 = require("./security/security.module");
const settings_module_1 = require("./settings/settings.module");
const newsletter_module_1 = require("./newsletter/newsletter.module");
const system_module_1 = require("./system/system.module");
const complaints_module_1 = require("./complaints/complaints.module");
const promotions_module_1 = require("./promotions/promotions.module");
const upload_module_1 = require("./upload/upload.module");
const banners_module_1 = require("./banners/banners.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            cache_manager_1.CacheModule.register({
                isGlobal: true,
                ttl: 60000,
            }),
            throttler_1.ThrottlerModule.forRoot([{
                    ttl: 60000,
                    limit: 60,
                }]),
            prisma_module_1.PrismaModule, users_module_1.UsersModule, auth_module_1.AuthModule, complaints_module_1.ComplaintsModule, tables_module_1.TablesModule, orders_module_1.OrdersModule, qr_sessions_module_1.QrSessionsModule, categories_module_1.CategoriesModule, products_module_1.ProductsModule, inventory_module_1.InventoryModule, sunat_module_1.SunatModule, events_module_1.EventsModule, rewards_module_1.RewardsModule, attendance_module_1.AttendanceModule, reservations_module_1.ReservationsModule, security_module_1.SecurityModule, settings_module_1.SettingsModule, newsletter_module_1.NewsletterModule, system_module_1.SystemModule, promotions_module_1.PromotionsModule, banners_module_1.BannersModule, upload_module_1.UploadModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            }
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map