import { PrismaClient, AccountStatus } from '@prisma/client';
import * as argon2 from 'argon2';

async function main() {
    const prisma = new PrismaClient();

    console.log('Seed starting...');

    // 1. Ensure Roles exist
    const roles = ['Admin', 'Organizer', 'Participant', 'Author', 'PanelEvaluator'];
    for (const roleName of roles) {
        await prisma.role.upsert({
            where: { roleName },
            update: {},
            create: { roleName },
        });
    }

    // 2. Create Admin User
    const adminEmail = 'admin@confiera.com';
    const adminPassword = 'AdminPassword123';
    const hashedPassword = await argon2.hash(adminPassword);

    const admin = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {},
        create: {
            email: adminEmail,
            passwordHash: hashedPassword,
            firstName: 'System',
            lastName: 'Admin',
            accountStatus: AccountStatus.ACTIVE,
            emailVerifiedAt: new Date(),
        },
    });

    // 3. Assign Admin Role
    const adminRole = await prisma.role.findUnique({ where: { roleName: 'Admin' } });
    if (adminRole) {
        await prisma.userRole.upsert({
            where: {
                userId_roleId: {
                    userId: admin.userId,
                    roleId: adminRole.roleId,
                },
            },
            update: {},
            create: {
                userId: admin.userId,
                roleId: adminRole.roleId,
            },
        });
    }

    console.log('Seed completed successfully!');
    console.log(`Admin User: ${adminEmail}`);
    console.log(`Admin Password: ${adminPassword}`);

    await prisma.$disconnect();
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
