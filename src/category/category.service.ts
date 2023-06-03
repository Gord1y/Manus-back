import { BadRequestException, Injectable } from '@nestjs/common'
import { ICategory } from 'src/dto/category.dto'
import { PrismaService } from 'src/prisma.service'
import { IQuery } from 'src/recipe/query.dto'

@Injectable()
export class CategoryService {
	constructor(private readonly prisma: PrismaService) {}

	async GetCategory(query: IQuery) {
		return await this.prisma.category.findMany({
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
					}
				]
			},
			skip: query.skip ? +query.skip : 0,
			take: query.take ? +query.take : 10
		})
	}

	async CreateCategory(dto: ICategory) {
		const slug = await this.prisma.category.findUnique({
			where: {
				slug: dto.slug
			}
		})
		if (slug) throw new BadRequestException('Category slug already exists')

		const name = await this.prisma.category.findUnique({
			where: {
				name: dto.name
			}
		})
		if (name) throw new BadRequestException('Category name already exists')

		return await this.prisma.category.create({
			data: {
				...dto
			}
		})
	}

	async UpdateCategory(id: string, dto: ICategory) {
		const Category = await this.prisma.category.findUnique({
			where: {
				id: id
			}
		})
		if (!Category) throw new BadRequestException('Category does not exist')

		if (Category.name !== dto.name) {
			const name = await this.prisma.category.findUnique({
				where: {
					name: dto.name
				}
			})
			if (name) throw new BadRequestException('Category name already exists')
		}

		if (Category.slug !== dto.slug) {
			const slug = await this.prisma.category.findUnique({
				where: {
					slug: dto.slug
				}
			})
			if (slug) throw new BadRequestException('Category slug already exists')
		}

		return await this.prisma.category.update({
			where: {
				id: id
			},
			data: {
				...dto
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

	async getBySlug(slug: string) {
		return await this.prisma.category.findUnique({
			where: {
				slug
			}
		})
	}
}
