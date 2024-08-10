"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return { error: "Erreur de connexion : " + error.message };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(formData: FormData) {
  const supabase = createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const signup = await supabase.auth.signUp(data);

  if (signup.error) {
    return { error: "Erreur d'inscription : " + signup.error.message };
  }

  if (signup.data.user?.role === "") {
    return { error: "Compte déjà existant" };
  }
  return { data: "Inscription réussie" };
}
