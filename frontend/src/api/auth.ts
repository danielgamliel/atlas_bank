import { apiFetch } from "./client";

export type LoginResponse = {
  success: boolean;
  data: { token: string; user?: any };
};

export type SignupResponse = {
  success: boolean;
  data: { id: string; email: string };
};

export function login(email: string, password: string) {
  return apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function signup(email: string, password: string) {
  return apiFetch<SignupResponse>("/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}
