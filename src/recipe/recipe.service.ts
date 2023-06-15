import { BadRequestException, Injectable } from '@nestjs/common'
import { IQuery } from 'src/dto/query.dto'
import { IRecipe } from 'src/dto/recipe.dto'
import { PrismaService } from 'src/prisma.service'
import { slugify } from 'src/services/slugify'

@Injectable()
export class RecipeService {
	constructor(private readonly prisma: PrismaService) {}

	async GetAllRecipes() {
		return await this.prisma.recipe.findMany()
	}

	async GetRecipes(query: IQuery) {
		return await this.prisma.recipe.findMany({
			where: {
				OR: [
					{
						name: {
							contains: query.find ? query.find : ''
						}
					},
					{
						description: {
							contains: query.find ? query.find : ''
						}
					},
					{
						instructions: {
							contains: query.find ? query.find : ''
						}
					},
					{
						slug: {
							contains: query.find ? query.find : ''
						}
					}
				]
			},
			skip: query.skip ? +query.skip : 0,
			take: query.take ? +query.take : 20
		})
	}

	async CreateRecipe(dto: IRecipe) {
		const {
			name,
			description,
			categorySlug,
			instructions,
			image,
			ingredients
		} = dto
		const recipeName = await this.prisma.recipe.findUnique({
			where: {
				name
			}
		})
		if (recipeName) throw new BadRequestException('Recipe name already exists')

		const slug = slugify(name)
		const recipeSlug = await this.prisma.recipe.findUnique({
			where: {
				slug
			}
		})
		if (recipeSlug) throw new BadRequestException('Recipe slug already exists')

		const recipeCategory = await this.prisma.category.findUnique({
			where: {
				slug: categorySlug
			}
		})
		if (!recipeCategory)
			throw new BadRequestException('Category does not exist')

		return await this.prisma.recipe.create({
			data: {
				name,
				description,
				slug,
				category: {
					connect: {
						slug: categorySlug
					}
				},
				instructions,
				image,
				ingredients
			}
		})
	}

	async UpdateRecipe(id: string, dto: IRecipe) {
		const {
			name,
			description,
			categorySlug,
			instructions,
			image,
			ingredients
		} = dto
		const recipe = await this.prisma.recipe.findUnique({
			where: {
				id
			}
		})
		if (!recipe) throw new BadRequestException('Recipe does not exist')

		if (recipe.name !== name) {
			const recipeName = await this.prisma.recipe.findUnique({
				where: {
					name
				}
			})
			if (recipeName)
				throw new BadRequestException('Recipe name already exists')
		}

		let slug = slugify(name)

		if (dto.slug) {
			slug = slugify(dto.slug)

			if (slug !== dto.slug) throw new BadRequestException('Slug is not valid')
		}

		if (recipe.slug !== slug) {
			const recipeSlug = await this.prisma.recipe.findUnique({
				where: {
					slug
				}
			})
			if (recipeSlug)
				throw new BadRequestException('Recipe slug already exists')
		}

		const recipeCategory = await this.prisma.category.findUnique({
			where: {
				slug: categorySlug
			}
		})
		if (!recipeCategory)
			throw new BadRequestException('Category does not exist')

		return await this.prisma.recipe.update({
			where: {
				id
			},
			data: {
				name,
				description,
				slug,
				category: {
					connect: {
						slug: categorySlug
					}
				},
				instructions,
				image,
				...ingredients
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
		const recipe = await this.prisma.recipe.findUnique({
			where: {
				slug
			}
		})

		if (!recipe) throw new BadRequestException('Recipe does not exist')

		return recipe
	}
}
