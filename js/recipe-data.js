// Recipe Knowledge Base for What's for Dinner
// Curated collection of recipes across 12 world cuisines

const RECIPES = [

  // ============================================================
  // INDIAN CUISINE (11 recipes: 3 breakfast, 3 lunch, 5 dinner)
  // ============================================================
  {
    id: "indian-masala-omelette",
    name: "Masala Omelette",
    cuisine: "Indian",
    mealType: ["breakfast"],
    ingredients: ["egg", "onion", "tomato", "green chili", "cilantro", "turmeric", "salt", "oil"],
    prepTime: 10,
    difficulty: "easy",
    description: "A spiced Indian-style omelette loaded with onions, tomatoes, and fresh herbs."
  },
  {
    id: "indian-poha",
    name: "Poha",
    cuisine: "Indian",
    mealType: ["breakfast"],
    ingredients: ["flattened rice", "onion", "potato", "peanut", "turmeric", "mustard seed", "curry leaf", "lemon", "salt", "oil"],
    prepTime: 20,
    difficulty: "easy",
    description: "Light and fluffy flattened rice tempered with mustard seeds, peanuts, and fresh lemon."
  },
  {
    id: "indian-aloo-paratha",
    name: "Aloo Paratha",
    cuisine: "Indian",
    mealType: ["breakfast"],
    ingredients: ["flour", "potato", "onion", "green chili", "cilantro", "cumin", "salt", "butter"],
    prepTime: 35,
    difficulty: "medium",
    description: "Stuffed whole wheat flatbread with a spiced potato filling, pan-fried in butter."
  },
  {
    id: "indian-dal-rice",
    name: "Dal Rice",
    cuisine: "Indian",
    mealType: ["lunch"],
    ingredients: ["lentil", "rice", "onion", "tomato", "garlic", "turmeric", "cumin", "ghee", "salt"],
    prepTime: 30,
    difficulty: "easy",
    description: "Comforting everyday lentils simmered with aromatic spices, served over steamed rice."
  },
  {
    id: "indian-chole-rice",
    name: "Chole Chawal",
    cuisine: "Indian",
    mealType: ["lunch"],
    ingredients: ["chickpea", "rice", "onion", "tomato", "ginger", "garlic", "garam masala", "cumin", "oil", "salt"],
    prepTime: 40,
    difficulty: "medium",
    description: "Hearty spiced chickpea curry paired with fluffy basmati rice."
  },
  {
    id: "indian-vegetable-biryani",
    name: "Vegetable Biryani",
    cuisine: "Indian",
    mealType: ["lunch", "dinner"],
    ingredients: ["rice", "potato", "carrot", "pea", "onion", "yogurt", "garam masala", "saffron", "ghee", "salt"],
    prepTime: 55,
    difficulty: "medium",
    description: "Fragrant layered rice dish with mixed vegetables, saffron, and warming spices."
  },
  {
    id: "indian-butter-chicken",
    name: "Butter Chicken",
    cuisine: "Indian",
    mealType: ["dinner"],
    ingredients: ["chicken", "tomato", "butter", "cream", "onion", "garlic", "ginger", "garam masala", "chili powder", "salt"],
    prepTime: 45,
    difficulty: "medium",
    description: "Tender chicken simmered in a rich, creamy tomato sauce with aromatic spices."
  },
  {
    id: "indian-palak-paneer",
    name: "Palak Paneer",
    cuisine: "Indian",
    mealType: ["dinner"],
    ingredients: ["spinach", "paneer", "onion", "garlic", "ginger", "cream", "cumin", "garam masala", "salt", "oil"],
    prepTime: 35,
    difficulty: "medium",
    description: "Creamy pureed spinach curry studded with soft cubes of Indian cottage cheese."
  },
  {
    id: "indian-chicken-tikka-masala",
    name: "Chicken Tikka Masala",
    cuisine: "Indian",
    mealType: ["dinner"],
    ingredients: ["chicken", "yogurt", "tomato", "onion", "garlic", "ginger", "cream", "garam masala", "paprika", "salt"],
    prepTime: 50,
    difficulty: "medium",
    description: "Grilled marinated chicken pieces in a luscious spiced tomato-cream sauce."
  },
  {
    id: "indian-chana-masala",
    name: "Chana Masala",
    cuisine: "Indian",
    mealType: ["dinner"],
    ingredients: ["chickpea", "onion", "tomato", "garlic", "ginger", "cumin", "coriander", "chili powder", "lemon", "salt"],
    prepTime: 35,
    difficulty: "easy",
    description: "A tangy and robust chickpea curry with warm spices and a squeeze of lemon."
  },
  {
    id: "indian-keema",
    name: "Keema",
    cuisine: "Indian",
    mealType: ["dinner"],
    ingredients: ["ground beef", "onion", "tomato", "pea", "garlic", "ginger", "garam masala", "cumin", "oil", "salt"],
    prepTime: 40,
    difficulty: "medium",
    description: "Savory spiced ground meat cooked with peas, tomatoes, and aromatic spices."
  },

  // ============================================================
  // ITALIAN CUISINE (11 recipes: 3 breakfast, 3 lunch, 5 dinner)
  // ============================================================
  {
    id: "italian-frittata",
    name: "Vegetable Frittata",
    cuisine: "Italian",
    mealType: ["breakfast"],
    ingredients: ["egg", "zucchini", "bell pepper", "onion", "cheese", "olive oil", "salt", "black pepper"],
    prepTime: 25,
    difficulty: "easy",
    description: "A fluffy open-faced Italian egg dish baked with seasonal vegetables and cheese."
  },
  {
    id: "italian-bruschetta-toast",
    name: "Bruschetta al Pomodoro",
    cuisine: "Italian",
    mealType: ["breakfast"],
    ingredients: ["bread", "tomato", "garlic", "basil", "olive oil", "salt"],
    prepTime: 10,
    difficulty: "easy",
    description: "Toasted crusty bread topped with ripe diced tomatoes, garlic, and fresh basil."
  },
  {
    id: "italian-ricotta-toast",
    name: "Ricotta Honey Toast",
    cuisine: "Italian",
    mealType: ["breakfast"],
    ingredients: ["bread", "ricotta", "honey", "walnut", "lemon", "salt"],
    prepTime: 10,
    difficulty: "easy",
    description: "Creamy ricotta spread on toasted bread, drizzled with honey and crunchy walnuts."
  },
  {
    id: "italian-caprese-sandwich",
    name: "Caprese Sandwich",
    cuisine: "Italian",
    mealType: ["lunch"],
    ingredients: ["bread", "mozzarella", "tomato", "basil", "olive oil", "balsamic vinegar", "salt"],
    prepTime: 10,
    difficulty: "easy",
    description: "A classic Italian sandwich with fresh mozzarella, ripe tomatoes, and fragrant basil."
  },
  {
    id: "italian-minestrone",
    name: "Minestrone Soup",
    cuisine: "Italian",
    mealType: ["lunch"],
    ingredients: ["pasta", "carrot", "celery", "zucchini", "tomato", "kidney bean", "onion", "garlic", "olive oil", "salt"],
    prepTime: 40,
    difficulty: "easy",
    description: "A hearty vegetable soup packed with beans, pasta, and garden vegetables."
  },
  {
    id: "italian-panzanella",
    name: "Panzanella Salad",
    cuisine: "Italian",
    mealType: ["lunch"],
    ingredients: ["bread", "tomato", "cucumber", "red onion", "basil", "olive oil", "red wine vinegar", "salt"],
    prepTime: 15,
    difficulty: "easy",
    description: "A rustic Tuscan bread salad with juicy tomatoes, cucumber, and a tangy vinaigrette."
  },
  {
    id: "italian-spaghetti-bolognese",
    name: "Spaghetti Bolognese",
    cuisine: "Italian",
    mealType: ["dinner"],
    ingredients: ["pasta", "ground beef", "tomato", "onion", "garlic", "carrot", "celery", "olive oil", "salt", "black pepper"],
    prepTime: 50,
    difficulty: "medium",
    description: "Classic Italian meat sauce slow-simmered with vegetables, served over spaghetti."
  },
  {
    id: "italian-chicken-parmigiana",
    name: "Chicken Parmigiana",
    cuisine: "Italian",
    mealType: ["dinner"],
    ingredients: ["chicken", "bread crumb", "egg", "tomato sauce", "mozzarella", "cheese", "garlic", "olive oil", "salt"],
    prepTime: 45,
    difficulty: "medium",
    description: "Crispy breaded chicken cutlets topped with marinara and melted mozzarella."
  },
  {
    id: "italian-risotto",
    name: "Mushroom Risotto",
    cuisine: "Italian",
    mealType: ["dinner"],
    ingredients: ["rice", "mushroom", "onion", "garlic", "butter", "cheese", "chicken broth", "white wine", "salt"],
    prepTime: 40,
    difficulty: "medium",
    description: "Creamy Arborio rice slowly stirred with earthy mushrooms and parmesan."
  },
  {
    id: "italian-lasagna",
    name: "Classic Lasagna",
    cuisine: "Italian",
    mealType: ["dinner"],
    ingredients: ["pasta", "ground beef", "ricotta", "mozzarella", "tomato sauce", "onion", "garlic", "egg", "salt"],
    prepTime: 75,
    difficulty: "hard",
    description: "Layers of pasta, rich meat sauce, and three cheeses baked to bubbly perfection."
  },
  {
    id: "italian-aglio-olio",
    name: "Spaghetti Aglio e Olio",
    cuisine: "Italian",
    mealType: ["dinner"],
    ingredients: ["pasta", "garlic", "olive oil", "red pepper flake", "parsley", "salt"],
    prepTime: 20,
    difficulty: "easy",
    description: "A simple yet elegant pasta tossed in garlic-infused olive oil with a hint of heat."
  },

  // ============================================================
  // MEXICAN CUISINE (11 recipes: 3 breakfast, 3 lunch, 5 dinner)
  // ============================================================
  {
    id: "mexican-huevos-rancheros",
    name: "Huevos Rancheros",
    cuisine: "Mexican",
    mealType: ["breakfast"],
    ingredients: ["egg", "tortilla", "tomato", "black bean", "onion", "jalapeno", "cheese", "cilantro", "salt", "oil"],
    prepTime: 20,
    difficulty: "easy",
    description: "Fried eggs on warm tortillas smothered in a zesty ranchero sauce with beans."
  },
  {
    id: "mexican-chilaquiles",
    name: "Chilaquiles Verdes",
    cuisine: "Mexican",
    mealType: ["breakfast"],
    ingredients: ["tortilla", "salsa verde", "egg", "cream", "cheese", "onion", "cilantro", "oil", "salt"],
    prepTime: 25,
    difficulty: "easy",
    description: "Crispy tortilla chips simmered in tangy green salsa, topped with egg and cream."
  },
  {
    id: "mexican-breakfast-burrito",
    name: "Breakfast Burrito",
    cuisine: "Mexican",
    mealType: ["breakfast"],
    ingredients: ["tortilla", "egg", "cheese", "black bean", "bell pepper", "onion", "salsa", "salt", "oil"],
    prepTime: 15,
    difficulty: "easy",
    description: "A warm flour tortilla stuffed with scrambled eggs, beans, cheese, and fresh salsa."
  },
  {
    id: "mexican-chicken-tacos",
    name: "Chicken Tacos",
    cuisine: "Mexican",
    mealType: ["lunch"],
    ingredients: ["chicken", "tortilla", "onion", "cilantro", "lime", "avocado", "chili powder", "cumin", "salt", "oil"],
    prepTime: 25,
    difficulty: "easy",
    description: "Seasoned shredded chicken in warm tortillas with fresh avocado and a lime squeeze."
  },
  {
    id: "mexican-quesadilla",
    name: "Cheese Quesadilla",
    cuisine: "Mexican",
    mealType: ["lunch"],
    ingredients: ["tortilla", "cheese", "bell pepper", "onion", "jalapeno", "salsa", "oil", "salt"],
    prepTime: 15,
    difficulty: "easy",
    description: "Crispy grilled tortillas oozing with melted cheese and sautéed peppers."
  },
  {
    id: "mexican-burrito-bowl",
    name: "Burrito Bowl",
    cuisine: "Mexican",
    mealType: ["lunch"],
    ingredients: ["rice", "black bean", "chicken", "corn", "tomato", "avocado", "lime", "cumin", "salt"],
    prepTime: 30,
    difficulty: "easy",
    description: "A deconstructed burrito with seasoned rice, black beans, chicken, and fresh toppings."
  },
  {
    id: "mexican-enchiladas",
    name: "Chicken Enchiladas",
    cuisine: "Mexican",
    mealType: ["dinner"],
    ingredients: ["chicken", "tortilla", "tomato sauce", "cheese", "onion", "garlic", "chili powder", "cumin", "cream", "salt"],
    prepTime: 45,
    difficulty: "medium",
    description: "Rolled tortillas stuffed with seasoned chicken, smothered in red sauce and cheese."
  },
  {
    id: "mexican-carnitas",
    name: "Pork Carnitas",
    cuisine: "Mexican",
    mealType: ["dinner"],
    ingredients: ["pork", "onion", "garlic", "orange", "cumin", "oregano", "tortilla", "cilantro", "salt", "oil"],
    prepTime: 120,
    difficulty: "medium",
    description: "Slow-cooked pork shoulder pulled into tender, crispy-edged pieces for tacos."
  },
  {
    id: "mexican-beef-fajitas",
    name: "Beef Fajitas",
    cuisine: "Mexican",
    mealType: ["dinner"],
    ingredients: ["beef", "bell pepper", "onion", "tortilla", "lime", "cumin", "chili powder", "garlic", "oil", "salt"],
    prepTime: 30,
    difficulty: "easy",
    description: "Sizzling strips of seasoned beef with charred peppers and onions in warm tortillas."
  },
  {
    id: "mexican-tamales",
    name: "Pork Tamales",
    cuisine: "Mexican",
    mealType: ["dinner"],
    ingredients: ["pork", "corn flour", "chili powder", "garlic", "cumin", "chicken broth", "lard", "salt"],
    prepTime: 120,
    difficulty: "hard",
    description: "Traditional steamed corn dough parcels filled with tender seasoned pork."
  },
  {
    id: "mexican-pozole",
    name: "Pozole Rojo",
    cuisine: "Mexican",
    mealType: ["dinner"],
    ingredients: ["pork", "hominy", "onion", "garlic", "chili powder", "oregano", "cabbage", "lime", "salt"],
    prepTime: 90,
    difficulty: "medium",
    description: "A rich and warming Mexican stew of tender pork and hominy in a red chili broth."
  },

  // ============================================================
  // CHINESE CUISINE (11 recipes: 3 breakfast, 3 lunch, 5 dinner)
  // ============================================================
  {
    id: "chinese-congee",
    name: "Rice Congee",
    cuisine: "Chinese",
    mealType: ["breakfast"],
    ingredients: ["rice", "chicken broth", "ginger", "green onion", "soy sauce", "sesame oil", "salt"],
    prepTime: 45,
    difficulty: "easy",
    description: "A silky, slow-cooked rice porridge topped with ginger, green onions, and sesame oil."
  },
  {
    id: "chinese-scallion-pancake",
    name: "Scallion Pancakes",
    cuisine: "Chinese",
    mealType: ["breakfast"],
    ingredients: ["flour", "green onion", "sesame oil", "salt", "oil"],
    prepTime: 30,
    difficulty: "medium",
    description: "Flaky, golden pan-fried flatbreads layered with fragrant scallions and sesame."
  },
  {
    id: "chinese-egg-fried-rice",
    name: "Egg Fried Rice",
    cuisine: "Chinese",
    mealType: ["breakfast", "lunch"],
    ingredients: ["rice", "egg", "green onion", "soy sauce", "sesame oil", "pea", "carrot", "oil", "salt"],
    prepTime: 15,
    difficulty: "easy",
    description: "Classic wok-tossed fried rice with fluffy eggs, peas, and a hint of sesame."
  },
  {
    id: "chinese-dan-dan-noodles",
    name: "Dan Dan Noodles",
    cuisine: "Chinese",
    mealType: ["lunch"],
    ingredients: ["noodle", "ground pork", "soy sauce", "sesame paste", "chili oil", "garlic", "green onion", "vinegar"],
    prepTime: 25,
    difficulty: "medium",
    description: "Spicy Sichuan noodles in a rich sesame-chili sauce with savory pork crumbles."
  },
  {
    id: "chinese-wonton-soup",
    name: "Wonton Soup",
    cuisine: "Chinese",
    mealType: ["lunch"],
    ingredients: ["ground pork", "wonton wrapper", "ginger", "green onion", "soy sauce", "sesame oil", "chicken broth", "salt"],
    prepTime: 40,
    difficulty: "medium",
    description: "Delicate pork-filled dumplings floating in a clear, savory ginger broth."
  },
  {
    id: "chinese-kung-pao-chicken",
    name: "Kung Pao Chicken",
    cuisine: "Chinese",
    mealType: ["dinner"],
    ingredients: ["chicken", "peanut", "bell pepper", "soy sauce", "vinegar", "sugar", "garlic", "ginger", "chili", "cornstarch"],
    prepTime: 30,
    difficulty: "medium",
    description: "Wok-fried chicken with crunchy peanuts and dried chilies in a sweet-tangy sauce."
  },
  {
    id: "chinese-mapo-tofu",
    name: "Mapo Tofu",
    cuisine: "Chinese",
    mealType: ["dinner"],
    ingredients: ["tofu", "ground pork", "chili paste", "soy sauce", "garlic", "ginger", "green onion", "cornstarch", "sesame oil"],
    prepTime: 25,
    difficulty: "medium",
    description: "Silky tofu and pork in a fiery, numbing Sichuan chili-bean sauce."
  },
  {
    id: "chinese-sweet-sour-pork",
    name: "Sweet and Sour Pork",
    cuisine: "Chinese",
    mealType: ["dinner"],
    ingredients: ["pork", "bell pepper", "pineapple", "onion", "vinegar", "sugar", "ketchup", "cornstarch", "oil", "salt"],
    prepTime: 35,
    difficulty: "medium",
    description: "Crispy battered pork tossed with peppers and pineapple in a glossy tangy sauce."
  },
  {
    id: "chinese-beef-broccoli",
    name: "Beef and Broccoli",
    cuisine: "Chinese",
    mealType: ["dinner"],
    ingredients: ["beef", "broccoli", "soy sauce", "garlic", "ginger", "cornstarch", "sesame oil", "sugar", "oil"],
    prepTime: 25,
    difficulty: "easy",
    description: "Tender sliced beef stir-fried with crisp broccoli in a savory garlic-soy glaze."
  },
  {
    id: "chinese-general-tso-chicken",
    name: "General Tso's Chicken",
    cuisine: "Chinese",
    mealType: ["dinner"],
    ingredients: ["chicken", "cornstarch", "soy sauce", "sugar", "vinegar", "garlic", "ginger", "chili", "green onion", "oil"],
    prepTime: 35,
    difficulty: "medium",
    description: "Crispy fried chicken bites glazed in a sweet, spicy, and tangy chili sauce."
  },

  // ============================================================
  // JAPANESE CUISINE (11 recipes: 3 breakfast, 3 lunch, 5 dinner)
  // ============================================================
  {
    id: "japanese-tamagoyaki",
    name: "Tamagoyaki",
    cuisine: "Japanese",
    mealType: ["breakfast"],
    ingredients: ["egg", "soy sauce", "sugar", "mirin", "oil"],
    prepTime: 15,
    difficulty: "medium",
    description: "A sweet and savory rolled Japanese omelette, delicate and slightly caramelized."
  },
  {
    id: "japanese-onigiri",
    name: "Onigiri",
    cuisine: "Japanese",
    mealType: ["breakfast", "lunch"],
    ingredients: ["rice", "nori", "salmon", "salt", "sesame seed"],
    prepTime: 15,
    difficulty: "easy",
    description: "Hand-shaped rice balls wrapped in crisp nori with a savory salmon filling."
  },
  {
    id: "japanese-miso-soup-breakfast",
    name: "Miso Soup with Rice",
    cuisine: "Japanese",
    mealType: ["breakfast"],
    ingredients: ["miso paste", "tofu", "green onion", "nori", "rice", "dashi", "salt"],
    prepTime: 15,
    difficulty: "easy",
    description: "A warming bowl of umami-rich miso broth with silken tofu, served alongside rice."
  },
  {
    id: "japanese-teriyaki-chicken-bowl",
    name: "Teriyaki Chicken Bowl",
    cuisine: "Japanese",
    mealType: ["lunch"],
    ingredients: ["chicken", "rice", "soy sauce", "mirin", "sugar", "ginger", "garlic", "sesame seed", "broccoli"],
    prepTime: 30,
    difficulty: "easy",
    description: "Glossy teriyaki-glazed chicken served over steamed rice with crisp vegetables."
  },
  {
    id: "japanese-gyudon",
    name: "Gyudon (Beef Bowl)",
    cuisine: "Japanese",
    mealType: ["lunch"],
    ingredients: ["beef", "rice", "onion", "soy sauce", "mirin", "sugar", "dashi", "egg", "ginger"],
    prepTime: 25,
    difficulty: "easy",
    description: "Thinly sliced beef and sweet onions simmered in a savory broth over hot rice."
  },
  {
    id: "japanese-ramen",
    name: "Shoyu Ramen",
    cuisine: "Japanese",
    mealType: ["dinner"],
    ingredients: ["noodle", "chicken broth", "soy sauce", "egg", "green onion", "nori", "pork", "garlic", "ginger"],
    prepTime: 45,
    difficulty: "medium",
    description: "Rich soy-flavored broth with springy noodles, tender pork, and a soft-boiled egg."
  },
  {
    id: "japanese-chicken-katsu",
    name: "Chicken Katsu",
    cuisine: "Japanese",
    mealType: ["dinner"],
    ingredients: ["chicken", "bread crumb", "egg", "flour", "rice", "cabbage", "tonkatsu sauce", "oil", "salt"],
    prepTime: 30,
    difficulty: "medium",
    description: "Golden crispy panko-breaded chicken cutlet served with shredded cabbage and rice."
  },
  {
    id: "japanese-salmon-teriyaki",
    name: "Salmon Teriyaki",
    cuisine: "Japanese",
    mealType: ["dinner"],
    ingredients: ["salmon", "soy sauce", "mirin", "sugar", "ginger", "rice", "sesame seed", "green onion"],
    prepTime: 25,
    difficulty: "easy",
    description: "Pan-seared salmon fillet with a sweet and glossy teriyaki glaze over steamed rice."
  },
  {
    id: "japanese-yakitori",
    name: "Yakitori",
    cuisine: "Japanese",
    mealType: ["dinner"],
    ingredients: ["chicken", "green onion", "soy sauce", "mirin", "sugar", "sake", "salt"],
    prepTime: 30,
    difficulty: "medium",
    description: "Juicy grilled chicken skewers brushed with a sweet soy tare glaze."
  },
  {
    id: "japanese-gyoza",
    name: "Pan-Fried Gyoza",
    cuisine: "Japanese",
    mealType: ["dinner"],
    ingredients: ["ground pork", "cabbage", "garlic", "ginger", "soy sauce", "sesame oil", "wonton wrapper", "oil", "vinegar"],
    prepTime: 40,
    difficulty: "medium",
    description: "Crispy-bottomed pork dumplings with a juicy filling, served with a soy dipping sauce."
  },
  {
    id: "japanese-curry-rice",
    name: "Japanese Curry Rice",
    cuisine: "Japanese",
    mealType: ["dinner"],
    ingredients: ["chicken", "potato", "carrot", "onion", "curry powder", "rice", "butter", "flour", "chicken broth"],
    prepTime: 50,
    difficulty: "medium",
    description: "A thick and mildly sweet Japanese curry with tender chicken and vegetables over rice."
  },

  // ============================================================
  // THAI CUISINE (11 recipes: 3 breakfast, 3 lunch, 5 dinner)
  // ============================================================
  {
    id: "thai-jok",
    name: "Jok (Thai Rice Porridge)",
    cuisine: "Thai",
    mealType: ["breakfast"],
    ingredients: ["rice", "ground pork", "egg", "ginger", "garlic", "soy sauce", "green onion", "white pepper"],
    prepTime: 30,
    difficulty: "easy",
    description: "A comforting Thai-style rice porridge with seasoned pork, egg, and fragrant ginger."
  },
  {
    id: "thai-khai-jiao",
    name: "Khai Jiao (Thai Omelette)",
    cuisine: "Thai",
    mealType: ["breakfast"],
    ingredients: ["egg", "fish sauce", "lime", "rice", "oil", "green onion", "chili"],
    prepTime: 10,
    difficulty: "easy",
    description: "A puffy, crispy-edged Thai omelette served over jasmine rice with a lime squeeze."
  },
  {
    id: "thai-roti-banana",
    name: "Thai Banana Roti",
    cuisine: "Thai",
    mealType: ["breakfast"],
    ingredients: ["flour", "egg", "banana", "sugar", "condensed milk", "butter", "salt"],
    prepTime: 20,
    difficulty: "easy",
    description: "Crispy pan-fried flatbread stuffed with sweet banana and drizzled with condensed milk."
  },
  {
    id: "thai-pad-see-ew",
    name: "Pad See Ew",
    cuisine: "Thai",
    mealType: ["lunch"],
    ingredients: ["noodle", "chicken", "broccoli", "egg", "soy sauce", "garlic", "sugar", "oil"],
    prepTime: 20,
    difficulty: "easy",
    description: "Smoky wok-charred wide rice noodles with chicken, broccoli, and a sweet soy glaze."
  },
  {
    id: "thai-green-papaya-salad",
    name: "Som Tum (Green Papaya Salad)",
    cuisine: "Thai",
    mealType: ["lunch"],
    ingredients: ["green papaya", "tomato", "peanut", "lime", "fish sauce", "sugar", "garlic", "chili"],
    prepTime: 15,
    difficulty: "easy",
    description: "A crunchy, tangy, and spicy salad of shredded green papaya with peanuts and lime."
  },
  {
    id: "thai-larb",
    name: "Larb Gai",
    cuisine: "Thai",
    mealType: ["lunch"],
    ingredients: ["ground chicken", "lime", "fish sauce", "rice powder", "shallot", "cilantro", "chili", "lettuce"],
    prepTime: 20,
    difficulty: "easy",
    description: "A zesty Thai minced chicken salad with toasted rice powder, herbs, and lime."
  },
  {
    id: "thai-green-curry",
    name: "Green Curry",
    cuisine: "Thai",
    mealType: ["dinner"],
    ingredients: ["chicken", "coconut milk", "green curry paste", "bell pepper", "bamboo shoot", "basil", "fish sauce", "sugar", "rice"],
    prepTime: 30,
    difficulty: "medium",
    description: "Aromatic coconut curry with tender chicken, peppers, and fragrant Thai basil."
  },
  {
    id: "thai-pad-thai",
    name: "Pad Thai",
    cuisine: "Thai",
    mealType: ["dinner"],
    ingredients: ["rice noodle", "shrimp", "egg", "peanut", "bean sprout", "lime", "fish sauce", "sugar", "garlic", "oil"],
    prepTime: 30,
    difficulty: "medium",
    description: "Thailand's iconic stir-fried noodles with shrimp, crunchy peanuts, and tangy lime."
  },
  {
    id: "thai-massaman-curry",
    name: "Massaman Curry",
    cuisine: "Thai",
    mealType: ["dinner"],
    ingredients: ["beef", "potato", "coconut milk", "massaman curry paste", "peanut", "onion", "fish sauce", "sugar", "rice"],
    prepTime: 55,
    difficulty: "medium",
    description: "A rich and mild Southern Thai curry with tender beef, potatoes, and peanuts."
  },
  {
    id: "thai-basil-chicken",
    name: "Thai Basil Chicken (Pad Krapow)",
    cuisine: "Thai",
    mealType: ["dinner"],
    ingredients: ["ground chicken", "basil", "garlic", "chili", "soy sauce", "fish sauce", "sugar", "oil", "rice", "egg"],
    prepTime: 15,
    difficulty: "easy",
    description: "Fiery stir-fried ground chicken with holy basil served over rice with a fried egg."
  },
  {
    id: "thai-tom-yum",
    name: "Tom Yum Goong",
    cuisine: "Thai",
    mealType: ["dinner"],
    ingredients: ["shrimp", "mushroom", "lemongrass", "lime", "fish sauce", "chili paste", "galangal", "cilantro"],
    prepTime: 25,
    difficulty: "medium",
    description: "A hot and sour shrimp soup bursting with lemongrass, lime, and aromatic herbs."
  },

  // ============================================================
  // MEDITERRANEAN CUISINE (11 recipes: 3 breakfast, 3 lunch, 5 dinner)
  // ============================================================
  {
    id: "mediterranean-shakshuka",
    name: "Shakshuka",
    cuisine: "Mediterranean",
    mealType: ["breakfast"],
    ingredients: ["egg", "tomato", "bell pepper", "onion", "garlic", "cumin", "paprika", "olive oil", "salt"],
    prepTime: 25,
    difficulty: "easy",
    description: "Eggs gently poached in a spiced tomato and pepper sauce, scooped up with bread."
  },
  {
    id: "mediterranean-avocado-toast",
    name: "Mediterranean Avocado Toast",
    cuisine: "Mediterranean",
    mealType: ["breakfast"],
    ingredients: ["bread", "avocado", "tomato", "feta cheese", "olive oil", "lemon", "red pepper flake", "salt"],
    prepTime: 10,
    difficulty: "easy",
    description: "Creamy smashed avocado on toasted bread with feta, tomatoes, and a drizzle of olive oil."
  },
  {
    id: "mediterranean-yogurt-bowl",
    name: "Greek Yogurt Bowl",
    cuisine: "Mediterranean",
    mealType: ["breakfast"],
    ingredients: ["yogurt", "honey", "walnut", "banana", "blueberry", "oat"],
    prepTime: 5,
    difficulty: "easy",
    description: "Thick Greek yogurt topped with fresh fruit, crunchy walnuts, and a swirl of honey."
  },
  {
    id: "mediterranean-greek-salad",
    name: "Greek Salad",
    cuisine: "Mediterranean",
    mealType: ["lunch"],
    ingredients: ["cucumber", "tomato", "red onion", "feta cheese", "olive", "olive oil", "oregano", "lemon", "salt"],
    prepTime: 10,
    difficulty: "easy",
    description: "A crisp and refreshing salad of cucumbers, tomatoes, olives, and tangy feta cheese."
  },
  {
    id: "mediterranean-falafel-wrap",
    name: "Falafel Wrap",
    cuisine: "Mediterranean",
    mealType: ["lunch"],
    ingredients: ["chickpea", "pita bread", "lettuce", "tomato", "cucumber", "tahini", "garlic", "cumin", "oil", "salt"],
    prepTime: 35,
    difficulty: "medium",
    description: "Crispy herbed chickpea fritters tucked into warm pita with fresh veggies and tahini."
  },
  {
    id: "mediterranean-hummus-plate",
    name: "Hummus Plate",
    cuisine: "Mediterranean",
    mealType: ["lunch"],
    ingredients: ["chickpea", "tahini", "lemon", "garlic", "olive oil", "pita bread", "cucumber", "paprika"],
    prepTime: 15,
    difficulty: "easy",
    description: "Silky smooth hummus drizzled with olive oil, served with warm pita and fresh veggies."
  },
  {
    id: "mediterranean-grilled-chicken",
    name: "Grilled Lemon Herb Chicken",
    cuisine: "Mediterranean",
    mealType: ["dinner"],
    ingredients: ["chicken", "lemon", "garlic", "oregano", "olive oil", "salt", "black pepper"],
    prepTime: 35,
    difficulty: "easy",
    description: "Juicy grilled chicken marinated in lemon, garlic, and Mediterranean herbs."
  },
  {
    id: "mediterranean-lamb-kofta",
    name: "Lamb Kofta",
    cuisine: "Mediterranean",
    mealType: ["dinner"],
    ingredients: ["ground lamb", "onion", "garlic", "cumin", "coriander", "parsley", "pita bread", "yogurt", "salt"],
    prepTime: 30,
    difficulty: "medium",
    description: "Spiced grilled lamb kebabs served with warm pita and a cool yogurt sauce."
  },
  {
    id: "mediterranean-baked-salmon",
    name: "Mediterranean Baked Salmon",
    cuisine: "Mediterranean",
    mealType: ["dinner"],
    ingredients: ["salmon", "tomato", "olive", "lemon", "garlic", "oregano", "olive oil", "salt", "black pepper"],
    prepTime: 30,
    difficulty: "easy",
    description: "Salmon baked atop tomatoes and olives with lemon, garlic, and oregano."
  },
  {
    id: "mediterranean-stuffed-pepper",
    name: "Stuffed Bell Peppers",
    cuisine: "Mediterranean",
    mealType: ["dinner"],
    ingredients: ["bell pepper", "rice", "ground beef", "tomato", "onion", "garlic", "parsley", "olive oil", "salt"],
    prepTime: 50,
    difficulty: "medium",
    description: "Roasted bell peppers stuffed with a savory rice and seasoned beef filling."
  },
  {
    id: "mediterranean-moussaka",
    name: "Moussaka",
    cuisine: "Mediterranean",
    mealType: ["dinner"],
    ingredients: ["eggplant", "ground beef", "tomato", "onion", "garlic", "milk", "flour", "butter", "cheese", "salt"],
    prepTime: 75,
    difficulty: "hard",
    description: "Layers of roasted eggplant and spiced meat topped with a golden béchamel crust."
  },

  // ============================================================
  // AMERICAN CUISINE (11 recipes: 3 breakfast, 4 lunch, 4 dinner)
  // ============================================================
  {
    id: "american-pancakes",
    name: "Buttermilk Pancakes",
    cuisine: "American",
    mealType: ["breakfast"],
    ingredients: ["flour", "buttermilk", "egg", "butter", "sugar", "baking powder", "salt", "maple syrup"],
    prepTime: 20,
    difficulty: "easy",
    description: "Tall, fluffy golden pancakes stacked high and drizzled with real maple syrup."
  },
  {
    id: "american-bacon-eggs",
    name: "Bacon and Eggs",
    cuisine: "American",
    mealType: ["breakfast"],
    ingredients: ["bacon", "egg", "bread", "butter", "salt", "black pepper"],
    prepTime: 15,
    difficulty: "easy",
    description: "Classic crispy bacon with sunny-side-up eggs and buttered toast."
  },
  {
    id: "american-avocado-toast-egg",
    name: "Avocado Toast with Egg",
    cuisine: "American",
    mealType: ["breakfast"],
    ingredients: ["bread", "avocado", "egg", "lemon", "red pepper flake", "salt", "black pepper"],
    prepTime: 10,
    difficulty: "easy",
    description: "Smashed avocado on toasted bread topped with a perfectly poached or fried egg."
  },
  {
    id: "american-club-sandwich",
    name: "Turkey Club Sandwich",
    cuisine: "American",
    mealType: ["lunch"],
    ingredients: ["bread", "turkey", "bacon", "lettuce", "tomato", "mayonnaise", "salt"],
    prepTime: 15,
    difficulty: "easy",
    description: "A triple-decker sandwich with turkey, crispy bacon, fresh lettuce, and tomato."
  },
  {
    id: "american-grilled-cheese",
    name: "Grilled Cheese with Tomato Soup",
    cuisine: "American",
    mealType: ["lunch"],
    ingredients: ["bread", "cheese", "butter", "tomato", "onion", "garlic", "cream", "salt"],
    prepTime: 25,
    difficulty: "easy",
    description: "Golden crispy grilled cheese paired with a warm bowl of creamy tomato soup."
  },
  {
    id: "american-caesar-salad",
    name: "Chicken Caesar Salad",
    cuisine: "American",
    mealType: ["lunch"],
    ingredients: ["chicken", "romaine lettuce", "bread", "cheese", "lemon", "garlic", "olive oil", "egg", "salt"],
    prepTime: 25,
    difficulty: "easy",
    description: "Crisp romaine lettuce with grilled chicken, crunchy croutons, and creamy Caesar dressing."
  },
  {
    id: "american-cobb-salad",
    name: "Cobb Salad",
    cuisine: "American",
    mealType: ["lunch"],
    ingredients: ["chicken", "bacon", "egg", "avocado", "tomato", "blue cheese", "lettuce", "red wine vinegar", "olive oil"],
    prepTime: 25,
    difficulty: "easy",
    description: "A hearty salad with rows of chicken, bacon, egg, avocado, and blue cheese."
  },
  {
    id: "american-cheeseburger",
    name: "Classic Cheeseburger",
    cuisine: "American",
    mealType: ["dinner"],
    ingredients: ["ground beef", "hamburger bun", "cheese", "lettuce", "tomato", "onion", "ketchup", "mustard", "salt"],
    prepTime: 25,
    difficulty: "easy",
    description: "A juicy beef patty with melted cheese, crisp lettuce, and all the fixings."
  },
  {
    id: "american-bbq-ribs",
    name: "BBQ Baby Back Ribs",
    cuisine: "American",
    mealType: ["dinner"],
    ingredients: ["pork ribs", "bbq sauce", "brown sugar", "paprika", "garlic powder", "onion powder", "salt", "black pepper"],
    prepTime: 180,
    difficulty: "medium",
    description: "Fall-off-the-bone tender ribs slow-cooked with a smoky-sweet BBQ glaze."
  },
  {
    id: "american-mac-and-cheese",
    name: "Mac and Cheese",
    cuisine: "American",
    mealType: ["dinner"],
    ingredients: ["pasta", "cheese", "milk", "butter", "flour", "mustard", "bread crumb", "salt"],
    prepTime: 35,
    difficulty: "easy",
    description: "Ultra-creamy baked macaroni and cheese with a crispy breadcrumb topping."
  },
  {
    id: "american-grilled-steak",
    name: "Grilled Steak with Potatoes",
    cuisine: "American",
    mealType: ["dinner"],
    ingredients: ["beef steak", "potato", "butter", "garlic", "rosemary", "olive oil", "salt", "black pepper"],
    prepTime: 35,
    difficulty: "medium",
    description: "A perfectly seared steak paired with crispy roasted garlic-herb potatoes."
  },

  // ============================================================
  // KOREAN CUISINE (11 recipes: 3 breakfast, 3 lunch, 5 dinner)
  // ============================================================
  {
    id: "korean-gyeran-bap",
    name: "Gyeran Bap (Egg Rice)",
    cuisine: "Korean",
    mealType: ["breakfast"],
    ingredients: ["rice", "egg", "soy sauce", "sesame oil", "green onion", "sesame seed", "butter"],
    prepTime: 10,
    difficulty: "easy",
    description: "Hot steamed rice mixed with a raw or fried egg, soy sauce, and sesame oil."
  },
  {
    id: "korean-hotteok",
    name: "Hotteok (Sweet Pancake)",
    cuisine: "Korean",
    mealType: ["breakfast"],
    ingredients: ["flour", "sugar", "brown sugar", "cinnamon", "peanut", "yeast", "oil", "salt"],
    prepTime: 30,
    difficulty: "medium",
    description: "Chewy Korean street pancakes filled with a gooey cinnamon-brown sugar-peanut filling."
  },
  {
    id: "korean-kimchi-jjigae-breakfast",
    name: "Kimchi Jjigae (Stew)",
    cuisine: "Korean",
    mealType: ["breakfast", "dinner"],
    ingredients: ["kimchi", "pork", "tofu", "onion", "garlic", "gochugaru", "sesame oil", "rice", "green onion"],
    prepTime: 30,
    difficulty: "medium",
    description: "A hearty, bubbling stew of fermented kimchi, pork belly, and soft tofu."
  },
  {
    id: "korean-bibimbap",
    name: "Bibimbap",
    cuisine: "Korean",
    mealType: ["lunch"],
    ingredients: ["rice", "beef", "spinach", "carrot", "zucchini", "egg", "gochujang", "sesame oil", "garlic", "soy sauce"],
    prepTime: 40,
    difficulty: "medium",
    description: "A vibrant mixed rice bowl with seasoned vegetables, beef, and a spicy gochujang sauce."
  },
  {
    id: "korean-japchae",
    name: "Japchae",
    cuisine: "Korean",
    mealType: ["lunch"],
    ingredients: ["sweet potato noodle", "beef", "spinach", "carrot", "mushroom", "onion", "soy sauce", "sesame oil", "sugar", "garlic"],
    prepTime: 35,
    difficulty: "medium",
    description: "Silky stir-fried glass noodles with colorful vegetables, beef, and sweet soy seasoning."
  },
  {
    id: "korean-kimbap",
    name: "Kimbap",
    cuisine: "Korean",
    mealType: ["lunch"],
    ingredients: ["rice", "nori", "carrot", "spinach", "egg", "pickled radish", "sesame oil", "salt"],
    prepTime: 35,
    difficulty: "medium",
    description: "Colorful Korean seaweed rice rolls filled with seasoned vegetables and egg."
  },
  {
    id: "korean-bulgogi",
    name: "Bulgogi",
    cuisine: "Korean",
    mealType: ["dinner"],
    ingredients: ["beef", "soy sauce", "sugar", "sesame oil", "garlic", "ginger", "pear", "onion", "green onion", "rice"],
    prepTime: 35,
    difficulty: "medium",
    description: "Sweet and savory marinated beef grilled to caramelized perfection, served with rice."
  },
  {
    id: "korean-dakgalbi",
    name: "Dakgalbi (Spicy Chicken)",
    cuisine: "Korean",
    mealType: ["dinner"],
    ingredients: ["chicken", "cabbage", "sweet potato", "gochujang", "gochugaru", "garlic", "soy sauce", "sugar", "rice", "oil"],
    prepTime: 35,
    difficulty: "medium",
    description: "Fiery stir-fried chicken with vegetables in a bold gochujang-based sauce."
  },
  {
    id: "korean-samgyeopsal",
    name: "Samgyeopsal (Grilled Pork Belly)",
    cuisine: "Korean",
    mealType: ["dinner"],
    ingredients: ["pork belly", "lettuce", "garlic", "ssamjang", "green onion", "sesame oil", "kimchi", "rice"],
    prepTime: 25,
    difficulty: "easy",
    description: "Sizzling grilled pork belly slices wrapped in lettuce with garlic and ssamjang."
  },
  {
    id: "korean-tteokbokki",
    name: "Tteokbokki",
    cuisine: "Korean",
    mealType: ["dinner"],
    ingredients: ["rice cake", "gochujang", "gochugaru", "sugar", "soy sauce", "fish cake", "green onion", "garlic"],
    prepTime: 20,
    difficulty: "easy",
    description: "Chewy Korean rice cakes swimming in a sweet and fiery red chili sauce."
  },
  {
    id: "korean-sundubu-jjigae",
    name: "Sundubu Jjigae (Soft Tofu Stew)",
    cuisine: "Korean",
    mealType: ["dinner"],
    ingredients: ["tofu", "egg", "shrimp", "onion", "garlic", "gochugaru", "sesame oil", "green onion", "salt"],
    prepTime: 25,
    difficulty: "medium",
    description: "A spicy, comforting stew of silky soft tofu, shrimp, and a cracked egg."
  },

  // ============================================================
  // MIDDLE EASTERN CUISINE (11 recipes: 3 breakfast, 3 lunch, 5 dinner)
  // ============================================================
  {
    id: "middle-eastern-ful-medames",
    name: "Ful Medames",
    cuisine: "Middle Eastern",
    mealType: ["breakfast"],
    ingredients: ["fava bean", "garlic", "lemon", "olive oil", "cumin", "parsley", "pita bread", "salt"],
    prepTime: 20,
    difficulty: "easy",
    description: "Slow-stewed fava beans mashed with garlic, lemon, and cumin — a hearty Egyptian breakfast."
  },
  {
    id: "middle-eastern-labneh-toast",
    name: "Labneh Toast",
    cuisine: "Middle Eastern",
    mealType: ["breakfast"],
    ingredients: ["yogurt", "bread", "olive oil", "za'atar", "cucumber", "tomato", "salt"],
    prepTime: 10,
    difficulty: "easy",
    description: "Thick strained yogurt spread on toast, drizzled with olive oil and sprinkled with za'atar."
  },
  {
    id: "middle-eastern-manakish",
    name: "Manakish (Za'atar Flatbread)",
    cuisine: "Middle Eastern",
    mealType: ["breakfast"],
    ingredients: ["flour", "yeast", "za'atar", "olive oil", "sugar", "salt"],
    prepTime: 35,
    difficulty: "medium",
    description: "Freshly baked flatbread generously topped with fragrant za'atar and olive oil."
  },
  {
    id: "middle-eastern-shawarma-wrap",
    name: "Chicken Shawarma Wrap",
    cuisine: "Middle Eastern",
    mealType: ["lunch"],
    ingredients: ["chicken", "pita bread", "yogurt", "garlic", "cumin", "paprika", "turmeric", "lettuce", "tomato", "oil"],
    prepTime: 30,
    difficulty: "medium",
    description: "Warmly spiced sliced chicken wrapped in pita with garlic yogurt sauce and fresh veggies."
  },
  {
    id: "middle-eastern-fattoush",
    name: "Fattoush Salad",
    cuisine: "Middle Eastern",
    mealType: ["lunch"],
    ingredients: ["lettuce", "tomato", "cucumber", "red onion", "pita bread", "lemon", "olive oil", "sumac", "salt"],
    prepTime: 15,
    difficulty: "easy",
    description: "A bright Lebanese salad with crispy pita chips, fresh vegetables, and tangy sumac dressing."
  },
  {
    id: "middle-eastern-lentil-soup",
    name: "Red Lentil Soup",
    cuisine: "Middle Eastern",
    mealType: ["lunch"],
    ingredients: ["red lentil", "onion", "carrot", "garlic", "cumin", "lemon", "olive oil", "salt"],
    prepTime: 30,
    difficulty: "easy",
    description: "A velvety, warming soup of red lentils with cumin and a bright squeeze of lemon."
  },
  {
    id: "middle-eastern-kebab",
    name: "Lamb Kebabs",
    cuisine: "Middle Eastern",
    mealType: ["dinner"],
    ingredients: ["ground lamb", "onion", "garlic", "cumin", "coriander", "parsley", "pita bread", "yogurt", "olive oil", "salt"],
    prepTime: 30,
    difficulty: "medium",
    description: "Juicy spiced lamb kebabs grilled on skewers, served with warm pita and yogurt."
  },
  {
    id: "middle-eastern-chicken-kabsa",
    name: "Chicken Kabsa",
    cuisine: "Middle Eastern",
    mealType: ["dinner"],
    ingredients: ["chicken", "rice", "tomato", "onion", "garlic", "cinnamon", "cumin", "cardamom", "olive oil", "salt"],
    prepTime: 55,
    difficulty: "medium",
    description: "A fragrant Saudi rice dish with spiced chicken, tomatoes, and warm spices."
  },
  {
    id: "middle-eastern-kofta-curry",
    name: "Kofta Curry",
    cuisine: "Middle Eastern",
    mealType: ["dinner"],
    ingredients: ["ground beef", "onion", "garlic", "tomato", "parsley", "cumin", "coriander", "rice", "olive oil", "salt"],
    prepTime: 45,
    difficulty: "medium",
    description: "Spiced beef meatballs simmered in a rich tomato sauce, served over fluffy rice."
  },
  {
    id: "middle-eastern-baked-kibbeh",
    name: "Baked Kibbeh",
    cuisine: "Middle Eastern",
    mealType: ["dinner"],
    ingredients: ["ground beef", "bulgur wheat", "onion", "pine nut", "cinnamon", "cumin", "butter", "salt"],
    prepTime: 60,
    difficulty: "hard",
    description: "A baked layered dish of spiced beef and bulgur wheat with toasted pine nuts."
  },
  {
    id: "middle-eastern-mansaf",
    name: "Mansaf",
    cuisine: "Middle Eastern",
    mealType: ["dinner"],
    ingredients: ["lamb", "rice", "yogurt", "onion", "garlic", "cardamom", "turmeric", "almond", "butter", "salt"],
    prepTime: 90,
    difficulty: "hard",
    description: "A festive Jordanian dish of tender lamb in a tangy yogurt sauce over saffron rice."
  },

  // ============================================================
  // FRENCH CUISINE (11 recipes: 3 breakfast, 3 lunch, 5 dinner)
  // ============================================================
  {
    id: "french-croque-madame",
    name: "Croque Madame",
    cuisine: "French",
    mealType: ["breakfast"],
    ingredients: ["bread", "ham", "cheese", "egg", "butter", "flour", "milk", "mustard", "salt"],
    prepTime: 25,
    difficulty: "medium",
    description: "A golden toasted ham and cheese sandwich with béchamel sauce and a fried egg on top."
  },
  {
    id: "french-crepes",
    name: "French Crêpes",
    cuisine: "French",
    mealType: ["breakfast"],
    ingredients: ["flour", "egg", "milk", "butter", "sugar", "vanilla", "salt"],
    prepTime: 25,
    difficulty: "medium",
    description: "Thin, delicate French pancakes served with butter, sugar, or fresh fruit."
  },
  {
    id: "french-pain-perdu",
    name: "Pain Perdu (French Toast)",
    cuisine: "French",
    mealType: ["breakfast"],
    ingredients: ["bread", "egg", "milk", "sugar", "vanilla", "butter", "cinnamon"],
    prepTime: 15,
    difficulty: "easy",
    description: "Thick slices of bread soaked in a custardy egg mixture and pan-fried until golden."
  },
  {
    id: "french-quiche-lorraine",
    name: "Quiche Lorraine",
    cuisine: "French",
    mealType: ["lunch"],
    ingredients: ["egg", "cream", "bacon", "cheese", "flour", "butter", "onion", "salt", "black pepper"],
    prepTime: 55,
    difficulty: "medium",
    description: "A savory custard tart filled with smoky bacon, cheese, and a buttery flaky crust."
  },
  {
    id: "french-niçoise-salad",
    name: "Salade Niçoise",
    cuisine: "French",
    mealType: ["lunch"],
    ingredients: ["tuna", "egg", "potato", "green bean", "olive", "tomato", "lettuce", "olive oil", "lemon"],
    prepTime: 25,
    difficulty: "easy",
    description: "A composed salad of tuna, boiled eggs, potatoes, green beans, and olives from Nice."
  },
  {
    id: "french-croque-monsieur",
    name: "Croque Monsieur",
    cuisine: "French",
    mealType: ["lunch"],
    ingredients: ["bread", "ham", "cheese", "butter", "flour", "milk", "mustard", "salt"],
    prepTime: 20,
    difficulty: "easy",
    description: "The quintessential French grilled ham and cheese with a creamy béchamel sauce."
  },
  {
    id: "french-coq-au-vin",
    name: "Coq au Vin",
    cuisine: "French",
    mealType: ["dinner"],
    ingredients: ["chicken", "red wine", "bacon", "mushroom", "onion", "garlic", "carrot", "thyme", "butter", "salt"],
    prepTime: 90,
    difficulty: "hard",
    description: "Chicken braised in red wine with mushrooms, bacon, and pearl onions — a French classic."
  },
  {
    id: "french-beef-bourguignon",
    name: "Beef Bourguignon",
    cuisine: "French",
    mealType: ["dinner"],
    ingredients: ["beef", "red wine", "carrot", "onion", "mushroom", "garlic", "thyme", "tomato paste", "butter", "salt"],
    prepTime: 150,
    difficulty: "hard",
    description: "Tender chunks of beef slow-braised in Burgundy wine with vegetables and herbs."
  },
  {
    id: "french-ratatouille",
    name: "Ratatouille",
    cuisine: "French",
    mealType: ["dinner"],
    ingredients: ["eggplant", "zucchini", "bell pepper", "tomato", "onion", "garlic", "basil", "olive oil", "thyme", "salt"],
    prepTime: 50,
    difficulty: "medium",
    description: "A Provençal stew of layered summer vegetables, slow-roasted with herbs and olive oil."
  },
  {
    id: "french-pan-seared-duck",
    name: "Pan-Seared Duck Breast",
    cuisine: "French",
    mealType: ["dinner"],
    ingredients: ["duck breast", "orange", "honey", "butter", "thyme", "garlic", "salt", "black pepper"],
    prepTime: 35,
    difficulty: "hard",
    description: "Crispy-skinned duck breast with a luscious orange and honey pan sauce."
  },
  {
    id: "french-onion-soup",
    name: "French Onion Soup",
    cuisine: "French",
    mealType: ["dinner"],
    ingredients: ["onion", "beef broth", "bread", "cheese", "butter", "thyme", "white wine", "salt"],
    prepTime: 60,
    difficulty: "medium",
    description: "Deeply caramelized onion soup topped with crusty bread and a broiled cheese crown."
  },

  // ============================================================
  // SOUTHERN/SOUL CUISINE (11 recipes: 3 breakfast, 4 lunch, 4 dinner)
  // ============================================================
  {
    id: "southern-biscuits-gravy",
    name: "Biscuits and Gravy",
    cuisine: "Southern/Soul",
    mealType: ["breakfast"],
    ingredients: ["flour", "butter", "buttermilk", "baking powder", "sausage", "milk", "salt", "black pepper"],
    prepTime: 30,
    difficulty: "medium",
    description: "Fluffy buttermilk biscuits smothered in a creamy pork sausage gravy."
  },
  {
    id: "southern-shrimp-grits-breakfast",
    name: "Shrimp and Grits",
    cuisine: "Southern/Soul",
    mealType: ["breakfast", "dinner"],
    ingredients: ["shrimp", "grits", "bacon", "butter", "garlic", "lemon", "green onion", "cheese", "salt"],
    prepTime: 30,
    difficulty: "medium",
    description: "Plump sautéed shrimp over creamy, cheesy stone-ground grits with crispy bacon."
  },
  {
    id: "southern-country-fried-eggs",
    name: "Country Breakfast Plate",
    cuisine: "Southern/Soul",
    mealType: ["breakfast"],
    ingredients: ["egg", "bacon", "grits", "butter", "bread", "salt", "black pepper"],
    prepTime: 20,
    difficulty: "easy",
    description: "A classic Southern breakfast of fried eggs, crispy bacon, buttery grits, and toast."
  },
  {
    id: "southern-po-boy",
    name: "Fried Shrimp Po' Boy",
    cuisine: "Southern/Soul",
    mealType: ["lunch"],
    ingredients: ["shrimp", "bread", "lettuce", "tomato", "mayonnaise", "cornmeal", "flour", "egg", "oil", "salt"],
    prepTime: 30,
    difficulty: "medium",
    description: "Crispy cornmeal-fried shrimp piled onto crusty French bread with all the fixings."
  },
  {
    id: "southern-pimento-cheese-sandwich",
    name: "Pimento Cheese Sandwich",
    cuisine: "Southern/Soul",
    mealType: ["lunch"],
    ingredients: ["cheese", "pimento", "mayonnaise", "bread", "cayenne", "salt"],
    prepTime: 10,
    difficulty: "easy",
    description: "The quintessential Southern spread of sharp cheese, pimentos, and mayo on soft bread."
  },
  {
    id: "southern-chicken-salad",
    name: "Southern Chicken Salad",
    cuisine: "Southern/Soul",
    mealType: ["lunch"],
    ingredients: ["chicken", "celery", "mayonnaise", "lemon", "mustard", "bread", "lettuce", "salt", "black pepper"],
    prepTime: 20,
    difficulty: "easy",
    description: "Tender shredded chicken mixed with celery and creamy mayo, served on bread or lettuce."
  },
  {
    id: "southern-collard-greens-cornbread",
    name: "Collard Greens with Cornbread",
    cuisine: "Southern/Soul",
    mealType: ["lunch"],
    ingredients: ["collard green", "bacon", "onion", "garlic", "vinegar", "cornmeal", "flour", "egg", "buttermilk", "salt"],
    prepTime: 60,
    difficulty: "medium",
    description: "Slow-braised collard greens with smoky bacon, paired with golden skillet cornbread."
  },
  {
    id: "southern-fried-chicken",
    name: "Southern Fried Chicken",
    cuisine: "Southern/Soul",
    mealType: ["dinner"],
    ingredients: ["chicken", "buttermilk", "flour", "paprika", "garlic powder", "cayenne", "salt", "black pepper", "oil"],
    prepTime: 45,
    difficulty: "medium",
    description: "Golden, crunchy fried chicken with a perfectly seasoned, crispy coating."
  },
  {
    id: "southern-gumbo",
    name: "Chicken and Sausage Gumbo",
    cuisine: "Southern/Soul",
    mealType: ["dinner"],
    ingredients: ["chicken", "sausage", "onion", "celery", "bell pepper", "garlic", "flour", "oil", "rice", "salt"],
    prepTime: 75,
    difficulty: "hard",
    description: "A rich, dark-roux Cajun stew with chicken and sausage, served over steamed rice."
  },
  {
    id: "southern-jambalaya",
    name: "Jambalaya",
    cuisine: "Southern/Soul",
    mealType: ["dinner"],
    ingredients: ["chicken", "sausage", "shrimp", "rice", "onion", "bell pepper", "celery", "tomato", "garlic", "cayenne"],
    prepTime: 50,
    difficulty: "medium",
    description: "A bold, one-pot Creole rice dish with chicken, sausage, and shrimp."
  },
  {
    id: "southern-catfish",
    name: "Fried Catfish",
    cuisine: "Southern/Soul",
    mealType: ["dinner"],
    ingredients: ["catfish", "cornmeal", "flour", "egg", "cayenne", "garlic powder", "lemon", "oil", "salt"],
    prepTime: 25,
    difficulty: "medium",
    description: "Crispy cornmeal-crusted catfish fillets fried golden and served with lemon wedges."
  }
];


