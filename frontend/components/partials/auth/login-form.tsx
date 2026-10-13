"use client";
import React from 'react'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icon } from "@/components/ui/icon";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from "zod";
import { cn } from "@/lib/utils"
import { Loader2 } from 'lucide-react';
import { loginUser } from '@/action/auth-action';
import { toast } from "sonner"
import { useRouter } from '@/components/navigation';

const schema = z.object({
  email: z.string().email({ message: "Correo inválido." }),
  password: z.string().min(1, { message: "La contraseña es obligatoria." }),
});

const LoginForm = () => {
  const [isPending, startTransition] = React.useTransition();
  const router = useRouter();
  const [passwordType, setPasswordType] = React.useState("password");

  const togglePasswordType = () => {
    setPasswordType((current) => (current === "password" ? "text" : "password"));
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "all",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    startTransition(async () => {
      try {
        const response = await loginUser(data);
        if (response?.error) {
          toast.error("Correo o contraseña incorrectos");
        } else {
          toast.success("Sesión iniciada correctamente");
          router.push('/clinica/dashboard');
        }
      } catch (err: any) {
        toast.error(err?.message ?? "No se pudo iniciar sesión");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-5 2xl:mt-7 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className=" font-medium text-default-600">
          Correo electrónico
        </Label>
        <Input size="lg"
          disabled={isPending}
          {...register("email")}
          type="email"
          id="email"
          className={cn("", {
            "border-destructive ": errors.email,
          })}
        />
      </div>
      {errors.email && (
        <div className=" text-destructive mt-2 text-sm">
          {errors.email.message}
        </div>
      )}

      <div className="mt-3.5 space-y-2">
        <Label htmlFor="password" className="mb-2 font-medium text-default-600">
          Contraseña
        </Label>
        <div className="relative">
          <Input size="lg"
            disabled={isPending}
            {...register("password")}
            type={passwordType}
            id="password"
            className="peer  "
            placeholder=" "
          />

          <div
            className="absolute top-1/2 -translate-y-1/2 ltr:right-4 rtl:left-4 cursor-pointer"
            onClick={togglePasswordType}
          >
            {passwordType === "password" ? (
              <Icon icon="heroicons:eye" className="w-5 h-5 text-default-400" />
            ) : (
              <Icon
                icon="heroicons:eye-slash"
                className="w-5 h-5 text-default-400"
              />
            )}
          </div>
        </div>
      </div>
      {errors.password && (
        <div className=" text-destructive mt-2 text-sm">
          {errors.password.message}
        </div>
      )}

      <Button fullWidth disabled={isPending}>
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isPending ? "Ingresando..." : "Ingresar"}
      </Button>
    </form>
  );
};
export default LoginForm;
