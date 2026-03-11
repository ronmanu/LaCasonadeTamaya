import React, { useState, useEffect } from 'react';
import { Lock, LogOut, ShieldCheck, Trash2, Plus, Coffee, X, LogIn, MessageSquare, AlertCircle, Save } from 'lucide-react';
import { ROOMS } from '../constants';
import { supabase } from '../supabase';

interface StaffAreaProps {
    onLogout: () => void;
}

interface Charge {
    id: string;
    room: string;
    concept: string;
    amount: number;
    quantity: number;
    unit_price: number;
    status: 'active' | 'archived';
    created_at: string;
    dateLabel: string;
}

const STAFF_PASSWORD = 'tamaya2026';

const BAR_PRODUCTS = [
    { name: 'Café', price: 1.50 },
    { name: 'Caña / Cerveza', price: 2.50 },
    { name: 'Botella Agua', price: 1.80 },
    { name: 'Refresco', price: 2.50 },
    { name: 'Copa Vino', price: 3.00 },
    { name: 'Desayuno Buffet', price: 12.00 },
    { name: 'Cena Menú', price: 25.00 },
    { name: 'Media Pensión', price: 35.00 },
    { name: 'Ración Ibéricos', price: 18.00 },
    { name: 'Torreznos', price: 8.00 },
    { name: 'Tabla Quesos', price: 16.00 },
    { name: 'Croquetas (8u)', price: 10.00 },
    { name: 'Cerveza Botella', price: 3.00 },
    { name: 'Suplemento Mascota', price: 10.00 },
];

const formatDateLabel = (isoString: string): string => {
    const date = new Date(isoString);
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const day = days[date.getDay()];
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    return `${day} ${dd}/${mm} · ${hh}:${min}`;
};

