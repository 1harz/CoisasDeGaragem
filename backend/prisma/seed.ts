import { PrismaClient, UserRole, ProductCondition } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const password = await bcrypt.hash('password123', 10);

    const seller = await prisma.user.upsert({
        where: { email: 'seller@example.com' },
        update: {},
        create: {
            email: 'seller@example.com',
            name: 'John Seller',
            password,
            role: UserRole.SELLER,
        },
    });

    const buyer = await prisma.user.upsert({
        where: { email: 'buyer@example.com' },
        update: {},
        create: {
            email: 'buyer@example.com',
            name: 'Jane Buyer',
            password,
            role: UserRole.BUYER,
        },
    });

    const product = await prisma.product.create({
        data: {
            name: 'Vintage Lamp',
            description: 'A beautiful vintage lamp.',
            price: 50.0,
            sellerId: seller.id,
            condition: ProductCondition.GOOD,
            category: 'Home',
            qrCode: 'unique-qr-code-123',
        },
    });

    console.log({ seller, buyer, product });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
