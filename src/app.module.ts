import { Module } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { AuthModule } from './auth/auth.module'
import { JwtService } from '@nestjs/jwt'
import { RecipeModule } from './recipe/recipe.module';

@Module({
	imports: [AuthModule, RecipeModule],
	controllers: [],
	providers: [PrismaClient, JwtService]
})
export class AppModule {}
