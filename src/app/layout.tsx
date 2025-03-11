import { UserContextProvider } from "./context/user-context";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <UserContextProvider>{children}</UserContextProvider>
      </body>
    </html>
  );
}
