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

    const fetchData = async () => {
        setIsLoading(true);
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

    useEffect(() => {
        if (!isAuthenticated) return;
        fetchData();

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

        setCleaningStatus({ ...cleaningStatus, [roomId]: next });
        await supabase.from('cleaning_status').upsert({ room_id: roomId, status: next }, { onConflict: 'room_id' });
    };

    const addCharge = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCharge.room || !newCharge.concept || !newCharge.unitPrice) return;

        const q = parseInt(newCharge.quantity) || 1;
        const up = parseFloat(newCharge.unitPrice);
        const amount = q * up;

        setNewCharge({ ...newCharge, concept: '', quantity: '1', unitPrice: '' });
        await supabase.from('room_charges').insert([{
            room: newCharge.room,
            concept: newCharge.concept,
            amount,
            quantity: q,
            unit_price: up
        }]);
    };

    const deleteCharge = async (id: string) => {
        if (confirm('¿Borrar este concepto?')) {
            // Borrado optimista local
            setCharges(prev => prev.filter(c => c.id !== id));

            const { error } = await supabase
                .from('room_charges')
                .delete()
                .eq('id', id);

            if (error) {
                console.error('Error deleting:', error);
                alert('No se ha podido borrar de la base de datos. Verifica el SQL de permisos.');
                fetchData(); // Recargar para volver al estado real
            }
        }
    };

    const clearCharges = async () => {
        if (confirm('¿VACIAR TODO EL HISTORIAL? Esta acción no se puede deshacer.')) {
            setCharges([]);
            const { error } = await supabase
                .from('room_charges')
                .delete()
                .gt('amount', -1); // Truco para borrar todo si la tabla tiene RLS desactivado

            if (error) {
                console.error('Clear error:', error);
                fetchData();
            }
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
                    </div>
                    <form onSubmit={handleLogin} className="space-y-6">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-stone-900"
                            placeholder="Contraseña"
                            required
                        />
                        {error && <p className="text-red-500 text-xs text-center">{error}</p>}
                        <button type="submit" className="w-full bg-stone-900 text-white py-4 rounded-xl font-bold hover:bg-stone-800 transition-all shadow-lg">Entrar</button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-20 bg-stone-50">
            <header className="bg-white border-b border-stone-200 py-6 px-4 mb-8">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-green-100 p-2 rounded-lg"><ShieldCheck className="text-green-700" size={24} /></div>
                        <div>
                            <h1 className="text-xl font-serif font-bold text-stone-900">Panel de Control Interno</h1>
                            <p className="text-xs text-stone-500">Sesión activa</p>
                        </div>
                    </div>
                    <button onClick={onLogout} className="flex items-center gap-2 text-stone-400 hover:text-red-600 font-medium text-sm"><LogOut size={18} /> Salir</button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 pb-20 space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 font-sans">
                    {/* Limpieza */}
                    <section className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden h-fit">
                        <div className="p-6 border-b border-stone-100 bg-stone-50/50">
                            <h2 className="text-xl font-serif font-bold text-stone-800">Estado de Limpieza</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-6">
                            {ROOMS.map(room => {
                                const status = cleaningStatus[room.id] || 'dirty';
                                return (
                                    <div key={room.id} onClick={() => toggleCleaning(room.id)} className={`cursor-pointer p-4 rounded-xl border transition-all flex items-center justify-between group ${status === 'clean' ? 'bg-green-50 border-green-200' : status === 'in-progress' ? 'bg-blue-50 border-blue-200' : 'bg-red-50 border-red-200'}`}>
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold ${status === 'clean' ? 'bg-green-600' : status === 'in-progress' ? 'bg-blue-600' : 'bg-red-600'}`}>{room.name.split(' ')[1]}</div>
                                            <div>
                                                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-tighter">{room.name.split('-')[1].trim()}</p>
                                                <p className={`text-[10px] font-bold uppercase ${status === 'clean' ? 'text-green-700' : status === 'in-progress' ? 'text-blue-700' : 'text-red-700'}`}>{status === 'clean' ? 'Limpia' : status === 'in-progress' ? 'Limpiando' : 'Sucia'}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* Cargos */}
                    <section className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden flex flex-col h-[650px]">
                        <div className="p-6 border-b border-stone-100 bg-stone-50/50">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-serif font-bold text-stone-800">Cargos a Habitación</h2>
                                <button onClick={clearCharges} className="text-stone-300 hover:text-red-500 transition-colors" title="Borrar historial completo"><Trash2 size={18} /></button>
                            </div>
                            <div className="flex gap-2 items-center">
                                <span className="text-xs font-bold text-stone-400 uppercase">Filtrar Hab:</span>
                                <select
                                    value={selectedRoomFilter}
                                    onChange={e => { setSelectedRoomFilter(e.target.value); setNewCharge({ ...newCharge, room: e.target.value }); }}
                                    className={`px-3 py-1.5 border rounded-lg text-sm font-bold outline-none ${selectedRoomFilter ? 'bg-stone-900 text-white' : 'bg-white'}`}
                                >
                                    <option value="">Todas</option>
                                    {ROOMS.map(r => <option key={r.id} value={r.name.split(' ')[1]}>{r.name.split(' ')[1]}</option>)}
                                </select>
                            </div>
                        </div>

                        <form onSubmit={addCharge} className="p-4 border-b border-stone-100 bg-stone-50/20 flex flex-wrap gap-2">
                            <select value={newCharge.room} onChange={e => setNewCharge({ ...newCharge, room: e.target.value })} className="w-20 px-2 py-2 border border-stone-200 rounded-lg text-sm outline-none focus:border-stone-900" required>
                                <option value="">Hab.</option>
                                {ROOMS.map(r => <option key={r.id} value={r.name.split(' ')[1]}>{r.name.split(' ')[1]}</option>)}
                            </select>
                            <input type="text" placeholder="Producto" value={newCharge.concept} onChange={e => setNewCharge({ ...newCharge, concept: e.target.value })} className="flex-1 px-3 py-2 border border-stone-200 rounded-lg text-sm outline-none focus:border-stone-900" required />
                            <input type="number" placeholder="Cant." value={newCharge.quantity} onChange={e => setNewCharge({ ...newCharge, quantity: e.target.value })} className="w-16 px-2 py-2 border border-stone-200 rounded-lg text-sm outline-none focus:border-stone-900" required />
                            <div className="flex gap-1 items-center">
                                <input type="number" step="0.01" placeholder="Precio" value={newCharge.unitPrice} onChange={e => setNewCharge({ ...newCharge, unitPrice: e.target.value })} className="w-20 px-2 py-2 border border-stone-200 rounded-lg text-sm outline-none focus:border-stone-900" required />
                                <span className="text-stone-300">€</span>
                                <button type="submit" className="bg-stone-900 text-white p-2 rounded-lg hover:bg-stone-800 shadow-md"><Plus size={18} /></button>
                            </div>
                        </form>

                        <div className="flex-grow overflow-y-auto p-6 space-y-3 bg-stone-50/30">
                            {filteredCharges.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-stone-300 opacity-50"><Coffee size={40} /><p className="text-sm mt-3">Sin consumos</p></div>
                            ) : (
                                filteredCharges.map((c) => (
                                    <div key={c.id} className="group flex items-center justify-between p-3 bg-white rounded-xl border border-stone-100 shadow-sm hover:border-stone-300 transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-stone-900 text-white w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold">{c.room}</div>
                                            <div>
                                                <p className="text-sm font-bold text-stone-800">{c.concept}</p>
                                                <p className="text-[10px] text-stone-400 uppercase">{c.quantity} x {Number(c.unit_price).toFixed(2)}€ · {c.time}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <p className="font-bold text-stone-900">{Number(c.amount).toFixed(2)}€</p>
                                            <button onClick={() => c.id && deleteCharge(c.id)} className="text-stone-300 hover:text-red-500 p-1 group-hover:opacity-100 opacity-30 transition-all"><X size={16} /></button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className={`p-4 text-white text-center text-xs font-bold uppercase tracking-widest ${selectedRoomFilter ? 'bg-wood-700' : 'bg-stone-900'}`}>
                            {selectedRoomFilter ? `Total Habitación ${selectedRoomFilter}: ` : 'Total General: '}
                            <span className="text-base ml-1">{filteredTotal.toFixed(2)}€</span>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};
