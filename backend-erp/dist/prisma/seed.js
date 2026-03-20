"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = __importDefault(require("pg"));
const bcrypt = __importStar(require("bcrypt"));
require("dotenv/config");
async function main() {
    const pool = new pg_1.default.Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new adapter_pg_1.PrismaPg(pool);
    const prisma = new client_1.PrismaClient({ adapter });
    console.log('🌱 Seeding database...\n');
    const users = [
        {
            email: 'pedrocarranzaescobedo001@gmail.com',
            fullName: 'Pedro Carranza',
            password: 'CaRrA06Rz+',
            role: 'ADMINISTRATOR',
        },
        {
            email: 'cajero@endorfina.com',
            fullName: 'Carlos Cajero',
            password: 'cajero123',
            role: 'CASHIER',
        },
        {
            email: 'mesero@endorfina.com',
            fullName: 'María Mesera',
            password: 'mesero123',
            role: 'WAITER',
        },
        {
            email: 'chef@endorfina.com',
            fullName: 'Chef Antonio',
            password: 'chef123',
            role: 'KITCHEN',
        },
    ];
    for (const u of users) {
        const exists = await prisma.user.findUnique({ where: { email: u.email } });
        if (exists) {
            console.log(`  ⏭️  ${u.email} ya existe (${u.role})`);
            continue;
        }
        const hashed = await bcrypt.hash(u.password, 10);
        await prisma.user.create({
            data: {
                email: u.email,
                fullName: u.fullName,
                password: hashed,
                role: u.role,
            },
        });
        console.log(`  ✅ ${u.email} creado como ${u.role}`);
    }
    const tableCount = await prisma.table.count();
    if (tableCount === 0) {
        console.log('\n  📋 Creando mesas de ejemplo...');
        for (let i = 1; i <= 8; i++) {
            await prisma.table.create({
                data: { number: i, capacity: i <= 4 ? 4 : 6, status: 'AVAILABLE' },
            });
        }
        console.log('  ✅ 8 mesas creadas');
    }
    const catCount = await prisma.category.count();
    if (catCount === 0) {
        console.log('\n  📂 Creando categorías de ejemplo...');
        const cats = ['Bebidas', 'Entradas', 'Platos Principales', 'Postres', 'Tragos'];
        for (const name of cats) {
            await prisma.category.create({ data: { name } });
        }
        console.log(`  ✅ ${cats.length} categorías creadas`);
    }
    console.log('\n🎉 Seed completado!\n');
    await prisma.$disconnect();
    await pool.end();
}
main().catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map