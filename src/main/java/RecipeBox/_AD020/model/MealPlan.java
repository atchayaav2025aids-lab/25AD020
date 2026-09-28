package RecipeBox._AD020.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "meal_plans")
public class MealPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate date;

    private String mealType;

    @ManyToOne
    @JoinColumn(name = "recipe_id")
    private Recipe recipe;

    public MealPlan() {
    }

    public MealPlan(LocalDate date, String mealType, Recipe recipe) {
        this.date = date;
        this.mealType = mealType;
        this.recipe = recipe;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getMealType() {
        return mealType;
    }

    public void setMealType(String mealType) {
        this.mealType = mealType;
    }

    public Recipe getRecipe() {
        return recipe;
    }

    public void setRecipe(Recipe recipe) {
        this.recipe = recipe;
    }
}
