import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    accessToken: string;
  }

  interface Session {
    user: User;
  }

  interface JWT {
    accessToken: string;
    role: string;
  }
}
