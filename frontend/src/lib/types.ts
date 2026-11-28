export type ProductType = "ready_to_wear" | "tailoring_material";

export interface ProductVariant {
  id: number;
  variant_sku: string;
  size_label: string | null;
  color_name: string | null;
  color_hex: string | null;
  stock_quantity: number;
  price_override_ngn: string | null;
  effective_price_ngn: number;
  image_url: string | null;
  in_stock: boolean;
}

export interface Product {
  id: number;
  sku: string;
  product_type: ProductType;
  category: string;
  name: string;
  slug: string;
  description?: string;
  unit_label: string;
  retail_price_ngn: string;
  wholesale_price_ngn: string | null;
  wholesale_min_qty: number | null;
  has_wholesale: boolean;
  weight_grams: number;
  variant_count?: number;
  in_stock_count?: number;
  is_active: boolean;
  variants?: ProductVariant[];
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface AuthUser {
  id: number;
  full_name: string;
  email: string;
  phone_e164: string | null;
  role: "customer" | "tailor_staff" | "admin";
  preferred_currency: string;
  created_at: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface RegisterPayload {
  full_name: string;
  email: string;
  phone_e164?: string;
  password: string;
  password_confirm: string;
}

export interface LoginPayload {
  login_id: string;
  password: string;
}

export interface AuthResponse {
  message?: string;
  user: AuthUser;
  tokens?: AuthTokens;
  access?: string;
  refresh?: string;
}