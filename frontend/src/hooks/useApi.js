// // hooks/useApi.js
// import { useState } from 'react';
// import { useUser } from '../UserContext';

// export const useApi = () => {
//   const { axiosInstance, user } = useUser();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const makeRequest = async (method, url, data = null, config = {}) => {
//     if (!user.isLoggedIn) {
//       throw new Error('User not authenticated');
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       let response;
      
//       switch (method.toLowerCase()) {
//         case 'get':
//           response = await axiosInstance.get(url, config);
//           break;
//         case 'post':
//           response = await axiosInstance.post(url, data, config);
//           break;
//         case 'put':
//           response = await axiosInstance.put(url, data, config);
//           break;
//         case 'patch':
//           response = await axiosInstance.patch(url, data, config);
//           break;
//         case 'delete':
//           response = await axiosInstance.delete(url, config);
//           break;
//         default:
//           throw new Error(`Unsupported HTTP method: ${method}`);
//       }

//       return { success: true, data: response.data };
//     } catch (err) {
//       const errorMessage = err.response?.data?.detail || 
//                           err.response?.data?.message || 
//                           err.message || 
//                           'An error occurred';
      
//       setError(errorMessage);
//       return { success: false, error: errorMessage };
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Convenience methods
//   const get = (url, config) => makeRequest('get', url, null, config);
//   const post = (url, data, config) => makeRequest('post', url, data, config);
//   const put = (url, data, config) => makeRequest('put', url, data, config);
//   const patch = (url, data, config) => makeRequest('patch', url, data, config);
//   const del = (url, config) => makeRequest('delete', url, null, config);

//   return {
//     loading,
//     error,
//     makeRequest,
//     get,
//     post,
//     put,
//     patch,
//     delete: del,
//     clearError: () => setError(null),
//   };
// };