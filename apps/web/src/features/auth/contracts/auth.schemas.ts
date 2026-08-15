import { z } from "zod";

export const signupBodySchema = z.object({
  email: z.string().trim().email("email must be a valid email"),
  password: z.string().min(8, "password must be at least 8 characters"),
  name: z.string().trim().min(1, "name is required"),
  organizationName: z.string().trim().min(1, "organizationName is required"),
});

export type SignupBody = z.infer<typeof signupBodySchema>;

export type SignupResult = {
  user: {
    id: string;
    email: string;
    name: string;
  };
  organization: {
    id: string;
    name: string;
  };
};

export const credentialsSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});
