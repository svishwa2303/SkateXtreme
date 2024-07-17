import store from '../redux/store';
import { logout } from '../redux/authSlice';

const handleUnauthorized = () => {
    // Dispatch the logout action to clear the token
    store.dispatch(logout());

    // Clear local storage if needed
    // localStorage.removeItem('jwtToken');

    // Redirect to login page
    window.location.href = '/login';
};

export const fetchClient = async (url, options = {}, queryParams = null, userToken = '') => {
    let fullUrl = url;

    // If queryParams are provided, construct the full URL with query parameters
    if (queryParams) {
        const queryString = new URLSearchParams(queryParams).toString();
        fullUrl += `?${queryString}`;
    }
    
    const defaultHeaders = {
        'Authorization': 'Bearer ' + userToken,
        'Content-Type': 'application/json',
    };

    const headers = {
        ...defaultHeaders,
        ...options.headers,
    };

    const response = await fetch(fullUrl, {
        ...options,
        headers,
    });

    if (response.status === 401) {
        // Handle 401 Unauthorized response
        handleUnauthorized();
        throw new Error('Unauthorized'); // Throw an error to stop further processing
    }

    return response;
};
