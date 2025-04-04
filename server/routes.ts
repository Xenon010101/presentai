import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import fs from "fs";
import path from "path";
import { z } from "zod";
import { insertUserSchema, insertEvaluationSchema, updateEvaluationSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

const upload = multer({
  dest: path.join(process.cwd(), "uploads"),
  limits: {
    fileSize: 200 * 1024 * 1024, // 200MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["video/mp4", "video/webm", "video/quicktime"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only MP4, WebM, and MOV videos are allowed."));
    }
  }
});

const validateRequestBody = <T>(schema: z.ZodType<T>, req: Request, res: Response): T | null => {
  try {
    return schema.parse(req.body);
  } catch (error) {
    if (error instanceof ZodError) {
      const validationError = fromZodError(error);
      res.status(400).json({ message: validationError.message });
    } else {
      res.status(400).json({ message: "Invalid request data" });
    }
    return null;
  }
};

// Create uploads directory if it doesn't exist
if (!fs.existsSync(path.join(process.cwd(), "uploads"))) {
  fs.mkdirSync(path.join(process.cwd(), "uploads"), { recursive: true });
}

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // User routes
  app.post("/api/users", async (req, res) => {
    const userData = validateRequestBody(insertUserSchema, req, res);
    if (!userData) return;

    const existingUser = await storage.getUserByUsername(userData.username);
    if (existingUser) {
      return res.status(409).json({ message: "Username already taken" });
    }

    const user = await storage.createUser(userData);
    res.status(201).json({ id: user.id, username: user.username });
  });

  // Video upload route
  app.post("/api/evaluations/upload", upload.single("video"), async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No video file uploaded" });
    }

    try {
      // For demo purposes, we'll use a fixed user ID (1)
      const userId = 1;
      const title = req.body.title || `Evaluation ${new Date().toLocaleString()}`;
      
      // Save the file path
      const videoUrl = `/uploads/${req.file.filename}`;
      
      const evaluation = await storage.createEvaluation({
        userId,
        title,
        videoUrl
      });
      
      // In a real implementation, we would start processing the video here
      // For demo purposes, we'll simulate processing by updating after a delay
      setTimeout(async () => {
        await simulateVideoAnalysis(evaluation.id);
      }, 5000);
      
      res.status(201).json(evaluation);
    } catch (error) {
      console.error("Error uploading video:", error);
      res.status(500).json({ message: "Error uploading video" });
    }
  });

  // Get evaluation by ID
  app.get("/api/evaluations/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid evaluation ID" });
    }

    const evaluation = await storage.getEvaluation(id);
    if (!evaluation) {
      return res.status(404).json({ message: "Evaluation not found" });
    }

    res.json(evaluation);
  });

  // Get evaluations by user ID
  app.get("/api/evaluations/user/:userId", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const evaluations = await storage.getEvaluationsByUserId(userId);
    res.json(evaluations);
  });

  // Serve uploaded videos
  app.get("/uploads/:filename", (req, res) => {
    const filePath = path.join(process.cwd(), "uploads", req.params.filename);
    res.sendFile(filePath);
  });

  return httpServer;
}

// Helper function to simulate video analysis
async function simulateVideoAnalysis(evaluationId: number) {
  try {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Generate random scores
    const confidenceScore = Math.floor(Math.random() * 30) + 70; // 70-100
    const facialExpressionsScore = Math.floor(Math.random() * 30) + 70;
    const eyeContactScore = Math.floor(Math.random() * 30) + 60;
    const bodyLanguageScore = Math.floor(Math.random() * 30) + 60;
    
    // Calculate overall score
    const overallScore = Math.floor(
      (confidenceScore + facialExpressionsScore + eyeContactScore + bodyLanguageScore) / 4
    );
    
    // Generate feedback
    const feedback = [
      {
        type: "positive",
        message: "Consistent clear speech throughout the presentation."
      },
      {
        type: "positive",
        message: "Good use of facial expressions to emphasize important points."
      },
      {
        type: "negative",
        message: "Try to maintain eye contact for longer periods with the audience."
      },
      {
        type: "negative",
        message: "Reduce hand fidgeting to appear more confident."
      }
    ];
    
    // Generate analysis details
    const analysisDetails = {
      expressionDistribution: {
        neutral: 45,
        happy: 25,
        sad: 5,
        angry: 0,
        fearful: 5,
        disgusted: 0,
        surprised: 20
      },
      timeline: Array.from({ length: 8 }, (_, i) => ({
        time: `${Math.floor(i/2)}:${(i % 2) * 30}0`,
        confidence: Math.floor(Math.random() * 30) + 60
      }))
    };
    
    await storage.updateEvaluation(evaluationId, {
      status: "completed",
      overallScore,
      confidenceScore,
      facialExpressionsScore,
      eyeContactScore,
      bodyLanguageScore,
      feedback,
      analysisDetails
    });
  } catch (error) {
    console.error("Error in video analysis:", error);
    await storage.updateEvaluation(evaluationId, {
      status: "failed"
    });
  }
}
