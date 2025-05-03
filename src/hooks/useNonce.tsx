import { useContext } from 'react';
import NonceContext from '../contexts/NonceContext';

/**
 * Custom hook to access the CSP nonce from any component
 * @returns {string|null} The nonce value or null if not available
 */
export function useNonce(): string | null {
  const nonce = useContext(NonceContext);
  return nonce;
}
