import type { Session, User } from "@supabase/supabase-js";
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";
import { supabase } from "../../../lib/supabase";
import {
  checkCurrentUserIsAdmin,
  signInAsAdmin,
  signOutCurrentSession,
} from "../services/authService";

export type AuthStatus = "loading" | "unauthenticated" | "admin";

export type AuthContextValue = {
  session: Session | null;
  user: User | null;
  status: AuthStatus;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);

  const [status, setStatus] = useState<AuthStatus>("loading");

  /*
   * Evita que uma verificação antiga sobrescreva o resultado
   * de uma sessão mais recente.
   */
  const verificationVersion = useRef(0);

  const applySession = useCallback(async (nextSession: Session | null) => {
    const currentVersion = ++verificationVersion.current;

    if (!nextSession) {
      setSession(null);
      setStatus("unauthenticated");
      return;
    }

    setStatus("loading");

    try {
      const isAdmin = await checkCurrentUserIsAdmin();

      if (currentVersion !== verificationVersion.current) {
        return;
      }

      if (!isAdmin) {
        setSession(null);
        setStatus("unauthenticated");

        /*
         * Executamos sem bloquear a atualização da interface.
         * O banco continua protegido pelo RLS.
         */
        void signOutCurrentSession().catch((error: unknown) => {
          console.error("Erro ao encerrar sessão não autorizada:", error);
        });

        return;
      }

      setSession(nextSession);
      setStatus("admin");
    } catch (error) {
      if (currentVersion !== verificationVersion.current) {
        return;
      }

      console.error("Erro durante a recuperação da sessão:", error);

      setSession(null);
      setStatus("unauthenticated");

      void signOutCurrentSession().catch(() => undefined);
    }
  }, []);

  useEffect(() => {
    let disposed = false;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      /*
       * O callback do onAuthStateChange permanece síncrono.
       * A verificação assíncrona é iniciada fora dele.
       */
      window.setTimeout(() => {
        if (!disposed) {
          void applySession(nextSession);
        }
      }, 0);
    });

    return () => {
      disposed = true;
      verificationVersion.current += 1;
      subscription.unsubscribe();
    };
  }, [applySession]);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const nextSession = await signInAsAdmin(email, password);

      verificationVersion.current += 1;
      setSession(nextSession);
      setStatus("admin");
    } catch (error) {
      verificationVersion.current += 1;
      setSession(null);
      setStatus("unauthenticated");

      throw error;
    }
  }, []);

  const signOut = useCallback(async () => {
    await signOutCurrentSession();

    verificationVersion.current += 1;
    setSession(null);
    setStatus("unauthenticated");
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      status,
      signIn,
      signOut,
    }),
    [session, status, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
