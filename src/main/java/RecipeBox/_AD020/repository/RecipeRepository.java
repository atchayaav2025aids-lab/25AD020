package RecipeBox._AD020.repository;

import RecipeBox._AD020.model.Recipe;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RecipeRepository extends JpaRepository<Recipe, Long> {
}