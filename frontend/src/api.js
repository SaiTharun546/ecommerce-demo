export async function fetchProducts() {
  try {
    const res = await fetch('/products');
    if (!res.ok) {
      console.error('Failed fetching products', res.status);
      return [];
    }
    return await res.json();
  } catch (err) {
    console.error('Error fetching products', err);
    return [];
  }
}