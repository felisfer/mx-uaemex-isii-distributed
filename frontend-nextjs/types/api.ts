export type ApiError = {
  message: string;
  errors?: Array<{ field: string; defaultMessage: string }>;
};

export type LoginRequest = {
  correo: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  type: string;
  expiresInMs: number;
};

export type RegisterRequest = {
  rfc: string;
  nombre: string;
  apellidos: string;
  correo: string;
  esAdministrador?: boolean;
  password?: string | null;
  confirmPassword?: string | null;
};

export type Empleado = {
  rfc: string;
  nombre: string;
  apellidos: string;
  correo: string;
  esAdministrador: boolean;
};

export type Nomina = {
  id: number;
  salario: number;
  excedente: number;
  cuotaFija: number;
  porcentaje: number;
  fechaInicio?: string;
  fechaFin?: string;
  periodoInicio?: string;
  periodoFin?: string;
};
