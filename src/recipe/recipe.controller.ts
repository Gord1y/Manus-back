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
import { IRecipe } from 'src/dto/recipe.dto'
import { IQuery } from '../dto/query.dto'
import { RecipeService } from './recipe.service'

@Controller('recipe')
export class RecipeController {
	constructor(private readonly recipeService: RecipeService) {}

	@Get('/all')
	async GetAllRecipes() {
		return await this.recipeService.GetAllRecipes()
	}

	@Get()
	async GetRecipes(@Query() query: IQuery) {
		return await this.recipeService.GetRecipes(query)
	}

	@Post()
	@HttpCode(200)
	@UsePipes(new ValidationPipe())
	@Auth()
	async CreateRecipe(@Body() dto: IRecipe) {
		return await this.recipeService.CreateRecipe(dto)
	}

	@Put('/:id')
	@HttpCode(200)
	@UsePipes(new ValidationPipe())
	@Auth()
	async UpdateRecipe(@Param('id') id: string, @Body() dto: IRecipe) {
		return await this.recipeService.UpdateRecipe(id, dto)
	}

	@Delete('/:id')
	@HttpCode(200)
	@UsePipes(new ValidationPipe())
	@Auth()
	async DeleteRecipe(@Param('id') id: string) {
		return await this.recipeService.DeleteRecipe(id)
	}

	@Get('/:slug')
	async getBySlug(@Param('slug') slug: string) {
		return await this.recipeService.getBySlug(slug)
	}
}
