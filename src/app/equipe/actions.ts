"use server";

import { revalidatePath } from "next/cache";
import {
  addStudyItem,
  deleteStudyItem,
  addCalendarItem,
  deleteCalendarItem,
} from "@/lib/dashboard-repo";

function refresh() {
  revalidatePath("/equipe");
  revalidatePath("/");
}

export async function addStudyAction(formData: FormData): Promise<void> {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const url = String(formData.get("url") ?? "").trim();
  if (!title || !description || !url) return;

  await addStudyItem({
    kind: "Curado pelo time",
    title,
    description,
    url,
    source: "equipe",
  });
  refresh();
}

export async function deleteStudyAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await deleteStudyItem(id);
  refresh();
}

export async function addCalendarAction(formData: FormData): Promise<void> {
  const title = String(formData.get("title") ?? "").trim();
  const startDate = String(formData.get("startDate") ?? "").trim();
  const endDate = String(formData.get("endDate") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const impact = String(formData.get("impact") ?? "").trim();
  const isDeadline = formData.get("isDeadline") === "on";
  if (!title || !startDate) return;

  await addCalendarItem({
    title,
    startDate,
    endDate: endDate || null,
    location,
    impact,
    isDeadline,
    source: "equipe",
  });
  refresh();
}

export async function deleteCalendarAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await deleteCalendarItem(id);
  refresh();
}
