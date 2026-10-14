import DashCodeLogo from "@/components/dascode-logo";

const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <DashCodeLogo className="h-10 w-10" />
      <span className="text-2xl font-semibold text-default-900">XelaHealing</span>
    </div>
  );
};

export default Logo;
