import { BadRequestException, Injectable } from '@nestjs/common'
import { ICategory } from 'src/dto/category.dto'
import { IQuery } from 'src/dto/query.dto'
import { PrismaService } from 'src/prisma.service'
import { slugify } from 'src/services/slugify'

@Injectable()
export class CategoryService {
	constructor(private readonly prisma: PrismaService) {}

	async GetAllCategories() {
		return await this.prisma.category.findMany()
	}

	async GetCategories(query: IQuery) {
		return await this.prisma.category.findMany({
			skip: query.skip ? Number(query.skip) : 0,
			take: query.take ? Number(query.take) : 20,
			where: {
				OR: [
					{
						name: { contains: query.find ? query.find : '' }
					},
					{
						slug: { contains: query.find ? query.find : '' }
					}
				]
			}
		})
	}

	async CreateCategory(dto: ICategory) {
		const { name } = dto

		const categoryName = await this.prisma.category.findUnique({
			where: {
				name
			}
		})
		if (categoryName)
			throw new BadRequestException('Category name already exists')

		const slug = slugify(dto.name)

		const categorySlug = await this.prisma.category.findUnique({
			where: {
				slug
			}
		})
		if (categorySlug)
			throw new BadRequestException('Category slug already exists')

		return await this.prisma.category.create({
			data: {
				name: name,
				slug: slugify(name)
			}
		})
	}

	async UpdateCategory(id: string, dto: ICategory) {
		const { name } = dto
		const category = await this.prisma.category.findUnique({
			where: {
				id
			}
		})
		if (!category) throw new BadRequestException('Category does not exist')

		if (category.name !== name) {
			const categoryName = await this.prisma.category.findUnique({
				where: {
					name
				}
			})
			if (categoryName)
				throw new BadRequestException('Category name already exists')
		}

		let slug = slugify(name)

		if (dto.slug) {
			slug = slugify(dto.slug)

			if (slug !== dto.slug) throw new BadRequestException('Slug is not valid')
		}

		if (category.slug !== slug) {
			const categorySlug = await this.prisma.category.findUnique({
				where: {
					slug
				}
			})
			if (categorySlug)
				throw new BadRequestException('Category slug already exists')
		}

		return await this.prisma.category.update({
			where: {
				id: id
			},
			data: {
				name,
				slug
			}
		})
	}

	async DeleteCategory(id: string) {
		return await this.prisma.category.delete({
			where: {
				id
			}
		})
	}

	async getBySlug(slug: string, query: IQuery) {
		return await this.prisma.recipe.findMany({
			where: {
				AND: [
					{
						categorySlug: slug
					},
					{
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
					}
				]
			},
			skip: query.skip ? Number(query.skip) : 0,
			take: query.take ? Number(query.take) : 20
		})
	}
}
