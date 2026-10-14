import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icon } from "@/components/ui/icon";
import { signOut, auth } from "@/lib/auth";

const NOMBRE_ROL: Record<string, string> = {
  ADMIN: "Administrador",
  MEDICO: "Médico",
  RECEPCION: "Recepción",
  FARMACIA: "Farmacia",
};

const ProfileInfo = async () => {
  const session = await auth();
  const nombre = session?.user?.name ?? "Usuario";
  const email = session?.user?.email ?? "";
  const rol = session?.user?.rol ? NOMBRE_ROL[session.user.rol] ?? session.user.rol : "";
  const inicial = (nombre || email || "?").charAt(0).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <button type="button" className="flex items-center gap-3 text-default-800">
          <span className="h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
            {inicial}
          </span>
          <span className="text-sm font-medium lg:block hidden">{nombre}</span>
          <span className="text-base me-2.5 lg:inline-block hidden">
            <Icon icon="heroicons-outline:chevron-down" />
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60 p-0" align="end">
        <DropdownMenuLabel className="flex gap-3 items-center p-3">
          <span className="h-9 w-9 shrink-0 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
            {inicial}
          </span>
          <div className="min-w-0">
            <div className="text-sm font-medium text-default-800 truncate">{nombre}</div>
            <div className="text-xs text-default-600 truncate">{email}</div>
            {rol && <div className="text-xs text-primary font-medium">{rol}</div>}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="mb-0 dark:bg-background" />
        <DropdownMenuItem className="p-0 my-1">
          <form
            className="w-full"
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button
              type="submit"
              className="w-full flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-destructive"
            >
              <Icon icon="heroicons:power" className="w-4 h-4" />
              Cerrar sesión
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileInfo;
