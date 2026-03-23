const { PrismaClient } = require('@prisma/client');

console.log('Imported PrismaClient');

try {
    const prisma = new PrismaClient();
    console.log('Successfully instantiated PrismaClient');

    async function main() {
        try {
            const users = await prisma.user.findMany();
            console.log('Successfully connected and fetched users:', users);
        } catch (e) {
            console.error('Error connecting to DB:', e);
        } finally {
            await prisma.$disconnect();
        }
    }

    main();
} catch (e) {
    console.error('Failed to instantiate PrismaClient:', e);
}
