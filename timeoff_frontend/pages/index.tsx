import Link from "next/link";

export default function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-3xl font-bold text-red-600">Access Denied</h1>
      <p className="text-lg mt-2">You do not have permission to view this page.</p>
      <Link href="/auth/login" className="mt-4 text-blue-500 underline">Go to login</Link>
    </div>
  );
}