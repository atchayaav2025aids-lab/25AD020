package RecipeBox._AD020.service;

import RecipeBox._AD020.model.MealPlan;
import RecipeBox._AD020.model.Recipe;
import RecipeBox._AD020.repository.MealPlanRepository;
import RecipeBox._AD020.repository.RecipeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MealPlanService {

    private final MealPlanRepository mealPlanRepository;
    private final RecipeRepository recipeRepository;

    public MealPlanService(MealPlanRepository mealPlanRepository,
                           RecipeRepository recipeRepository) {
        this.mealPlanRepository = mealPlanRepository;
        this.recipeRepository = recipeRepository;
    }

    // CREATE
    public MealPlan addMealPlan(MealPlan mealPlan) {

        Long recipeId = mealPlan.getRecipe().getId();

        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new RuntimeException("Recipe not found"));

        mealPlan.setRecipe(recipe);

        return mealPlanRepository.save(mealPlan);
    }

    // READ ALL
    public List<MealPlan> getAllMealPlans() {
        return mealPlanRepository.findAll();
    }

    // READ ONE
    public Optional<MealPlan> getMealPlanById(Long id) {
        return mealPlanRepository.findById(id);
    }

    // UPDATE
    public MealPlan updateMealPlan(Long id, MealPlan mealPlan) {

        MealPlan existingMealPlan = mealPlanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Meal plan not found"));

        existingMealPlan.setDate(mealPlan.getDate());
        existingMealPlan.setMealType(mealPlan.getMealType());

        Long recipeId = mealPlan.getRecipe().getId();

        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new RuntimeException("Recipe not found"));

        existingMealPlan.setRecipe(recipe);

        return mealPlanRepository.save(existingMealPlan);
    }

    // DELETE
    public void deleteMealPlan(Long id) {
        mealPlanRepository.deleteById(id);
    }
}