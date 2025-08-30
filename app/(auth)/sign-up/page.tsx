import SignUp from "@/components/auth/sign-up";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="space-y-4">
      <SignUp />
      <p className="text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link href="/sign-in" className="font-medium text-blue-600 hover:text-blue-500">
          Sign in
        </Link>
      </p>
    </div>
  );
}