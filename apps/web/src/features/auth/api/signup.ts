import type {
  SignupBody,
  SignupResult,
} from "@/features/auth/contracts/auth.schemas";
import { apiFetch } from "@/lib/api/client";

export async function signup(body: SignupBody): Promise<SignupResult> {
  const { data } = await apiFetch<SignupResult>("/api/v1/auth/signup", {
    method: "POST",
    body: JSON.stringify(body),
  });
  return data;
}
