export interface Usuario {
  email: string;
  name: string;
  password: string;
}
export interface Reseña {
  id: number;
  name: string;
  comment: string;
  isPositive: boolean;
  date: string;
  route: string;
}

 export interface Props {
  name: string;
  comment: string;
  isPositive: boolean;
  date?: string;
  route?: string;
}