-- =====================================================
-- LA CASONA DE TAMAYA — Políticas RLS (Row Level Security)
-- =====================================================
--
-- DESCRIPCIÓN:
--   Este script configura la seguridad a nivel de fila en las tablas
--   de gestión del hotel. Solo los usuarios autenticados vía Supabase Auth
--   pueden leer o escribir datos.
--
-- CÓMO EJECUTAR:
--   1. Ir a https://supabase.com/dashboard
--   2. Seleccionar el proyecto "ronmanu's Project"
--   3. Menú izquierdo → SQL Editor
--   4. Pegar este script completo y pulsar "Run"
--
-- RESULTADO ESPERADO:
--   "Success. No rows returned"
--
-- NOTAS:
--   - Si ya existen políticas, este script las elimina primero para evitar
--     conflictos de nombres duplicados.
--   - auth.role() = 'authenticated' se cumple cuando el usuario ha iniciado
--     sesión con supabase.auth.signInWithPassword().
--   - Los visitantes anónimos de la web NO pueden acceder a estas tablas.
--
-- FECHA: Marzo 2026
-- =====================================================


-- ─── PASO 1: Activar RLS ────────────────────────────
-- Si RLS ya está activado, esta operación no tiene efecto.
ALTER TABLE room_charges ENABLE ROW LEVEL SECURITY;
ALTER TABLE cleaning_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_details ENABLE ROW LEVEL SECURITY;


-- ─── PASO 2: Limpiar políticas existentes ───────────
-- Eliminamos cualquier política previa para empezar desde cero.
-- DROP POLICY IF EXISTS es idempotente (no falla si no existe).

-- room_charges
DROP POLICY IF EXISTS "Permitir lectura pública" ON room_charges;
DROP POLICY IF EXISTS "select_all" ON room_charges;
DROP POLICY IF EXISTS "insert_auth" ON room_charges;
DROP POLICY IF EXISTS "update_auth" ON room_charges;
DROP POLICY IF EXISTS "delete_auth" ON room_charges;
DROP POLICY IF EXISTS "staff_select_charges" ON room_charges;
DROP POLICY IF EXISTS "staff_insert_charges" ON room_charges;
DROP POLICY IF EXISTS "staff_update_charges" ON room_charges;
DROP POLICY IF EXISTS "staff_delete_charges" ON room_charges;

-- cleaning_status
DROP POLICY IF EXISTS "Permitir lectura pública" ON cleaning_status;
DROP POLICY IF EXISTS "select_all" ON cleaning_status;
DROP POLICY IF EXISTS "insert_auth" ON cleaning_status;
DROP POLICY IF EXISTS "update_auth" ON cleaning_status;
DROP POLICY IF EXISTS "delete_auth" ON cleaning_status;
DROP POLICY IF EXISTS "staff_select_cleaning" ON cleaning_status;
DROP POLICY IF EXISTS "staff_insert_cleaning" ON cleaning_status;
DROP POLICY IF EXISTS "staff_update_cleaning" ON cleaning_status;
DROP POLICY IF EXISTS "staff_delete_cleaning" ON cleaning_status;

-- room_details
DROP POLICY IF EXISTS "Permitir lectura pública" ON room_details;
DROP POLICY IF EXISTS "select_all" ON room_details;
DROP POLICY IF EXISTS "insert_auth" ON room_details;
DROP POLICY IF EXISTS "update_auth" ON room_details;
DROP POLICY IF EXISTS "delete_auth" ON room_details;
DROP POLICY IF EXISTS "staff_select_details" ON room_details;
DROP POLICY IF EXISTS "staff_insert_details" ON room_details;
DROP POLICY IF EXISTS "staff_update_details" ON room_details;
DROP POLICY IF EXISTS "staff_delete_details" ON room_details;


-- ─── PASO 3: Crear políticas para room_charges ──────
-- Tabla de cargos (cafés, cenas, extras). Solo staff puede ver y gestionar.

CREATE POLICY "staff_select_charges" ON room_charges
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "staff_insert_charges" ON room_charges
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "staff_update_charges" ON room_charges
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "staff_delete_charges" ON room_charges
  FOR DELETE USING (auth.role() = 'authenticated');


-- ─── PASO 4: Crear políticas para cleaning_status ───
-- Estado de limpieza de cada habitación. Solo staff puede ver y modificar.

CREATE POLICY "staff_select_cleaning" ON cleaning_status
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "staff_insert_cleaning" ON cleaning_status
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "staff_update_cleaning" ON cleaning_status
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "staff_delete_cleaning" ON cleaning_status
  FOR DELETE USING (auth.role() = 'authenticated');


-- ─── PASO 5: Crear políticas para room_details ──────
-- Detalles de cada habitación (ocupación, precio, notas). Solo staff.

CREATE POLICY "staff_select_details" ON room_details
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "staff_insert_details" ON room_details
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "staff_update_details" ON room_details
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "staff_delete_details" ON room_details
  FOR DELETE USING (auth.role() = 'authenticated');


-- ─── FIN ─────────────────────────────────────────────
-- Verificación: Ve a Database → Policies en el Dashboard 
-- y comprueba que cada tabla tiene 4 políticas (SELECT, INSERT, UPDATE, DELETE).
