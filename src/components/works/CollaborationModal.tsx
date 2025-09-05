"use client";

import { useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  XMarkIcon,
  MusicalNoteIcon,
  DocumentTextIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

interface CollaborationModalProps {
  workId: number;
  workTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CollaborationModal({
  workId,
  workTitle,
  isOpen,
  onClose,
  onSuccess,
}: CollaborationModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    commitMessage: "",
    changesSummary: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.name.toLowerCase().endsWith(".mid")) {
        toast.error("Only MIDI file format is supported");
        return;
      }

      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size cannot exceed 10MB");
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    if (!selectedFile) {
      toast.error("Please select a MIDI file");
      setError("Please select a MIDI file");
      return;
    }

    if (!formData.title.trim() || !formData.commitMessage.trim()) {
      toast.error("Please fill in all required fields");
      setError("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);

      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("description", formData.description);
      submitData.append("commitMessage", formData.commitMessage);
      submitData.append("changesSummary", formData.changesSummary);
      submitData.append("midiFile", selectedFile);

      const response = await axios.post(
        `/api/works/${workId}/collaborations/submit`,
        submitData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        toast.success("Collaboration request submitted successfully!");
        handleClose();
        onSuccess();
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Submission failed";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: "",
      description: "",
      commitMessage: "",
      changesSummary: "",
    });
    setSelectedFile(null);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <DocumentTextIcon className="h-5 w-5 mr-2" />
            Submit Collaboration Request
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Work Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Target Work</div>
            <div className="font-medium text-gray-900">{workTitle}</div>
          </div>

          {/* Request Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Request Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Briefly describe your changes"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>

          {/* Request Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Request Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your changes and reasons in detail"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Commit Message */}
          <div>
            <label
              htmlFor="commitMessage"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Commit Message <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="commitMessage"
              name="commitMessage"
              value={formData.commitMessage}
              onChange={handleInputChange}
              placeholder="Briefly describe this change (like Git commit message)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>

          {/* Changes Summary */}
          <div>
            <label
              htmlFor="changesSummary"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Changes Summary
            </label>
            <textarea
              id="changesSummary"
              name="changesSummary"
              value={formData.changesSummary}
              onChange={handleInputChange}
              placeholder="Detail what changes you made to the MIDI file"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* File Upload */}
          <div>
            <label
              htmlFor="midiFile"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              MIDI File <span className="text-red-500">*</span>
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                id="midiFile"
                accept=".mid"
                onChange={handleFileChange}
                className="hidden"
                required
              />
              <MusicalNoteIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <div className="text-sm text-gray-600 mb-2">
                {selectedFile ? (
                  <span className="text-green-600 font-medium">
                    {selectedFile.name}
                  </span>
                ) : (
                  "Click to select or drag MIDI file here"
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Select File
              </button>
              <p className="text-xs text-gray-500 mt-2">
                Supports .mid format, max 10MB
              </p>
            </div>
          </div>

          {/* Error message display */}
          {error && (
            <div
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <strong className="font-bold">Submission failed:</strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {/* Submit buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                  Submitting...
                </div>
              ) : (
                "Submit Collaboration Request"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
