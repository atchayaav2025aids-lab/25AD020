// ============================================================
// RECIPEBOX - COMPLETE SCRIPT.JS
// ============================================================

// =========================
// API URL
// =========================

const API_URL = "http://localhost:8080/api";


// ============================================================
// GENERAL SECTION CONTROL
// ============================================================

function showSection(sectionId) {

    const sections = document.querySelectorAll(".page-section");

    sections.forEach(section => {
        section.classList.add("hidden");
    });

    const selectedSection = document.getElementById(sectionId);

    if (selectedSection) {
        selectedSection.classList.remove("hidden");
    }

    // Load data whenever section is opened
    if (sectionId === "dashboard") {
        loadDashboard();
    }

    if (sectionId === "recipes") {
        loadRecipes();
    }

    if (sectionId === "ingredients") {
        loadIngredients();
    }

    if (sectionId === "mealplans") {
        loadMealPlans();
    }

    if (sectionId === "users") {
        loadUsers();
    }
}


// ============================================================
// DASHBOARD
// ============================================================

async function loadDashboard() {

    try {

        const [
            recipesResponse,
            ingredientsResponse,
            mealPlansResponse,
            usersResponse
        ] = await Promise.all([
            fetch(`${API_URL}/recipes`),
            fetch(`${API_URL}/ingredients`),
            fetch(`${API_URL}/meal-plans`),
            fetch(`${API_URL}/users`)
        ]);

        if (!recipesResponse.ok) {
            throw new Error("Could not load recipes.");
        }

        if (!ingredientsResponse.ok) {
            throw new Error("Could not load ingredients.");
        }

        if (!mealPlansResponse.ok) {
            throw new Error("Could not load meal plans.");
        }

        if (!usersResponse.ok) {
            throw new Error("Could not load users.");
        }


        const recipes = await recipesResponse.json();
        const ingredients = await ingredientsResponse.json();
        const mealPlans = await mealPlansResponse.json();
        const users = await usersResponse.json();


        console.log("Dashboard Recipes:", recipes);
        console.log("Dashboard Ingredients:", ingredients);
        console.log("Dashboard Meal Plans:", mealPlans);
        console.log("Dashboard Users:", users);


        // =========================
        // UPDATE COUNTS
        // =========================

        document.getElementById("recipeCount").textContent =
            recipes.length;

        document.getElementById("ingredientCount").textContent =
            ingredients.length;

        document.getElementById("mealPlanCount").textContent =
            mealPlans.length;

        document.getElementById("userCount").textContent =
            users.length;


        // =========================
        // RECENT RECIPES
        // =========================

        const recentRecipes =
            document.getElementById("recentRecipes");

        recentRecipes.innerHTML = "";


        if (recipes.length === 0) {

            recentRecipes.innerHTML = `
                <div class="card">
                    <p>No recipes available.</p>
                </div>
            `;

            return;
        }


        recipes
            .slice(-3)
            .reverse()
            .forEach(recipe => {

                const card = document.createElement("div");

                card.className = "card";

                card.innerHTML = `
                    <h3>${escapeHtml(recipe.name)}</h3>

                    <p>
                        <strong>Cuisine:</strong>
                        ${escapeHtml(recipe.cuisine || "Not specified")}
                    </p>

                    <p>
                        <strong>Prep Time:</strong>
                        ${recipe.prepTime || 0} minutes
                    </p>

                    <p>
                        ${escapeHtml(recipe.steps || "")}
                    </p>
                `;

                recentRecipes.appendChild(card);
            });


    } catch (error) {

        console.error("Dashboard loading error:", error);

    }
}


// ============================================================
// RECIPES
// ============================================================

function openRecipeForm() {

    document.getElementById("recipeForm").classList.remove("hidden");

    document.getElementById("recipeId").value = "";
    document.getElementById("recipeName").value = "";
    document.getElementById("recipeIngredients").value = "";
    document.getElementById("recipeSteps").value = "";
    document.getElementById("recipePrepTime").value = "";
    document.getElementById("recipeCuisine").value = "";
    document.getElementById("recipeFavorite").checked = false;
}


function closeRecipeForm() {

    document.getElementById("recipeForm").classList.add("hidden");

    document.getElementById("recipeId").value = "";
    document.getElementById("recipeName").value = "";
    document.getElementById("recipeIngredients").value = "";
    document.getElementById("recipeSteps").value = "";
    document.getElementById("recipePrepTime").value = "";
    document.getElementById("recipeCuisine").value = "";
    document.getElementById("recipeFavorite").checked = false;
}


