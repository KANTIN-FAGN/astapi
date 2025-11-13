// prisma/seed.ts

import { PrismaClient } from '@prisma/client';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
    // create two dummy articles
    const post1 = await prisma.photo.upsert({
        where: { title: 'Smiling Vincent' },
        update: {},
        create: {
            title: 'Smiling Vincent',
            imagePath: '/uploads/vincent/vincent_1.png',
            description:
                "We are excited to Vincent today's",
        },
    });

    const post2 = await prisma.photo.upsert({
        where: { title: "Questioning Vincent" },
        update: {},
        create: {
            title: "Questioning Vincent",
            imagePath: '/uploads/vincent/vincent_2.jpg',
            description:
                'Learn with Vincent',
        },
    });

    console.log({ post1, post2 });
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

