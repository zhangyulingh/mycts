export const API_BASE_URL: string

export function saveProduct(product: Record<string, unknown>): Promise<unknown>

export function updateProduct(barcode: string, product: Record<string, unknown>): Promise<unknown>

export function getProduct(barcode: string): Promise<unknown>

export function listProducts(limit?: number): Promise<unknown>

export function deleteProduct(barcode: string): Promise<unknown>

export function isApiBaseUrlConfigured(): boolean
