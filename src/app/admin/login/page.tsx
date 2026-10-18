import { redirect } from "next/navigation";
import { adminConfigured, isAdmin } from "@/lib/admin/auth";
import { LoginForm } from "@/components/admin/LoginForm";
import { Card } from "@/components/admin/ui";

export const metadata = { title: "Anmelden" };
export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");
  return (
    <div className="mx-auto max-w-md pt-10">
      <h1 className="mb-8 font-display text-5xl font-light">Anmelden</h1>
      {adminConfigured() ? (
        <Card>
          <LoginForm />
        </Card>
      ) : (
        <Card title="Noch nicht eingerichtet">
          <p>
            Das Backend ist noch ohne Passwort. Mit <code className="rounded bg-ink/10 px-1.5">npm run admin:hash</code> einen Hash erzeugen und als <code className="rounded bg-ink/10 px-1.5">ADMIN_PASSWORD_HASH</code> in
            <code className="rounded bg-ink/10 px-1.5"> .env.local</code> bzw. der Hosting-Umgebung eintragen.
          </p>
        </Card>
      )}
    </div>
  );
}
