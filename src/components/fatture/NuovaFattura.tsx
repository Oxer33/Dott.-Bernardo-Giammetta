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
// NATURE SPESA - Nessun preset, l'utente le aggiunge manualmente
// =============================================================================

const NATURE_SPESA_DEFAULT: NaturaSpesa[] = [];

// =============================================================================
// FUNZIONI CALCOLO FATTURA
// Il prezzo selezionato INCLUDE già bollo e contributo ENPAB
// Esempio: 100€ = imponibile ~94.23 + contributo 4% ~3.77 + bollo 2€
// =============================================================================

function calcolaScorporoFattura(totaleConBollo: number) {
  // Se il totale è <= 77.47€, non c'è bollo
  // Altrimenti, togliamo 2€ di bollo e poi scorporiamo il 4%
  
  let bollo = 0;
  let totaleConContributo = totaleConBollo;
  
  // Verifica se c'è bollo (soglia 77.47€ sul lordo senza bollo)
  // Dobbiamo iterare perché il bollo dipende dal totale lordo che dipende dal bollo
  // Semplificazione: se totale > 79.47€ (77.47 + 2), c'è sicuramente bollo
  if (totaleConBollo > 79.47) {
    bollo = 2;
    totaleConContributo = totaleConBollo - bollo;
  }
  
  // Scorporo contributo ENPAB 4%: imponibile = totale / 1.04
  const imponibile = totaleConContributo / 1.04;
  const contributo = totaleConContributo - imponibile;
  
  return {
    imponibile: Math.round(imponibile * 100) / 100,
    contributo: Math.round(contributo * 100) / 100,
    bollo,
    totale: totaleConBollo
  };
}

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

  // Calcoli automatici - il prezzo selezionato INCLUDE già bollo e contributo
  const totaleSelezionato = righe.reduce((sum, r) => sum + r.importo, 0);
  const calcoli = calcolaScorporoFattura(totaleSelezionato);
  const { imponibile: totaleImponibile, contributo: contributoENPAB, bollo: marcaDaBollo, totale: totaleFinale } = calcoli;

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

  // Carica nature spesa dal server
  useEffect(() => {
    const fetchExpenseTypes = async () => {
      try {
        const res = await fetch('/api/fatture/expense-types');
        const data = await res.json();
        if (data.success && data.expenseTypes?.length > 0) {
          setNatureSalvate(data.expenseTypes.map((e: { id: string; description: string; defaultAmount: number }) => ({
            id: e.id,
            descrizione: e.description,
            importo: e.defaultAmount
          })));
        }
      } catch (err) {
        console.error('Errore caricamento nature spesa:', err);
        // Usa default se API non disponibile
      }
    };
    fetchExpenseTypes();
  }, []);

  // Genera numero fattura progressivo dal database
  useEffect(() => {
    const fetchNextInvoiceNumber = async () => {
      try {
        const res = await fetch('/api/fatture/next-number');
        const data = await res.json();
        if (data.success) {
          setNumeroFattura(data.nextNumber);
        } else {
          // Fallback
          const anno = new Date().getFullYear();
          setNumeroFattura(`1/${anno}`);
        }
      } catch (err) {
        // Fallback
        const anno = new Date().getFullYear();
        setNumeroFattura(`1/${anno}`);
      }
    };
    fetchNextInvoiceNumber();
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

  // Salva nuova natura spesa (anche su server)
  const handleSaveNuovaNatura = async () => {
    if (!nuovaDescrizione || !nuovoImporto) return;
    
    try {
      const res = await fetch('/api/fatture/expense-types', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: nuovaDescrizione,
          defaultAmount: parseFloat(nuovoImporto)
        })
      });
      const data = await res.json();
      
      if (data.success) {
        setNatureSalvate(prev => [...prev, {
          id: data.expenseType.id,
          descrizione: data.expenseType.description,
          importo: data.expenseType.defaultAmount
        }]);
      } else {
        // Fallback locale
        setNatureSalvate(prev => [...prev, {
          id: `local-${Date.now()}`,
          descrizione: nuovaDescrizione,
          importo: parseFloat(nuovoImporto)
        }]);
      }
    } catch (err) {
      // Fallback locale
      setNatureSalvate(prev => [...prev, {
        id: `local-${Date.now()}`,
        descrizione: nuovaDescrizione,
        importo: parseFloat(nuovoImporto)
      }]);
    }
    
    setNuovaDescrizione('');
    setNuovoImporto('');
    setShowNuovaNatura(false);
  };

  // Elimina natura spesa
  const handleDeleteNatura = async (id: string) => {
    // Non eliminare le nature predefinite
    if (id.startsWith('default-')) return;
    
    try {
      await fetch(`/api/fatture/expense-types?id=${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Errore eliminazione natura:', err);
    }
    
    setNatureSalvate(prev => prev.filter(n => n.id !== id));
  };

  // Salva fattura
  const handleSalvaFattura = async () => {
    if (!selectedPaziente || righe.length === 0) {
      setError('Seleziona un paziente e aggiungi almeno una prestazione');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch('/api/fatture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedPaziente.id,
          invoiceDate: dataFattura,
          invoiceNumber: numeroFattura,
          items: righe.map(r => ({
            description: r.descrizione,
            amount: r.importo
          })),
          paymentMethod: 'MP05',
          status: 'EMESSA'
        })
      });
      
      const data = await res.json();
      
      if (data.success) {
        setSuccess(`Fattura n. ${data.fattura.invoiceNumber} salvata con successo!`);
        // Reset form
        setSelectedPaziente(null);
        setRighe([]);
        // Rigenera numero fattura
        const anno = new Date().getFullYear();
        const match = data.fattura.invoiceNumber.match(/^(\d+)\//);
        if (match) {
          setNumeroFattura(`${parseInt(match[1]) + 1}/${anno}`);
        }
      } else {
        setError(data.error || 'Errore nel salvataggio della fattura');
      }
    } catch (err) {
      setError('Errore di connessione al server');
    } finally {
      setSaving(false);
    }
  };

  // Stampa fattura (genera PDF)
  const handleStampa = async () => {
    if (!selectedPaziente || righe.length === 0) {
      setError('Seleziona un paziente e aggiungi almeno una prestazione');
      return;
    }
    
    // Per ora apre una finestra di stampa del browser
    // TODO: Implementare generazione PDF professionale
    window.print();
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
                <div
                  key={natura.id}
                  className="flex items-center gap-2"
                >
                  <button
                    onClick={() => handleAddRiga(natura)}
                    className="flex-1 flex justify-between items-center p-3 bg-sage-50 rounded-xl hover:bg-sage-100 transition-colors text-left"
                  >
                    <span className="text-sage-700">{natura.descrizione}</span>
                    <span className="font-semibold text-sage-800">€ {natura.importo.toFixed(2)}</span>
                  </button>
                  {/* Bottone elimina (solo per nature non predefinite) */}
                  {!natura.id.startsWith('default-') && (
                    <button
                      onClick={() => handleDeleteNatura(natura.id)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Elimina natura spesa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
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
                <span>Imponibile (prestazione)</span>
                <span>€ {totaleImponibile.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sage-600">
                <span>Contributo ENPAB 4%</span>
                <span>€ {contributoENPAB.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sage-600">
                <span>Subtotale</span>
                <span>€ {(totaleImponibile + contributoENPAB).toFixed(2)}</span>
              </div>
              {marcaDaBollo > 0 && (
                <div className="flex justify-between text-sage-600">
                  <span>Marca da bollo</span>
                  <span>€ {marcaDaBollo.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-sage-200 pt-3 mt-3">
                <div className="flex justify-between text-lg font-bold text-green-700">
                  <span>TOTALE FATTURA</span>
                  <span>€ {totaleFinale.toFixed(2)}</span>
                </div>
                <p className="text-xs text-sage-500 mt-1">
                  (bollo e contributo già inclusi nel prezzo)
                </p>
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
              onClick={handleStampa}
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
