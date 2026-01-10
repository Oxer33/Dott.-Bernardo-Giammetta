// =============================================================================
// NUOVA FATTURA - DOTT. BERNARDO GIAMMETTA
// Form per creazione nuova fattura con ricerca paziente e calcoli automatici
// Basato su Autofatturazione STS
// =============================================================================

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  User,
  FileText,
  Calculator,
  Printer,
  Save,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

// =============================================================================
// TIPI
// =============================================================================

interface Paziente {
  id: string;
  firstName: string | null;
  lastName: string | null;
  name: string | null;
  email: string;
  phone: string | null;
  codiceFiscale: string | null;
  birthPlace: string | null;
  address: string | null;
  addressNumber: string | null;
  city: string | null;
  cap: string | null;
}

interface NaturaSpesa {
  id: string;
  descrizione: string;
  importo: number;
}

interface RigaFattura {
  id: string;
  descrizione: string;
  importo: number;
}

// =============================================================================
// NATURE SPESA PREDEFINITE
// =============================================================================

const NATURE_SPESA_DEFAULT: NaturaSpesa[] = [
  { id: '1', descrizione: 'Prima visita nutrizionale', importo: 100 },
  { id: '2', descrizione: 'Visita di controllo', importo: 60 },
  { id: '3', descrizione: 'Elaborazione piano alimentare', importo: 80 },
  { id: '4', descrizione: 'Consulenza nutrizionale online', importo: 50 },
];

// =============================================================================
// COMPONENTE PRINCIPALE
// =============================================================================

