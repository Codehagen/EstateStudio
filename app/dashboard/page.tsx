import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
        take: 10,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          _count: {
            select: {
              photos: true,
            },
          },
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Velkommen tilbake, {session.user.name || "Bruker"}!
            </h2>
            <p className="text-gray-600 mt-1">Arbeidsområde: {workspace.name}</p>
          </div>
          <Link href="/dashboard/editor">
            <Button size="lg">Rediger nytt bilde</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Totalt antall bilder</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">
                {workspace._count.photos}
              </p>
              <p className="text-sm text-gray-600 mt-1">På tvers av alle eiendommer</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Eiendommer</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">
                {workspace.projects.length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Aktive eiendommer</p>
            </CardContent>
          </Card>
        </div>


        {workspace.projects.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Nylige eiendommer</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Eiendomsadresse</TableHead>
                    <TableHead>Beskrivelse</TableHead>
                    <TableHead>Bilder</TableHead>
                    <TableHead>Opprettet</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workspace.projects.map((project) => (
                    <TableRow key={project.id} className="cursor-pointer hover:bg-gray-50">
                      <TableCell className="font-medium">
                        <Link 
                          href={`/dashboard/editor/${project.id}`}
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {project.name}
                        </Link>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {project.description}
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                          {project._count.photos} bilder
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-500">
                        {new Date(project.createdAt).toLocaleDateString('no-NO', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

