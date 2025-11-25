// Define UUID type for consistent usage
export type UUID = string;

// Supported language codes for localization
export type LanguageCode = 'en' | 'de' | 'es' | 'fr' | 'ja' | 'zh';

/**
 * AuthModel
 * Représente les informations de session après authentification
 * (token JWT + rôles)
 */
export interface AuthModel {
  accessToken: string;       // ✅ token JWT
  roles?: string[];          // ✅ ex: ['ADMIN', 'USER', 'MODERATOR']
}

/**
 * UserModel
 * Représente le profil utilisateur récupéré depuis l’API ou stocké en mémoire
 */
export interface UserModel {
  username: string;
  email: string;
  password?: string;         // optionnel, utilisé seulement pour login/register

  roles?: string[];          // ✅ utilisé dans AuthProvider et RequireAuth

  // Informations facultatives pour profil étendu
  first_name?: string;
  last_name?: string;
  fullname?: string;
  email_verified?: boolean;
  occupation?: string;
  company_name?: string;
  phone?: string;
  pic?: string;
  language?: LanguageCode;

  // Indique si l’utilisateur a explicitement un rôle admin
  is_admin?: boolean;
}

/**
 * Exemple de modèle pour une ressource spécifique (ex: habitat)
 * (facultatif, utile pour typer ton API HabitableUnit)
 */
export interface HabitableUnitDTO {
  id?: number;
  registrationNumber: string;
  address?: string | null;
  matrisynd?: string | null;
  startActivity: string;     // format "YYYY-MM" côté backend
  totalCotisation?: number;
  totalPrestation?: number;
  fixedAmount: number;
}
