import { Toaster } from "react-hot-toast";
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Toaster position="top-center" />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
