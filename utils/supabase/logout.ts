import { createClientClient } from "./client";

/**
 * Cette fonction **front** deconnecte le client et log un message d'erreur en cas d'echec
 */
export async function logout() {
  const supabase = createClientClient();

  const { error } = await supabase.auth.signOut();
  if (error) console.error("Erreur lors de la déconnexion:", error);
}
