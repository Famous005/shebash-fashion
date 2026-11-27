export type ProductType = "ready_to_wear" | "tailoring_material";

export interface Product {
  id: number;
  sku: string;
  product_type: ProductType;
  category: string;
  name: string;
  slug: string;
  unit_label: string;
  retail_price_ngn: string;
  wholesale_price_ngn: string | null;
  wholesale_min_qty: number | null;
  has_wholesale: boolean;
  weight_grams: number;
  variant_count: number;
  in_stock_count: number;
  is_active: boolean;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}