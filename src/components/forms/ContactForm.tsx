"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { contactSchema, flattenErrors, type FieldErrors } from "@/lib/contact/schema";
import { topics, isTopic, type TopicValue } from "@/lib/contact/topics";
import { Button } from "@/components/ui/Button";

type Status = "idle" | "sending" | "success" | "error";

type ApiResult =
  | { ok: true; mode: "send" | "dry-run"; stored: boolean }
  | { ok: false; code: string; message: string; fieldErrors?: FieldErrors };

const inputBase =
  "w-full border-0 border-b bg-transparent px-0 py-3 text-base text-inherit placeholder:text-muted/60 focus:border-rose-deep focus:outline-none focus:ring-0 transition-colors";

export function ContactForm({ defaultTopic, tone = "light" }: { defaultTopic?: string; tone?: "light" | "dark" }) {
  const uid = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [globalError, setGlobalError] = useState("");
  const [previewOnly, setPreviewOnly] = useState(false);
  const [topic, setTopic] = useState<TopicValue>(isTopic(defaultTopic) ? defaultTopic : "erstgespraech");
  const tokenRef = useRef("");
  const successRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const showSalon = topics.find((t) => t.value === topic)?.salon ?? false;
  const dark = tone === "dark";
  const line = dark ? "border-bone/35 placeholder:text-bone/45" : "border-ink/30";

  const loadToken = useCallback(async () => {
    try {
      const res = await fetch("/api/contact/token", { cache: "no-store" });
      const json = (await res.json()) as { token?: string };
      if (json.token) tokenRef.current = json.token;
    } catch {
      /* wird beim Absenden erneut versucht */
    }
  }, []);

  useEffect(() => {
    void loadToken();
  }, [loadToken]);

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (!tokenRef.current) await loadToken();

    const payload = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      salon: showSalon ? String(fd.get("salon") ?? "") : "",
      topic,
      message: String(fd.get("message") ?? ""),
      consent: fd.get("consent") === "on",
      website: String(fd.get("website") ?? ""),
      token: tokenRef.current,
    };

    // Sofort-Feedback im Browser (maßgeblich bleibt die Prüfung auf dem Server)
    const local = contactSchema.safeParse(payload);
    if (!local.success) {
      const fe = flattenErrors(local.error);
      delete fe.token;
      setErrors(fe);
      setGlobalError(fe.token ? "Sicherheitsprüfung fehlgeschlagen. Bitte lade die Seite neu." : "");
      setStatus("error");
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>("[aria-invalid='true']")?.focus());
      return;
    }

    setErrors({});
    setGlobalError("");
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as ApiResult;
      if (json.ok) {
        // Hinweis nur, wenn die Anfrage weder gespeichert noch per Mail versendet wurde (reine Vorschau)
        setPreviewOnly(json.mode === "dry-run" && !json.stored);
        setStatus("success");
        return;
      }
      setErrors(json.fieldErrors ?? {});
      setGlobalError(json.message);
      setStatus("error");
      if (json.code === "token" || json.code === "too-fast") void loadToken();
    } catch {
      setGlobalError("Keine Verbindung. Bitte prüfe deine Internetverbindung und versuche es erneut – oder ruf mich direkt an.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div ref={successRef} tabIndex={-1} role="status" className="border-y hairline py-12 outline-none">
        <p className="eyebrow mb-4">Nachricht angekommen</p>
        <h3 className="display-m mb-4">Danke dir – ich melde mich bei dir.</h3>
        <p className="max-w-lg text-muted">
          Deine Anfrage ist bei mir eingegangen. Ich antworte dir persönlich per E-Mail oder Telefon – meist innerhalb weniger Werktage.
        </p>
        {previewOnly && (
          <p className="mt-6 max-w-lg rounded-sm border border-rose-deep/40 bg-blush/60 p-4 text-sm text-ink">
            Vorschau-Modus: Es wurde <strong>keine E-Mail versendet</strong>, weil der Mailversand noch nicht freigegeben ist.
          </p>
        )}
      </div>
    );
  }

  const field = (name: keyof FieldErrors) => ({
    "aria-invalid": errors[name] ? (true as const) : undefined,
    "aria-describedby": errors[name] ? `${uid}-${name}-err` : undefined,
  });
  const err = (name: keyof FieldErrors) =>
    errors[name] ? (
      <p id={`${uid}-${name}-err`} className={`mt-2 text-sm ${dark ? "text-rose" : "text-[#9b2c1f]"}`}>
        {errors[name]}
      </p>
    ) : null;
  const label = "block text-[0.72rem] font-medium uppercase tracking-[0.22em]";

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="grid gap-x-10 gap-y-8 md:grid-cols-2" aria-label="Kontaktformular">
      <div>
        <label htmlFor={`${uid}-name`} className={label}>
          Vor- &amp; Nachname *
        </label>
        <input id={`${uid}-name`} name="name" type="text" autoComplete="name" required maxLength={100} className={`${inputBase} ${line}`} {...field("name")} />
        {err("name")}
      </div>

      <div>
        <label htmlFor={`${uid}-email`} className={label}>
          E-Mail-Adresse *
        </label>
        <input id={`${uid}-email`} name="email" type="email" autoComplete="email" required maxLength={200} className={`${inputBase} ${line}`} {...field("email")} />
        {err("email")}
      </div>

      <div>
        <label htmlFor={`${uid}-phone`} className={label}>
          Telefonnummer <span className="normal-case tracking-normal opacity-70">(optional)</span>
        </label>
        <input id={`${uid}-phone`} name="phone" type="tel" autoComplete="tel" maxLength={40} className={`${inputBase} ${line}`} {...field("phone")} />
        {err("phone")}
      </div>

      <div>
        <label htmlFor={`${uid}-topic`} className={label}>
          Worum geht’s? *
        </label>
        <select
          id={`${uid}-topic`}
          name="topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value as TopicValue)}
          className={`${inputBase} ${line} cursor-pointer ${dark ? "[&>option]:text-ink" : ""}`}
          {...field("topic")}
        >
          {topics.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        {err("topic")}
      </div>

      {showSalon && (
        <div className="md:col-span-2">
          <label htmlFor={`${uid}-salon`} className={label}>
            Salonname <span className="normal-case tracking-normal opacity-70">(optional)</span>
          </label>
          <input id={`${uid}-salon`} name="salon" type="text" autoComplete="organization" maxLength={120} className={`${inputBase} ${line}`} {...field("salon")} />
          {err("salon")}
        </div>
      )}

      <div className="md:col-span-2">
        <label htmlFor={`${uid}-message`} className={label}>
          Nachricht *
        </label>
        <textarea id={`${uid}-message`} name="message" rows={5} required maxLength={4000} className={`${inputBase} ${line} resize-y`} {...field("message")} />
        {err("message")}
      </div>

      {/* Honeypot: für Menschen unsichtbar und nicht per Tab erreichbar */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="md:col-span-2">
        <div className="flex items-start gap-4">
          <input
            id={`${uid}-consent`}
            name="consent"
            type="checkbox"
            className="mt-1.5 h-5 w-5 shrink-0 cursor-pointer accent-[#8a5a48]"
            {...field("consent")}
          />
          <label htmlFor={`${uid}-consent`} className="cursor-pointer text-[0.95rem] leading-relaxed">
            Ich habe die{" "}
            <Link href="/datenschutz" className="link-line" target="_blank">
              Datenschutzhinweise
            </Link>{" "}
            gelesen und bin damit einverstanden, dass meine Angaben zur Bearbeitung meiner Anfrage verarbeitet werden. *
          </label>
        </div>
        {err("consent")}
      </div>

      <div className="flex flex-col gap-4 md:col-span-2 md:flex-row md:items-center md:justify-between">
        <Button type="submit" variant={dark ? "light" : "primary"} disabled={status === "sending"}>
          {status === "sending" ? "Wird gesendet …" : "Anfrage senden"}
        </Button>
        <p className={`text-sm ${dark ? "text-bone/65" : "text-muted"}`}>* Pflichtfelder · Keine Cookies, kein Tracking.</p>
      </div>

      <div aria-live="assertive" className="md:col-span-2">
        {globalError && (
          <p role="alert" className={`border-l-2 py-1 pl-4 ${dark ? "border-rose text-bone" : "border-[#9b2c1f] text-[#9b2c1f]"}`}>
            {globalError}
          </p>
        )}
      </div>
    </form>
  );
}
