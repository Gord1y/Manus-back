import { BadRequestException, Injectable } from '@nestjs/common'
import { ICategory } from 'src/dto/category.dto'
import { IQuery } from 'src/dto/query.dto'
import { PrismaService } from 'src/prisma.service'
import { slugify } from 'src/services/slugify'

@Injectable()
export class CategoryService {
	constructor(private readonly prisma: PrismaService) {}

	async GetCategory(query: IQuery) {
		return await this.prisma.category.findMany({
			skip: query.skip ? query.skip : 0,
			take: query.take ? query.take : 20,
			where: {
				name: { contains: query.find }
			}
		})
	}

	async CreateCategory() {
		return await this.prisma.category.create({
			data: {
				name: '',
				slug: ''
			}
		})
	}

	async UpdateCategory(id: string, dto: ICategory) {
		const { name } = dto
		const slug = slugify(dto.name)
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

	async getBySlug(slug: string) {
		return await this.prisma.category.findUnique({
			where: {
				slug
			}
		})
	}
}
