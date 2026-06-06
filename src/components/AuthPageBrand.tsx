import { SiteLogo } from "@/components/SiteLogo";

/**
 * Centered logo and title block for sign-in and sign-up pages.
 */
export function AuthPageBrand() {
  return (
    <div className="mb-6 flex flex-col items-center text-center">
      <SiteLogo size="auth" linkToHome />
      <h1 className="mt-4 text-2xl font-bold text-zinc-900">Sign in</h1>
      <p className="mt-2 max-w-sm text-sm text-zinc-600">
        Create an account to post listings and message other members. Only
        signed-in users can send contact messages.
      </p>
    </div>
  );
}
