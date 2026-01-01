import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
      <SignUp
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        afterSignUpUrl="/choose-role"
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-zinc-900/90 border border-zinc-700 shadow-2xl backdrop-blur-sm",
            headerTitle: "text-white",
            headerSubtitle: "text-zinc-400",
            socialButtonsBlockButton:
              "bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700",
            socialButtonsBlockButtonText: "text-white",
            dividerLine: "bg-zinc-700",
            dividerText: "text-zinc-500",
            formFieldLabel: "text-zinc-300",
            formFieldInput:
              "bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-purple-500 focus:ring-purple-500",
            formButtonPrimary:
              "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white",
            footerActionLink: "text-purple-400 hover:text-purple-300",
            identityPreviewText: "text-white",
            identityPreviewEditButton: "text-purple-400 hover:text-purple-300",
          },
        }}
      />
    </div>
  );
}

