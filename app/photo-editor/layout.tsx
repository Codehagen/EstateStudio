import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Real Estate Photo Editor",
  description: "Transform your real estate photos with AI-powered editing using Gemini Nano Banana",
};

export default function PhotoEditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
}