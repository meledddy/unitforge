export interface SignInActionState {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
}

export const initialSignInActionState: SignInActionState = {
  status: "idle",
};
