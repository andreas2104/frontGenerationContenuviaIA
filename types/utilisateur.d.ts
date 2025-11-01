export interface Utilisateur {
  id: number;
  nom: string;
  prenom: string;
  photo: string;
  email: string;
  type_compte: "admin" | "user" | "free" | "premium";
  date_creation: string;
  actif: boolean;
}