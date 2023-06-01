import { BadRequestException, Injectable } from '@nestjs/common'
import { IRecipe, IRecipeUpdate } from 'src/dto/recipe.dto'
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

	async UpdateRecipe(dto: IRecipeUpdate) {
		const recipe = await this.prisma.recipe.findUnique({
			where: {
				id: dto.id
			}
		})
		if (!recipe) throw new BadRequestException('Recipe does not exist')

		if (recipe.name !== dto.name) {
			const name = await this.prisma.recipe.findUnique({
				where: {
					name: dto.name
				}
			})
			if (name) throw new BadRequestException('Recipe name already exists')
		}

		if (recipe.slug !== dto.slug) {
			const slug = await this.prisma.recipe.findUnique({
				where: {
					slug: dto.slug
				}
			})
			if (slug) throw new BadRequestException('Recipe slug already exists')
		}

		return await this.prisma.recipe.update({
			where: {
				id: dto.id
			},
			data: {
				name: dto.name,
				slug: dto.slug,
				description: dto.description,
				instructions: dto.instructions,
				image: dto.image,
				ingredients: dto.ingredients
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
