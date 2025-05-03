import { createContext } from 'react';

// Create a context with a default value of null
const NonceContext = createContext<string | null>(null);

export default NonceContext;
