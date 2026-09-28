package RecipeBox._AD020.service;

import RecipeBox._AD020.model.Recipe;
import RecipeBox._AD020.repository.RecipeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RecipeService {

    private final RecipeRepository recipeRepository;

    public RecipeService(RecipeRepository recipeRepository) {
        this.recipeRepository = recipeRepository;
    }

    // CREATE
    public Recipe addRecipe(Recipe recipe) {
        return recipeRepository.save(recipe);
    }

    // READ - all recipes
    public List<Recipe> getAllRecipes() {
        return recipeRepository.findAll();
    }

    // READ - one recipe
    public Optional<Recipe> getRecipeById(Long id) {
        return recipeRepository.findById(id);
    }

    // UPDATE
    public Recipe updateRecipe(Long id, Recipe recipe) {

        Recipe existingRecipe = recipeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Recipe not found"));

        existingRecipe.setName(recipe.getName());
        existingRecipe.setIngredients(recipe.getIngredients());
        existingRecipe.setSteps(recipe.getSteps());
        existingRecipe.setPrepTime(recipe.getPrepTime());
        existingRecipe.setCuisine(recipe.getCuisine());
        existingRecipe.setFavorite(recipe.getFavorite());

        return recipeRepository.save(existingRecipe);
    }

    // DELETE
    public void deleteRecipe(Long id) {
        recipeRepository.deleteById(id);
    }
}