import React, { useEffect, useState } from 'react';
import { fetchProducts } from './api';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchProducts().then(data => {
      setProducts(data || []);
      setLoading(false);
    });
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!title || !price) return alert('Provide title and price');
    const payload = {
      name: title,
      price: parseFloat(price),
      description: description || '',
      stock: 10
    };
    const resp = await fetch('/products', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    });
    if (!resp.ok) {
      const errText = await resp.text();
      alert('Failed to add product: ' + (errText || resp.status));
      return;
    }
    const newProduct = await resp.json();
    setProducts(prev => [...prev, newProduct]);
    setTitle('');
    setPrice('');
    setDescription('');
  };

  return (
    <div className="container">
      <h1>Simple Ecommerce Demo</h1>
      <p>A minimal React + Express demo. Products are stored in a JSON file.</p>

      <section>
        <h2>Products</h2>
        {loading ? <p>Loading...</p> :
          products.length === 0 ? <p>No products</p> :
          <div className="grid">
            {products.map(p => (
              <div key={p.id} className="card">
                <h3>{p.name}</h3>
                <p className="desc">{p.description}</p>
                <p><strong>${Number(p.price).toFixed(2)}</strong></p>
                <p>Stock: {p.stock}</p>
              </div>
            ))}
          </div>
        }
      </section>

      <section style={{marginTop:20}}>
        <h2>Add product (admin)</h2>
        <form onSubmit={handleAdd} className="form">
          <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
          <input placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} type="number" step="0.01" />
          <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} rows={3} />
          <button type="submit">Add</button>
        </form>
      </section>
    </div>
  );
}

export default App;