import React, { useState, useEffect } from 'react';
import { Lock, LogOut, CheckCircle, RefreshCcw, ExternalLink, ShieldCheck, AlertTriangle, Trash2, Plus, Coffee, X } from 'lucide-react';
import { ROOMS } from '../constants';
import { supabase } from '../supabase';

interface StaffAreaProps {
    onLogout: () => void;
}

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
        const { data: chargesData, error: chargesErr } = await supabase
            .from('room_charges')
            .select('*')
            .order('created_at', { ascending: false });

        if (chargesErr) console.error('Error fetching charges:', chargesErr);
        if (chargesData) {
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

        const { data: cleaningData, error: cleanErr } = await supabase.from('cleaning_status').select('*');
        if (cleanErr) console.error('Error fetching cleaning:', cleanErr);
        if (cleaningData) {
            const statusMap: any = {};
            cleaningData.forEach(item => statusMap[item.room_id] = item.status);
            setCleaningStatus(statusMap);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        if (!isAuthenticated) return;
        fetchData();

        const channel = supabase
            .channel('db-changes')
            .on('postgres_changes', { event: '*', table: 'room_charges' }, () => fetchData())
            .on('postgres_changes', { event: '*', table: 'cleaning_status' }, () => fetchData())
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [isAuthenticated]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === STAFF_PASSWORD) { setIsAuthenticated(true); setError(''); }
        else { setError('Contraseña incorrecta'); setPassword(''); }
    };

    const toggleCleaning = async (roomId: string) => {
        const current = cleaningStatus[roomId] || 'dirty';
        const next = current === 'dirty' ? 'in-progress' : current === 'in-progress' ? 'clean' : 'dirty';
        setCleaningStatus({ ...cleaningStatus, [roomId]: next });
        const { error } = await supabase.from('cleaning_status').upsert({ room_id: roomId, status: next }, { onConflict: 'room_id' });
        if (error) alert('Error limpieza: ' + error.message);
    };

    const addCharge = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCharge.room || !newCharge.concept || !newCharge.unitPrice) return;

        // Capturamos los valores ACTUALES para que no se pierdan al limpiar el form
        const currentConcept = newCharge.concept;
        const currentRoom = newCharge.room;
        const currentQty = parseInt(newCharge.quantity) || 1;
        const currentPrice = parseFloat(newCharge.unitPrice);
        const total = currentQty * currentPrice;

        const { error } = await supabase.from('room_charges').insert([{
            room: currentRoom,
            concept: currentConcept,
            amount: total,
            quantity: currentQty,
            unit_price: currentPrice
        }]);

        if (error) {
            alert('❌ ERROR AL AÑADIR: ' + error.message + '\nCódigo: ' + error.code);
        } else {
            setNewCharge({ ...newCharge, concept: '', quantity: '1', unitPrice: '' });
            fetchData();
        }
    };

    const deleteCharge = async (id: string) => {
        if (!id) return;
        if (confirm('¿Seguro que quieres borrar este concepto?')) {
            const { error } = await supabase.from('room_charges').delete().eq('id', id);
            if (error) {
                alert('❌ ERROR AL BORRAR: ' + error.message + '\nCódigo: ' + error.code);
            } else {
                fetchData();
            }
        }
    };

    const clearCharges = async () => {
        if (confirm('¿VACIAR TODO EL HISTORIAL?')) {
            const { error } = await supabase.from('room_charges').delete().neq('room', 'NONE');
            if (error) alert('Error al vaciar: ' + error.message);
            else fetchData();
        }
    };

    const filteredCharges = selectedRoomFilter ? charges.filter(c => c.room === selectedRoomFilter) : charges;
    const filteredTotal = filteredCharges.reduce((acc, curr) => acc + Number(curr.amount), 0);

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen pt-20 bg-stone-100 flex items-center justify-center px-4 font-sans">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 border border-stone-200">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-serif font-bold text-stone-900">Personal Tamaya</h1>
                    </div>
                    <form onSubmit={handleLogin} className="space-y-6">
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl outline-none" placeholder="Contraseña staff" required />
                        {error && <p className="text-red-500 text-xs text-center">{error}</p>}
                        <button type="submit" className="w-full bg-stone-900 text-white py-4 rounded-xl font-bold hover:bg-stone-800 transition-all shadow-lg">Entrar</button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-20 bg-stone-50 font-sans">
            <header className="bg-white border-b border-stone-200 py-4 px-4 mb-6">
                <div className="max-w-7xl mx-auto flex justify-between items-center text-sm font-bold uppercase tracking-widest text-stone-400">
                    <span>Panel de Control</span>
                    <button onClick={onLogout} className="flex items-center gap-2 hover:text-red-600 transition-colors"><LogOut size={16} /> Salir</button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Limpieza */}
                <section className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden h-fit">
                    <div className="p-5 border-b border-stone-100"><h2 className="font-serif font-bold">Estado de Habitaciones</h2></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-4">
                        {ROOMS.map(room => {
                            const status = cleaningStatus[room.id] || 'dirty';
                            return (
                                <div key={room.id} onClick={() => toggleCleaning(room.id)} className={`cursor-pointer p-3 rounded-xl border flex items-center gap-3 ${status === 'clean' ? 'bg-green-50 border-green-200' : status === 'in-progress' ? 'bg-blue-50 border-blue-200' : 'bg-red-50 border-red-200'}`}>
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold ${status === 'clean' ? 'bg-green-600' : status === 'in-progress' ? 'bg-blue-600' : 'bg-red-600'}`}>{room.name.split(' ')[1]}</div>
                                    <span className={`text-[10px] font-bold uppercase ${status === 'clean' ? 'text-green-700' : status === 'in-progress' ? 'text-blue-700' : 'text-red-700'}`}>{status === 'clean' ? 'Limpia' : status === 'in-progress' ? 'Limpiando' : 'Sucia'}</span>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Cargos */}
                <section className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden flex flex-col h-[600px]">
                    <div className="p-5 border-b border-stone-100 flex justify-between items-center">
                        <h2 className="font-serif font-bold">Cargos a Habitación</h2>
                        <button onClick={clearCharges} className="text-stone-300 hover:text-red-500"><Trash2 size={18} /></button>
                    </div>

                    <div className="p-4 bg-stone-50 border-b border-stone-100 flex gap-2">
                        <select value={selectedRoomFilter} onChange={e => setSelectedRoomFilter(e.target.value)} className="text-xs font-bold p-1 rounded border">
                            <option value="">Filtro: Todas</option>
                            {ROOMS.map(r => <option key={r.id} value={r.name.split(' ')[1]}>{r.name.split(' ')[1]}</option>)}
                        </select>
                    </div>

                    <form onSubmit={addCharge} className="p-4 flex flex-wrap gap-2 border-b border-stone-100">
                        <select value={newCharge.room} onChange={e => setNewCharge({ ...newCharge, room: e.target.value })} className="flex-1 p-2 border rounded text-xs" required>
                            <option value="">Hab.</option>
                            {ROOMS.map(r => <option key={r.id} value={r.name.split(' ')[1]}>{r.name.split(' ')[1]}</option>)}
                        </select>
                        <input type="text" placeholder="Concepto" value={newCharge.concept} onChange={e => setNewCharge({ ...newCharge, concept: e.target.value })} className="flex-[2] p-2 border rounded text-xs" required />
                        <input type="number" placeholder="Cant." value={newCharge.quantity} onChange={e => setNewCharge({ ...newCharge, quantity: e.target.value })} className="w-12 p-2 border rounded text-xs" required />
                        <input type="number" step="0.01" placeholder="Precio" value={newCharge.unitPrice} onChange={e => setNewCharge({ ...newCharge, unitPrice: e.target.value })} className="w-16 p-2 border rounded text-xs" required />
                        <button type="submit" className="bg-stone-900 text-white px-3 py-2 rounded"><Plus size={16} /></button>
                    </form>

                    <div className="flex-grow overflow-y-auto p-4 space-y-2">
                        {filteredCharges.map((c) => (
                            <div key={c.id} className="flex items-center justify-between p-3 bg-white border rounded-xl group">
                                <div className="flex items-center gap-3">
                                    <div className="bg-stone-900 text-white w-7 h-7 rounded flex items-center justify-center text-[10px] font-bold">{c.room}</div>
                                    <div className="text-xs">
                                        <p className="font-bold">{c.concept}</p>
                                        <p className="text-[9px] text-stone-400">{c.quantity} u. x {Number(c.unit_price).toFixed(2)}€</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="font-bold text-xs">{Number(c.amount).toFixed(2)}€</span>
                                    <button onClick={() => c.id && deleteCharge(c.id)} className="text-stone-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><X size={14} /></button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-4 bg-stone-900 text-white text-center text-xs font-bold font-serif italic text-base">
                        Total: {filteredTotal.toFixed(2)}€
                    </div>
                </section>
            </main>
        </div>
    );
};
