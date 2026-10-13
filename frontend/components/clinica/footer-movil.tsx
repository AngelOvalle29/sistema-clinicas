'use client'

import { Link } from "@/components/navigation";
import { Icon } from "@/components/ui/icon";
import { useAlertasPendientes } from "@/hooks/use-alertas-pendientes";

const FooterMovil = ({ inicial }: { inicial: string }) => {
  const pendientes = useAlertasPendientes();

  return (
    <div className="flex md:hidden justify-around items-center">
      <Link href="/clinica/citas" className="text-default-600">
        <div>
          <span className="relative cursor-pointer rounded-full text-[20px] flex flex-col items-center justify-center mb-1">
            <Icon icon="heroicons-outline:calendar" />
          </span>
          <span className="block text-xs text-default-600">Citas</span>
        </div>
      </Link>
      <Link
        href="/clinica/dashboard"
        className="relative bg-card bg-no-repeat backdrop-filter backdrop-blur-[40px] rounded-full footer-bg dark:bg-default-300 h-[65px] w-[65px] z-[-1] -mt-[40px] flex justify-center items-center"
      >
        <div className="h-[50px] w-[50px] rounded-full border-2 custom-dropshadow flex items-center justify-center bg-primary text-primary-foreground text-xl font-semibold uppercase">
          {inicial}
        </div>
      </Link>
      <Link href="/clinica/alertas" className="text-default-600">
        <div>
          <span className="relative cursor-pointer rounded-full text-[20px] flex flex-col items-center justify-center mb-1">
            <Icon icon="heroicons-outline:bell" />
            {pendientes > 0 && (
              <span className="absolute right-[5px] lg:top-0 -top-2 h-4 w-4 bg-red-500 text-[8px] font-semibold flex flex-col items-center justify-center rounded-full text-white z-[99]">
                {pendientes > 99 ? "99+" : pendientes}
              </span>
            )}
          </span>
          <span className="block text-xs text-default-600">Alertas</span>
        </div>
      </Link>
    </div>
  );
};

export default FooterMovil;
