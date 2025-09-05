"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/layout/Providers";
import { MusicalNoteIcon } from "@heroicons/react/24/outline";
import WorkForm from "@/components/works/WorkForm";

export default function NewWorkPage() {
  const { user } = useAuth();
  const router = useRouter();

  // Check if user is logged in
  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
      return;
    }
  }, [user, router]);

  const handleSuccess = (workId: string) => {
    router.push(`/works/${workId}`);
  };

  const handleCancel = () => {
    router.push("/works");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
              <MusicalNoteIcon className="h-6 w-6 text-primary-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Create New Work
            </h1>
          </div>
          <p className="mt-2 text-gray-600">
            Upload your sheet music and MIDI files to share with music lovers
          </p>
        </div>

        {/* Create form */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <WorkForm
              mode="create"
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