export const StaffArea: React.FC<StaffAreaProps> = ({ onLogout }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    const [cleaningStatus, setCleaningStatus] = useState<Record<string, 'clean' | 'dirty' | 'in-progress'>>({});
    const [roomDetails, setRoomDetails] = useState<Record<string, { is_occupied: boolean, price_per_night: number, notes: string }>>({});
    const [charges, setCharges] = useState<Charge[]>([]);
    const [newCharge, setNewCharge] = useState({ room: '', concept: '', quantity: '1', unitPrice: '' });
    const [selectedRoom, setSelectedRoom] = useState<string>('');
    const [isEditingPrice, setIsEditingPrice] = useState<string | null>(null);
    const [tempPrice, setTempPrice] = useState<string>('');
    const [isEditingNotes, setIsEditingNotes] = useState<string | null>(null);
    const [tempNotes, setTempNotes] = useState<string>('');

    // Checkout confirmation state: 0=idle, 1=first confirm, 2=second confirm, 3=type confirm
    const [checkoutStep, setCheckoutStep] = useState<0 | 1 | 2 | 3>(0);
    const [checkoutInput, setCheckoutInput] = useState('');

    const fetchData = async () => {
        // Only fetch ACTIVE charges for the current operational view
        const { data: chargesData, error: chargesErr } = await supabase
            .from('room_charges')
            .select('*')
            .eq('status', 'active')
            .order('created_at', { ascending: false });

        if (chargesErr) console.error('Error fetching charges:', chargesErr);
        if (chargesData) {
            setCharges(chargesData.map(c => ({
                id: c.id,
                room: c.room,
                concept: c.concept,
                amount: Number(c.amount),
                quantity: c.quantity || 1,
                unit_price: c.unit_price || (c.amount / (c.quantity || 1)),
                status: c.status || 'active',
                created_at: c.created_at,
                dateLabel: formatDateLabel(c.created_at),
            })));
        }

        const { data: cleaningData, error: cleanErr } = await supabase.from('cleaning_status').select('*');
        if (cleanErr) console.error('Error fetching cleaning:', cleanErr);
        if (cleaningData) {
            const statusMap: Record<string, 'clean' | 'dirty' | 'in-progress'> = {};
            cleaningData.forEach(item => { statusMap[item.room_id] = item.status; });
            setCleaningStatus(statusMap);
        }

        const { data: detailsData, error: detailsErr } = await supabase.from('room_details').select('*');
        if (detailsErr) console.error('Error fetching room details:', detailsErr);
        if (detailsData) {
            const detailsMap: Record<string, { is_occupied: boolean, price_per_night: number, notes: string }> = {};
            detailsData.forEach(item => {
                detailsMap[item.room_id] = {
                    is_occupied: item.is_occupied,
                    price_per_night: Number(item.price_per_night),
                    notes: item.notes || ''
                };
            });
            setRoomDetails(detailsMap);
        }
    };

    useEffect(() => {
        if (!isAuthenticated) return;
        fetchData();

        const channel = supabase
            .channel('staff-db-changes')
            .on('postgres_changes', { event: '*', table: 'room_charges' }, fetchData)
            .on('postgres_changes', { event: '*', table: 'cleaning_status' }, fetchData)
            .on('postgres_changes', { event: '*', table: 'room_details' }, fetchData)
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [isAuthenticated]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === STAFF_PASSWORD) { setIsAuthenticated(true); setLoginError(''); }
        else { setLoginError('Contraseña incorrecta'); setPassword(''); }
    };

    const toggleCleaning = async (roomId: string) => {
        const current = cleaningStatus[roomId] || 'dirty';
        const next = current === 'dirty' ? 'in-progress' : current === 'in-progress' ? 'clean' : 'dirty';
        setCleaningStatus({ ...cleaningStatus, [roomId]: next });
        const { error } = await supabase.from('cleaning_status').upsert({ room_id: roomId, status: next }, { onConflict: 'room_id' });
        if (error) alert('Error limpieza: ' + error.message);
    };

    const toggleOccupancy = async (roomId: string) => {
        const existing = roomDetails[roomId] || { is_occupied: false, price_per_night: 0, notes: '' };
        const next = !existing.is_occupied;

        setRoomDetails(prev => ({
            ...prev,
            [roomId]: { ...existing, is_occupied: next }
        }));

        const { error } = await supabase.from('room_details').upsert({
            room_id: roomId,
            is_occupied: next
        }, { onConflict: 'room_id' });

        if (error) {
            console.error('Error ocupación:', error);
            fetchData(); // Rollback/Sync
        }
    };

    const updateRoomPrice = async (roomId: string, newPrice: number) => {
        const existing = roomDetails[roomId] || { is_occupied: false, price_per_night: 0, notes: '' };

        setRoomDetails(prev => ({
            ...prev,
            [roomId]: { ...existing, price_per_night: newPrice }
        }));

        const { error } = await supabase.from('room_details').upsert({
            room_id: roomId,
            price_per_night: newPrice
        }, { onConflict: 'room_id' });

        if (error) {
            console.error('Error precio:', error);
            fetchData(); // Rollback/Sync
        }
        setIsEditingPrice(null);
    };

    const updateRoomNotes = async (roomId: string, newNotes: string) => {
        const existing = roomDetails[roomId] || { is_occupied: false, price_per_night: 0, notes: '' };

        setRoomDetails(prev => ({
            ...prev,
            [roomId]: { ...existing, notes: newNotes }
        }));

        const { error } = await supabase.from('room_details').upsert({
            room_id: roomId,
            notes: newNotes
        }, { onConflict: 'room_id' });

        if (error) {
            console.error('Error notas:', error);
            fetchData(); // Rollback/Sync
        }
        setIsEditingNotes(null);
    };

    const handleProductSelect = (productName: string) => {
        if (!productName) return;
        const product = BAR_PRODUCTS.find(p => p.name === productName);
        if (product) setNewCharge(prev => ({ ...prev, concept: product.name, unitPrice: product.price.toString() }));
    };

    const addCharge = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCharge.room || !newCharge.concept || !newCharge.unitPrice) return;

        const room = newCharge.room;
        const concept = newCharge.concept;
        const qty = parseInt(newCharge.quantity) || 1;
        const price = parseFloat(newCharge.unitPrice);
        const amount = qty * price;

        const { error } = await supabase.from('room_charges').insert([{
            room, concept, amount, quantity: qty, unit_price: price, status: 'active'
        }]);

        if (error) {
            alert('❌ Error al añadir: ' + error.message);
        } else {
            setNewCharge(prev => ({ ...prev, concept: '', quantity: '1', unitPrice: '' }));
            fetchData();
        }
    };

    const deleteCharge = async (id: string) => {
        if (!window.confirm('¿Borrar este concepto? (Solo para errores de apunte)')) return;
        const { error } = await supabase.from('room_charges').delete().eq('id', id);
        if (error) alert('❌ Error al borrar: ' + error.message);
        else fetchData();
    };

    // 3-step checkout flow
    const startCheckout = () => setCheckoutStep(1);
    const cancelCheckout = () => { setCheckoutStep(0); setCheckoutInput(''); };

    const confirmCheckout = async () => {
        if (checkoutStep === 1) { setCheckoutStep(2); return; }
        if (checkoutStep === 2) { setCheckoutStep(3); return; }
        if (checkoutStep === 3) {
            if (checkoutInput.trim().toUpperCase() !== 'CHECKOUT') {
                alert('Debes escribir exactamente "CHECKOUT" para confirmar.');
                return;
            }
            // Archive all active charges for this room
            const { error } = await supabase
                .from('room_charges')
                .update({ status: 'archived' })
                .eq('room', selectedRoom)
                .eq('status', 'active');

            if (error) {
                alert('❌ Error al hacer check-out: ' + error.message);
            } else {
                cancelCheckout();
                setSelectedRoom('');
                fetchData();
            }
        }
    };

    const filteredCharges = selectedRoom ? charges.filter(c => c.room === selectedRoom) : charges;
    const filteredTotal = filteredCharges.reduce((acc, c) => acc + c.amount, 0);
    const roomHasCharges = selectedRoom && charges.some(c => c.room === selectedRoom);

    const roomLabel = (roomId: string) => {
        const r = ROOMS.find(r => r.id === roomId);
        return r ? r.name.split(' ')[1] : roomId;
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen pt-20 bg-stone-100 flex items-center justify-center px-4 font-sans">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 border border-stone-200">
                    <div className="text-center mb-8">
                        <div className="bg-stone-900 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Lock className="text-white" size={24} />
                        </div>
                        <h1 className="text-2xl font-serif font-bold text-stone-900">Personal Tamaya</h1>
                        <p className="text-stone-400 text-sm mt-1">Acceso restringido al equipo</p>
                    </div>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-stone-900 transition-colors"
                            placeholder="Contraseña staff"
                            required
                        />
                        {loginError && <p className="text-red-500 text-xs text-center">{loginError}</p>}
                        <button type="submit" className="w-full bg-stone-900 text-white py-4 rounded-xl font-bold hover:bg-stone-800 transition-all shadow-lg">
                            Entrar
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-20 bg-stone-50 font-sans">
            <header className="bg-white border-b border-stone-200 py-4 px-4 mb-6">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <ShieldCheck size={18} className="text-green-600" />
                        <span className="text-sm font-bold uppercase tracking-widest text-stone-500">Panel de Control</span>
                    </div>
                    <button
                        onClick={onLogout}
                        className="flex items-center gap-2 text-stone-400 hover:text-red-600 text-sm font-medium transition-colors"
                        title="Cerrar sesión"
                        aria-label="Cerrar sesión"
                    >
                        <LogOut size={16} /> Salir
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* ── LIMPIEZA ─────────────────────────────────────── */}
                <section className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden h-fit">
                    <div className="p-5 border-b border-stone-100">
                        <h2 className="font-serif font-bold text-stone-800">Estado de Habitaciones</h2>
                        <p className="text-xs text-stone-400 mt-0.5">Pulsa para cambiar estado</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-4">
                        {ROOMS.map(room => {
                            const num = room.name.split(' ')[1];
                            const cStatus = cleaningStatus[room.id] || 'dirty';
                            const rDetails = roomDetails[room.id] || { is_occupied: false, price_per_night: 0, notes: '' };

                            const cColors = {
                                clean: 'bg-green-50 border-green-200 text-green-700',
                                'in-progress': 'bg-blue-50 border-blue-200 text-blue-700',
                                dirty: 'bg-red-50 border-red-200 text-red-700',
                            };
                            const cBadgeColors = {
                                clean: 'bg-green-600',
                                'in-progress': 'bg-blue-600',
                                dirty: 'bg-red-600',
                            };
                            const cLabels = { clean: 'Limpia', 'in-progress': 'Limpiando', dirty: 'Sucia' };

                            return (
                                <div key={room.id} className="p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-3">
                                    <div className="flex justify-between items-start">
                                        <div className="flex gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-stone-900 flex items-center justify-center text-white text-xs font-bold shrink-0">{num}</div>
                                            <div>
                                                <p className="text-[10px] text-stone-900 font-bold uppercase">{room.name.split('- ')[1]}</p>
                                                <div className="flex items-center gap-1.5 mt-1">
                                                    {isEditingPrice === room.id ? (
                                                        <div className="flex items-center gap-1">
                                                            <input
                                                                type="number"
                                                                value={tempPrice}
                                                                onChange={e => setTempPrice(e.target.value)}
                                                                className="w-14 text-[10px] font-bold border rounded px-1 py-0.5 outline-none"
                                                                autoFocus
                                                            />
                                                            <button
                                                                onClick={() => updateRoomPrice(room.id, parseFloat(tempPrice))}
                                                                className="text-green-600 hover:text-green-700"
                                                                title="Guardar"
                                                            >
                                                                <ShieldCheck size={12} />
                                                            </button>
                                                            <button
                                                                onClick={() => setIsEditingPrice(null)}
                                                                className="text-stone-400"
                                                                title="Cancelar"
                                                            >
                                                                <X size={12} />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => {
                                                                setIsEditingPrice(room.id);
                                                                setTempPrice((rDetails.price_per_night || 0).toString());
                                                            }}
                                                            className="text-[10px] font-bold text-stone-400 hover:text-stone-600 transition-colors flex items-center gap-1"
                                                            title="Editar precio por noche"
                                                        >
                                                            {(rDetails.price_per_night || 0).toFixed(2)}€/noche
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        {/* Limpieza */}
                                        <button
                                            onClick={() => toggleCleaning(room.id)}
                                            className={`flex flex-col p-2 rounded-lg border text-left transition-all ${cColors[cStatus]}`}
                                        >
                                            <span className="text-[8px] uppercase font-bold opacity-60">Limpieza</span>
                                            <span className="text-[10px] font-black uppercase">{cLabels[cStatus]}</span>
                                        </button>

                                        {/* Ocupación */}
                                        <button
                                            onClick={() => toggleOccupancy(room.id)}
                                            className={`flex flex-col p-2 rounded-lg border text-left transition-all ${rDetails.is_occupied
                                                ? 'bg-amber-50 border-amber-200 text-amber-700'
                                                : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                                }`}
                                        >
                                            <span className="text-[8px] uppercase font-bold opacity-60">Ocupación</span>
                                            <span className="text-[10px] font-black uppercase">
                                                {rDetails.is_occupied ? 'Ocupada' : 'Libre'}
                                            </span>
                                        </button>
                                    </div>

                                    {/* Notas / Incidencias */}
                                    <div className="pt-2 border-t border-stone-100">
                                        {isEditingNotes === room.id ? (
                                            <div className="space-y-2">
                                                <textarea
                                                    value={tempNotes}
                                                    onChange={e => setTempNotes(e.target.value)}
                                                    className="w-full text-[10px] p-2 border rounded-lg outline-none bg-white min-h-[60px]"
                                                    placeholder="Averías, preferencias, avisos..."
                                                    autoFocus
                                                />
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => setIsEditingNotes(null)}
                                                        className="px-2 py-1 text-[9px] font-bold text-stone-400 hover:text-stone-600"
                                                    >
                                                        Cancelar
                                                    </button>
                                                    <button
                                                        onClick={() => updateRoomNotes(room.id, tempNotes)}
                                                        className="flex items-center gap-1 px-2 py-1 text-[9px] font-bold bg-stone-900 text-white rounded-md"
                                                    >
                                                        <Save size={10} /> Guardar Nota
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => {
                                                    setIsEditingNotes(room.id);
                                                    setTempNotes(rDetails.notes || '');
                                                }}
                                                className={`w-full flex items-start gap-2 p-2 rounded-lg transition-colors text-left ${rDetails.notes
                                                        ? 'bg-stone-100 border border-stone-200'
                                                        : 'hover:bg-stone-100 border border-transparent border-dashed hover:border-stone-200'
                                                    }`}
                                            >
                                                <MessageSquare size={14} className={rDetails.notes ? 'text-stone-900 mt-0.5' : 'text-stone-300 mt-0.5'} />
                                                <div className="min-w-0 flex-1">
                                                    <p className={`text-[9px] font-bold uppercase ${rDetails.notes ? 'text-stone-900' : 'text-stone-400'}`}>
                                                        {rDetails.notes ? 'Aviso / Incidencia' : 'Añadir nota o avería'}
                                                    </p>
                                                    {rDetails.notes && (
                                                        <p className="text-[10px] text-stone-600 line-clamp-2 mt-0.5 leading-tight">
                                                            {rDetails.notes}
                                                        </p>
                                                    )}
                                                </div>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* ── CARGOS ───────────────────────────────────────── */}
                <section className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden flex flex-col" style={{ height: '680px' }}>
                    <div className="p-5 border-b border-stone-100 flex justify-between items-start shrink-0">
                        <div>
                            <h2 className="font-serif font-bold text-stone-800">Cargos a Habitación</h2>
                            <p className="text-xs text-stone-400 mt-0.5">Los cargos se archivan en el check-out, nunca se pierden</p>
                        </div>
                    </div>

                    {/* Filtros + Check-Out */}
                    <div className="p-4 bg-stone-50 border-b border-stone-100 shrink-0">
                        <div className="flex gap-3 items-end">
                            <div className="flex flex-col gap-1 flex-1">
                                <span className="text-[9px] font-bold text-stone-400 uppercase">Filtro / Habitación</span>
                                <select
                                    title="Filtrar por habitación"
                                    value={selectedRoom}
                                    onChange={e => { setSelectedRoom(e.target.value); cancelCheckout(); }}
                                    className="text-xs font-bold p-2 rounded-lg border bg-white outline-none"
                                    aria-label="Filtrar por habitación"
                                >
                                    <option value="">Todas las habitaciones</option>
                                    {ROOMS.map(r => <option key={r.id} value={r.name.split(' ')[1]}>{r.name.split(' ')[1]} — {r.name.split('- ')[1]}</option>)}
                                </select>
                            </div>
                            {selectedRoom && (
                                <button
                                    onClick={startCheckout}
                                    title={`Hacer check-out de Hab. ${selectedRoom}`}
                                    aria-label={`Check-out habitación ${selectedRoom}`}
                                    className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors shrink-0"
                                >
                                    <LogIn size={14} /> Check-Out Hab. {selectedRoom}
                                </button>
                            )}
                        </div>

                        {/* Checkout confirmation flow */}
                        {checkoutStep > 0 && (
                            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl space-y-2">
                                {checkoutStep === 1 && (
                                    <>
                                        <p className="text-xs font-bold text-red-700">⚠️ Paso 1/3 — ¿Iniciar check-out de Hab. {selectedRoom}?</p>
                                        <p className="text-[10px] text-red-500">Los cargos activos quedarán archivados. No se borrarán.</p>
                                        <div className="flex gap-2">
                                            <button onClick={confirmCheckout} className="bg-red-600 text-white text-xs px-3 py-1.5 rounded-lg font-bold">Sí, continuar</button>
                                            <button onClick={cancelCheckout} className="bg-white border text-stone-500 text-xs px-3 py-1.5 rounded-lg">Cancelar</button>
                                        </div>
                                    </>
                                )}
                                {checkoutStep === 2 && (
                                    <>
                                        <p className="text-xs font-bold text-red-700">⚠️ Paso 2/3 — ¿Archivar TODOS los cargos de Hab. {selectedRoom}?</p>
                                        <p className="text-[10px] text-red-500">Total a archivar: {filteredTotal.toFixed(2)}€ · {filteredCharges.length} concepto(s)</p>
                                        <div className="flex gap-2">
                                            <button onClick={confirmCheckout} className="bg-red-600 text-white text-xs px-3 py-1.5 rounded-lg font-bold">Confirmar</button>
                                            <button onClick={cancelCheckout} className="bg-white border text-stone-500 text-xs px-3 py-1.5 rounded-lg">Cancelar</button>
                                        </div>
                                    </>
                                )}
                                {checkoutStep === 3 && (
                                    <>
                                        <p className="text-xs font-bold text-red-700">⚠️ Paso 3/3 — Escribe CHECKOUT para confirmar</p>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={checkoutInput}
                                                onChange={e => setCheckoutInput(e.target.value)}
                                                placeholder="Escribe CHECKOUT"
                                                className="flex-1 border border-red-300 rounded-lg px-2 py-1 text-xs outline-none"
                                            />
                                            <button
                                                onClick={confirmCheckout}
                                                disabled={checkoutInput.trim().toUpperCase() !== 'CHECKOUT'}
                                                className="bg-red-600 disabled:bg-stone-300 text-white text-xs px-3 py-1.5 rounded-lg font-bold transition-colors"
                                            >
                                                Ejecutar
                                            </button>
                                            <button onClick={cancelCheckout} className="bg-white border text-stone-500 text-xs px-3 py-1.5 rounded-lg">Cancelar</button>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {/* Products quick selector */}
                        <div className="mt-3 flex flex-col gap-1">
                            <span className="text-[9px] font-bold text-stone-400 uppercase">Producto Rápido</span>
                            <select
                                title="Seleccionar producto del bar"
                                onChange={e => handleProductSelect(e.target.value)}
                                className="text-xs font-bold p-2 rounded-lg border bg-blue-50 border-blue-100 outline-none"
                                value=""
                                aria-label="Seleccionar producto del bar"
                            >
                                <option value="">Selecciona para autocompletar...</option>
                                {BAR_PRODUCTS.map(p => <option key={p.name} value={p.name}>{p.name} ({p.price.toFixed(2)}€)</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Add charge form */}
                    <form onSubmit={addCharge} className="p-4 flex flex-wrap gap-2 border-b border-stone-100 bg-stone-50/30 shrink-0">
                        <select
                            title="Seleccionar habitación"
                            value={newCharge.room}
                            onChange={e => setNewCharge(prev => ({ ...prev, room: e.target.value }))}
                            className="w-16 p-2 border rounded-lg text-xs outline-none"
                            required
                            aria-label="Habitación del cargo"
                        >
                            <option value="">Hab.</option>
                            {ROOMS.map(r => <option key={r.id} value={r.name.split(' ')[1]}>{r.name.split(' ')[1]}</option>)}
                        </select>
                        <input
                            type="text"
                            placeholder="Concepto"
                            value={newCharge.concept}
                            onChange={e => setNewCharge(prev => ({ ...prev, concept: e.target.value }))}
                            className="flex-1 p-2 border rounded-lg text-xs outline-none min-w-0"
                            required
                        />
                        <input
                            type="number"
                            placeholder="Cant."
                            value={newCharge.quantity}
                            onChange={e => setNewCharge(prev => ({ ...prev, quantity: e.target.value }))}
                            className="w-12 p-2 border rounded-lg text-xs outline-none"
                            min="1"
                            required
                        />
                        <input
                            type="number"
                            step="0.01"
                            placeholder="Precio"
                            value={newCharge.unitPrice}
                            onChange={e => setNewCharge(prev => ({ ...prev, unitPrice: e.target.value }))}
                            className="w-16 p-2 border rounded-lg text-xs outline-none"
                            min="0"
                            required
                        />
                        <button
                            type="submit"
                            title="Añadir cargo"
                            aria-label="Añadir cargo"
                            className="bg-stone-900 text-white px-3 py-2 rounded-lg hover:bg-stone-800 transition-colors"
                        >
                            <Plus size={16} />
                        </button>
                    </form>

                    {/* Charges list */}
                    <div className="flex-grow overflow-y-auto p-4 space-y-2">
                        {filteredCharges.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-stone-300 opacity-40">
                                <Coffee size={36} />
                                <p className="text-xs mt-2">Sin consumos activos</p>
                            </div>
                        ) : (
                            filteredCharges.map(c => (
                                <div key={c.id} className="group flex items-start justify-between p-3 bg-white border border-stone-100 rounded-xl shadow-sm hover:border-stone-300 transition-all">
                                    <div className="flex items-start gap-3 min-w-0">
                                        <div className="bg-stone-900 text-white w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">{c.room}</div>
                                        <div className="min-w-0">
                                            <p className="text-xs font-bold text-stone-800 truncate">{c.concept}</p>
                                            <p className="text-[9px] text-stone-400">{c.quantity} u. × {Number(c.unit_price).toFixed(2)}€</p>
                                            <p className="text-[9px] text-stone-300 mt-0.5">{c.dateLabel}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0 ml-2">
                                        <span className="font-bold text-xs text-stone-900">{c.amount.toFixed(2)}€</span>
                                        <button
                                            onClick={() => deleteCharge(c.id)}
                                            title="Borrar este concepto (solo errores de apunte)"
                                            aria-label={`Borrar cargo: ${c.concept}`}
                                            className="text-stone-200 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-0.5"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Total footer */}
                    <div className="shrink-0 p-4 bg-stone-900 text-white flex justify-between items-center">
                        <span className="text-xs font-bold uppercase tracking-widest text-stone-400">
                            {selectedRoom ? `Hab. ${selectedRoom}` : 'Total General'}
                        </span>
                        <span className="font-serif font-bold text-lg">{filteredTotal.toFixed(2)} €</span>
                    </div>
                </section>

            </main>
        </div>
    );
};
