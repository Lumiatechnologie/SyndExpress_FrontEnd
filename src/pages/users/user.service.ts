import axios from '@/auth/api/axios';

export type SortDir = 'ASC' | 'DESC';

export interface UserQuery {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: SortDir;
  username?: string;
  email?: string;
  matricule?: string;
  startActivity?: string; // ex: "2024-11"
}

export async function fetchUsers(params: UserQuery = {}) {
  const {
    page = 0,
    size = 10,
    sortBy = 'username',
    sortDir = 'ASC',
    username,
    email,
    matricule,
    startActivity,
  } = params;

  const res = await axios.get('/api/auth/users', {
    params: { page, size, sortBy, sortDir, username, email, matricule, startActivity },
  });

  // Structure renvoyée par ton backend (Page Spring)
  // { content: [], pageable: {...}, totalElements, totalPages, number, size, ... }
  return res.data;
}
