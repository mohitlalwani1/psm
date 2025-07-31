import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Upload,
  Download,
  Share2,
  Edit,
  Trash2,
  Search,
  Folder,
} from "lucide-react";
import { api } from "@/lib/api";

interface Document {
  _id: string;
  title: string;
  description: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  category: string;
  projectId: string;
  uploadedBy: string;
  uploadedAt: string;
  lastModified: string;
  tags: string[];
  isPublic: boolean;
  downloadCount: number;
}

export default function Documents() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [uploading, setUploading] = useState(false);
  const [newDocument, setNewDocument] = useState({
    title: "",
    description: "",
    category: "",
    tags: "",
    isPublic: false,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await api.get("/documents");
      setDocuments(response as Document[]);
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("title", newDocument.title);
    formData.append("description", newDocument.description);
    formData.append("category", newDocument.category);
    formData.append("tags", newDocument.tags);
    formData.append("isPublic", newDocument.isPublic.toString());

    try {
      await api.post("/documents/upload", formData);
      setNewDocument({
        title: "",
        description: "",
        category: "",
        tags: "",
        isPublic: false,
      });
      setSelectedFile(null);
      setShowUpload(false);
      fetchDocuments();
    } catch (error) {
      console.error("Error uploading document:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (_documentId: string, fileName: string) => {
    try {
      const url = window.URL.createObjectURL(
        new Blob(["Mock file content"], { type: "text/plain" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading document:", error);
    }
  };

  const handleDeleteDocument = async (_documentId: string) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      try {
        await api.delete();
        fetchDocuments();
      } catch (error) {
        console.error("Error deleting document:", error);
      }
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (!fileType) return "📄";
    if (fileType.includes("pdf")) return "📄";
    if (fileType.includes("doc")) return "📝";
    if (fileType.includes("xls")) return "📊";
    if (fileType.includes("ppt")) return "📈";
    if (fileType.includes("image")) return "🖼️";
    return "📄";
  };

  const filteredDocuments = (documents || []).filter((doc) => {
    const matchesSearch =
      (doc.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.description || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (doc.tags || []).some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesCategory =
      selectedCategory === "all" || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    ...new Set((documents || []).map((doc) => doc.category || "Uncategorized")),
  ];

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Document Management</h1>
          <p className="text-muted-foreground">
            Organize and share project documents
          </p>
        </div>
        <Button onClick={() => setShowUpload(true)}>
          <Upload className="w-4 h-4 mr-2" />
          Upload Document
        </Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              className="p-2 border rounded"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              aria-label="Filter by category"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Document Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Documents
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(documents || []).length}</div>
            <p className="text-xs text-muted-foreground">All uploaded files</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Size</CardTitle>
            <Folder className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatFileSize(
                (documents || []).reduce(
                  (sum, doc) => sum + (doc.fileSize || 0),
                  0
                )
              )}
            </div>
            <p className="text-xs text-muted-foreground">Storage used</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Public Documents
            </CardTitle>
            <Share2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(documents || []).filter((doc) => doc.isPublic).length}
            </div>
            <p className="text-xs text-muted-foreground">Shared with team</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Downloads
            </CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(documents || []).reduce(
                (sum, doc) => sum + (doc.downloadCount || 0),
                0
              )}
            </div>
            <p className="text-xs text-muted-foreground">File downloads</p>
          </CardContent>
        </Card>
      </div>

      {/* Documents List */}
      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredDocuments.map((document) => (
              <div
                key={document._id}
                className="flex items-center justify-between border rounded-lg p-4"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">
                    {getFileIcon(document.fileType)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">
                      {document.title || "Untitled Document"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {document.description || "No description"}
                    </p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {formatFileSize(document.fileSize || 0)}
                      </span>
                      <Badge variant="outline">
                        {document.category || "Uncategorized"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {document.uploadedAt
                          ? new Date(document.uploadedAt).toLocaleDateString()
                          : "Unknown date"}
                      </span>
                      {document.isPublic && (
                        <Badge className="bg-green-100 text-green-800">
                          Public
                        </Badge>
                      )}
                    </div>
                    {(document.tags || []).length > 0 && (
                      <div className="flex space-x-1 mt-1">
                        {(document.tags || []).map((tag, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-muted-foreground">
                    {document.downloadCount || 0} downloads
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      handleDownload(
                        document._id,
                        document.fileName || "document"
                      )
                    }
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      /* Handle share */
                    }}
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      /* Handle edit */
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteDocument(document._id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Upload Document</h2>
            <div className="space-y-4">
              <Input
                placeholder="Document Title"
                value={newDocument.title}
                onChange={(e) =>
                  setNewDocument({ ...newDocument, title: e.target.value })
                }
              />
              <textarea
                className="w-full p-2 border rounded"
                placeholder="Description"
                value={newDocument.description}
                onChange={(e) =>
                  setNewDocument({
                    ...newDocument,
                    description: e.target.value,
                  })
                }
                rows={3}
              />
              <Input
                placeholder="Category"
                value={newDocument.category}
                onChange={(e) =>
                  setNewDocument({ ...newDocument, category: e.target.value })
                }
              />
              <Input
                placeholder="Tags (comma separated)"
                value={newDocument.tags}
                onChange={(e) =>
                  setNewDocument({ ...newDocument, tags: e.target.value })
                }
              />
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={newDocument.isPublic}
                  onChange={(e) =>
                    setNewDocument({
                      ...newDocument,
                      isPublic: e.target.checked,
                    })
                  }
                />
                <label htmlFor="isPublic">Make document public</label>
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {selectedFile ? selectedFile.name : "Click to select file"}
                  </p>
                </label>
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={handleFileUpload}
                  className="flex-1"
                  disabled={!selectedFile || uploading}
                >
                  {uploading ? "Uploading..." : "Upload"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowUpload(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
