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
      "braised",
      "grilled",
      "sautéed",
      "roasted",
      "steamed",
      "fried",
      "baked",
      "smoked",
      "cured",
      "pickled",
      "fermented",
      "infused",
    ];

    let query = recipeTitle
      .toLowerCase()
      .replace(/[^\w\s]/g, " ") // Remove special characters
      .split(" ")
      .filter((word) => word.length > 2 && !commonWords.includes(word))
      .slice(0, 3) // Take first 3 meaningful words for more specific search
      .join(" ");

    // If no meaningful words found, use the original title
    if (!query.trim()) {
      query = recipeTitle
        .toLowerCase()
        .replace(/[^\w\s]/g, " ")
        .trim();
    }

    // Add "food photography" to make it more specific
    return query + " food photography";
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
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop&auto=format&q=80",
    ];

    return fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
  }

  /**
   * Check if API key is configured
   */
  static isConfigured(): boolean {
    return !!this.ACCESS_KEY;
  }
}
