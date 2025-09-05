"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function FeedbackPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(""); // Clear previous error messages

    try {
      // Call API to submit feedback
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(data.error || data.message || "Submission failed");
      }

      toast.success(
        "Thank you for your feedback! We will process it as soon as possible."
      );
      setIsSubmitSuccess(true);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      let friendlyMessage = "Unknown error";
      let technicalMessage = "";

      if (error instanceof Error) {
        technicalMessage = error.message;
      }

      // Display user-friendly error messages
      if (
        technicalMessage.includes("Table") &&
        technicalMessage.includes("doesn't exist")
      ) {
        friendlyMessage =
          "System is not ready to receive feedback, please contact administrator to initialize feedback system";
      } else if (technicalMessage.includes("Database error")) {
        friendlyMessage =
          "Database service is temporarily unavailable, please try again later";
      }

      // Set error message state
      setErrorMessage(friendlyMessage);

      // Show toast notification
      toast.error(`Submission failed: ${friendlyMessage}`);
      console.error("Failed to submit feedback:", error, technicalMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinueFeedback = () => {
    setIsSubmitSuccess(false);
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          Submit Feedback & Suggestions
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          We value your feedback and suggestions, which help us continuously
          improve our products and services
        </p>
      </div>

      {isSubmitSuccess ? (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6 sm:p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
              <svg
                className="h-10 w-10 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Feedback Submitted Successfully
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Thank you for your valuable feedback and suggestions! We will
              carefully review and process your feedback as soon as possible.
              <br />
              Your support is the driving force behind our continuous
              improvement.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                onClick={handleContinueFeedback}
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Continue Submitting Feedback
              </button>
              <button
                onClick={handleGoBack}
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Your Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      placeholder="Please enter your name"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email Address
                  </label>
                  <div className="mt-1">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      placeholder="Please enter your email address"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700"
                >
                  Feedback Type
                </label>
                <div className="mt-1">
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    required
                  >
                    <option value="">Please select feedback type</option>
                    <option value="Feature Suggestion">
                      Feature Suggestion
                    </option>
                    <option value="Bug Report">Bug Report</option>
                    <option value="Content Feedback">Content Feedback</option>
                    <option value="User Experience">User Experience</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700"
                >
                  Feedback Content
                </label>
                <div className="mt-1">
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    placeholder="Please describe your feedback or suggestions in detail..."
                    required
                  ></textarea>
                </div>
              </div>

              {/* Error Message Display Area */}
              {errorMessage && (
                <div className="rounded-md bg-red-50 p-4 mb-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-red-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        Submission Failed
                      </h3>
                      <div className="mt-2 text-sm text-red-700">
                        <p>{errorMessage}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Submitting..." : "Submit Feedback"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="mt-12 text-center">
        <h2 className="text-xl font-semibold text-gray-900">
          Other Contact Methods
        </h2>
        <p className="mt-2 text-gray-600">
          If you have urgent issues that need to be resolved, you can also
          contact us through the following methods
        </p>
        <div className="mt-4 flex justify-center space-x-6">
          <div className="text-center">
            <div className="text-lg font-medium text-gray-900">Email</div>
            <div className="mt-1 text-gray-600">837856276@qq.com</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-medium text-gray-900">
              Customer Service
            </div>
            <div className="mt-1 text-gray-600">+086-15663632812</div>
          </div>
        </div>
      </div>
    </div>
  );
}
