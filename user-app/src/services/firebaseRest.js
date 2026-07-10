const API_KEY = import.meta.env.VITE_FIREBASE_API_KEY;
const PROJECT_ID = import.meta.env.VITE_FIREBASE_PROJECT_ID;

const BASE_AUTH_URL = 'https://identitytoolkit.googleapis.com/v1';
const BASE_FIRESTORE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

const getFirebaseErrorMessage = (code, fallback) => {
  const messages = {
    CONFIGURATION_NOT_FOUND: 'Firebase Authentication is not enabled for this project. In Firebase Console, enable Authentication > Sign-in method > Email/Password.',
    EMAIL_EXISTS: 'An account already exists with this email.',
    EMAIL_NOT_FOUND: 'No account found with this email.',
    INVALID_PASSWORD: 'Incorrect password.',
    INVALID_LOGIN_CREDENTIALS: 'Invalid email or password.',
    USER_DISABLED: 'This account has been disabled.',
    WEAK_PASSWORD: 'Password should be at least 6 characters.',
  };

  return messages[code] || fallback;
};

export const signUpWithEmail = async (email, password) => {
  const trimmedEmail = email.trim();
  const response = await fetch(`${BASE_AUTH_URL}/accounts:signUp?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: trimmedEmail,
      password,
      returnSecureToken: true
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(getFirebaseErrorMessage(error.error?.message, 'Signup failed'));
  }

  const data = await response.json();
  localStorage.setItem('user', JSON.stringify(data));
  return data;
};

export const loginWithEmail = async (email, password) => {
  const trimmedEmail = email.trim();
  const response = await fetch(`${BASE_AUTH_URL}/accounts:signInWithPassword?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: trimmedEmail,
      password,
      returnSecureToken: true
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(getFirebaseErrorMessage(error.error?.message, 'Login failed'));
  }

  const data = await response.json();
  localStorage.setItem('user', JSON.stringify(data));
  return data;
};

export const resetPassword = async (email) => {
  const trimmedEmail = email.trim();
  const response = await fetch(`${BASE_AUTH_URL}/accounts:sendOobCode?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      requestType: 'PASSWORD_RESET',
      email: trimmedEmail
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(getFirebaseErrorMessage(error.error?.message, 'Password reset failed'));
  }

  return await response.json();
};

export const getUserData = async (userId, idToken) => {
  const response = await fetch(`${BASE_FIRESTORE_URL}/users/${userId}?key=${API_KEY}`, {
    headers: {
      'Authorization': `Bearer ${idToken}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user data');
  }

  const data = await response.json();
  return parseFirestoreDocument(data);
};

export const updateUserData = async (userId, userData, idToken) => {
  const firestoreData = {
    fields: {
      name: { stringValue: userData.name || '' },
      phone: { stringValue: userData.phone || '' },
      addresses: { arrayValue: { values: userData.addresses?.map(addr => ({ stringValue: addr })) || [] } }
    }
  };

  const response = await fetch(`${BASE_FIRESTORE_URL}/users/${userId}?key=${API_KEY}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
    body: JSON.stringify(firestoreData)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to update user data');
  }

  return await response.json();
};

export const getProducts = async () => {
  const response = await fetch(`${BASE_FIRESTORE_URL}/products?key=${API_KEY}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }

  const data = await response.json();
  return data.documents?.map(doc => parseFirestoreDocument(doc, doc.name)) || [];
};

export const getCategories = async () => {
  const response = await fetch(`${BASE_FIRESTORE_URL}/categories?key=${API_KEY}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }

  const data = await response.json();
  return data.documents?.map(doc => parseFirestoreDocument(doc, doc.name)) || [];
};

export const placeOrder = async (orderData, idToken) => {
  const firestoreData = {
    fields: {
      userId: { stringValue: orderData.userId },
      userEmail: { stringValue: orderData.userEmail },
      items: { arrayValue: { values: orderData.items.map(item => ({
        mapValue: {
          fields: {
            productId: { stringValue: item.productId },
            name: { stringValue: item.name },
            price: { doubleValue: item.price },
            quantity: { integerValue: item.quantity },
            image: { stringValue: item.image || '' }
          }
        }
      })) }},
      total: { doubleValue: orderData.total },
      address: { stringValue: orderData.address },
      status: { stringValue: orderData.status || 'processing' },
      paymentMethod: { stringValue: orderData.paymentMethod || 'COD' },
      createdAt: { timestampValue: new Date().toISOString() }
    }
  };

  const response = await fetch(`${BASE_FIRESTORE_URL}/orders?key=${API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
    body: JSON.stringify(firestoreData)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to place order');
  }

  return await response.json();
};

export const getUserOrders = async (userId, idToken) => {
  const query = {
    structuredQuery: {
      from: [{ collectionId: 'orders' }],
      where: {
        fieldFilter: {
          field: { fieldPath: 'userId' },
          op: 'EQUAL',
          value: { stringValue: userId }
        }
      }
    }
  };

  const response = await fetch(`${BASE_FIRESTORE_URL}:runQuery?key=${API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
    body: JSON.stringify(query)
  });

  if (!response.ok) {
    throw new Error('Failed to fetch orders');
  }

  const data = await response.json();
  return data
    .filter(doc => doc.document)
    .map(doc => ({
      id: doc.document.name.split('/').pop(),
      ...parseFirestoreDocument(doc.document)
    }))
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
};

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
