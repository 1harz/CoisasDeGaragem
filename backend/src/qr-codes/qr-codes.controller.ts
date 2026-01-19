import { Controller, Get, Post, Param, Body, NotFoundException, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';

@Controller('qr-codes')
export class QrCodesController {
    constructor(private prisma: PrismaService) { }

    @Get(':productId')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    async getQRCode(@Param('productId') productId: string) {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product) {
            throw new NotFoundException('Product not found');
        }
        // Return mock Base64 QR code or generate one
        // Ideally we use a lib `qrcode`. For now, return a placeholder or generate simple one.
        // The frontend actually expects an IMAGE URL or Base64? Api says `getQRCode` returns `any`.
        // Mockapi returns: url: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=...'
        // So let's return that.
        return {
            url: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${product.qrCode}`,
            code: product.qrCode
        };
    }

    @Post('scan')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    async scanQRCode(@Body() data: { content: string }) {
        const product = await this.prisma.product.findUnique({
            where: { qrCode: data.content },
            include: { seller: true }
        });

        if (!product) {
            throw new NotFoundException('Invalid QR Code');
        }

        return {
            product,
            seller: product.seller
        };
    }
}
