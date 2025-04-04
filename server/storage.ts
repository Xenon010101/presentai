import { 
  users, type User, type InsertUser,
  evaluations, type Evaluation, type InsertEvaluation, type UpdateEvaluation
} from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Evaluation methods
  getEvaluation(id: number): Promise<Evaluation | undefined>;
  getEvaluationsByUserId(userId: number): Promise<Evaluation[]>;
  createEvaluation(evaluation: InsertEvaluation): Promise<Evaluation>;
  updateEvaluation(id: number, update: UpdateEvaluation): Promise<Evaluation | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private evaluations: Map<number, Evaluation>;
  private userIdCounter: number;
  private evaluationIdCounter: number;

  constructor() {
    this.users = new Map();
    this.evaluations = new Map();
    this.userIdCounter = 1;
    this.evaluationIdCounter = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getEvaluation(id: number): Promise<Evaluation | undefined> {
    return this.evaluations.get(id);
  }

  async getEvaluationsByUserId(userId: number): Promise<Evaluation[]> {
    return Array.from(this.evaluations.values())
      .filter(evaluation => evaluation.userId === userId)
      .sort((a, b) => {
        const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
        const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
        return dateB.getTime() - dateA.getTime();
      });
  }

  async createEvaluation(insertEvaluation: InsertEvaluation): Promise<Evaluation> {
    const id = this.evaluationIdCounter++;
    const now = new Date();
    
    const evaluation: Evaluation = {
      ...insertEvaluation,
      id,
      createdAt: now,
      status: "processing",
      overallScore: null,
      confidenceScore: null,
      facialExpressionsScore: null,
      eyeContactScore: null,
      bodyLanguageScore: null,
      feedback: null,
      analysisDetails: null
    };
    
    this.evaluations.set(id, evaluation);
    return evaluation;
  }

  async updateEvaluation(id: number, update: UpdateEvaluation): Promise<Evaluation | undefined> {
    const evaluation = this.evaluations.get(id);
    if (!evaluation) return undefined;
    
    const updatedEvaluation: Evaluation = {
      ...evaluation,
      ...update
    };
    
    this.evaluations.set(id, updatedEvaluation);
    return updatedEvaluation;
  }
}

export const storage = new MemStorage();