// ============================================================
// COMMON GROCERIES - Unique ingredients for autocomplete
// Extracted from all recipes, sorted alphabetically (~80 items)
// ============================================================
const COMMON_GROCERIES = [
  "almond",
  "avocado",
  "bacon",
  "baking powder",
  "bamboo shoot",
  "banana",
  "basil",
  "bbq sauce",
  "bean sprout",
  "beef",
  "beef broth",
  "beef steak",
  "bell pepper",
  "black bean",
  "black pepper",
  "blueberry",
  "bread",
  "bread crumb",
  "broccoli",
  "brown sugar",
  "bulgur wheat",
  "butter",
  "buttermilk",
  "cabbage",
  "carrot",
  "catfish",
  "cayenne",
  "celery",
  "cheese",
  "chicken",
  "chicken broth",
  "chickpea",
  "chili",
  "chili paste",
  "chili powder",
  "cilantro",
  "cinnamon",
  "coconut milk",
  "coriander",
  "corn",
  "cornmeal",
  "cornstarch",
  "cream",
  "cucumber",
  "cumin",
  "curry powder",
  "dashi",
  "duck breast",
  "egg",
  "eggplant",
  "fava bean",
  "feta cheese",
  "fish sauce",
  "flour",
  "garam masala",
  "garlic",
  "ghee",
  "ginger",
  "gochugaru",
  "gochujang",
  "green bean",
  "green onion",
  "ground beef",
  "ground chicken",
  "ground lamb",
  "ground pork",
  "grits",
  "ham",
  "hamburger bun",
  "hominy",
  "honey",
  "jalapeno",
  "ketchup",
  "kidney bean",
  "kimchi",
  "lamb",
  "lemon",
  "lemongrass",
  "lentil",
  "lettuce",
  "lime",
  "maple syrup",
  "mayonnaise",
  "milk",
  "mirin",
  "miso paste",
  "mozzarella",
  "mushroom",
  "mustard",
  "noodle",
  "nori",
  "oat",
  "oil",
  "olive",
  "olive oil",
  "onion",
  "orange",
  "oregano",
  "paneer",
  "paprika",
  "parsley",
  "pasta",
  "pea",
  "peanut",
  "pear",
  "pine nut",
  "pineapple",
  "pita bread",
  "pork",
  "pork belly",
  "pork ribs",
  "potato",
  "red lentil",
  "red onion",
  "red pepper flake",
  "red wine",
  "red wine vinegar",
  "rice",
  "rice cake",
  "rice noodle",
  "ricotta",
  "romaine lettuce",
  "rosemary",
  "sake",
  "salmon",
  "salsa",
  "salsa verde",
  "salt",
  "sausage",
  "sesame oil",
  "sesame paste",
  "sesame seed",
  "shallot",
  "shrimp",
  "soy sauce",
  "spinach",
  "sugar",
  "sweet potato",
  "sweet potato noodle",
  "tahini",
  "thyme",
  "tofu",
  "tomato",
  "tomato paste",
  "tomato sauce",
  "tortilla",
  "tuna",
  "turkey",
  "turmeric",
  "vanilla",
  "vinegar",
  "walnut",
  "white pepper",
  "white wine",
  "wonton wrapper",
  "yogurt",
  "yeast",
  "za'atar",
  "zucchini"
];

