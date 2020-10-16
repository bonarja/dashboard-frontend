export interface DataDashboard {
  id?: string;
  color: string;
  nombre: string;
  codigo: string;
  url: string;
  permisos?: Array<string>;
  requiere?: Array<string>;
}
