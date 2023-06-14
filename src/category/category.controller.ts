import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	Query,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { Auth } from 'src/decorators/auth.decorator'
import { ICategory } from 'src/dto/category.dto'
import { IQuery } from 'src/dto/query.dto'
import { CategoryService } from './category.service'

@Controller('category')
export class CategoryController {
	constructor(private readonly categoryService: CategoryService) {}

	@Get('/all')
	async GetAllCategories() {
		return await this.categoryService.GetAllCategories()
	}

	@Get()
	async GetCategories(@Query() query: IQuery) {
		return await this.categoryService.GetCategories(query)
	}

	@Post()
	@HttpCode(200)
	@UsePipes(new ValidationPipe())
	@Auth()
	async CreateCategory(@Body() dto: ICategory) {
		return await this.categoryService.CreateCategory(dto)
	}

	@Put('/:id')
	@HttpCode(200)
	@UsePipes(new ValidationPipe())
	@Auth()
	async UpdateCategory(@Param('id') id: string, @Body() dto: ICategory) {
		return await this.categoryService.UpdateCategory(id, dto)
	}

	@Delete('/:id')
	@HttpCode(200)
	@UsePipes(new ValidationPipe())
	@Auth()
	async DeleteCategory(@Param('id') id: string) {
		return await this.categoryService.DeleteCategory(id)
	}

	@Get('/:slug')
	async getBySlug(@Query() query: IQuery, @Param('slug') slug: string) {
		return await this.categoryService.getBySlug(slug, query)
	}
}
