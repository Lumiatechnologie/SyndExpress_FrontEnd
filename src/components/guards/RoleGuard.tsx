// src/components/guards/RoleGuard.tsx
import React from "react";
import { Navigate } from "react-router-dom";

type Props = {
  roles: string[];              // ex: ["ROLE_MODERATOR"]
  children: React.ReactNode;
  fallbackPath?: string;        // ex: "/"
};

export function hasAnyRole(targetRoles: string[], userRoles?: string[] | string): boolean {
  if (!userRoles) return false;
  const list = Array.isArray(userRoles) ? userRoles : [userRoles];
  return targetRoles.some(r => list.includes(r));
}

const RoleGuard: React.FC<Props> = ({ roles, children, fallbackPath = "/" }) => {
  const raw = localStorage.getItem("auth");
  const auth = raw ? JSON.parse(raw) : null;

  if (!auth?.accessToken) {
    return <Navigate to="/auth/signin" replace />;
  }

 if (!hasAnyRole(roles, auth?.roles)) {
  return <Navigate to={fallbackPath} replace />;
}


  return <>{children}</>;
};

export default RoleGuard;
