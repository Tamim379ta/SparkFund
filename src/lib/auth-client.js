import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  fetchOptions: {
    credentials: "include",
    onRequest: (ctx) => {
      const token = localStorage.getItem("sparkfund_token");
      if (token) {
        ctx.headers.set("Authorization", `Bearer ${token}`);
      }
    },
    onResponse: async (ctx) => {
      const token = ctx.response.headers.get("set-auth-token");
      if (token) {
        localStorage.setItem("sparkfund_token", token);
      }
    },
  },
});