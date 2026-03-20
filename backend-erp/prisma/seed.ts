import 'dotenv/config';
import { PrismaClient, Role } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import * as bcrypt from 'bcryptjs';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is not defined');

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Iniciando Seeding de usuarios...');

  const saltRounds = 10;
  // Usaremos la contraseña exacta que pediste: CaRrA06Rz+
  const passwordToSet = 'CaRrA06Rz+';
  const hashedPassword = await bcrypt.hash(passwordToSet, saltRounds);

  const users = [
    {
      email: 'pedrocarranzaescobedo001@gmail.com',
      fullName: 'Pedro Carranza (Super Admin)',
    },
    {
      email: 'adminprueva@gmail.com',
      fullName: 'Admin de Prueba',
    }
  ];

  for (const userData of users) {
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {
        password: hashedPassword,
        role: Role.ADMINISTRATOR,
      },
      create: {
        email: userData.email,
        fullName: userData.fullName,
        password: hashedPassword,
        role: Role.ADMINISTRATOR,
        phone: '+51 999 999 999',
      },
    });
    console.log(`✅ Usuario configurado: ${user.email}`);
  }

  console.log('🚀 Seeding completado con éxito.');
}

main()
  .catch((e) => {
    console.error('❌ Error en el seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
