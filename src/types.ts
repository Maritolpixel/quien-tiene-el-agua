export type AnexosPunto = {
  USO: string;
  LON: number;
  LAT: number;
  VOL: number;
  FECHA: string;
  TITULO: string;
  TITULAR: string;
};

export type Visibility = {
  sub: boolean;
  sup: boolean;
  des: boolean;
  fed: boolean;
};

export type Fechas = {
  fecha_inicio: Date;
  fecha_final: Date;
};
