import { BadRequestException, Injectable } from '@nestjs/common'
import { Recipe } from '@prisma/client'
import { IRecipe } from 'src/dto/recipe.dto'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class RecipeService {
	constructor(private readonly prisma: PrismaService) {}

	async GetAllRecipes() {
		return await this.prisma.recipe.findMany({})
	}

	async CreateRecipe(dto: IRecipe) {
		const name = await this.prisma.recipe.findUnique({
			where: {
				name: dto.name
			}
		})
		if (name) throw new BadRequestException('Recipe name already exists')

		const recipe = await this.prisma.recipe.findUnique({
			where: {
				slug: dto.slug
			}
		})
		if (recipe) throw new BadRequestException('Recipe slug already exists')

		return await this.prisma.recipe.create({
			data: {
				...dto
			}
		})
	}

	async UpdateRecipe(dto: Recipe) {
		return await this.prisma.recipe.update({
			where: {
				id: dto.id
			},
			data: {
				...dto
			}
		})
	}

	async DeleteRecipe(id: string) {
		return await this.prisma.recipe.delete({
			where: {
				id
			}
		})
	}

	async getBySlug(slug: string) {
		return await this.prisma.recipe.findUnique({
			where: {
				slug
			}
		})
	}
}
