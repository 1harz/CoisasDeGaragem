import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Post()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.SELLER)
    create(@Body() createProductDto: CreateProductDto, @CurrentUser() user: any) {
        return this.productsService.create(createProductDto, user.userId); // userId comes from JwtStrategy validate
    }

    @Get()
    findAll() {
        return this.productsService.findAll();
    }

    @Get('my-products')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.SELLER)
    getMyProducts(@CurrentUser() user: any) {
        return this.productsService.getSellerProducts(user.userId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.productsService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.SELLER)
    update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto, @CurrentUser() user: any) {
        return this.productsService.update(id, updateProductDto, user.userId);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.SELLER)
    remove(@Param('id') id: string, @CurrentUser() user: any) {
        return this.productsService.remove(id, user.userId);
    }
}
