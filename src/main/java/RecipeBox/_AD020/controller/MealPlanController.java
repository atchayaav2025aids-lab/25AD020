package RecipeBox._AD020.controller;

import RecipeBox._AD020.model.MealPlan;
import RecipeBox._AD020.service.MealPlanService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/meal-plans")
@CrossOrigin(origins = "*")
public class MealPlanController {

    private final MealPlanService mealPlanService;

    public MealPlanController(MealPlanService mealPlanService) {
        this.mealPlanService = mealPlanService;
    }

    // CREATE
    @PostMapping
    public MealPlan addMealPlan(@RequestBody MealPlan mealPlan) {
        return mealPlanService.addMealPlan(mealPlan);
    }

    // READ ALL
    @GetMapping
    public List<MealPlan> getAllMealPlans() {
        return mealPlanService.getAllMealPlans();
    }

    // READ ONE
    @GetMapping("/{id}")
    public ResponseEntity<MealPlan> getMealPlanById(@PathVariable Long id) {

        return mealPlanService.getMealPlanById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<MealPlan> updateMealPlan(
            @PathVariable Long id,
            @RequestBody MealPlan mealPlan) {

        try {
            return ResponseEntity.ok(
                    mealPlanService.updateMealPlan(id, mealPlan)
            );
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMealPlan(@PathVariable Long id) {

        try {
            mealPlanService.deleteMealPlan(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}