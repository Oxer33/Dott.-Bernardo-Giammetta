// =============================================================================
// ELENCO FATTURE - DOTT. BERNARDO GIAMMETTA
// Lista fatture con ricerca, modifica e stampa
// =============================================================================

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  FileText,
  Printer,
  Download,
  Edit,
  Eye,
  Calendar,
  User,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

// =============================================================================
// TIPI
// =============================================================================

interface Fattura {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  user: {
    firstName: string | null;
    lastName: string | null;
    name: string | null;
    email: string;
    codiceFiscale: string | null;
  };
  total: number;
  status: string;
}

interface Stats {
  totale: number;
  emesse: number;
  pagate: number;
  settimana: { count: number; total: number };
  mese: { count: number; total: number };
  anno: { count: number; total: number };
  incassato: number;
}

// Helper per formattare nome paziente
const getNomePaziente = (user: Fattura['user']) => {
  if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`;
  return user.name || user.email;
};

// =============================================================================
// COMPONENTE PRINCIPALE
// =============================================================================

export function ElencoFatture() {
  const [fatture, setFatture] = useState<Fattura[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedFattura, setSelectedFattura] = useState<Fattura | null>(null);
  const [editingFattura, setEditingFattura] = useState<Fattura | null>(null);

  // Carica fatture da API
  useEffect(() => {
    const fetchFatture = async () => {
      try {
        const res = await fetch('/api/fatture');
        const data = await res.json();
        if (data.success) {
          setFatture(data.fatture || []);
          setStats(data.stats || null);
        }
      } catch (err) {
        console.error('Errore caricamento fatture:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFatture();
  }, []);

  // Filtra fatture per ricerca (supporta formati data multipli)
  const fattureFiltrate = fatture.filter(f => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase().trim();
    const nomePaziente = getNomePaziente(f.user).toLowerCase();
    
    // Formatta data in vari modi per ricerca
    const dataObj = new Date(f.invoiceDate);
    const dataISO = f.invoiceDate.toLowerCase();
    const dataIT = format(dataObj, 'dd/MM/yyyy');
    const dataITShort = format(dataObj, 'd/M/yyyy');
    const dataMese = format(dataObj, 'MMMM yyyy', { locale: it }).toLowerCase();
    const dataGiorno = format(dataObj, 'd MMMM yyyy', { locale: it }).toLowerCase();
    
    return (
      f.invoiceNumber.toLowerCase().includes(query) ||
      nomePaziente.includes(query) ||
      f.user.email.toLowerCase().includes(query) ||
      (f.user.codiceFiscale || '').toLowerCase().includes(query) ||
      dataISO.includes(query) ||
      dataIT.includes(query) ||
      dataITShort.includes(query) ||
      dataMese.includes(query) ||
      dataGiorno.includes(query)
    );
  });

  // Colore stato
  const getStatoColor = (stato: string) => {
    switch (stato) {
      case 'pagata': return 'bg-green-100 text-green-700';
      case 'emessa': return 'bg-amber-100 text-amber-700';
      case 'annullata': return 'bg-red-100 text-red-700';
      default: return 'bg-sage-100 text-sage-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Statistiche per periodo */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-soft">
          <p className="text-xs text-sage-500 uppercase tracking-wide">Questa settimana</p>
          <p className="text-xl font-bold text-sage-800">{stats?.settimana.count || 0}</p>
          <p className="text-sm text-green-600 font-medium">€ {(stats?.settimana.total || 0).toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-soft">
          <p className="text-xs text-sage-500 uppercase tracking-wide">Questo mese</p>
          <p className="text-xl font-bold text-sage-800">{stats?.mese.count || 0}</p>
          <p className="text-sm text-green-600 font-medium">€ {(stats?.mese.total || 0).toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-soft">
          <p className="text-xs text-sage-500 uppercase tracking-wide">Quest'anno</p>
          <p className="text-xl font-bold text-sage-800">{stats?.anno.count || 0}</p>
          <p className="text-sm text-green-600 font-medium">€ {(stats?.anno.total || 0).toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-soft">
          <p className="text-xs text-sage-500 uppercase tracking-wide">Da incassare</p>
          <p className="text-xl font-bold text-amber-600">{stats?.emesse || 0}</p>
          <p className="text-sm text-sage-500">su {stats?.totale || 0} totali</p>
        </div>
      </div>

      {/* Barra ricerca */}
      <div className="bg-white rounded-2xl p-6 shadow-soft">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sage-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cerca fattura (numero, paziente, email, codice fiscale, data...)"
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-sage-200 focus:border-sage-400 focus:ring-2 focus:ring-sage-100 outline-none"
          />
        </div>
      </div>

      {/* Lista fatture */}
      <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
        <div className="p-4 border-b border-sage-100">
          <h2 className="font-semibold text-sage-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-lavender-500" />
            Elenco Fatture ({fattureFiltrate.length})
          </h2>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <Loader2 className="w-8 h-8 text-sage-400 animate-spin mx-auto mb-2" />
            <p className="text-sage-600">Caricamento fatture...</p>
          </div>
        ) : fattureFiltrate.length === 0 ? (
          <div className="p-8 text-center">
            <FileText className="w-12 h-12 text-sage-300 mx-auto mb-2" />
            <p className="text-sage-600">Nessuna fattura trovata</p>
          </div>
        ) : (
          <div className="divide-y divide-sage-100">
            {fattureFiltrate.map((fattura, index) => (
              <motion.div
                key={fattura.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 hover:bg-sage-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sage-800">
                          Fattura n. {fattura.invoiceNumber}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatoColor(fattura.status)}`}>
                          {fattura.status.charAt(0).toUpperCase() + fattura.status.slice(1).toLowerCase()}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-sage-500 mt-1">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {getNomePaziente(fattura.user)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(fattura.invoiceDate), 'd MMM yyyy', { locale: it })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-lg font-bold text-sage-800">
                      € {fattura.total.toFixed(2)}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setSelectedFattura(fattura)}
                        className="p-2 text-sage-400 hover:text-sage-600 hover:bg-sage-100 rounded-lg transition-colors"
                        title="Visualizza"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingFattura(fattura)}
                        className="p-2 text-sage-400 hover:text-sage-600 hover:bg-sage-100 rounded-lg transition-colors"
                        title="Modifica stato"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => window.print()}
                        className="p-2 text-sage-400 hover:text-sage-600 hover:bg-sage-100 rounded-lg transition-colors"
                        title="Stampa"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => alert('Generazione PDF in sviluppo')}
                        className="p-2 text-sage-400 hover:text-sage-600 hover:bg-sage-100 rounded-lg transition-colors"
                        title="Scarica PDF"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modal dettaglio fattura */}
      {selectedFattura && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-sage-900">
                Fattura n. {selectedFattura.invoiceNumber}
              </h3>
              <button
                onClick={() => setSelectedFattura(null)}
                className="p-2 hover:bg-sage-100 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-sage-50 rounded-xl p-4">
                <p className="text-sm text-sage-500 mb-1">Paziente</p>
                <p className="font-semibold text-sage-800">{getNomePaziente(selectedFattura.user)}</p>
                <p className="text-sm text-sage-600">{selectedFattura.user.email}</p>
                <p className="text-sm font-mono text-sage-500">{selectedFattura.user.codiceFiscale || 'N/D'}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-sage-50 rounded-xl p-4">
                  <p className="text-sm text-sage-500 mb-1">Data</p>
                  <p className="font-semibold text-sage-800">
                    {format(new Date(selectedFattura.invoiceDate), 'd MMMM yyyy', { locale: it })}
                  </p>
                </div>
                <div className="bg-sage-50 rounded-xl p-4">
                  <p className="text-sm text-sage-500 mb-1">Totale</p>
                  <p className="font-bold text-xl text-sage-800">€ {selectedFattura.total.toFixed(2)}</p>
                </div>
              </div>

              <div className="bg-sage-50 rounded-xl p-4">
                <p className="text-sm text-sage-500 mb-1">Stato</p>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatoColor(selectedFattura.status)}`}>
                  {selectedFattura.status}
                </span>
              </div>

              <div className="flex gap-3 mt-6">
                <button 
                  onClick={() => window.print()}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-xl hover:bg-amber-600"
                >
                  <Printer className="w-4 h-4" />
                  Stampa
                </button>
                <button 
                  onClick={() => alert('Generazione PDF in sviluppo')}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-sage-100 text-sage-700 rounded-xl hover:bg-sage-200"
                >
                  <Download className="w-4 h-4" />
                  Scarica PDF
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
