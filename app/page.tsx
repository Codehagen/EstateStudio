import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Camera, Wand2, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center space-y-8 mb-16">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 rounded-full bg-primary/10">
              <Sparkles className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Real Estate Photo Editor
            </h1>
          </div>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Transform your real estate photos with cutting-edge AI technology. 
            Powered by Google's Gemini 2.0 Flash (Nano Banana) for professional-grade photo editing.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/photo-editor">
              <Button size="lg" className="gap-2 px-8 py-4 text-lg">
                <Camera className="h-5 w-5" />
                Start Editing
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="px-8 py-4 text-lg">
              View Examples
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="border-none shadow-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur">
            <CardContent className="p-8 text-center space-y-4">
              <div className="p-4 rounded-full bg-blue-100 dark:bg-blue-900 w-fit mx-auto">
                <Camera className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold">Virtual Staging</h3>
              <p className="text-muted-foreground">
                Add modern furniture and decor to empty rooms with AI-generated staging that looks completely realistic.
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur">
            <CardContent className="p-8 text-center space-y-4">
              <div className="p-4 rounded-full bg-green-100 dark:bg-green-900 w-fit mx-auto">
                <Wand2 className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold">Smart Enhancement</h3>
              <p className="text-muted-foreground">
                Improve lighting, remove clutter, enhance colors, and boost curb appeal with intelligent AI edits.
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur">
            <CardContent className="p-8 text-center space-y-4">
              <div className="p-4 rounded-full bg-purple-100 dark:bg-purple-900 w-fit mx-auto">
                <Sparkles className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold">Professional Quality</h3>
              <p className="text-muted-foreground">
                Maintain photorealistic quality with Google's advanced Gemini AI, trusted by professionals.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-2xl p-12 shadow-lg">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Photos?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of real estate professionals using AI to create stunning property photos that sell faster.
          </p>
          <Link href="/photo-editor">
            <Button size="lg" className="gap-2 px-12 py-4 text-xl">
              <Sparkles className="h-6 w-6" />
              Get Started Now
              <ArrowRight className="h-6 w-6" />
            </Button>
          </Link>
        </div>

        {/* Powered by */}
        <div className="text-center mt-16 space-y-4">
          <p className="text-sm text-muted-foreground">Powered by cutting-edge AI technology</p>
          <div className="flex items-center justify-center gap-6 opacity-60">
            <Image
              src="/next.svg"
              alt="Next.js"
              width={80}
              height={20}
              className="dark:invert"
            />
            <span className="text-2xl text-muted-foreground">×</span>
            <div className="text-lg font-semibold">Google Gemini 2.0</div>
          </div>
        </div>
      </div>
    </div>
  );
}