export function NuovaFattura() {
  // State paziente
  const [searchQuery, setSearchQuery] = useState('');
  const [pazienti, setPazienti] = useState<Paziente[]>([]);
  const [selectedPaziente, setSelectedPaziente] = useState<Paziente | null>(null);
  const [loadingPazienti, setLoadingPazienti] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // State fattura
  const [numeroFattura, setNumeroFattura] = useState('');
  const [dataFattura, setDataFattura] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [righe, setRighe] = useState<RigaFattura[]>([]);
  const [natureSalvate, setNatureSalvate] = useState<NaturaSpesa[]>(NATURE_SPESA_DEFAULT);
  
  // State nuova natura spesa
  const [showNuovaNatura, setShowNuovaNatura] = useState(false);
  const [nuovaDescrizione, setNuovaDescrizione] = useState('');
  const [nuovoImporto, setNuovoImporto] = useState('');

  // State UI
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Calcoli automatici
  const totaleImponibile = righe.reduce((sum, r) => sum + r.importo, 0);
  const contributoENPAB = totaleImponibile * 0.04; // 4% ENPAB
  const totaleLordo = totaleImponibile + contributoENPAB;
  const marcaDaBollo = totaleLordo > 77.47 ? 2 : 0; // Marca da bollo se > 77.47€
  const totaleFinale = totaleLordo + marcaDaBollo;

  // Ricerca pazienti con debounce
  useEffect(() => {
    if (searchQuery.length < 2) {
      setPazienti([]);
      setShowResults(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoadingPazienti(true);
      try {
        const res = await fetch(`/api/admin/patients?search=${encodeURIComponent(searchQuery)}&filter=all`);
        const data = await res.json();
        if (data.success) {
          setPazienti(data.patients || []);
          setShowResults(true);
        }
      } catch (err) {
        console.error('Errore ricerca pazienti:', err);
      } finally {
        setLoadingPazienti(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Genera numero fattura progressivo
  useEffect(() => {
    const anno = new Date().getFullYear();
    // In produzione questo dovrebbe essere calcolato dal database
    const progressivo = Math.floor(Math.random() * 1000) + 1;
    setNumeroFattura(`${progressivo}/${anno}`);
  }, []);

  // Seleziona paziente
  const handleSelectPaziente = (p: Paziente) => {
    setSelectedPaziente(p);
    setSearchQuery('');
    setShowResults(false);
  };

  // Aggiungi riga da natura spesa
  const handleAddRiga = (natura: NaturaSpesa) => {
    setRighe(prev => [...prev, {
      id: `${Date.now()}`,
      descrizione: natura.descrizione,
      importo: natura.importo
    }]);
  };

  // Rimuovi riga
  const handleRemoveRiga = (id: string) => {
    setRighe(prev => prev.filter(r => r.id !== id));
  };

  // Salva nuova natura spesa
  const handleSaveNuovaNatura = () => {
    if (!nuovaDescrizione || !nuovoImporto) return;
    
    const nuova: NaturaSpesa = {
      id: `custom-${Date.now()}`,
      descrizione: nuovaDescrizione,
      importo: parseFloat(nuovoImporto)
    };
    
    setNatureSalvate(prev => [...prev, nuova]);
    setNuovaDescrizione('');
    setNuovoImporto('');
    setShowNuovaNatura(false);
  };

  // Salva fattura
  const handleSalvaFattura = async () => {
    if (!selectedPaziente || righe.length === 0) {
      setError('Seleziona un paziente e aggiungi almeno una prestazione');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      // TODO: Implementare API salvataggio fattura
      // const res = await fetch('/api/fatture', { ... });
      
      // Simulazione successo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess('Fattura salvata con successo!');
      // Reset form
      setSelectedPaziente(null);
      setRighe([]);
      
    } catch (err) {
      setError('Errore nel salvataggio della fattura');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Messaggi */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-red-700">{error}</span>
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <span className="text-green-700">{success}</span>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Colonna sinistra: Ricerca paziente e dati fattura */}
        <div className="space-y-6">
          {/* Ricerca paziente */}
          <div className="bg-white rounded-2xl p-6 shadow-soft">
            <h2 className="text-lg font-semibold text-sage-800 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-lavender-500" />
              Paziente
            </h2>

            {selectedPaziente ? (
              <div className="bg-sage-50 rounded-xl p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-sage-800">
                      {selectedPaziente.firstName && selectedPaziente.lastName
                        ? `${selectedPaziente.firstName} ${selectedPaziente.lastName}`
                        : selectedPaziente.name || 'Nome non specificato'}
                    </p>
                    <p className="text-sm text-sage-600">{selectedPaziente.email}</p>
                    {selectedPaziente.codiceFiscale && (
                      <p className="text-sm text-sage-500 font-mono">{selectedPaziente.codiceFiscale}</p>
                    )}
                    {selectedPaziente.address && (
                      <p className="text-sm text-sage-500 mt-1">
                        {selectedPaziente.address} {selectedPaziente.addressNumber}, {selectedPaziente.cap} {selectedPaziente.city}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedPaziente(null)}
                    className="text-sage-400 hover:text-sage-600"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sage-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cerca paziente (nome, email, telefono...)"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-sage-200 focus:border-sage-400 focus:ring-2 focus:ring-sage-100 outline-none"
                />
                
                {/* Risultati ricerca */}
                {showResults && (
                  <div className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-lg border border-sage-200 max-h-60 overflow-y-auto">
                    {loadingPazienti ? (
                      <div className="p-4 text-center">
                        <Loader2 className="w-5 h-5 text-sage-400 animate-spin mx-auto" />
                      </div>
                    ) : pazienti.length === 0 ? (
                      <div className="p-4 text-center text-sage-500">
                        Nessun paziente trovato
                      </div>
                    ) : (
                      pazienti.map(p => (
                        <button
                          key={p.id}
                          onClick={() => handleSelectPaziente(p)}
                          className="w-full p-3 text-left hover:bg-sage-50 transition-colors border-b border-sage-100 last:border-0"
                        >
                          <p className="font-medium text-sage-800">
                            {p.firstName && p.lastName ? `${p.firstName} ${p.lastName}` : p.name || p.email}
                          </p>
                          <p className="text-sm text-sage-500">{p.email}</p>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Dati fattura */}
          <div className="bg-white rounded-2xl p-6 shadow-soft">
            <h2 className="text-lg font-semibold text-sage-800 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-lavender-500" />
              Dati Fattura
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-sage-700 mb-2">
                  Numero Fattura
                </label>
                <input
                  type="text"
                  value={numeroFattura}
                  onChange={(e) => setNumeroFattura(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-sage-200 focus:border-sage-400 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-sage-700 mb-2">
                  Data Fattura
                </label>
                <input
                  type="date"
                  value={dataFattura}
                  onChange={(e) => setDataFattura(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-sage-200 focus:border-sage-400 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Nature di spesa */}
          <div className="bg-white rounded-2xl p-6 shadow-soft">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-sage-800 flex items-center gap-2">
                <Plus className="w-5 h-5 text-lavender-500" />
                Aggiungi Prestazione
              </h2>
              <button
                onClick={() => setShowNuovaNatura(!showNuovaNatura)}
                className="text-sm text-lavender-600 hover:text-lavender-800"
              >
                + Nuova natura spesa
              </button>
            </div>

            {/* Form nuova natura */}
            {showNuovaNatura && (
              <div className="bg-lavender-50 rounded-xl p-4 mb-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <input
                      type="text"
                      value={nuovaDescrizione}
                      onChange={(e) => setNuovaDescrizione(e.target.value)}
                      placeholder="Descrizione prestazione"
                      className="w-full px-3 py-2 rounded-lg border border-lavender-200 text-sm"
                    />
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={nuovoImporto}
                      onChange={(e) => setNuovoImporto(e.target.value)}
                      placeholder="€"
                      className="w-full px-3 py-2 rounded-lg border border-lavender-200 text-sm"
                    />
                    <button
                      onClick={handleSaveNuovaNatura}
                      className="px-3 py-2 bg-lavender-500 text-white rounded-lg text-sm hover:bg-lavender-600"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Lista nature salvate */}
            <div className="space-y-2">
              {natureSalvate.map(natura => (
                <button
                  key={natura.id}
                  onClick={() => handleAddRiga(natura)}
                  className="w-full flex justify-between items-center p-3 bg-sage-50 rounded-xl hover:bg-sage-100 transition-colors text-left"
                >
                  <span className="text-sage-700">{natura.descrizione}</span>
                  <span className="font-semibold text-sage-800">€ {natura.importo.toFixed(2)}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Colonna destra: Riepilogo fattura */}
        <div className="space-y-6">
          {/* Righe fattura */}
          <div className="bg-white rounded-2xl p-6 shadow-soft">
            <h2 className="text-lg font-semibold text-sage-800 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-lavender-500" />
              Righe Fattura
            </h2>

            {righe.length === 0 ? (
              <p className="text-sage-500 text-center py-8">
                Clicca su una prestazione per aggiungerla alla fattura
              </p>
            ) : (
              <div className="space-y-2">
                {righe.map(riga => (
                  <div
                    key={riga.id}
                    className="flex justify-between items-center p-3 bg-sage-50 rounded-xl"
                  >
                    <span className="text-sage-700">{riga.descrizione}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-sage-800">€ {riga.importo.toFixed(2)}</span>
                      <button
                        onClick={() => handleRemoveRiga(riga.id)}
                        className="p-1 text-red-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Calcoli */}
          <div className="bg-white rounded-2xl p-6 shadow-soft">
            <h2 className="text-lg font-semibold text-sage-800 mb-4 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-lavender-500" />
              Riepilogo Importi
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between text-sage-600">
                <span>Imponibile</span>
                <span>€ {totaleImponibile.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sage-600">
                <span>Contributo ENPAB (4%)</span>
                <span>€ {contributoENPAB.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sage-600">
                <span>Totale lordo</span>
                <span>€ {totaleLordo.toFixed(2)}</span>
              </div>
              {marcaDaBollo > 0 && (
                <div className="flex justify-between text-amber-600">
                  <span>Marca da bollo (oltre €77,47)</span>
                  <span>€ {marcaDaBollo.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-sage-200 pt-3 mt-3">
                <div className="flex justify-between text-lg font-bold text-sage-800">
                  <span>TOTALE FATTURA</span>
                  <span>€ {totaleFinale.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Azioni */}
          <div className="flex gap-3">
            <button
              onClick={handleSalvaFattura}
              disabled={saving || !selectedPaziente || righe.length === 0}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-xl font-medium hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              Salva Fattura
            </button>
            <button
              disabled={!selectedPaziente || righe.length === 0}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-sage-100 text-sage-700 rounded-xl font-medium hover:bg-sage-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Printer className="w-5 h-5" />
              Stampa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
