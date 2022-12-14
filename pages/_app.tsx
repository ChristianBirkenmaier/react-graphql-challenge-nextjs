import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "@styles/theme";
import { CredentialsProvider } from "@provider/credentials/index";
import { Header } from "@components/header";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <SessionProvider session={pageProps.session}>
        <Header />
        <CredentialsProvider>
          <Component {...pageProps} />
        </CredentialsProvider>
      </SessionProvider>
    </ChakraProvider>
  );
}

export default MyApp;
