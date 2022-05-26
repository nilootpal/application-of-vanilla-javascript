const mealsContainer = document.getElementById("meals");
const favMeals = document.getElementById("fav-meals");
const reloadBtn = document.getElementById("reload");
const searchTerm = document.getElementById("search-term");
const searchBtn = document.getElementById("search");
const mealInfoEl = document.getElementById("meal-info")
const mealPopup = document.getElementById("meal-popup");
const closePopup = document.getElementById("close-popup");

getRandomMeal();
fetchFavMeals();


reloadBtn.addEventListener("click", () => {
    mealsContainer.innerHTML = '';
    getRandomMeal();
})

async function getRandomMeal(){
    const resp = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
    const respData = await resp.json();
    const randomMeal = respData.meals[0];
    console.log(randomMeal)

    addMeal(randomMeal, true);
}

async function getMealById(id){
    const resp = await fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id);
    const respData = await resp.json();

    const meal = respData.meals[0];
    return meal;
}

async function getMealBySearch(term){
    const resp = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=" + term);
    const respData = await resp.json();
    const meal = respData.meals;
    // console.log(meal)
    return meal;
}

function addMeal(mealData, random=false){
    const meal = document.createElement("div");
    meal.classList.add("meal");

    meal.innerHTML = `
        <div class="meal-header">
            ${random ?
            `<span class="random">
                Random Recipe
            </span>` : ''}
            <img src=${mealData.strMealThumb} alt=${mealData.strMeal} ">
        </div>
        <div class="meal-body">
            <h4>${mealData.strMeal}</h4>
            <button class="fav-btn">
                <i class="fas fa-heart"></i>
            </button>
        </div>
    `;

    const btn =  meal.querySelector(".meal-body .fav-btn");
    const container =  meal.querySelector(".meal-header ");

    btn.addEventListener(
        'click',() => {
            if(btn.classList.contains('active')){
                removeMealfromLS(mealData.idMeal)
                btn.classList.remove('active')
            }
            else{
                addMealtoLS(mealData.idMeal)
                btn.classList.add('active')
            }
            favMeals.innerHTML=''
            fetchFavMeals();
        }
    )

    container.addEventListener("click", () => openModal(mealData))

    mealsContainer.appendChild(meal);
}

function addMealtoLS(mealId){
    const mealIds = getMealfromLS();
    localStorage.setItem("mealIds", JSON.stringify([...mealIds, mealId]))
}

function removeMealfromLS(mealId){
    const mealIds = getMealfromLS();
    localStorage.setItem("mealIds", JSON.stringify(mealIds.filter(id => id !== mealId)))
}

function getMealfromLS(){   
    const mealIds = JSON.parse(localStorage.getItem("mealIds"));
    return mealIds === null ? [] : mealIds;
}

async function fetchFavMeals(){
    favMeals.innerHTML = '';
    const mealIds = getMealfromLS();

    for(let i = 0; i < mealIds.length; i++){
        const mealId = mealIds[i];
        const meal = await getMealById(mealId);
        addMealtoFav(meal, true);
    }

}

function addMealtoFav(mealData, random=false){
    const favMeal = document.createElement("li");
    favMeal.classList.add("fav-meal");

    favMeal.innerHTML = `
        <button class="clear"><i class="fa-solid fa-xmark"></i></button>
        <img class="fav-img"src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
        <span>${mealData.strMeal}</span>
    `;
    const btn = favMeal.querySelector(".clear")
    const img = favMeal.querySelector(".fav-img")


    // favMeal.addEventListener("click", async () => {
    //     mealsContainer.innerHTML = '';
    //     const favmeal = await getMealById(mealData.idMeal);
    //     addMeal(favmeal, true)
    // })

    btn.addEventListener("click", () => {
        removeMealfromLS(mealData.idMeal);
        fetchFavMeals();
        // getRandomMeal();
    })

    img.addEventListener("click", () => openModal(mealData))

    favMeals.appendChild(favMeal);
}

const searchMeal = async () =>{
    const search = searchTerm.value;
    if(search){
        const meals = await getMealBySearch(search);
        // console.log(meals)
        if(meals){
            mealsContainer.innerHTML = '';
            meals.forEach((meal) =>{
                addMeal(meal);
            })
        }
    }
}

searchBtn.addEventListener("click", searchMeal)

searchTerm.addEventListener("keydown", (e) => {
    if(e.key ==='Enter'){
        searchMeal();
    }
})

closePopup.addEventListener("click", () => {
    mealPopup.classList.add("hidden");
})

const openModal = (mealData) => {
    console.log(mealData)
    mealInfoEl.innerHTML = '';

    const ingredients =[];

    for(let i = 1; i <= 20; ++i){
        if(mealData[`strIngredient`+i] === "")
            break;
        else    
            ingredients.push(`${mealData[`strIngredient`+i]} - ${mealData[`strMeasure`+i]}`)
    }
    const mealEl = document.createElement('div');
    mealEl.innerHTML=`
        <h1>${mealData.strMeal}</h1>
        <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">     
        <p>
            ${mealData.strInstructions}
        </p>
        <h3>Ingredient: </h3>
        <ul>
            ${ ingredients.map((ing) => `<li>${ing}</li>`).join("") }
        </ul>
    `

    mealInfoEl.appendChild(mealEl);

    mealPopup.classList.remove("hidden");

}