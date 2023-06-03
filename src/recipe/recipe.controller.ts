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
import { IQuery } from './query.dto'
import { RecipeService } from './recipe.service'

@Controller('recipe')
export class RecipeController {
	constructor(private readonly recipeService: RecipeService) {}

	@Get()
	async GetRecipes(@Query() query: IQuery) {
		return await this.recipeService.GetRecipes(query)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post()
	@Auth()
	async CreateRecipe(@Body() dto: IRecipe) {
		return await this.recipeService.CreateRecipe(dto)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put('/:id')
	@Auth()
	async UpdateRecipe(@Param('id') id: string, @Body() dto: IRecipe) {
		return await this.recipeService.UpdateRecipe(id, dto)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Delete('/:id')
	@Auth()
	async DeleteRecipe(@Param('id') id: string) {
		return await this.recipeService.DeleteRecipe(id)
	}

	@Get('/:slug')
	async getBySlug(@Param('slug') slug: string) {
		return await this.recipeService.getBySlug(slug)
	}
}