// ============================================================
// INGREDIENT CATEGORIES
// Maps ingredient names to shopping store sections
// ============================================================
const INGREDIENT_CATEGORIES = {
  // Proteins
  'chicken': 'Proteins', 'beef': 'Proteins', 'ground beef': 'Proteins', 'lamb': 'Proteins',
  'pork': 'Proteins', 'pork belly': 'Proteins', 'pork ribs': 'Proteins', 'turkey': 'Proteins',
  'salmon': 'Proteins', 'shrimp': 'Proteins', 'tuna': 'Proteins', 'fish': 'Proteins',
  'tofu': 'Proteins', 'paneer': 'Proteins', 'chickpea': 'Proteins', 'lentil': 'Proteins',
  'red lentil': 'Proteins', 'kidney bean': 'Proteins', 'black bean': 'Proteins',
  'egg': 'Proteins', 'sausage': 'Proteins', 'bacon': 'Proteins',
  // Produce
  'tomato': 'Produce', 'onion': 'Produce', 'garlic': 'Produce', 'ginger': 'Produce',
  'spinach': 'Produce', 'bell pepper': 'Produce', 'zucchini': 'Produce', 'carrot': 'Produce',
  'potato': 'Produce', 'sweet potato': 'Produce', 'celery': 'Produce', 'cucumber': 'Produce',
  'broccoli': 'Produce', 'cauliflower': 'Produce', 'mushroom': 'Produce', 'pea': 'Produce',
  'corn': 'Produce', 'lettuce': 'Produce', 'romaine lettuce': 'Produce', 'kale': 'Produce',
  'cabbage': 'Produce', 'eggplant': 'Produce', 'green chili': 'Produce', 'jalapeno': 'Produce',
  'lemon': 'Produce', 'lime': 'Produce', 'avocado': 'Produce', 'red onion': 'Produce',
  'shallot': 'Produce', 'leek': 'Produce', 'asparagus': 'Produce', 'basil': 'Produce',
  'cilantro': 'Produce', 'parsley': 'Produce', 'mint': 'Produce', 'thyme': 'Produce',
  'rosemary': 'Produce', 'green onion': 'Produce', 'curry leaf': 'Produce',
  // Dairy & Eggs
  'milk': 'Dairy & Eggs', 'cream': 'Dairy & Eggs', 'heavy cream': 'Dairy & Eggs',
  'butter': 'Dairy & Eggs', 'cheese': 'Dairy & Eggs', 'mozzarella': 'Dairy & Eggs',
  'parmesan': 'Dairy & Eggs', 'ricotta': 'Dairy & Eggs', 'feta': 'Dairy & Eggs',
  'yogurt': 'Dairy & Eggs', 'ghee': 'Dairy & Eggs', 'coconut cream': 'Dairy & Eggs',
  // Pantry & Grains
  'rice': 'Pantry', 'pasta': 'Pantry', 'bread': 'Pantry', 'flour': 'Pantry',
  'flattened rice': 'Pantry', 'rice noodle': 'Pantry', 'sweet potato noodle': 'Pantry',
  'wonton wrapper': 'Pantry', 'tortilla': 'Pantry', 'bread crumb': 'Pantry', 'noodle': 'Pantry',
  'soy sauce': 'Pantry', 'sesame oil': 'Pantry', 'sesame paste': 'Pantry',
  'sesame seed': 'Pantry', 'fish sauce': 'Pantry', 'oyster sauce': 'Pantry',
  'rice vinegar': 'Pantry', 'balsamic vinegar': 'Pantry', 'red wine vinegar': 'Pantry',
  'olive oil': 'Pantry', 'coconut milk': 'Pantry', 'tomato sauce': 'Pantry',
  'tomato paste': 'Pantry', 'broth': 'Pantry', 'honey': 'Pantry', 'sugar': 'Pantry',
  'vinegar': 'Pantry', 'salsa': 'Pantry', 'salsa verde': 'Pantry', 'miso paste': 'Pantry',
  'tahini': 'Pantry', 'peanut': 'Pantry', 'walnut': 'Pantry', 'almond': 'Pantry',
  'sake': 'Pantry', 'white wine': 'Pantry', 'red wine': 'Pantry', 'dashi': 'Pantry',
  'sriracha': 'Pantry', 'gochujang': 'Pantry', 'hoisin sauce': 'Pantry', 'peanut butter': 'Pantry',
  'rice cake': 'Pantry', 'cornstarch': 'Pantry', 'baking powder': 'Pantry', 'yeast': 'Pantry',
  'vanilla': 'Pantry',
  // Spices & Seasonings
  'salt': 'Spices & Seasonings', 'black pepper': 'Spices & Seasonings',
  'white pepper': 'Spices & Seasonings', 'oil': 'Spices & Seasonings',
  'cumin': 'Spices & Seasonings', 'turmeric': 'Spices & Seasonings',
  'paprika': 'Spices & Seasonings', 'chili powder': 'Spices & Seasonings',
  'garam masala': 'Spices & Seasonings', 'coriander': 'Spices & Seasonings',
  'mustard seed': 'Spices & Seasonings', 'red pepper flake': 'Spices & Seasonings',
  'cayenne': 'Spices & Seasonings', 'cinnamon': 'Spices & Seasonings',
  'cardamom': 'Spices & Seasonings', 'bay leaf': 'Spices & Seasonings',
  'saffron': 'Spices & Seasonings', 'clove': 'Spices & Seasonings',
  'allspice': 'Spices & Seasonings', 'nutmeg': 'Spices & Seasonings',
  "za'atar": 'Spices & Seasonings', 'sumac': 'Spices & Seasonings',
  'ras el hanout': 'Spices & Seasonings', 'harissa': 'Spices & Seasonings',
  'five spice': 'Spices & Seasonings', 'star anise': 'Spices & Seasonings',
  'garlic powder': 'Spices & Seasonings', 'onion powder': 'Spices & Seasonings',
  'dried thyme': 'Spices & Seasonings', 'dried oregano': 'Spices & Seasonings',
};

