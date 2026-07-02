/**
 * Session Limits Manager
 * Controls recipe generation limits per user session
 * Uses server-side in-memory storage for API routes
 */

interface SessionData {
  userId: string;
  recipesGenerated: number;
  sessionStartTime: number;
  lastActivity: number;
}

// Global server-side storage for sessions
declare global {
  var __sessionLimits: Map<string, SessionData> | undefined;
}

class SessionLimitsManager {
  private sessions: Map<string, SessionData>;

  // Configuration — generation is free (Gemini), so effectively unlimited
  private readonly MAX_RECIPES_PER_SESSION = 1000;
  private readonly SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours

  constructor() {
    // Use global server-side storage
    if (typeof window === 'undefined') {
      // Server-side: use global storage
      if (!global.__sessionLimits) {
        global.__sessionLimits = new Map();
      }
      this.sessions = global.__sessionLimits;
    } else {
      // Client-side: use localStorage
      this.sessions = new Map();
      this.loadSessionsFromStorage();
    }
  }

  /**
   * Check if user can generate more recipes
   */
  canGenerateRecipe(userId: string): boolean {
    const session = this.getOrCreateSession(userId);
    const canGenerate = session.recipesGenerated < this.MAX_RECIPES_PER_SESSION;
    console.log(`🔍 SessionLimitsManager.canGenerateRecipe(${userId}):`, {
      recipesGenerated: session.recipesGenerated,
      maxRecipes: this.MAX_RECIPES_PER_SESSION,
      canGenerate,
      isServer: typeof window === 'undefined',
      sessionAge: Math.round((Date.now() - session.sessionStartTime) / (1000 * 60 * 60)), // hours
    });
    return canGenerate;
  }

  /**
   * Get remaining recipes for user
   */
  getRemainingRecipes(userId: string): number {
    const session = this.getOrCreateSession(userId);
    return Math.max(0, this.MAX_RECIPES_PER_SESSION - session.recipesGenerated);
  }

  /**
   * Record a recipe generation
   */
  recordRecipeGeneration(userId: string): boolean {
    const session = this.getOrCreateSession(userId);

    console.log(`📊 SessionLimitsManager.recordRecipeGeneration(${userId}):`, {
      currentCount: session.recipesGenerated,
      maxRecipes: this.MAX_RECIPES_PER_SESSION,
      isServer: typeof window === 'undefined',
      sessionAge: Math.round((Date.now() - session.sessionStartTime) / (1000 * 60 * 60)), // hours
    });

    if (session.recipesGenerated >= this.MAX_RECIPES_PER_SESSION) {
      console.log(`🚫 Limit exceeded for user ${userId}`);
      return false; // Limit exceeded
    }

    session.recipesGenerated++;
    session.lastActivity = Date.now();

    console.log(
      `✅ Recipe generation recorded for user ${userId}. New count: ${session.recipesGenerated}`
    );

    this.saveSessionsToStorage();
    return true;
  }

  /**
   * Get or create session for user
   */
  private getOrCreateSession(userId: string): SessionData {
    let session = this.sessions.get(userId);

    if (!session || this.isSessionExpired(session)) {
      session = {
        userId,
        recipesGenerated: 0,
        sessionStartTime: Date.now(),
        lastActivity: Date.now(),
      };
      this.sessions.set(userId, session);
    }

    return session;
  }

  /**
   * Check if session has expired
   */
  private isSessionExpired(session: SessionData): boolean {
    return Date.now() - session.lastActivity > this.SESSION_TIMEOUT;
  }

  /**
   * Reset session for user (for testing or admin purposes)
   */
  resetSession(userId: string): void {
    this.sessions.delete(userId);
    this.saveSessionsToStorage();
  }

  /**
   * Get session info for user
   */
  getSessionInfo(userId: string): SessionData | null {
    const session = this.sessions.get(userId);
    if (!session || this.isSessionExpired(session)) {
      return null;
    }
    return { ...session };
  }

  /**
   * Load sessions from localStorage
   */
  private loadSessionsFromStorage(): void {
    try {
      const stored = localStorage.getItem('chef-at-home-sessions');
      if (stored) {
        const data = JSON.parse(stored);
        this.sessions = new Map(data);

        // Clean up expired sessions
        for (const [userId, session] of this.sessions.entries()) {
          if (this.isSessionExpired(session)) {
            this.sessions.delete(userId);
          }
        }
      }
    } catch (error) {
      console.warn('Failed to load sessions from storage:', error);
    }
  }

  /**
   * Save sessions to storage (localStorage on client, in-memory on server)
   */
  private saveSessionsToStorage(): void {
    if (typeof window !== 'undefined') {
      // Client-side: save to localStorage
      try {
        const data = Array.from(this.sessions.entries());
        localStorage.setItem('chef-at-home-sessions', JSON.stringify(data));
      } catch (error) {
        console.warn('Failed to save sessions to localStorage:', error);
      }
    }
    // Server-side: no need to save, already in global memory
  }

  /**
   * Get all active sessions (for debugging)
   */
  getAllSessions(): Map<string, SessionData> {
    return new Map(this.sessions);
  }
}

// Create a new instance (not singleton) to work properly in server/client environments
export const sessionLimitsManager = new SessionLimitsManager();

// Export types for use in other files
export type { SessionData };
