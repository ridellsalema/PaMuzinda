# PaMuzinda API - Frontend Integration Guide

## 1. Base URL Setup
Set your `REACT_APP_API_URL` to the backend endpoint (e.g., `http://localhost:5000/api`).

```javascript
import axios from 'axios';
export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});
```

## 2. Authentication Flow
Save the JWT returned from `/auth/login` inside `localStorage` or robust State stores (like context or zustand). 
You should build an axios interceptor:

```javascript
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(res => res, err => {
  if (err.response?.status === 401) {
    localStorage.removeItem('token');
    window.location = '/login';
  }
  return Promise.reject(err);
});
```

## 3. Role-Based UI Guidelines
Decode JWT tokens locally (`jwt-decode(token)`) to dynamically adjust the UI layout based on:
- `user.role` === 'Student' -> Transport booking buttons, Student ID verification page.
- `user.role` === 'Landlord' -> Properties Management screens.
- `user.role` === 'Admin' -> Admin analytic panels.

## 4. Per-Endpoint Frontend Usage
Example mapping properties:
```javascript
const loadProperties = async () => {
    try {
       const res = await api.get('/properties?is_student_only=false');
       console.log(res.data.data); // Array inside API generic wrapper 'data' field
    } catch(err) {
       console.error("Failed", err.response?.data?.message);
    }
}
```

## 5. Image Upload from React
Use standard `FormData` mappings combining it with normal fetch or axios.
```javascript
const uploadImage = async (file) => {
  const fd = new FormData();
  fd.append('image', file);
  await api.post(`/properties/${propertyId}/images`, fd, { headers: { 'Content-Type': 'multipart/form-data' }});
}
```

## 6. Error Handling
Responses mirror exactly: `{ success: boolean, message: string, data/error: Object|String }`.
Display the inner `err.response?.data?.message` inside React Toasts to provide instant readability for users (especially Joi validation formats, e.g. `"email" must be a valid email`).

## 7. Protected Routes
Build a ProtectedRoute abstraction in React Router checking `localStorage.getItem('token')`.
Extend the wrapper further by taking `allowedRoles={['Admin', 'Student']}` if needed.

## 8. State Management
Hydrate state on load. 
Ensure properties refresh automatically by setting query constraints effectively when filtering parameters from Search Bars are altered.
