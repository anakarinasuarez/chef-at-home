export interface UnsplashImage {
  id: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description: string;
  description: string;
  user: {
    name: string;
    username: string;
  };
}

export class UnsplashService {
  private static readonly BASE_URL = "https://api.unsplash.com";
  private static readonly ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

  /**
   * Search for food images based on recipe title
   */
  static async searchFoodImages(
    query: string,
    count: number = 10
  ): Promise<UnsplashImage[]> {
    try {
      if (!this.ACCESS_KEY) {
        throw new Error("Unsplash API key not configured");
      }

      const searchUrl = `${
        this.BASE_URL
      }/search/photos?query=${encodeURIComponent(
        query + " food"
      )}&per_page=${count}&orientation=landscape`;

      const response = await fetch(searchUrl, {
        headers: {
          Authorization: `Client-ID ${this.ACCESS_KEY}`,
          "Accept-Version": "v1",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Unsplash API error: ${response.status} - ${response.statusText}`
        );
      }

      const data = await response.json();

      if (data.results && Array.isArray(data.results)) {
        return data.results;
      }

      return [];
    } catch (error) {
      console.error("Error searching Unsplash images:", error);
      throw error;
    }
  }

  /**
   * Get a random food image for a recipe
   */
  static async getRandomFoodImage(recipeTitle: string): Promise<string> {
    try {
      // Extract key ingredients from recipe title for better image matching
      const searchQuery = this.generateSearchQuery(recipeTitle);

      const images = await this.searchFoodImages(searchQuery, 20);

      if (images.length > 0) {
        const randomImage = images[Math.floor(Math.random() * images.length)];
        return `${randomImage.urls.regular}?w=400&h=300&fit=crop&auto=format&q=80`;
      }

      throw new Error("No images found");
    } catch (error) {
      console.error("Error getting random food image:", error);
      throw error;
    }
  }

  /**
   * Generate intelligent search query based on recipe title
   */
  private static generateSearchQuery(recipeTitle: string): string {
    // Extract cuisine type and main ingredients
    const cuisineKeywords = {
      italian: [
        "tuscan",
        "sicilian",
        "lombard",
        "piedmont",
        "venetian",
        "roman",
        "neapolitan",
      ],
      mexican: [
        "oaxacan",
        "yucatecan",
        "poblano",
        "veracruzano",
        "jalisciense",
      ],
      asian: ["cantonese", "sichuan", "hunan", "shandong", "fujian"],
      mediterranean: ["provençal", "andalusian", "catalan", "greek", "turkish"],
      american: ["southern", "texan", "californian", "new england"],
      french: ["burgundian", "norman", "provençal", "languedoc"],
      indian: ["punjabi", "bengali", "gujarati", "maharashtrian"],
      thai: ["northern", "central", "southern", "isaan"],
    };

    // Cooking methods that work well for images
    const cookingMethods = [
      "grilled",
      "roasted",
      "sautéed",
      "braised",
      "baked",
      "pan-seared",
      "stir-fried",
      "curried",
      "tandoori",
      "steamed",
    ];

    // Remove common words and focus on main ingredients
    const commonWords = [
      "and",
      "with",
      "the",
      "a",
      "an",
      "delicious",
      "fresh",
      "creation",
      "bowl",
      "salad",
      "pasta",
      "rice",
      "delight",
      "twist",
      "fusion",
      "modern",
      "inspired",
      "gourmet",
      "family",
      "elegant",
      "quick",
      "seasonal",
      "approach",
      "traditional",
      "street",
      "comfort",
      "party",
      "weeknight",
      "variations",
      "cuisine",
      "technique",
      "cooking",
      "dish",
      "meal",
      "food",
      "style",
      "method",
    ];

    let query = recipeTitle
      .toLowerCase()
      .replace(/[^\w\s]/g, " ") // Remove special characters
      .split(" ")
      .filter((word) => word.length > 2 && !commonWords.includes(word))
      .slice(0, 4) // Take first 4 meaningful words
      .join(" ");

    // If no meaningful words found, use the original title
    if (!query.trim()) {
      query = recipeTitle
        .toLowerCase()
        .replace(/[^\w\s]/g, " ")
        .trim();
    }

    // Add cuisine context if detected
    const detectedCuisine = this.detectCuisineFromTitle(recipeTitle);
    if (detectedCuisine) {
      query = `${detectedCuisine} ${query}`;
    }

    // Add "food photography" to make it more specific
    return query + " food photography";
  }

  /**
   * Detect cuisine from recipe title
   */
  private static detectCuisineFromTitle(title: string): string | null {
    const titleLower = title.toLowerCase();

    const cuisinePatterns = {
      italian: [
        "tuscan",
        "sicilian",
        "lombard",
        "piedmont",
        "venetian",
        "roman",
        "neapolitan",
        "calabrian",
      ],
      mexican: [
        "oaxacan",
        "yucatecan",
        "poblano",
        "veracruzano",
        "jalisciense",
        "tamaulipeco",
      ],
      asian: [
        "cantonese",
        "sichuan",
        "hunan",
        "shandong",
        "fujian",
        "jiangsu",
        "zhejiang",
      ],
      mediterranean: [
        "provençal",
        "andalusian",
        "catalan",
        "greek",
        "turkish",
        "lebanese",
      ],
      american: [
        "southern",
        "texan",
        "californian",
        "new england",
        "midwestern",
        "pacific northwest",
      ],
      french: [
        "burgundian",
        "norman",
        "provençal",
        "languedoc",
        "alsacian",
        "bretagne",
      ],
      indian: [
        "punjabi",
        "bengali",
        "gujarati",
        "maharashtrian",
        "tamil",
        "kerala",
      ],
      thai: [
        "northern",
        "central",
        "southern",
        "isaan",
        "bangkok",
        "chiang mai",
      ],
    };

    for (const [cuisine, patterns] of Object.entries(cuisinePatterns)) {
      if (patterns.some((pattern) => titleLower.includes(pattern))) {
        return cuisine;
      }
    }

    return null;
  }

  /**
   * Get multiple food images for recipe cards
   */
  static async getMultipleFoodImages(
    recipeTitles: string[]
  ): Promise<string[]> {
    try {
      const imagePromises = recipeTitles.map((title) =>
        this.getRandomFoodImage(title).catch(() => this.getFallbackImage())
      );

      return await Promise.all(imagePromises);
    } catch (error) {
      console.error("Error getting multiple food images:", error);
      // Return fallback images for all recipes
      return recipeTitles.map(() => this.getFallbackImage());
    }
  }

  /**
   * Get fallback image when API fails
   */
  static getFallbackImage(): string {
    const fallbackImages = [
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1504674900242-4187e7e100f3?w=400&h=300&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400&h=300&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1563379926898-05fdf5cf0d4c?w=400&h=300&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&auto=format&q=80",
    ];

    return fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
  }

  /**
   * Get cuisine-specific fallback image
   */
  static getCuisineSpecificImage(
    cuisine: string,
    ingredients?: string[],
    recipeIndex: number = 0
  ): string {
    const cuisineImages: Record<string, string[]> = {
      Italian: [
        "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop&auto=format&q=80", // Chicken pasta
        "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop&auto=format&q=80", // Tomato pasta
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&auto=format&q=80", // Pasta italiana
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&auto=format&q=80", // Pizza
        "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop&auto=format&q=80", // Risotto
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop&auto=format&q=80", // Lasagna
        "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop&auto=format&q=80", // Gnocchi
        "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop&auto=format&q=80", // Italian dish 1
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&auto=format&q=80", // Italian dish 2
        "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop&auto=format&q=80", // Italian dish 3
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&auto=format&q=80", // Italian dish 4
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&auto=format&q=80", // Italian dish 5
        "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop&auto=format&q=80", // Italian dish 6
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop&auto=format&q=80", // Italian dish 7
        "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop&auto=format&q=80", // Italian dish 8
      ],
      Mexican: [
        "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop&auto=format&q=80", // Tacos
        "https://images.unsplash.com/photo-1563379926898-05fdf5cf0d4c?w=400&h=300&fit=crop&auto=format&q=80", // Enchiladas
        "https://images.unsplash.com/photo-1504674900242-4187e7e100f3?w=400&h=300&fit=crop&auto=format&q=80", // Guacamole
        "https://images.unsplash.com/photo-1592861956120-e524fc739696?w=400&h=300&fit=crop&auto=format&q=80", // Quesadillas
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&auto=format&q=80", // Burritos
        "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop&auto=format&q=80", // Chili dishes
        "https://images.unsplash.com/photo-1563379926898-05fdf5cf0d4c?w=400&h=300&fit=crop&auto=format&q=80", // Lime dishes
        "https://images.unsplash.com/photo-1504674900242-4187e7e100f3?w=400&h=300&fit=crop&auto=format&q=80", // Mexican dish 1
        "https://images.unsplash.com/photo-1592861956120-e524fc739696?w=400&h=300&fit=crop&auto=format&q=80", // Mexican dish 2
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&auto=format&q=80", // Mexican dish 3
        "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop&auto=format&q=80", // Mexican dish 4
        "https://images.unsplash.com/photo-1563379926898-05fdf5cf0d4c?w=400&h=300&fit=crop&auto=format&q=80", // Mexican dish 5
        "https://images.unsplash.com/photo-1504674900242-4187e7e100f3?w=400&h=300&fit=crop&auto=format&q=80", // Mexican dish 6
        "https://images.unsplash.com/photo-1592861956120-e524fc739696?w=400&h=300&fit=crop&auto=format&q=80", // Mexican dish 7
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&auto=format&q=80", // Mexican dish 8
      ],
      Asian: [
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop&auto=format&q=80", // Sushi
        "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400&h=300&fit=crop&auto=format&q=80", // Ramen
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&auto=format&q=80", // Stir fry
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&auto=format&q=80", // Dumplings
        "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop&auto=format&q=80", // Curry
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop&auto=format&q=80", // Rice dishes
        "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400&h=300&fit=crop&auto=format&q=80", // Ginger dishes
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&auto=format&q=80", // Asian dish 1
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&auto=format&q=80", // Asian dish 2
        "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop&auto=format&q=80", // Asian dish 3
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop&auto=format&q=80", // Asian dish 4
        "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400&h=300&fit=crop&auto=format&q=80", // Asian dish 5
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&auto=format&q=80", // Asian dish 6
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&auto=format&q=80", // Asian dish 7
        "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop&auto=format&q=80", // Asian dish 8
      ],
      Mediterranean: [
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&auto=format&q=80", // Greek salad
        "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop&auto=format&q=80", // Paella
        "https://images.unsplash.com/photo-1504674900242-4187e7e100f3?w=400&h=300&fit=crop&auto=format&q=80", // Hummus
        "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop&auto=format&q=80", // Falafel
        "https://images.unsplash.com/photo-1563379926898-05fdf5cf0d4c?w=400&h=300&fit=crop&auto=format&q=80", // Grilled fish
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&auto=format&q=80", // Mediterranean dish 1
        "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop&auto=format&q=80", // Mediterranean dish 2
        "https://images.unsplash.com/photo-1504674900242-4187e7e100f3?w=400&h=300&fit=crop&auto=format&q=80", // Mediterranean dish 3
        "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop&auto=format&q=80", // Mediterranean dish 4
        "https://images.unsplash.com/photo-1563379926898-05fdf5cf0d4c?w=400&h=300&fit=crop&auto=format&q=80", // Mediterranean dish 5
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&auto=format&q=80", // Mediterranean dish 6
        "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop&auto=format&q=80", // Mediterranean dish 7
        "https://images.unsplash.com/photo-1504674900242-4187e7e100f3?w=400&h=300&fit=crop&auto=format&q=80", // Mediterranean dish 8
        "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop&auto=format&q=80", // Mediterranean dish 9
        "https://images.unsplash.com/photo-1563379926898-05fdf5cf0d4c?w=400&h=300&fit=crop&auto=format&q=80", // Mediterranean dish 10
      ],
      French: [
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&auto=format&q=80", // Coq au vin
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop&auto=format&q=80", // Ratatouille
        "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400&h=300&fit=crop&auto=format&q=80", // Quiche
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&auto=format&q=80", // Escargots
        "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop&auto=format&q=80", // French onion soup
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&auto=format&q=80", // Beef dishes
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop&auto=format&q=80", // Wine dishes
        "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400&h=300&fit=crop&auto=format&q=80", // French dish 1
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&auto=format&q=80", // French dish 2
        "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop&auto=format&q=80", // French dish 3
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&auto=format&q=80", // French dish 4
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop&auto=format&q=80", // French dish 5
        "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400&h=300&fit=crop&auto=format&q=80", // French dish 6
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&auto=format&q=80", // French dish 7
        "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop&auto=format&q=80", // French dish 8
      ],
      Indian: [
        "https://images.unsplash.com/photo-1563379926898-05fdf5cf0d4c?w=400&h=300&fit=crop&auto=format&q=80", // Curry
        "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop&auto=format&q=80", // Tandoori
        "https://images.unsplash.com/photo-1504674900242-4187e7e100f3?w=400&h=300&fit=crop&auto=format&q=80", // Biryani
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&auto=format&q=80", // Naan bread
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop&auto=format&q=80", // Samosas
        "https://images.unsplash.com/photo-1563379926898-05fdf5cf0d4c?w=400&h=300&fit=crop&auto=format&q=80", // Curry dishes
        "https://images.unsplash.com/photo-1504674900242-4187e7e100f3?w=400&h=300&fit=crop&auto=format&q=80", // Coconut dishes
        "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop&auto=format&q=80", // Indian dish 1
        "https://images.unsplash.com/photo-1504674900242-4187e7e100f3?w=400&h=300&fit=crop&auto=format&q=80", // Indian dish 2
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&auto=format&q=80", // Indian dish 3
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop&auto=format&q=80", // Indian dish 4
        "https://images.unsplash.com/photo-1563379926898-05fdf5cf0d4c?w=400&h=300&fit=crop&auto=format&q=80", // Indian dish 5
        "https://images.unsplash.com/photo-1504674900242-4187e7e100f3?w=400&h=300&fit=crop&auto=format&q=80", // Indian dish 6
        "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop&auto=format&q=80", // Indian dish 7
        "https://images.unsplash.com/photo-1504674900242-4187e7e100f3?w=400&h=300&fit=crop&auto=format&q=80", // Indian dish 8
      ],
      Thai: [
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop&auto=format&q=80", // Pad Thai
        "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400&h=300&fit=crop&auto=format&q=80", // Green curry
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&auto=format&q=80", // Tom yum
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&auto=format&q=80", // Mango sticky rice
        "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop&auto=format&q=80", // Thai basil chicken
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop&auto=format&q=80", // Thai dish 1
        "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400&h=300&fit=crop&auto=format&q=80", // Thai dish 2
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&auto=format&q=80", // Thai dish 3
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&auto=format&q=80", // Thai dish 4
        "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop&auto=format&q=80", // Thai dish 5
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop&auto=format&q=80", // Thai dish 6
        "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400&h=300&fit=crop&auto=format&q=80", // Thai dish 7
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&auto=format&q=80", // Thai dish 8
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&auto=format&q=80", // Thai dish 9
        "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop&auto=format&q=80", // Thai dish 10
      ],
    };

    const images = cuisineImages[cuisine] || cuisineImages["Italian"];

    // Si tenemos ingredientes específicos, intentar seleccionar una imagen más relevante
    if (ingredients && ingredients.length > 0) {
      const ingredientStr = ingredients.join(" ").toLowerCase();

      // Buscar imágenes que coincidan con ingredientes específicos
      if (cuisine === "Italian") {
        if (ingredientStr.includes("chicken")) {
          return images[0]; // Chicken pasta
        } else if (ingredientStr.includes("tomato")) {
          return images[1]; // Tomato pasta
        } else if (ingredientStr.includes("pasta")) {
          return images[2]; // Pasta italiana
        } else if (ingredientStr.includes("cheese")) {
          return images[3]; // Pizza
        }
      } else if (cuisine === "Mexican") {
        if (ingredientStr.includes("chili")) {
          return images[5]; // Chili dishes
        } else if (ingredientStr.includes("lime")) {
          return images[6]; // Lime dishes
        } else if (ingredientStr.includes("tortilla")) {
          return images[0]; // Tacos
        }
      } else if (cuisine === "Asian") {
        if (ingredientStr.includes("rice")) {
          return images[5]; // Rice dishes
        } else if (ingredientStr.includes("ginger")) {
          return images[6]; // Ginger dishes
        } else if (ingredientStr.includes("soy")) {
          return images[1]; // Ramen
        }
      } else if (cuisine === "French") {
        if (ingredientStr.includes("beef")) {
          return images[5]; // Beef dishes
        } else if (ingredientStr.includes("wine")) {
          return images[6]; // Wine dishes
        } else if (ingredientStr.includes("herbs")) {
          return images[2]; // Quiche
        }
      } else if (cuisine === "Indian") {
        if (ingredientStr.includes("curry")) {
          return images[0]; // Curry
        } else if (ingredientStr.includes("coconut")) {
          return images[2]; // Biryani
        } else if (ingredientStr.includes("turmeric")) {
          return images[1]; // Tandoori
        }
      }
    }

    // Usar el índice de la receta para seleccionar diferentes imágenes
    return images[recipeIndex % images.length];
  }

  /**
   * Check if API key is configured
   */
  static isConfigured(): boolean {
    return !!this.ACCESS_KEY;
  }

  /**
   * Detect cuisine from ingredients
   */
  static detectCuisineFromIngredients(ingredients: string[]): string {
    const ingredientStr = ingredients.join(" ").toLowerCase();

    if (
      ingredientStr.includes("pasta") ||
      ingredientStr.includes("tomato") ||
      ingredientStr.includes("basil")
    ) {
      return "Italian";
    } else if (
      ingredientStr.includes("rice") ||
      ingredientStr.includes("soy") ||
      ingredientStr.includes("ginger")
    ) {
      return "Asian";
    } else if (
      ingredientStr.includes("tortilla") ||
      ingredientStr.includes("chili") ||
      ingredientStr.includes("lime")
    ) {
      return "Mexican";
    } else if (
      ingredientStr.includes("curry") ||
      ingredientStr.includes("coconut") ||
      ingredientStr.includes("turmeric")
    ) {
      return "Indian";
    } else if (
      ingredientStr.includes("fish") ||
      ingredientStr.includes("lemon") ||
      ingredientStr.includes("olive")
    ) {
      return "Mediterranean";
    } else if (
      ingredientStr.includes("beef") ||
      ingredientStr.includes("wine") ||
      ingredientStr.includes("herbs")
    ) {
      return "French";
    } else if (
      ingredientStr.includes("lemongrass") ||
      ingredientStr.includes("fish sauce") ||
      ingredientStr.includes("lime")
    ) {
      return "Thai";
    }

    return "International";
  }

  /**
   * Generate search query based on ingredients
   */
  static generateSearchQueryFromIngredients(ingredients: string[]): string {
    const mainIngredients = ingredients.slice(0, 3); // Tomar los primeros 3 ingredientes
    const ingredientQuery = mainIngredients.join(" ");

    // Detectar la cocina basada en los ingredientes
    const detectedCuisine = this.detectCuisineFromIngredients(ingredients);

    // Construir una consulta específica basada en ingredientes
    let searchQuery = `${ingredientQuery} dish`;

    if (detectedCuisine && detectedCuisine !== "International") {
      searchQuery += ` ${detectedCuisine.toLowerCase()}`;
    }

    searchQuery += " food photography";
    return searchQuery;
  }
}
