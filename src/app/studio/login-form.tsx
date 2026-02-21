"use client";

import { useActionState } from "react";
import { loginStudioAction } from "@/app/studio/actions";

const initialState = {
  error: ""
};

export function StudioLoginForm() {
  const [state, formAction, isPending] = useActionState(loginStudioAction, initialState);

  return (
    <div className="studio-login-card">
      <h1>Studio Access</h1>
      <p>Hidden dashboard. Password required every new browser session.</p>
      <form action={formAction} className="studio-login-form">
        <label>
          Password
          <input type="password" name="password" required />
        </label>
        {state?.error ? <p className="form-error">{state.error}</p> : null}
        <button type="submit" disabled={isPending}>
          {isPending ? "Checking..." : "Enter Studio"}
        </button>
      </form>
    </div>
  );
}
