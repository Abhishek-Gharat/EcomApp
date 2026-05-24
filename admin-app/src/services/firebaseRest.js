const API_KEY = import.meta.env.VITE_FIREBASE_API_KEY;
const PROJECT_ID = import.meta.env.VITE_FIREBASE_PROJECT_ID;

const BASE_AUTH_URL = 'https://identitytoolkit.googleapis.com/v1';
const BASE_FIRESTORE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

// Auth
export const loginWithEmail = async (email, password) => {
  const response = await fetch(`${BASE_AUTH_URL}/accounts:signInWithPassword?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      password,
      returnSecureToken: true
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Login failed');
  }

  const data = await response.json();
  localStorage.setItem('adminUser', JSON.stringify(data));
  return data;
};

// Categories
export const getCategories = async (idToken) => {
  const response = await fetch(`${BASE_FIRESTORE_URL}/categories`, {
    headers: { 'Authorization': `Bearer ${idToken}` }
  });
  
  if (!response.ok) throw new Error('Failed to fetch categories');
  
  const data = await response.json();
  return data.documents?.map(doc => parseFirestoreDocument(doc, doc.name)) || [];
};

export const createCategory = async (categoryData, idToken) => {
  const firestoreData = {
    fields: {
      name: { stringValue: categoryData.name },
      description: { stringValue: categoryData.description || '' },
      createdAt: { timestampValue: new Date().toISOString() }
    }
  };

  const response = await fetch(`${BASE_FIRESTORE_URL}/categories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
    body: JSON.stringify(firestoreData)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to create category');
  }

  const data = await response.json();
  return parseFirestoreDocument(data, data.name);
};

export const updateCategory = async (categoryId, categoryData, idToken) => {
  const firestoreData = {
    fields: {
      name: { stringValue: categoryData.name },
      description: { stringValue: categoryData.description || '' },
      updatedAt: { timestampValue: new Date().toISOString() }
    }
  };

  const response = await fetch(`${BASE_FIRESTORE_URL}/categories/${categoryId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
    body: JSON.stringify(firestoreData)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to update category');
  }

  const data = await response.json();
  return parseFirestoreDocument(data, data.name);
};

export const deleteCategory = async (categoryId, idToken) => {
  const response = await fetch(`${BASE_FIRESTORE_URL}/categories/${categoryId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${idToken}` }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to delete category');
  }

  return true;
};

// Products
export const getProducts = async (idToken) => {
  const response = await fetch(`${BASE_FIRESTORE_URL}/products`, {
    headers: { 'Authorization': `Bearer ${idToken}` }
  });
  
  if (!response.ok) throw new Error('Failed to fetch products');
  
  const data = await response.json();
  return data.documents?.map(doc => parseFirestoreDocument(doc, doc.name)) || [];
};

export const createProduct = async (productData, idToken) => {
  const firestoreData = {
    fields: {
      name: { stringValue: productData.name },
      description: { stringValue: productData.description || '' },
      price: { doubleValue: parseFloat(productData.price) },
      category: { stringValue: productData.category },
      image: { stringValue: productData.image || '' },
      stock: { integerValue: parseInt(productData.stock) || 0 },
      createdAt: { timestampValue: new Date().toISOString() }
    }
  };

  const response = await fetch(`${BASE_FIRESTORE_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
    body: JSON.stringify(firestoreData)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to create product');
  }

  const data = await response.json();
  return parseFirestoreDocument(data, data.name);
};

export const updateProduct = async (productId, productData, idToken) => {
  const firestoreData = {
    fields: {
      name: { stringValue: productData.name },
      description: { stringValue: productData.description || '' },
      price: { doubleValue: parseFloat(productData.price) },
      category: { stringValue: productData.category },
      image: { stringValue: productData.image || '' },
      stock: { integerValue: parseInt(productData.stock) || 0 },
      updatedAt: { timestampValue: new Date().toISOString() }
    }
  };

  const response = await fetch(`${BASE_FIRESTORE_URL}/products/${productId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
    body: JSON.stringify(firestoreData)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to update product');
  }

  const data = await response.json();
  return parseFirestoreDocument(data, data.name);
};

export const deleteProduct = async (productId, idToken) => {
  const response = await fetch(`${BASE_FIRESTORE_URL}/products/${productId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${idToken}` }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to delete product');
  }

  return true;
};

// Orders
export const getOrders = async (idToken) => {
  const query = {
    structuredQuery: {
      from: [{ collectionId: 'orders' }],
      orderBy: [{
        field: { fieldPath: 'createdAt' },
        direction: 'DESCENDING'
      }]
    }
  };

  const response = await fetch(`${BASE_FIRESTORE_URL}:runQuery`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
    body: JSON.stringify(query)
  });

  if (!response.ok) throw new Error('Failed to fetch orders');

  const data = await response.json();
  return data
    .filter(doc => doc.document)
    .map(doc => parseFirestoreDocument(doc.document, doc.document.name));
};

export const updateOrderStatus = async (orderId, status, idToken) => {
  const firestoreData = {
    fields: {
      status: { stringValue: status },
      updatedAt: { timestampValue: new Date().toISOString() }
    }
  };

  const response = await fetch(`${BASE_FIRESTORE_URL}/orders/${orderId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
    body: JSON.stringify(firestoreData)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to update order');
  }

  return true;
};

// Parse Firestore document
const parseFirestoreDocument = (doc, name) => {
  if (!doc || !doc.fields) return {};
  
  const result = {};
  for (const [key, value] of Object.entries(doc.fields)) {
    if (value.stringValue !== undefined) {
      result[key] = value.stringValue;
    } else if (value.integerValue !== undefined) {
      result[key] = parseInt(value.integerValue);
    } else if (value.doubleValue !== undefined) {
      result[key] = value.doubleValue;
    } else if (value.booleanValue !== undefined) {
      result[key] = value.booleanValue;
    } else if (value.arrayValue?.values) {
      result[key] = value.arrayValue.values.map(v => 
        v.stringValue || v.integerValue || v.doubleValue || parseFirestoreDocument({ fields: v.mapValue?.fields })
      );
    } else if (value.mapValue?.fields) {
      result[key] = parseFirestoreDocument(value.mapValue);
    } else if (value.timestampValue) {
      result[key] = value.timestampValue;
    }
  }
  
  if (name) {
    result.id = name.split('/').pop();
  }
  
  return result;
};
