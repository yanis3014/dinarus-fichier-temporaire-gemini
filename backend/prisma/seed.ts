// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  const password = 'adminpassword'; // Choisissez un mot de passe sécurisé !
  const hashedPassword = await bcrypt.hash(password, 10);

  // Étape 1 : Créer ou trouver l'utilisateur admin avec TOUS les champs requis
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@dinary.com' },
    update: {},
    create: {
      email: 'admin@dinary.com',
      username: 'Admin',
      fullName: 'Admin Dinary', // CHAMP OBLIGATOIRE AJOUTÉ
      phoneNumber: '+213500000000', // CHAMP OBLIGATOIRE AJOUTÉ (valeur de test)
      hashedPassword: hashedPassword,
      role: 'ADMIN',
      isVerified: true,
    },
  });

  console.log(`Admin user created/updated: ${adminUser.email}`);

  // Étape 2 : Créer le profil associé
  await prisma.userProfile.upsert({
    where: { userId: adminUser.id },
    update: {},
    create: {
      userId: adminUser.id,
      // Les autres champs comme 'level' et 'xp' ont des valeurs par défaut
    },
  });

  console.log(`Admin profile created/updated for: ${adminUser.email}`);

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
