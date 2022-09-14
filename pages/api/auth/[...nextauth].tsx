import { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";

const options = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
      authorization: { params: { scope: "repo" } },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken;
      return session;
    },
  },
};

const auth = (req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, options);

export default auth;
