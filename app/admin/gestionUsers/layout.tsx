import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gestión de Usuarios - Admin - TruckWave",
};

export default function GestionUsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
