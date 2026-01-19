import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PurchaseStatus } from '@prisma/client';

@Injectable()
export class AnalyticsService {
    constructor(private prisma: PrismaService) { }

    async getSellerAnalytics(sellerId: string) {
        const totalSales = await this.prisma.purchase.count({
            where: {
                sellerId,
                status: PurchaseStatus.COMPLETED,
            },
        });

        const revenueResult = await this.prisma.purchase.aggregate({
            where: {
                sellerId,
                status: PurchaseStatus.COMPLETED,
            },
            _sum: {
                price: true,
            },
        });

        const totalRevenue = revenueResult._sum.price || 0;

        const productsCount = await this.prisma.product.count({
            where: { sellerId },
        });

        return {
            totalSales,
            totalRevenue,
            productsCount,
        };
    }
}