async function loadRecipes() {

    try {

        const response =
            await fetch(`${API_URL}/recipes`);

        if (!response.ok) {
            throw new Error("Could not load recipes.");
        }

        const recipes = await response.json();

        console.log("Recipes:", recipes);

        const recipeList =
            document.getElementById("recipeList");

        recipeList.innerHTML = "";


        if (recipes.length === 0) {

            recipeList.innerHTML = `
                <div class="card">
                    <p>No recipes available.</p>
                </div>
            `;

            return;
        }


        recipes.forEach(recipe => {

            const card =
                document.createElement("div");

            card.className = "card";


            card.innerHTML = `

                <h3>
                    🍲 ${escapeHtml(recipe.name)}
                </h3>

                <p>
                    <strong>Ingredients:</strong><br>
                    ${escapeHtml(recipe.ingredients || "")}
                </p>

                <p>
                    <strong>Steps:</strong><br>
                    ${escapeHtml(recipe.steps || "")}
                </p>

                <p>
                    <strong>Preparation Time:</strong>
                    ${recipe.prepTime || 0} minutes
                </p>

                <p>
                    <strong>Cuisine:</strong>
                    ${escapeHtml(recipe.cuisine || "")}
                </p>

                <p>
                    <strong>Favorite:</strong>
                    ${recipe.favorite ? "Yes ❤️" : "No"}
                </p>

                <div class="card-actions">

                    <button
                        class="edit-btn"
                        onclick="editRecipe(${recipe.id})">
                        Edit
                    </button>

                    <button
                        class="delete-btn"
                        onclick="deleteRecipe(${recipe.id})">
                        Delete
                    </button>

                </div>
            `;

            recipeList.appendChild(card);
        });


    } catch (error) {

        console.error("Recipe loading error:", error);

        alert(
            "Could not load recipes.\n\n" +
            error.message
        );
    }
}


