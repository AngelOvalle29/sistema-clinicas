export type SubChildren = {
  href: string;
  label: string;
  active: boolean;
  children?: SubChildren[];
};
export type Submenu = {
  href: string;
  label: string;
  active: boolean;
  icon: any;
  submenus?: Submenu[];
  children?: SubChildren[];
};

export type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: any;
  submenus: Submenu[];
  id: string;
};

export type Group = {
  groupLabel: string;
  menus: Menu[];
  id: string;
};

// El layout horizontal reutiliza el mismo árbol de navegación que el sidebar vertical.
export function getHorizontalMenuList(pathname: string, t: any): Group[] {
  return getMenuList(pathname, t);
}

export function getMenuList(pathname: string, t: any): Group[] {
  return [
    {
      groupLabel: "",
      id: "dashboard",
      menus: [
        {
          id: "dashboard",
          href: "/clinica/dashboard",
          label: "Dashboard",
          active: pathname.includes("/clinica/dashboard"),
          icon: "heroicons-outline:home",
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Clínica",
      id: "clinica",
      menus: [
        {
          id: "pacientes",
          href: "/clinica/pacientes",
          label: "Pacientes",
          active: pathname.includes("/clinica/pacientes"),
          icon: "heroicons-outline:user-group",
          submenus: [],
        },
        {
          id: "citas",
          href: "/clinica/citas",
          label: "Citas",
          active: pathname.includes("/clinica/citas"),
          icon: "heroicons-outline:calendar",
          submenus: [],
        },
        {
          id: "recetas",
          href: "/clinica/recetas",
          label: "Recetas",
          active: pathname.includes("/clinica/recetas"),
          icon: "heroicons-outline:clipboard-document-list",
          submenus: [],
        },
        {
          id: "farmacia",
          href: "/clinica/farmacia",
          label: "Farmacia",
          active: pathname.includes("/clinica/farmacia"),
          icon: "heroicons-outline:beaker",
          submenus: [],
        },
        {
          id: "alertas",
          href: "/clinica/alertas",
          label: "Alertas",
          active: pathname.includes("/clinica/alertas"),
          icon: "heroicons-outline:bell-alert",
          submenus: [],
        },
      ],
    },
  ];
}
