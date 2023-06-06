import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	Query,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { Auth } from 'src/decorators/auth.decorator'
import { ICategory } from 'src/dto/category.dto'
import { IQuery } from 'src/recipe/query.dto'
import { CategoryService } from './category.service'

@Controller('category')
export class CategoryController {
	constructor(private readonly categoryService: CategoryService) {}

	@Get()
	async GetCategory(@Query() query: IQuery) {
		return await this.categoryService.GetCategory(query)
	}

	@UsePipes(new ValidationPipe())
	@Post()
	@Auth()
	async CreateCategory(@Body() dto: ICategory) {
		return await this.categoryService.CreateCategory(dto)
	}

	@UsePipes(new ValidationPipe())
	@Put('/:id')
	@Auth()
	async UpdateCategory(@Param('id') id: string, @Body() dto: ICategory) {
		return await this.categoryService.UpdateCategory(id, dto)
	}

	@UsePipes(new ValidationPipe())
	@Delete('/:id')
	@Auth()
	async DeleteCategory(@Param('id') id: string) {
		return await this.categoryService.DeleteCategory(id)
	}

	@Get('/:slug')
	async getBySlug(@Param('slug') slug: string) {
		return await this.categoryService.getBySlug(slug)
	}
}
