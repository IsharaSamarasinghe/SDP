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
            where: { userId_roleId: { userId: admin.userId, roleId: adminRole.roleId } },
            update: {},
            create: { userId: admin.userId, roleId: adminRole.roleId },
        });
    }

    // 4. Create Organizer User
    const orgEmail = 'organizer@confiera.com';
    const orgPassword = 'OrganizerPassword123';
    const org = await prisma.user.upsert({
        where: { email: orgEmail },
        update: {},
        create: {
            email: orgEmail,
            passwordHash: await argon2.hash(orgPassword),
            firstName: 'Demo',
            lastName: 'Organizer',
            accountStatus: AccountStatus.ACTIVE,
            emailVerifiedAt: new Date(),
        },
    });
    const orgRole = await prisma.role.findUnique({ where: { roleName: 'Organizer' } });
    if (orgRole) {
        await prisma.userRole.upsert({
            where: { userId_roleId: { userId: org.userId, roleId: orgRole.roleId } },
            update: {},
            create: { userId: org.userId, roleId: orgRole.roleId },
        });
    }

    // 5. Create Evaluator User
    const evalEmail = 'evaluator@confiera.com';
    const evalPassword = 'EvaluatorPassword123';
    const evaluator = await prisma.user.upsert({
        where: { email: evalEmail },
        update: {},
        create: {
            email: evalEmail,
            passwordHash: await argon2.hash(evalPassword),
            firstName: 'Demo',
            lastName: 'Evaluator',
            accountStatus: AccountStatus.ACTIVE,
            emailVerifiedAt: new Date(),
        },
    });
    const evalRole = await prisma.role.findUnique({ where: { roleName: 'PanelEvaluator' } });
    if (evalRole) {
        await prisma.userRole.upsert({
            where: { userId_roleId: { userId: evaluator.userId, roleId: evalRole.roleId } },
            update: {},
            create: { userId: evaluator.userId, roleId: evalRole.roleId },
        });
    }

    console.log('Seed completed successfully!');
    console.log(`Admin User: ${adminEmail} / ${adminPassword}`);
    console.log(`Organizer User: ${orgEmail} / ${orgPassword}`);
    console.log(`Evaluator User: ${evalEmail} / ${evalPassword}`);

    await prisma.$disconnect();
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
