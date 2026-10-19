"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { loginAdmin, logoutAdmin, requireAdmin } from "@/lib/admin/auth";
import { deleteInquiry, updateInquiry, updateOrder } from "@/lib/db/repo";

export type LoginState = { error?: string };

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const res = await loginAdmin(String(formData.get("password") ?? ""));
  if (!res.ok) return { error: res.message };
  redirect("/admin");
}

export async function logoutAction() {
  await logoutAdmin();
  redirect("/admin/login");
}

const idOf = (formData: FormData) => {
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id) || id < 1) throw new Error("Ungültige ID");
  return id;
};

export async function saveInquiryAction(formData: FormData) {
  await requireAdmin();
  const id = idOf(formData);
  await updateInquiry(id, { status: String(formData.get("status") ?? ""), notes: String(formData.get("notes") ?? "") });
  revalidatePath("/admin", "layout");
  redirect(`/admin/anfragen/${id}?gespeichert=1`);
}

export async function deleteInquiryAction(formData: FormData) {
  await requireAdmin();
  const id = idOf(formData);
  if (formData.get("confirm") === "ja") await deleteInquiry(id);
  else redirect(`/admin/anfragen/${id}?fehler=bestaetigung`);
  revalidatePath("/admin", "layout");
  redirect("/admin/anfragen?geloescht=1");
}

export async function saveOrderAction(formData: FormData) {
  await requireAdmin();
  const id = idOf(formData);
  await updateOrder(id, { status: String(formData.get("status") ?? ""), notes: String(formData.get("notes") ?? "") });
  revalidatePath("/admin", "layout");
  redirect(`/admin/bestellungen/${id}?gespeichert=1`);
}
