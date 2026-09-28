package RecipeBox._AD020.repository;

import RecipeBox._AD020.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}