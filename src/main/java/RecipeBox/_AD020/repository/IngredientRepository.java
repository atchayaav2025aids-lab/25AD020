package RecipeBox._AD020.repository;

import RecipeBox._AD020.model.Ingredient;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IngredientRepository extends JpaRepository<Ingredient, Long> {
}