const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "")

async function request(path, options = {}) {
  if (!API_BASE_URL) {
    throw new Error("后端 API 未配置，请设置 VITE_API_BASE_URL")
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  })

  if (response.status === 204) return null

  const text = await response.text()
  const data = text ? JSON.parse(text) : null

  if (!response.ok) {
    throw new Error(data?.message || `API request failed with status ${response.status}`)
  }

  return data
}

export function saveProduct(product) {
  return request("/products", {
    method: "POST",
    body: JSON.stringify(product),
  })
}

export function updateProduct(barcode, product) {
  return request(`/products/${encodeURIComponent(barcode)}`, {
    method: "PUT",
    body: JSON.stringify(product),
  })
}

export function getProduct(barcode) {
  return request(`/products/${encodeURIComponent(barcode)}`)
}

export function listProducts(limit = 20) {
  return request(`/products?limit=${encodeURIComponent(limit)}`)
}

export function deleteProduct(barcode) {
  return request(`/products/${encodeURIComponent(barcode)}`, {
    method: "DELETE",
  })
}

export function isApiBaseUrlConfigured() {
  return Boolean(API_BASE_URL)
}

export {API_BASE_URL}
