import SignIn from "@/components/auth/sign-in";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="space-y-4">
      <SignIn />
      <p className="text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <Link href="/sign-up" className="font-medium text-blue-600 hover:text-blue-500">
          Sign up
        </Link>
      </p>
    </div>
  );
}