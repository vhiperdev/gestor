import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { NextUIProvider } from "@nextui-org/react";
import { Layout } from "../components/layout/layout";
import { ChakraProvider } from '@chakra-ui/react'
import { UserProvider } from "@auth0/nextjs-auth0/client";



function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <NextThemesProvider defaultTheme="light" attribute="class">
        <NextUIProvider>
          <ChakraProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </ChakraProvider>
        </NextUIProvider>
      </NextThemesProvider>
    </UserProvider>
  );
}

export default MyApp;
