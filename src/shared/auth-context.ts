import { createContext } from 'react';
import { AuthContextType } from '../global';

export const AuthContext = createContext<AuthContextType | null>(null);
