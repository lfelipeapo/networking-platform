'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Member {
  id: string;
  nome: string;
  email: string;
  empresa: string;
}

interface MemberContextData {
  member: Member | null;
  login: (email: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const MemberContext = createContext<MemberContextData>({} as MemberContextData);

export function MemberProvider({ children }: { children: ReactNode }) {
  const [member, setMember] = useState<Member | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar se há membro logado no localStorage
    const storedMember = localStorage.getItem('@networking:member');
    if (storedMember) {
      setMember(JSON.parse(storedMember));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string) => {
    setIsLoading(true);
    try {
      // Buscar membro pelo email
      const response = await fetch(`/api/membros?email=${email}`);
      
      if (!response.ok) {
        throw new Error('Membro não encontrado');
      }

      const result = await response.json();
      const memberData = result.data;

      setMember(memberData);
      localStorage.setItem('@networking:member', JSON.stringify(memberData));
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setMember(null);
    localStorage.removeItem('@networking:member');
  };

  return (
    <MemberContext.Provider value={{ member, login, logout, isLoading }}>
      {children}
    </MemberContext.Provider>
  );
}

export function useMember() {
  const context = useContext(MemberContext);
  
  if (!context) {
    throw new Error('useMember must be used within a MemberProvider');
  }

  return context;
}
