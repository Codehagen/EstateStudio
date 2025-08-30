import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { signOut } from "@/lib/auth-client";
import Link from "next/link";

export default async function Dashboard() {
  const session = await getSession();
  
  if (!session) {
    redirect("/sign-in");
  }

  // Get user's workspace
  const workspace = await prisma.workspace.findFirst({
    where: {
      members: {
        some: {
          userId: session.user.id,
        },
      },
    },
    include: {
      projects: {
        take: 5,
        orderBy: {
          createdAt: "desc",
        },
      },
      _count: {
        select: {
          photos: true,
        },
      },
    },
  });

  if (!workspace) {
    // This shouldn't happen if workspace creation on signup works
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>No Workspace Found</CardTitle>
            <CardDescription>
              There was an issue finding your workspace. Please contact support.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">AI Photo Editor</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {session.user.email}
              </span>
              <SignOutButton />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Welcome back, {session.user.name || "User"}!
          </h2>
          <p className="text-gray-600 mt-1">
            Workspace: {workspace.name}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Subscription</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold capitalize">
                {workspace.subscriptionTier.toLowerCase()}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {workspace.currentMonthEdits} / {workspace.monthlyEditLimit} edits this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Total Photos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">
                {workspace._count.photos}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Across all projects
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">
                {workspace.projects.length}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Active projects
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Start Editing</CardTitle>
            <CardDescription>
              Upload a photo to enhance it with AI-powered editing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/photo-editor">
              <Button size="lg">
                Open Photo Editor
              </Button>
            </Link>
          </CardContent>
        </Card>

        {workspace.projects.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recent Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {workspace.projects.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50"
                  >
                    <div>
                      <p className="font-medium">{project.name}</p>
                      <p className="text-sm text-gray-600">
                        {project.description}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

// Client component for sign out button
function SignOutButton() {
  "use client";
  
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={async () => {
        await signOut();
        window.location.href = "/";
      }}
    >
      Sign Out
    </Button>
  );
}
