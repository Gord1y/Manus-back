import { Module } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { AuthModule } from './auth/auth.module'
import { JwtService } from '@nestjs/jwt'
import { RecipeModule } from './recipe/recipe.module';
import { CategoryModule } from './category/category.module';

@Module({
	imports: [AuthModule, RecipeModule, CategoryModule],
	controllers: [],
	providers: [PrismaClient, JwtService]
})
export class AppModule {}
