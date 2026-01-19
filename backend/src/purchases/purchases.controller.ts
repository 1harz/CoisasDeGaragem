import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('purchases')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class PurchasesController {
    constructor(private readonly purchasesService: PurchasesService) { }

    @Post()
    @Roles(UserRole.BUYER)
    create(@Body() createPurchaseDto: CreatePurchaseDto, @CurrentUser() user: any) {
        return this.purchasesService.create(createPurchaseDto, user.userId);
    }

    @Get('history')
    @Roles(UserRole.BUYER)
    getHistory(@CurrentUser() user: any) {
        return this.purchasesService.findAllByBuyer(user.userId);
    }

    @Get('sales')
    @Roles(UserRole.SELLER)
    getSales(@CurrentUser() user: any) {
        return this.purchasesService.findAllBySeller(user.userId);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @CurrentUser() user: any) {
        return this.purchasesService.findOne(id, user.userId);
    }
}
