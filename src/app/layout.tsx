import "./globals.css";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <header>
          <SignedOut>
            <SignInButton></SignInButton>
            <SignUpButton></SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton></UserButton>
          </SignedIn>
        </header>
        <body className={`antialiased`}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
