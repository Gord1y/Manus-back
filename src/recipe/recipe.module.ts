import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { RecipeController } from './recipe.controller'
import { RecipeService } from './recipe.service'

@Module({
	controllers: [RecipeController],
	providers: [RecipeService, PrismaService]
})
export class RecipeModule {}
