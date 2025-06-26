import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Login failed");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Login exitoso",
        description: "Redirigiendo al dashboard...",
      });
      // Redirect to superadmin dashboard
      window.location.href = "/dashboard/superadmin";
    },
    onError: (error: Error) => {
      toast({
        title: "Error de login",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    const credentials = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    // For demo purposes, accept admin@notarypro.cl / Admin123
    if (credentials.email === "admin@notarypro.cl" && credentials.password === "Admin123") {
      loginMutation.mutate(credentials);
    } else {
      toast({
        title: "Credenciales incorrectas",
        description: "Use: admin@notarypro.cl / Admin123",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-chile-blue to-blue-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-chile-red rounded-full flex items-center justify-center mb-4">
            <Shield className="text-white" size={24} />
          </div>
          <CardTitle className="text-2xl font-bold">NotaryPro Admin</CardTitle>
          <p className="text-gray-600">Acceso al panel de administración</p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@notarypro.cl"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Admin123"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>
              </div>
            </div>

            <div className="p-3 bg-blue-50 rounded-lg text-sm">
              <p className="font-medium text-blue-800">Credenciales de prueba:</p>
              <p className="text-blue-600">Email: admin@notarypro.cl</p>
              <p className="text-blue-600">Contraseña: Admin123</p>
            </div>

            <Button
              type="submit"
              className="w-full btn-chile"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}