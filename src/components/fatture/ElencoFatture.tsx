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
  numero: string;
  data: string;
  paziente: {
    nome: string;
    email: string;
    codiceFiscale: string;
  };
  totale: number;
  stato: 'emessa' | 'pagata' | 'annullata';
}

// =============================================================================
// DATI MOCK (in produzione verranno dal database)
// =============================================================================

const FATTURE_MOCK: Fattura[] = [
  {
    id: '1',
    numero: '1/2026',
    data: '2026-01-05',
    paziente: { nome: 'Mario Rossi', email: 'mario.rossi@email.com', codiceFiscale: 'RSSMRA80A01H501Z' },
    totale: 104.00,
    stato: 'pagata'
  },
  {
    id: '2',
    numero: '2/2026',
    data: '2026-01-08',
    paziente: { nome: 'Giulia Bianchi', email: 'giulia.bianchi@email.com', codiceFiscale: 'BNCGLI85M41H501X' },
    totale: 62.40,
    stato: 'emessa'
  },
  {
    id: '3',
    numero: '3/2026',
    data: '2026-01-10',
    paziente: { nome: 'Luca Verdi', email: 'luca.verdi@email.com', codiceFiscale: 'VRDLCU90B15H501Y' },
    totale: 104.00,
    stato: 'emessa'
  },
];

// =============================================================================
// COMPONENTE PRINCIPALE
// =============================================================================

export function ElencoFatture() {
  const [fatture, setFatture] = useState<Fattura[]>(FATTURE_MOCK);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedFattura, setSelectedFattura] = useState<Fattura | null>(null);

  // Filtra fatture per ricerca
  const fattureFiltrate = fatture.filter(f => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      f.numero.toLowerCase().includes(query) ||
      f.paziente.nome.toLowerCase().includes(query) ||
      f.paziente.email.toLowerCase().includes(query) ||
      f.paziente.codiceFiscale.toLowerCase().includes(query) ||
      f.data.includes(query)
    );
  });

  // Statistiche
  const totaleEmesse = fatture.filter(f => f.stato === 'emessa').length;
  const totalePagate = fatture.filter(f => f.stato === 'pagata').length;
  const totaleImporto = fatture.reduce((sum, f) => sum + f.totale, 0);

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
      {/* Statistiche */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-soft">
          <p className="text-sm text-sage-500">Fatture totali</p>
          <p className="text-2xl font-bold text-sage-800">{fatture.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-soft">
          <p className="text-sm text-sage-500">Da incassare</p>
          <p className="text-2xl font-bold text-amber-600">{totaleEmesse}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-soft">
          <p className="text-sm text-sage-500">Totale incassato</p>
          <p className="text-2xl font-bold text-green-600">€ {totaleImporto.toFixed(2)}</p>
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
                          Fattura n. {fattura.numero}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatoColor(fattura.stato)}`}>
                          {fattura.stato.charAt(0).toUpperCase() + fattura.stato.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-sage-500 mt-1">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {fattura.paziente.nome}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(fattura.data), 'd MMM yyyy', { locale: it })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-lg font-bold text-sage-800">
                      € {fattura.totale.toFixed(2)}
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
                        className="p-2 text-sage-400 hover:text-sage-600 hover:bg-sage-100 rounded-lg transition-colors"
                        title="Modifica"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 text-sage-400 hover:text-sage-600 hover:bg-sage-100 rounded-lg transition-colors"
                        title="Stampa PDF"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                      <button
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
                Fattura n. {selectedFattura.numero}
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
                <p className="font-semibold text-sage-800">{selectedFattura.paziente.nome}</p>
                <p className="text-sm text-sage-600">{selectedFattura.paziente.email}</p>
                <p className="text-sm font-mono text-sage-500">{selectedFattura.paziente.codiceFiscale}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-sage-50 rounded-xl p-4">
                  <p className="text-sm text-sage-500 mb-1">Data</p>
                  <p className="font-semibold text-sage-800">
                    {format(new Date(selectedFattura.data), 'd MMMM yyyy', { locale: it })}
                  </p>
                </div>
                <div className="bg-sage-50 rounded-xl p-4">
                  <p className="text-sm text-sage-500 mb-1">Totale</p>
                  <p className="font-bold text-xl text-sage-800">€ {selectedFattura.totale.toFixed(2)}</p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-xl hover:bg-amber-600">
                  <Printer className="w-4 h-4" />
                  Stampa
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-sage-100 text-sage-700 rounded-xl hover:bg-sage-200">
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
