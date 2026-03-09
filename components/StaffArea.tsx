import React, { useState, useEffect } from 'react';
import { Lock, LogOut, CheckCircle, RefreshCcw, ExternalLink, ShieldCheck, AlertTriangle, Trash2, Plus, Coffee, X } from 'lucide-react';
import { ROOMS } from '../constants';
import { supabase } from '../supabase';

interface StaffAreaProps {
    onLogout: () => void;
}

/**
 * Staff Area Component - Exclusive for hotel management.
 * Integrated with Supabase for real-time data sync.
 */
export const StaffArea: React.FC<StaffAreaProps> = ({ onLogout }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const STAFF_PASSWORD = "tamaya2026";

    const [cleaningStatus, setCleaningStatus] = useState<Record<string, 'clean' | 'dirty' | 'in-progress'>>({});
    const [charges, setCharges] = useState<{ id?: string, room: string, concept: string, amount: number, quantity: number, unit_price: number, time: string }[]>([]);
    const [newCharge, setNewCharge] = useState({ room: '', concept: '', quantity: '1', unitPrice: '' });
    const [selectedRoomFilter, setSelectedRoomFilter] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);

    // Initial load and Real-time subscription
    useEffect(() => {
        if (!isAuthenticated) return;

        const fetchData = async () => {
            setIsLoading(true);

            // Fetch charges
            const { data: chargesData, error: chargesErr } = await supabase
                .from('room_charges')
                .select('*')
                .order('created_at', { ascending: false });

            if (!chargesErr && chargesData) {
                setCharges(chargesData.map(c => ({
                    id: c.id,
                    room: c.room,
                    concept: c.concept,
                    amount: c.amount,
                    quantity: c.quantity || 1,
                    unit_price: c.unit_price || (c.amount / (c.quantity || 1)),
                    time: new Date(c.created_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
                })));
            }

            // Fetch cleaning status
            const { data: cleaningData, error: cleanErr } = await supabase
                .from('cleaning_status')
                .select('*');

            if (!cleanErr && cleaningData) {
                const statusMap: any = {};
                cleaningData.forEach(item => statusMap[item.room_id] = item.status);
                setCleaningStatus(statusMap);
            }

            setIsLoading(false);
        };

        fetchData();

        // Subscribe to real-time changes
        const chargesSub = supabase
            .channel('room-charges')
            .on('postgres_changes', { event: '*', table: 'room_charges' }, fetchData)
            .subscribe();

        const cleaningSub = supabase
            .channel('cleaning-status')
            .on('postgres_changes', { event: '*', table: 'cleaning_status' }, fetchData)
            .subscribe();

        return () => {
            supabase.removeChannel(chargesSub);
            supabase.removeChannel(cleaningSub);
        };
    }, [isAuthenticated]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === STAFF_PASSWORD) {
            setIsAuthenticated(true);
            setError('');
        } else {
            setError('Contraseña incorrecta');
            setPassword('');
        }
    };

    const toggleCleaning = async (roomId: string) => {
        const current = cleaningStatus[roomId] || 'dirty';
        let next: 'clean' | 'dirty' | 'in-progress';

        if (current === 'dirty') next = 'in-progress';
        else if (current === 'in-progress') next = 'clean';
        else next = 'dirty';

        // Update local state for immediate UI feedback
        setCleaningStatus({ ...cleaningStatus, [roomId]: next });

        // Persist to Supabase
        await supabase
            .from('cleaning_status')
            .upsert({ room_id: roomId, status: next }, { onConflict: 'room_id' });
    };

    const addCharge = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCharge.room || !newCharge.concept || !newCharge.unitPrice) return;

        const concept = newCharge.concept;
        const room = newCharge.room;
        const q = parseInt(newCharge.quantity) || 1;
        const up = parseFloat(newCharge.unitPrice);
        const amount = q * up;

        setNewCharge({ ...newCharge, concept: '', quantity: '1', unitPrice: '' });

        const { error } = await supabase
            .from('room_charges')
            .insert([{ room, concept, amount, quantity: q, unit_price: up }]);

        if (error) {
            console.error('Error adding charge:', error);
            alert('Error al guardar: Cierra y abre este panel si el error persiste.');
        }
    };

    const deleteCharge = async (id: string) => {
        if (confirm('¿Borrar este cargo?')) {
            const { error } = await supabase
                .from('room_charges')
                .delete()
                .eq('id', id);

            if (error) console.error('Delete error:', error);
        }
    };

    const clearCharges = async () => {
        if (confirm('¿Vaciar historial de consumos de la base de datos central?')) {
            const { error } = await supabase
                .from('room_charges')
                .delete()
                .neq('room', 'FORCE_DELETE_ALL');

            if (error) console.error('Delete error:', error);
            else setCharges([]);
        }
    };

    const filteredCharges = selectedRoomFilter
        ? charges.filter(c => c.room === selectedRoomFilter)
        : charges;

    const filteredTotal = filteredCharges.reduce((acc, curr) => acc + Number(curr.amount), 0);

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen pt-20 bg-stone-100 flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 border border-stone-200">
                    <div className="text-center mb-8">
                        <div className="bg-stone-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Lock className="text-white" size={30} />
                        </div>
                        <h1 className="text-2xl font-serif font-bold text-stone-900">Acceso Staff</h1>
                        <p className="text-stone-500 text-sm mt-2">Área para administración y gestión interna</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Contraseña</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-stone-900 transition-colors"
                                placeholder="••••••••"
                                required
                            />
                            {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-stone-900 text-white py-4 rounded-xl font-bold hover:bg-stone-800 transition-all shadow-lg"
                        >
                            Entrar al Panel
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-stone-100 text-center">
                        <p className="text-[10px] text-stone-400 leading-relaxed uppercase tracking-tighter">
                            AVISO: El acceso no autorizado está prohibido. <br />Toda actividad queda registrada.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-20 bg-stone-50">
            <header className="bg-white border-b border-stone-200 py-6 px-4 mb-8">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-green-100 p-2 rounded-lg">
                            <ShieldCheck className="text-green-700" size={24} />
                        </div>
                        <div>
                            <h1 className="text-xl font-serif font-bold text-stone-900">Panel de Control Interno</h1>
                            <p className="text-xs text-stone-500">Sesión activa como Administrador</p>
                        </div>
                    </div>
                    <button
                        onClick={onLogout}
                        className="flex items-center gap-2 text-stone-400 hover:text-red-600 transition-colors font-medium text-sm"
                    >
                        <LogOut size={18} /> Salir
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 pb-20 space-y-8">
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <a
                        href="https://www.avaibook.com/login"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 hover:border-wood-600 transition-all group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-bold text-stone-800">Panel AvaiBook</h3>
                            <ExternalLink size={18} className="text-stone-300 group-hover:text-wood-600" />
                        </div>
                        <p className="text-xs text-stone-500">Gestión de reservas, pagos y partes a la Guardia Civil.</p>
                    </a>

                    <a
                        href="https://admin.booking.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 hover:border-blue-600 transition-all group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-bold text-stone-800">Booking Extranet</h3>
                            <ExternalLink size={18} className="text-stone-300 group-hover:text-blue-600" />
                        </div>
                        <p className="text-xs text-stone-500">Calendario de disponibilidad, reseñas y ofertas.</p>
                    </a>

                    <div className="bg-amber-50 p-6 rounded-2xl shadow-sm border border-amber-200 relative font-sans">
                        <div className="flex items-center gap-2 mb-4 text-amber-800">
                            <AlertTriangle size={18} />
                            <h3 className="font-bold">Estado Sistema</h3>
                        </div>
                        <div className="text-xs text-amber-700 space-y-2">
                            <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${isLoading ? 'bg-amber-400 animate-pulse' : 'bg-green-500'}`}></span>
                                <span>{isLoading ? 'Sincronizando...' : 'Nube Conectada'}</span>
                            </div>
                            <p className="opacity-70 tracking-tight leading-tight">Los cambios se guardan automáticamente en la nube.</p>
                        </div>
                    </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 font-sans">
                    {/* Cleaning Dashboard */}
                    <section className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden h-fit">
                        <div className="p-6 border-b border-stone-100 bg-stone-50/50">
                            <h2 className="text-xl font-serif font-bold text-stone-800">Estado de Limpieza</h2>
                            <p className="text-xs text-stone-500">Control rápido para el equipo de planta</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-6">
                            {ROOMS.map(room => {
                                const status = cleaningStatus[room.id] || 'dirty';
                                return (
                                    <div
                                        key={room.id}
                                        onClick={() => toggleCleaning(room.id)}
                                        className={`
                                            cursor-pointer p-4 rounded-xl border transition-all flex items-center justify-between group
                                            ${status === 'clean' ? 'bg-green-50 border-green-200' :
                                                status === 'in-progress' ? 'bg-blue-50 border-blue-200' : 'bg-red-50 border-red-200'}
                                        `}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`
                                                w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold
                                                ${status === 'clean' ? 'bg-green-600' :
                                                    status === 'in-progress' ? 'bg-blue-600' : 'bg-red-600'}
                                            `}>
                                                {room.name.split(' ')[1]}
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-tighter">{room.name.split('-')[1].trim()}</p>
                                                <p className={`text-[10px] font-bold uppercase tracking-widest ${status === 'clean' ? 'text-green-700' :
                                                    status === 'in-progress' ? 'text-blue-700' : 'text-red-700'
                                                    }`}>
                                                    {status === 'clean' ? 'Limpia' :
                                                        status === 'in-progress' ? 'Limpiando' : 'Sucia'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* Quick Charges Management */}
                    <section className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden flex flex-col h-[650px]">
                        <div className="p-6 border-b border-stone-100 bg-stone-50/50">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h2 className="text-xl font-serif font-bold text-stone-800">Cargos a Habitación</h2>
                                    <p className="text-xs text-stone-500">Gestión de consumos individuales</p>
                                </div>
                                <button onClick={clearCharges} className="text-stone-300 hover:text-red-600 transition-colors" title="Borrar todo el historial">
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            {/* Filter Section */}
                            <div className="flex gap-2 items-center">
                                <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">Filtrar por Hab:</label>
                                <select
                                    value={selectedRoomFilter}
                                    onChange={e => {
                                        setSelectedRoomFilter(e.target.value);
                                        setNewCharge({ ...newCharge, room: e.target.value });
                                    }}
                                    className={`px-3 py-1.5 border rounded-lg text-sm font-bold outline-none transition-all ${selectedRoomFilter ? 'bg-stone-900 text-white border-stone-900' : 'bg-white text-stone-800 border-stone-200'}`}
                                >
                                    <option value="">Todas</option>
                                    {ROOMS.map(r => <option key={r.id} value={r.name.split(' ')[1]}>{r.name.split(' ')[1]}</option>)}
                                </select>
                                {selectedRoomFilter && (
                                    <button onClick={() => setSelectedRoomFilter('')} className="bg-stone-100 text-stone-400 p-1.5 rounded-lg hover:bg-stone-200">
                                        <X size={14} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Add New Charge Form */}
                        <form onSubmit={addCharge} className="p-4 border-b border-stone-100 bg-stone-50/20 flex flex-wrap gap-2">
                            <select
                                value={newCharge.room}
                                onChange={e => setNewCharge({ ...newCharge, room: e.target.value })}
                                className="w-20 px-2 py-2 border border-stone-200 rounded-lg text-sm bg-white outline-none focus:border-stone-900 font-medium"
                                required
                            >
                                <option value="">Hab.</option>
                                {ROOMS.map(r => <option key={r.id} value={r.name.split(' ')[1]}>{r.name.split(' ')[1]}</option>)}
                            </select>
                            <input
                                type="text"
                                placeholder="Producto"
                                value={newCharge.concept}
                                onChange={e => setNewCharge({ ...newCharge, concept: e.target.value })}
                                className="flex-1 min-w-[120px] px-3 py-2 border border-stone-200 rounded-lg text-sm outline-none focus:border-stone-900"
                                required
                            />
                            <input
                                type="number"
                                placeholder=" Cant."
                                value={newCharge.quantity}
                                onChange={e => setNewCharge({ ...newCharge, quantity: e.target.value })}
                                className="w-16 px-2 py-2 border border-stone-200 rounded-lg text-sm outline-none focus:border-stone-900 font-medium"
                                required
                            />
                            <div className="flex gap-1 items-center">
                                <input
                                    type="number"
                                    step="0.01"
                                    placeholder="Precio"
                                    value={newCharge.unitPrice}
                                    onChange={e => setNewCharge({ ...newCharge, unitPrice: e.target.value })}
                                    className="w-20 px-2 py-2 border border-stone-200 rounded-lg text-sm outline-none focus:border-stone-900 font-medium"
                                    required
                                />
                                <span className="text-stone-400 font-bold">€</span>
                                <button type="submit" className="bg-stone-900 text-white p-2 rounded-lg hover:bg-stone-800 transition-colors shadow-sm">
                                    <Plus size={18} />
                                </button>
                            </div>
                        </form>

                        <div className="flex-grow overflow-y-auto p-6 space-y-3 bg-stone-50/30">
                            {filteredCharges.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-stone-300 space-y-2 opacity-50">
                                    <Coffee size={40} />
                                    <p className="text-sm">{selectedRoomFilter ? `Sin consumos en Hab. ${selectedRoomFilter}` : 'Sin consumos hoy'}</p>
                                </div>
                            ) : (
                                filteredCharges.map((c) => (
                                    <div key={c.id} className="group relative flex items-center justify-between p-3 bg-white rounded-xl border border-stone-100 shadow-sm hover:border-stone-300 transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-stone-900 text-white w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold">
                                                {c.room}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-stone-800">{c.concept}</p>
                                                <p className="text-[10px] text-stone-400 uppercase">
                                                    {c.quantity} x {Number(c.unit_price).toFixed(2)}€ · {c.time}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <p className="font-bold text-stone-900">{Number(c.amount).toFixed(2)}€</p>
                                            <button
                                                onClick={() => c.id && deleteCharge(c.id)}
                                                className="opacity-0 group-hover:opacity-100 transition-opacity text-stone-300 hover:text-red-500 p-1"
                                                title="Eliminar cargo"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className={`p-4 text-white text-center text-xs font-bold uppercase tracking-widest transition-colors ${selectedRoomFilter ? 'bg-wood-700' : 'bg-stone-900'}`}>
                            {selectedRoomFilter ? `Total Habitación ${selectedRoomFilter}: ` : 'Total Todas las Habitaciones: '}
                            <span className="text-base ml-1">{filteredTotal.toFixed(2)}€</span>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};