async function saveRecipe() {

    const id =
        document.getElementById("recipeId").value;

    const name =
        document.getElementById("recipeName").value.trim();

    const ingredients =
        document.getElementById("recipeIngredients").value.trim();

    const steps =
        document.getElementById("recipeSteps").value.trim();

    const prepTimeValue =
        document.getElementById("recipePrepTime").value;

    const cuisine =
        document.getElementById("recipeCuisine").value.trim();

    const favorite =
        document.getElementById("recipeFavorite").checked;


    // =========================
    // VALIDATION
    // =========================

    if (!name) {
        alert("Please enter Recipe Name.");
        return;
    }

    if (!ingredients) {
        alert("Please enter Ingredients.");
        return;
    }

    if (!steps) {
        alert("Please enter Cooking Steps.");
        return;
    }

    if (!prepTimeValue) {
        alert("Please enter Preparation Time.");
        return;
    }

    if (!cuisine) {
        alert("Please enter Cuisine.");
        return;
    }


    const prepTime = Number(prepTimeValue);


    if (!Number.isInteger(prepTime) || prepTime < 0) {

        alert(
            "Please enter a valid Preparation Time."
        );

        return;
    }


    // =========================
    // RECIPE OBJECT
    // =========================

    const recipe = {

        name: name,

        ingredients: ingredients,

        steps: steps,

        prepTime: prepTime,

        cuisine: cuisine,

        favorite: favorite
    };


    console.log("Sending recipe:", recipe);


    try {

        let response;


        // =========================
        // UPDATE
        // =========================

        if (id) {

            response = await fetch(
                `${API_URL}/recipes/${id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(recipe)
                }
            );

        }


            // =========================
            // CREATE
        // =========================

        else {

            response = await fetch(
                `${API_URL}/recipes`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(recipe)
                }
            );
        }


        const responseText =
            await response.text();


        console.log(
            "Recipe backend response:",
            response.status,
            responseText
        );


        if (!response.ok) {

            alert(
                "Recipe could not be saved.\n\n" +
                "Status: " +
                response.status +
                "\n\nBackend message:\n" +
                responseText
            );

            return;
        }


        alert("Recipe saved successfully!");


        closeRecipeForm();

        loadRecipes();

        loadDashboard();


    } catch (error) {

        console.error(
            "Recipe error:",
            error
        );

        alert(
            "Could not connect to backend.\n\n" +
            error.message
        );
    }
}


async function editRecipe(id) {

    try {

        const response =
            await fetch(`${API_URL}/recipes/${id}`);


        if (!response.ok) {

            throw new Error(
                "Could not load recipe."
            );
        }


        const recipe =
            await response.json();


        document.getElementById("recipeId").value =
            recipe.id;

        document.getElementById("recipeName").value =
            recipe.name || "";

        document.getElementById("recipeIngredients").value =
            recipe.ingredients || "";

        document.getElementById("recipeSteps").value =
            recipe.steps || "";

        document.getElementById("recipePrepTime").value =
            recipe.prepTime || "";

        document.getElementById("recipeCuisine").value =
            recipe.cuisine || "";

        document.getElementById("recipeFavorite").checked =
            recipe.favorite === true;


        document.getElementById("recipeForm")
            .classList.remove("hidden");


    } catch (error) {

        console.error(
            "Edit recipe error:",
            error
        );

        alert(
            "Could not load recipe.\n\n" +
            error.message
        );
    }
}


async function deleteRecipe(id) {

    if (!confirm("Are you sure you want to delete this recipe?")) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/recipes/${id}`,
                {
                    method: "DELETE"
                }
            );


        const responseText =
            await response.text();


        if (!response.ok) {

            alert(
                "Recipe could not be deleted.\n\n" +
                "Status: " +
                response.status +
                "\n\n" +
                responseText
            );

            return;
        }


        alert("Recipe deleted successfully!");


        loadRecipes();

        loadDashboard();


    } catch (error) {

        console.error(
            "Delete recipe error:",
            error
        );

        alert(
            "Could not connect to backend.\n\n" +
            error.message
        );
    }
}


// ============================================================
// INGREDIENTS
// ============================================================

function openIngredientForm() {

    document.getElementById("ingredientForm")
        .classList.remove("hidden");

    document.getElementById("ingredientId").value = "";

    document.getElementById("ingredientName").value = "";

    document.getElementById("ingredientQuantity").value = "";
}


function closeIngredientForm() {

    document.getElementById("ingredientForm")
        .classList.add("hidden");

    document.getElementById("ingredientId").value = "";

    document.getElementById("ingredientName").value = "";

    document.getElementById("ingredientQuantity").value = "";
}


async function loadIngredients() {

    try {

        const response =
            await fetch(`${API_URL}/ingredients`);


        if (!response.ok) {

            throw new Error(
                "Could not load ingredients."
            );
        }


        const ingredients =
            await response.json();


        console.log(
            "Ingredients:",
            ingredients
        );


        const ingredientList =
            document.getElementById("ingredientList");


        ingredientList.innerHTML = "";


        if (ingredients.length === 0) {

            ingredientList.innerHTML = `
                <div class="card">
                    <p>No ingredients available.</p>
                </div>
            `;

            return;
        }


        ingredients.forEach(ingredient => {

            const card =
                document.createElement("div");


            card.className = "card";


            card.innerHTML = `

                <h3>
                    🥕 ${escapeHtml(ingredient.name)}
                </h3>

                <p>
                    <strong>Quantity:</strong>
                    ${escapeHtml(ingredient.quantity || "")}
                </p>

                <div class="card-actions">

                    <button
                        class="edit-btn"
                        onclick="editIngredient(${ingredient.id})">
                        Edit
                    </button>

                    <button
                        class="delete-btn"
                        onclick="deleteIngredient(${ingredient.id})">
                        Delete
                    </button>

                </div>
            `;


            ingredientList.appendChild(card);

        });


    } catch (error) {

        console.error(
            "Ingredient loading error:",
            error
        );

        alert(
            "Could not load ingredients.\n\n" +
            error.message
        );
    }
}


async function saveIngredient() {

    const id =
        document.getElementById("ingredientId").value;

    const name =
        document.getElementById("ingredientName").value.trim();

    const quantity =
        document.getElementById("ingredientQuantity").value.trim();


    if (!name) {

        alert(
            "Please enter Ingredient Name."
        );

        return;
    }


    if (!quantity) {

        alert(
            "Please enter Quantity."
        );

        return;
    }


    const ingredient = {

        name: name,

        quantity: quantity
    };


    console.log(
        "Sending ingredient:",
        ingredient
    );


    try {

        let response;


        if (id) {

            response = await fetch(
                `${API_URL}/ingredients/${id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(ingredient)
                }
            );

        } else {

            response = await fetch(
                `${API_URL}/ingredients`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(ingredient)
                }
            );
        }


        const responseText =
            await response.text();


        console.log(
            "Ingredient backend response:",
            response.status,
            responseText
        );


        if (!response.ok) {

            alert(
                "Ingredient could not be saved.\n\n" +
                "Status: " +
                response.status +
                "\n\nBackend message:\n" +
                responseText
            );

            return;
        }


        alert(
            "Ingredient saved successfully!"
        );


        closeIngredientForm();

        loadIngredients();

        loadDashboard();


    } catch (error) {

        console.error(
            "Ingredient error:",
            error
        );

        alert(
            "Could not connect to backend.\n\n" +
            error.message
        );
    }
}


async function editIngredient(id) {

    try {

        const response =
            await fetch(
                `${API_URL}/ingredients/${id}`
            );


        if (!response.ok) {

            throw new Error(
                "Could not load ingredient."
            );
        }


        const ingredient =
            await response.json();


        document.getElementById("ingredientId").value =
            ingredient.id;

        document.getElementById("ingredientName").value =
            ingredient.name || "";

        document.getElementById("ingredientQuantity").value =
            ingredient.quantity || "";


        document.getElementById("ingredientForm")
            .classList.remove("hidden");


    } catch (error) {

        console.error(
            "Edit ingredient error:",
            error
        );

        alert(
            "Could not load ingredient.\n\n" +
            error.message
        );
    }
}


async function deleteIngredient(id) {

    if (
        !confirm(
            "Are you sure you want to delete this ingredient?"
        )
    ) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/ingredients/${id}`,
                {
                    method: "DELETE"
                }
            );


        const responseText =
            await response.text();


        if (!response.ok) {

            alert(
                "Ingredient could not be deleted.\n\n" +
                "Status: " +
                response.status +
                "\n\n" +
                responseText
            );

            return;
        }


        alert(
            "Ingredient deleted successfully!"
        );


        loadIngredients();

        loadDashboard();


    } catch (error) {

        console.error(
            "Delete ingredient error:",
            error
        );

        alert(
            "Could not connect to backend.\n\n" +
            error.message
        );
    }
}


// ============================================================
// MEAL PLANS
// ============================================================

function openMealPlanForm() {

    document.getElementById("mealPlanForm")
        .classList.remove("hidden");

    document.getElementById("mealPlanId").value = "";

    document.getElementById("mealPlanDate").value = "";

    document.getElementById("mealPlanType").value = "";

    document.getElementById("mealPlanRecipeId").value = "";
}


function closeMealPlanForm() {

    document.getElementById("mealPlanForm")
        .classList.add("hidden");

    document.getElementById("mealPlanId").value = "";

    document.getElementById("mealPlanDate").value = "";

    document.getElementById("mealPlanType").value = "";

    document.getElementById("mealPlanRecipeId").value = "";
}


async function loadMealPlans() {

    try {

        const response =
            await fetch(`${API_URL}/meal-plans`);


        if (!response.ok) {

            throw new Error(
                "Could not load meal plans."
            );
        }


        const mealPlans =
            await response.json();


        console.log(
            "Meal Plans:",
            mealPlans
        );


        const mealPlanList =
            document.getElementById("mealPlanList");


        mealPlanList.innerHTML = "";


        if (mealPlans.length === 0) {

            mealPlanList.innerHTML = `
                <div class="card">
                    <p>No meal plans available.</p>
                </div>
            `;

            return;
        }


        mealPlans.forEach(mealPlan => {

            const card =
                document.createElement("div");


            card.className = "card";


            const recipeName =
                mealPlan.recipe &&
                mealPlan.recipe.name
                    ? mealPlan.recipe.name
                    : "Recipe ID " +
                    (
                        mealPlan.recipe
                            ? mealPlan.recipe.id
                            : ""
                    );


            const recipeId =
                mealPlan.recipe
                    ? mealPlan.recipe.id
                    : "";


            card.innerHTML = `

                <h3>
                    📅 ${escapeHtml(mealPlan.mealType || "")}
                </h3>

                <p>
                    <strong>Date:</strong>
                    ${escapeHtml(mealPlan.date || "")}
                </p>

                <p>
                    <strong>Recipe:</strong>
                    ${escapeHtml(recipeName)}
                </p>

                <p>
                    <strong>Recipe ID:</strong>
                    ${recipeId}
                </p>

                <div class="card-actions">

                    <button
                        class="edit-btn"
                        onclick="editMealPlan(${mealPlan.id})">
                        Edit
                    </button>

                    <button
                        class="delete-btn"
                        onclick="deleteMealPlan(${mealPlan.id})">
                        Delete
                    </button>

                </div>
            `;


            mealPlanList.appendChild(card);

        });


    } catch (error) {

        console.error(
            "Meal plan loading error:",
            error
        );

        alert(
            "Could not load meal plans.\n\n" +
            error.message
        );
    }
}


async function saveMealPlan() {

    const id =
        document.getElementById("mealPlanId").value;

    const date =
        document.getElementById("mealPlanDate").value;

    const mealType =
        document.getElementById("mealPlanType").value;

    const recipeIdValue =
        document.getElementById("mealPlanRecipeId").value;


    // =========================
    // VALIDATION
    // =========================

    if (!date) {

        alert(
            "Please select a date."
        );

        return;
    }


    if (!mealType) {

        alert(
            "Please select a meal type."
        );

        return;
    }


    if (!recipeIdValue) {

        alert(
            "Please enter a Recipe ID."
        );

        return;
    }


    const recipeId =
        Number(recipeIdValue);


    if (
        !Number.isInteger(recipeId) ||
        recipeId <= 0
    ) {

        alert(
            "Please enter a valid Recipe ID."
        );

        return;
    }


    // =========================
    // MEAL PLAN DATA
    // =========================

    const mealPlan = {

        date: date,

        mealType: mealType,

        recipe: {
            id: recipeId
        }
    };


    console.log(
        "Sending meal plan:",
        mealPlan
    );


    try {

        let response;


        // =========================
        // UPDATE
        // =========================

        if (id) {

            response = await fetch(
                `${API_URL}/meal-plans/${id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(mealPlan)
                }
            );

        }


            // =========================
            // CREATE
        // =========================

        else {

            response = await fetch(
                `${API_URL}/meal-plans`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(mealPlan)
                }
            );
        }


        // =========================
        // BACKEND RESPONSE
        // =========================

        const responseText =
            await response.text();


        console.log(
            "Meal plan backend response:",
            response.status,
            responseText
        );


        if (!response.ok) {

            alert(
                "Meal Plan could not be saved.\n\n" +
                "Status: " +
                response.status +
                "\n\nBackend message:\n" +
                responseText
            );

            return;
        }


        // =========================
        // SUCCESS
        // =========================

        alert(
            "Meal plan saved successfully!"
        );


        closeMealPlanForm();

        loadMealPlans();

        loadDashboard();


    } catch (error) {

        console.error(
            "Meal plan error:",
            error
        );

        alert(
            "Could not connect to the backend.\n\n" +
            error.message
        );
    }
}


async function editMealPlan(id) {

    try {

        const response =
            await fetch(
                `${API_URL}/meal-plans/${id}`
            );


        if (!response.ok) {

            throw new Error(
                "Could not load meal plan."
            );
        }


        const mealPlan =
            await response.json();


        document.getElementById("mealPlanId").value =
            mealPlan.id;


        document.getElementById("mealPlanDate").value =
            mealPlan.date || "";


        document.getElementById("mealPlanType").value =
            mealPlan.mealType || "";


        if (mealPlan.recipe) {

            document.getElementById(
                "mealPlanRecipeId"
            ).value =
                mealPlan.recipe.id || "";
        }


        document.getElementById("mealPlanForm")
            .classList.remove("hidden");


    } catch (error) {

        console.error(
            "Edit meal plan error:",
            error
        );

        alert(
            "Could not load meal plan.\n\n" +
            error.message
        );
    }
}


async function deleteMealPlan(id) {

    if (
        !confirm(
            "Are you sure you want to delete this meal plan?"
        )
    ) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/meal-plans/${id}`,
                {
                    method: "DELETE"
                }
            );


        const responseText =
            await response.text();


        if (!response.ok) {

            alert(
                "Meal plan could not be deleted.\n\n" +
                "Status: " +
                response.status +
                "\n\n" +
                responseText
            );

            return;
        }


        alert(
            "Meal plan deleted successfully!"
        );


        loadMealPlans();

        loadDashboard();


    } catch (error) {

        console.error(
            "Delete meal plan error:",
            error
        );

        alert(
            "Could not connect to backend.\n\n" +
            error.message
        );
    }
}


// ============================================================
// USERS
// ============================================================

function openUserForm() {

    document.getElementById("userForm")
        .classList.remove("hidden");

    document.getElementById("userId").value = "";

    document.getElementById("userName").value = "";
}


function closeUserForm() {

    document.getElementById("userForm")
        .classList.add("hidden");

    document.getElementById("userId").value = "";

    document.getElementById("userName").value = "";
}


async function loadUsers() {

    try {

        const response =
            await fetch(`${API_URL}/users`);


        if (!response.ok) {

            throw new Error(
                "Could not load users."
            );
        }


        const users =
            await response.json();


        console.log(
            "Users:",
            users
        );


        const userList =
            document.getElementById("userList");


        userList.innerHTML = "";


        if (users.length === 0) {

            userList.innerHTML = `
                <div class="card">
                    <p>No users available.</p>
                </div>
            `;

            return;
        }


        users.forEach(user => {

            const card =
                document.createElement("div");


            card.className = "card";


            card.innerHTML = `

                <h3>
                    👤 ${escapeHtml(user.name || "")}
                </h3>

                <p>
                    <strong>User ID:</strong>
                    ${user.id}
                </p>

                <div class="card-actions">

                    <button
                        class="edit-btn"
                        onclick="editUser(${user.id})">
                        Edit
                    </button>

                    <button
                        class="delete-btn"
                        onclick="deleteUser(${user.id})">
                        Delete
                    </button>

                </div>
            `;


            userList.appendChild(card);

        });


    } catch (error) {

        console.error(
            "User loading error:",
            error
        );

        alert(
            "Could not load users.\n\n" +
            error.message
        );
    }
}


async function saveUser() {

    const id =
        document.getElementById("userId").value;

    const name =
        document.getElementById("userName").value.trim();


    if (!name) {

        alert(
            "Please enter User Name."
        );

        return;
    }


    const user = {

        name: name
    };


    console.log(
        "Sending user:",
        user
    );


    try {

        let response;


        if (id) {

            response = await fetch(
                `${API_URL}/users/${id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(user)
                }
            );

        } else {

            response = await fetch(
                `${API_URL}/users`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(user)
                }
            );
        }


        const responseText =
            await response.text();


        console.log(
            "User backend response:",
            response.status,
            responseText
        );


        if (!response.ok) {

            alert(
                "User could not be saved.\n\n" +
                "Status: " +
                response.status +
                "\n\nBackend message:\n" +
                responseText
            );

            return;
        }


        alert(
            "User saved successfully!"
        );


        closeUserForm();

        loadUsers();

        loadDashboard();


    } catch (error) {

        console.error(
            "User error:",
            error
        );

        alert(
            "Could not connect to backend.\n\n" +
            error.message
        );
    }
}


async function editUser(id) {

    try {

        const response =
            await fetch(
                `${API_URL}/users/${id}`
            );


        if (!response.ok) {

            throw new Error(
                "Could not load user."
            );
        }


        const user =
            await response.json();


        document.getElementById("userId").value =
            user.id;


        document.getElementById("userName").value =
            user.name || "";


        document.getElementById("userForm")
            .classList.remove("hidden");


    } catch (error) {

        console.error(
            "Edit user error:",
            error
        );

        alert(
            "Could not load user.\n\n" +
            error.message
        );
    }
}


async function deleteUser(id) {

    if (
        !confirm(
            "Are you sure you want to delete this user?"
        )
    ) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/users/${id}`,
                {
                    method: "DELETE"
                }
            );


        const responseText =
            await response.text();


        if (!response.ok) {

            alert(
                "User could not be deleted.\n\n" +
                "Status: " +
                response.status +
                "\n\n" +
                responseText
            );

            return;
        }


        alert(
            "User deleted successfully!"
        );


        loadUsers();

        loadDashboard();


    } catch (error) {

        console.error(
            "Delete user error:",
            error
        );

        alert(
            "Could not connect to backend.\n\n" +
            error.message
        );
    }
}


// ============================================================
// HTML SAFETY
// ============================================================

function escapeHtml(value) {

    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ============================================================
// PAGE LOAD
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        // Show dashboard first
        showSection("dashboard");

        // Load all dashboard information
        loadDashboard();

    }
);