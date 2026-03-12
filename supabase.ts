/**
 * @fileoverview Inicialización del cliente Supabase.
 *
 * Este módulo exporta una instancia singleton del cliente de Supabase,
 * configurada con las credenciales del proyecto desde variables de entorno.
 *
 * La `anon key` de Supabase es segura para el cliente: por sí sola NO da
 * acceso a datos. El acceso real lo controlan las políticas RLS definidas
 * en la base de datos (ver docs/supabase-rls.sql).
 *
 * Para operaciones autenticadas (Staff Area), el cliente gestiona
 * automáticamente los tokens JWT tras `supabase.auth.signInWithPassword()`.
 *
 * @module supabase
 */

import { createClient } from '@supabase/supabase-js';

/** URL del proyecto Supabase (ej: https://xxxxx.supabase.co) */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';

/** Clave pública (anon key) del proyecto. Segura para el cliente. */
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
        '⚠️ Supabase credentials missing. Check your .env file.\n' +
        'Required: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY'
    );
}

/**
 * Cliente Supabase singleton.
 *
 * Uso en componentes:
 * ```ts
 * import { supabase } from '../supabase';
 *
 * // Leer datos (requiere sesión activa por RLS)
 * const { data } = await supabase.from('room_details').select('*');
 *
 * // Autenticación
 * await supabase.auth.signInWithPassword({ email, password });
 * await supabase.auth.signOut();
 * ```
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
