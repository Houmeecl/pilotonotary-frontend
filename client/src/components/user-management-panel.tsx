import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  UserPlus, Eye, EyeOff, Users, Shield, CheckCircle, 
  Building, Handshake, GraduationCap, FileText, Edit, Trash2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

interface CreateUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  rut?: string;
  phone?: string;
}

const USER_ROLES = [
  { value: "superadmin", label: "Superadmin", icon: Shield, color: "red" },
  { value: "certificador", label: "Certificador", icon: CheckCircle, color: "blue" },
  { value: "vecino", label: "Vecino", icon: Building, color: "green" },
  { value: "usuario_final", label: "Usuario Final", icon: Users, color: "purple" },
  { value: "socios", label: "Socios", icon: Handshake, color: "indigo" },
  { value: "rrhh", label: "RRHH", icon: GraduationCap, color: "orange" }
];

interface UserManagementPanelProps {
  users?: User[];
  isLoading?: boolean;
}

export default function UserManagementPanel({ users = [], isLoading = false }: UserManagementPanelProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createUserMutation = useMutation({
    mutationFn: async (userData: CreateUserData) => {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error al crear usuario");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      setShowCreateForm(false);
      toast({
        title: "Usuario creado",
        description: "El usuario se ha creado exitosamente",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const toggleUserStatusMutation = useMutation({
    mutationFn: async ({ userId, isActive }: { userId: string; isActive: boolean }) => {
      const response = await fetch(`/api/admin/users/${userId}/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive }),
      });
      if (!response.ok) throw new Error("Error al cambiar estado del usuario");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
    },
  });

  const getRoleIcon = (role: string) => {
    const roleData = USER_ROLES.find(r => r.value === role);
    const Icon = roleData?.icon || Users;
    return <Icon size={16} />;
  };

  const getRoleColor = (role: string) => {
    const roleData = USER_ROLES.find(r => r.value === role);
    return roleData?.color || "gray";
  };

  const handleCreateUser = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    const userData: CreateUserData = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      role: selectedRole,
      rut: formData.get("rut") as string || undefined,
      phone: formData.get("phone") as string || undefined,
    };

    createUserMutation.mutate(userData);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center space-x-2">
            <Users className="text-purple-600" />
            <span>Gestión de Usuarios</span>
          </CardTitle>
          <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
            <DialogTrigger asChild>
              <Button className="btn-chile">
                <UserPlus className="mr-2" size={16} />
                Crear Usuario
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Crear Nuevo Usuario</DialogTitle>
              </DialogHeader>

              <form onSubmit={handleCreateUser} className="space-y-6">
                {/* Role Selection */}
                <div className="space-y-2">
                  <Label>Rol del Usuario</Label>
                  <Select value={selectedRole} onValueChange={setSelectedRole} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar rol" />
                    </SelectTrigger>
                    <SelectContent>
                      {USER_ROLES.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          <div className="flex items-center space-x-2">
                            <role.icon size={16} />
                            <span>{role.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Personal Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Nombre</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder="Juan"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Apellido</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder="Pérez"
                      required
                    />
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="juan@ejemplo.com"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="rut">RUT (opcional)</Label>
                      <Input
                        id="rut"
                        name="rut"
                        type="text"
                        placeholder="12.345.678-9"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono (opcional)</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+56 9 1234 5678"
                      />
                    </div>
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Contraseña segura"
                      required
                      minLength={8}
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
                  <p className="text-xs text-gray-600">
                    La contraseña debe tener al menos 8 caracteres
                  </p>
                </div>

                {/* Role-specific information */}
                {selectedRole && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">Información del Rol</h4>
                    <div className="text-sm text-gray-600">
                      {selectedRole === "certificador" && (
                        <p>Los Certificadores pueden revisar y firmar documentos digitalmente.</p>
                      )}
                      {selectedRole === "vecino" && (
                        <p>Los Vecinos gestionan puntos de venta (POS) y reciben comisiones.</p>
                      )}
                      {selectedRole === "usuario_final" && (
                        <p>Los Usuarios Finales pueden crear y gestionar sus documentos.</p>
                      )}
                      {selectedRole === "superadmin" && (
                        <p>Los Superadmins tienen acceso completo al sistema.</p>
                      )}
                      {selectedRole === "socios" && (
                        <p>Los Socios gestionan alianzas estratégicas y proyectos.</p>
                      )}
                      {selectedRole === "rrhh" && (
                        <p>RRHH gestiona recursos humanos y capacitación.</p>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 btn-chile"
                    disabled={createUserMutation.isPending || !selectedRole}
                  >
                    {createUserMutation.isPending ? "Creando..." : "Crear Usuario"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-chile-red mx-auto"></div>
            <p className="mt-2 text-gray-600">Cargando usuarios...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-8">
            <Users className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600">No hay usuarios registrados</p>
            <Button 
              onClick={() => setShowCreateForm(true)}
              className="mt-4"
              variant="outline"
            >
              Crear primer usuario
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Users List */}
            <div className="space-y-3">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 bg-white rounded-lg border hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 bg-${getRoleColor(user.role)}-100 rounded-lg flex items-center justify-center`}>
                      {getRoleIcon(user.role)}
                    </div>
                    <div>
                      <h4 className="font-medium">{user.firstName} {user.lastName}</h4>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <p className="text-xs text-gray-500">
                        Creado: {new Date(user.createdAt).toLocaleDateString()}
                        {user.lastLogin && ` • Último acceso: ${new Date(user.lastLogin).toLocaleDateString()}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge 
                      className={`bg-${getRoleColor(user.role)}-100 text-${getRoleColor(user.role)}-700`}
                    >
                      {USER_ROLES.find(r => r.value === user.role)?.label || user.role}
                    </Badge>
                    <Badge variant={user.isActive ? "default" : "secondary"}>
                      {user.isActive ? "Activo" : "Inactivo"}
                    </Badge>
                    <div className="flex space-x-1">
                      <Button size="sm" variant="outline">
                        <Edit size={14} />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleUserStatusMutation.mutate({ 
                          userId: user.id, 
                          isActive: !user.isActive 
                        })}
                        disabled={toggleUserStatusMutation.isPending}
                      >
                        {user.isActive ? "Desactivar" : "Activar"}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-lg font-bold text-blue-800">{users.length}</p>
                <p className="text-xs text-blue-600">Total Usuarios</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-lg font-bold text-green-800">
                  {users.filter(u => u.isActive).length}
                </p>
                <p className="text-xs text-green-600">Activos</p>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <p className="text-lg font-bold text-purple-800">
                  {new Set(users.map(u => u.role)).size}
                </p>
                <p className="text-xs text-purple-600">Roles Diferentes</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}