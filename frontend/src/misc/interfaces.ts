export interface productDetailsInterface {
  amount: number;
  bottling_date: string;
  description: string;
  expiry_date: string;
  name: string;
  picture: string | null;
  price: string;
  storage_location_name: string;
  storage_location_uuid: string;
  uuid: string;
}

export type ProductFormValues = {
  amount: number;
  bottling_date: string;
  description: string;
  expiry_date: string;
  name: string;
  price: string;
  storage_location_uuid: string;
};

export interface Storage {
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  uuid: string;
}

export interface NewStorage {
  name: string;
  description: string | null;
}

export interface AlertInterface {
  isAlert: boolean;
  type: "success" | "warning" | "danger" | "neutral" | "primary";
  header: string;
  text: string;
}

export interface SettingsIntf {
  ["app-name"]: string;
  currency: string;
}
