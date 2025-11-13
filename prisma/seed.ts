// prisma/seed.ts

import {PrismaClient} from '@prisma/client';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {

    const user1 = await prisma.user.upsert({
        where: {email: 'nathanael.pivot@ynov.com'},
        update: {},
        create: {
            email: 'nathanael.pivot@ynov.com',
            name: 'Nathanael PIVOT',
            password: 'password-nathanael',
        },
    });

    const user2 = await prisma.user.upsert({
        where: {email: 'kantin.fagniart@ynov.com'},
        update: {},
        create: {
            email: 'kantin.fagniart@ynov.com',
            name: 'Fantin FAGNIART',
            password: 'password-kantin',
        },
    });

    // create two dummy articles
    const post1 = await prisma.photo.upsert({
        where: {title: 'Smiling Vincent'},
        update: {
            authorId: user2.id,
        },
        create: {
            title: 'Smiling Vincent',
            imagePath: '/uploads/vincent/vincent_1.png',
            description:
                "We are excited to Vincent today's",
            authorId: user2.id,
        },
    });

    const post2 = await prisma.photo.upsert({
        where: {title: "Questioning Vincent"},
        update: {
            authorId: user1.id,
        },
        create: {
            title: "Questioning Vincent",
            imagePath: '/uploads/vincent/vincent_2.jpg',
            description:
                'Learn with Vincent',
            authorId: user1.id,
        },
    });

    console.log({user1, user2, post1, post2});
}

// execute the main function
main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        // close Prisma Client at the end
        await prisma.$disconnect();
    });

