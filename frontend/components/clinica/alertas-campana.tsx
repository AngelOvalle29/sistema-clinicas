'use client'

import { Link } from "@/components/navigation";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { useAlertasPendientes } from "@/hooks/use-alertas-pendientes";

const AlertasCampana = () => {
  const pendientes = useAlertasPendientes();

  return (
    <Link
      href="/clinica/alertas"
      title="Alertas pendientes"
      className="relative hidden md:h-8 md:w-8 md:bg-secondary text-secondary-foreground rounded-full md:flex flex-col items-center justify-center"
    >
      <Icon icon="heroicons-outline:bell" className="h-5 w-5" />
      {pendientes > 0 && (
        <Badge
          className="w-4 h-4 p-0 text-[8px] rounded-full font-semibold items-center justify-center absolute left-[calc(100%-12px)] bottom-[calc(100%-10px)]"
          color="destructive"
        >
          {pendientes > 99 ? "99+" : pendientes}
        </Badge>
      )}
    </Link>
  );
};

export default AlertasCampana;
