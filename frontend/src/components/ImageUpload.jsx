import React, { useState } from "react";
import { Upload, Link, Image as ImageIcon, X } from "lucide-react";
import { fileAPI } from "../services/api";

const ImageUpload = ({ currentImage, onImageChange, className = "" }) => {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentImage || "");
  const [uploadMode, setUploadMode] = useState("url"); // 'upload' or 'url'

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    setUploading(true);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target.result);
      reader.readAsDataURL(file);

      // Upload file
      const response = await fileAPI.upload(file);
      const imageUrl = `https://umersaeed.duckdns.org${response.file_url}`;

      onImageChange(imageUrl);
      setPreviewUrl(imageUrl);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload image. Please try again.");
      setPreviewUrl(currentImage || "");
    } finally {
      setUploading(false);
    }
  };

  const handleUrlChange = (event) => {
    const url = event.target.value;
    setPreviewUrl(url);
    onImageChange(url);
  };

  const clearImage = () => {
    setPreviewUrl("");
    onImageChange("");
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Mode Toggle */}
      <div className="flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
        <button
          type="button"
          onClick={() => setUploadMode("upload")}
          className={`flex-1 px-4 py-2 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
            uploadMode === "upload"
              ? "bg-blue-500 text-white"
              : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
          }`}
        >
          <Upload size={16} />
          Upload from PC
        </button>
        <button
          type="button"
          onClick={() => setUploadMode("url")}
          className={`flex-1 px-4 py-2 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
            uploadMode === "url"
              ? "bg-blue-500 text-white"
              : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
          }`}
        >
          <Link size={16} />
          Use URL
        </button>
      </div>

      {/* File Upload Mode */}
      {uploadMode === "upload" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select Image File
          </label>
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={uploading}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0
                       file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700
                       hover:file:bg-blue-100 disabled:opacity-50 cursor-pointer
                       file:cursor-pointer"
            />
            {uploading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Max file size: 5MB. Supported formats: JPG, PNG, GIF, WebP
          </p>
        </div>
      )}

      {/* URL Input Mode */}
      {uploadMode === "url" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Image URL
          </label>
          <input
            type="url"
            value={currentImage || ""}
            onChange={handleUrlChange}
            placeholder="https://example.com/image.jpg"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      )}

      {/* Upload Status */}
      {uploading && (
        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-md">
          <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
          <span className="text-sm font-medium">Uploading image...</span>
        </div>
      )}

      {/* Image Preview */}
      {previewUrl && !uploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Preview
            </label>
            <button
              type="button"
              onClick={clearImage}
              className="text-red-500 hover:text-red-700 p-1 rounded"
              title="Remove image"
            >
              <X size={16} />
            </button>
          </div>
          <div className="relative inline-block">
            <img
              src={previewUrl}
              alt="Preview"
              className="h-32 w-32 object-cover rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm"
              onError={(e) => {
                e.target.src =
                  'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24" fill="%23666"><rect x="3" y="3" width="18" height="18" rx="2" fill="%23f3f4f6"/><path d="M8.5 10a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3ZM21 15l-5-5L5 21h16Z" fill="%23666"/></svg>';
                e.target.alt = "Failed to load image";
              }}
            />
            <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1">
              <ImageIcon size={12} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
