import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "@styles/theme";
import { CredentialsProvider } from "@provider/credentials";
import { Header } from "@components/header";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <CredentialsProvider>
        <Header />
        <Component {...pageProps} />
      </CredentialsProvider>
    </ChakraProvider>
  );
}

export default MyApp;