// ============================================================
// SWAP REGISTRY
// Maps ingredients to their possible substitutions.
// Protein-level swaps support per-dietary-profile substitutions.
// ============================================================
const SWAP_REGISTRY = {
  // Ingredient-level swaps (for missing items)
  'red pepper flake': ['black pepper', 'cayenne', 'paprika'],
  'chili powder':     ['paprika', 'cayenne', 'red pepper flake'],
  'soy sauce':        ['tamari', 'coconut aminos', 'salt'],
  'heavy cream':      ['coconut cream', 'yogurt', 'evaporated milk'],
  'cream':            ['coconut cream', 'yogurt', 'heavy cream'],
  'butter':           ['coconut oil', 'olive oil', 'ghee'],
  'ghee':             ['butter', 'coconut oil', 'olive oil'],
  'lemon':            ['lime', 'rice vinegar', 'white wine vinegar'],
  'lime':             ['lemon', 'rice vinegar'],
  'garam masala':     ['curry powder', 'cumin', 'coriander'],
  'mozzarella':       ['cheese', 'ricotta', 'feta'],
  'parmesan':         ['pecorino', 'cheese', 'nutritional yeast'],
  'ricotta':          ['cream cheese', 'cottage cheese', 'tofu'],
  'yogurt':           ['sour cream', 'coconut yogurt', 'cream'],
  'sesame oil':       ['olive oil', 'vegetable oil'],
  'fish sauce':       ['soy sauce', 'tamari'],
  'oyster sauce':     ['hoisin sauce', 'soy sauce'],
  'tahini':           ['peanut butter', 'almond butter', 'sesame paste'],
  'peanut':           ['cashew', 'almond', 'sunflower seed'],
  'honey':            ['maple syrup', 'sugar', 'agave'],
  'white wine':       ['chicken broth', 'white grape juice', 'apple cider vinegar'],
  'red wine':         ['beef broth', 'grape juice', 'pomegranate juice'],
  'sake':             ['dry sherry', 'white wine', 'rice vinegar'],
  'miso paste':       ['soy sauce', 'tahini'],
  'coconut milk':     ['heavy cream', 'oat milk', 'almond milk'],
  'broth':            ['water', 'stock', 'bouillon'],
  'bread crumb':      ['panko', 'crushed crackers', 'almond flour'],
  'celery':           ['fennel', 'cucumber', 'green onion'],
  'zucchini':         ['yellow squash', 'cucumber', 'eggplant'],
  'spinach':          ['kale', 'chard', 'arugula'],
  'paneer':           ['tofu', 'halloumi', 'cheese'],
  // Protein-level swaps (dietary profile substitutions per meal card)
  'chicken': { vegan: 'tofu', vegetarian: 'paneer', pescatarian: 'shrimp', keto: 'chicken' },
  'beef':    { vegan: 'lentil', vegetarian: 'black bean', pescatarian: 'tuna' },
  'ground beef': { vegan: 'lentil', vegetarian: 'black bean', pescatarian: 'tuna' },
  'lamb':    { vegan: 'tofu', vegetarian: 'chickpea' },
  'pork':    { vegan: 'tofu', vegetarian: 'mushroom', pescatarian: 'shrimp' },
  'shrimp':  { vegan: 'tofu', vegetarian: 'mushroom' },
  'salmon':  { vegan: 'tofu', vegetarian: 'eggplant' },
  'tuna':    { vegan: 'chickpea', vegetarian: 'chickpea' },
  'turkey':  { vegan: 'lentil', vegetarian: 'lentil', pescatarian: 'salmon' },
};

// ============================================================
// DEFAULT PANTRY STAPLES
// These are common household essentials pre-seeded in Step 1.
// Users can remove these or add their own custom staples.
// ============================================================
const DEFAULT_PANTRY_STAPLES = [
  'oil', 'olive oil', 'butter', 'salt', 'black pepper', 'sugar', 'flour',
  'water', 'vinegar', 'garlic powder', 'onion powder'
];
