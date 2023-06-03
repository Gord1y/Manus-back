import { BadRequestException, Injectable } from '@nestjs/common'
import { IRecipe } from 'src/dto/recipe.dto'
import { PrismaService } from 'src/prisma.service'
import { IQuery } from './query.dto'

@Injectable()
export class RecipeService {
	constructor(private readonly prisma: PrismaService) {}

	async GetRecipes(query: IQuery) {
		return await this.prisma.recipe.findMany({
			where: {
				OR: [
					{
						name: {
							contains: query.find
						}
					},
					{
						slug: {
							contains: query.find
						}
					},
					{
						ingredients: {
							some: {
								name: {
									contains: query.find
								}
							}
						}
					}
				]
			},

			skip: query.skip ? +query.skip : 0,
			take: query.take ? +query.take : 20
		})
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

	async UpdateRecipe(id: string, dto: IRecipe) {
		const recipe = await this.prisma.recipe.findUnique({
			where: {
				id: id
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
				id: id
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
