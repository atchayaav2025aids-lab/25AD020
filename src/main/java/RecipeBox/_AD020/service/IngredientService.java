package RecipeBox._AD020.service;

import RecipeBox._AD020.model.Ingredient;
import RecipeBox._AD020.repository.IngredientRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class IngredientService {

    private final IngredientRepository ingredientRepository;

    public IngredientService(IngredientRepository ingredientRepository) {
        this.ingredientRepository = ingredientRepository;
    }

    // CREATE
    public Ingredient addIngredient(Ingredient ingredient) {
        return ingredientRepository.save(ingredient);
    }

    // READ ALL
    public List<Ingredient> getAllIngredients() {
        return ingredientRepository.findAll();
    }

    // READ ONE
    public Optional<Ingredient> getIngredientById(Long id) {
        return ingredientRepository.findById(id);
    }

    // UPDATE
    public Ingredient updateIngredient(Long id, Ingredient ingredient) {

        Ingredient existingIngredient = ingredientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ingredient not found"));

        existingIngredient.setName(ingredient.getName());
        existingIngredient.setQuantity(ingredient.getQuantity());
        existingIngredient.setUnit(ingredient.getUnit());

        return ingredientRepository.save(existingIngredient);
    }

    // DELETE
    public void deleteIngredient(Long id) {
        ingredientRepository.deleteById(id);
    }
}