import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <header></header>
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
