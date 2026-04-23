export interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
  isActive: boolean;
}

export interface LandingSection {
  id: number;
  title: string;
  order: number;
  isActive: boolean;
  products: Product[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateLandingSectionDto {
  title: string;
  order: number;
  isActive?: boolean;
  productIds?: number[];
}

export interface UpdateLandingSectionDto {
  title?: string;
  order?: number;
  isActive?: boolean;
  productIds?: number[];
}
