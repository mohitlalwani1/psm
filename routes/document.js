import express from "express";
import { auth } from "../middleware/auth.js";
import multer from "multer";
import path from "path";

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Get all documents
router.get("/", auth, async (req, res) => {
  try {
    // Mock data - replace with actual database queries
    const documents = [
      {
        _id: "1",
        title: "Project Requirements",
        description: "Detailed project requirements document",
        fileName: "requirements.pdf",
        fileSize: 2048576,
        fileType: "application/pdf",
        category: "Requirements",
        projectId: "1",
        uploadedBy: "John Doe",
        uploadedAt: "2024-01-15T10:30:00Z",
        lastModified: "2024-01-15T10:30:00Z",
        tags: ["requirements", "planning"],
        isPublic: true,
        downloadCount: 15,
      },
      {
        _id: "2",
        title: "Design Mockups",
        description: "UI/UX design mockups",
        fileName: "mockups.zip",
        fileSize: 10485760,
        fileType: "application/zip",
        category: "Design",
        projectId: "1",
        uploadedBy: "Jane Smith",
        uploadedAt: "2024-01-20T14:45:00Z",
        lastModified: "2024-01-20T14:45:00Z",
        tags: ["design", "ui", "ux"],
        isPublic: false,
        downloadCount: 8,
      },
    ];
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Upload document
router.post("/upload", auth, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const document = {
      _id: Date.now().toString(),
      title: req.body.title,
      description: req.body.description,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      fileType: req.file.mimetype,
      category: req.body.category,
      projectId: req.body.projectId || "1",
      uploadedBy: req.user.id,
      uploadedAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      tags: req.body.tags
        ? req.body.tags.split(",").map((tag) => tag.trim())
        : [],
      isPublic: req.body.isPublic === "true",
      downloadCount: 0,
    };

    res.status(201).json(document);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Download document
router.get("/:id/download", auth, async (req, res) => {
  try {
    // Mock file path - replace with actual file retrieval
    const filePath = path.join(process.cwd(), "uploads", "sample.pdf");
    res.download(filePath);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get document by ID
router.get("/:id", auth, async (req, res) => {
  try {
    // Mock data - replace with actual database query
    const document = {
      _id: req.params.id,
      title: "Sample Document",
      description: "Sample document description",
      fileName: "sample.pdf",
      fileSize: 2048576,
      fileType: "application/pdf",
      category: "General",
      projectId: "1",
      uploadedBy: "John Doe",
      uploadedAt: "2024-01-15T10:30:00Z",
      lastModified: "2024-01-15T10:30:00Z",
      tags: ["sample"],
      isPublic: true,
      downloadCount: 5,
    };
    res.json(document);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update document
router.put("/:id", auth, async (req, res) => {
  try {
    const document = {
      _id: req.params.id,
      ...req.body,
      lastModified: new Date().toISOString(),
    };
    res.json(document);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete document
router.delete("/:id", auth, async (req, res) => {
  try {
    res.json({ message: "Document deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
