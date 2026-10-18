"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "@/app/admin/actions";
import { btnCls, inputCls } from "./ui";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(loginAction, {});
  return (
    <form action={action} className="space-y-5">
      <div>
        <label htmlFor="password" className="mb-2 block text-[0.72rem] font-medium uppercase tracking-[0.22em]">
          Passwort
        </label>
        <input id="password" name="password" type="password" autoComplete="current-password" required maxLength={200} className={inputCls} aria-invalid={state.error ? true : undefined} />
      </div>
      <button type="submit" disabled={pending} className={`${btnCls} disabled:opacity-60`}>
        {pending ? "Prüfe …" : "Anmelden"}
      </button>
      <div aria-live="assertive">
        {state.error && (
          <p role="alert" className="border-l-2 border-[#9b2c1f] py-1 pl-4 text-[#9b2c1f]">
            {state.error}
          </p>
        )}
      </div>
    </form>
  );
}
