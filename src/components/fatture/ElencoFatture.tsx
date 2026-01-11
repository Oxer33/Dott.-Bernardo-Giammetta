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
  AlertCircle,
  Trash2,
  X,
  Save,
  CheckCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { stampaPDF, scaricaPDF, DatiFatturaPDF } from '@/lib/invoice-pdf';

// =============================================================================
// TIPI
// =============================================================================

interface Fattura {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  user: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    name: string | null;
    email: string;
    codiceFiscale: string | null;
    birthDate: string | null;
    birthPlace: string | null;
    address: string | null;
    addressNumber: string | null;
    city: string | null;
    cap: string | null;
  };
  subtotal: number;
  contributo: number;
  bollo: number;
  total: number;
  status: string;
  paymentMethod: string;
  description?: string;
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

// Helper per preparare dati PDF
const preparaDatiPDF = (fattura: Fattura): DatiFatturaPDF => ({
  numeroFattura: fattura.invoiceNumber,
  dataFattura: fattura.invoiceDate,
  paziente: {
    nome: getNomePaziente(fattura.user),
    codiceFiscale: fattura.user.codiceFiscale || undefined,
    indirizzo: fattura.user.address 
      ? `${fattura.user.address} ${fattura.user.addressNumber || ''}`
      : undefined,
    cap: fattura.user.cap || undefined,
    citta: fattura.user.city || undefined,
  },
  prestazioni: [{
    descrizione: fattura.description || 'Prestazione sanitaria',
    importo: fattura.subtotal
  }],
  imponibile: fattura.subtotal,
  contributoENPAB: fattura.contributo,
  marcaDaBollo: fattura.bollo,
  totale: fattura.total,
  metodoPagamento: fattura.paymentMethod,
  stato: fattura.status
});

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
  const [deletingId, setDeletingId] = useState<string | null>(null);
  // Stati per modifica fattura completa
  const [editStatus, setEditStatus] = useState('');
  const [editPayment, setEditPayment] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editNumber, setEditNumber] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editSubtotal, setEditSubtotal] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // Stati per nature di spesa nel modal modifica
  const [natureSalvate, setNatureSalvate] = useState<{id: string; descrizione: string; importo: number}[]>([]);
  const [showNuovaNatura, setShowNuovaNatura] = useState(false);
  const [nuovaDescrizione, setNuovaDescrizione] = useState('');
  const [nuovoImporto, setNuovoImporto] = useState('');

  // Ricarica fatture
  const reloadFatture = async () => {
    try {
      const res = await fetch('/api/fatture');
      const data = await res.json();
      if (data.success) {
        setFatture(data.fatture || []);
        setStats(data.stats || null);
      }
    } catch (err) {
      console.error('Errore caricamento fatture:', err);
    }
  };

  // Elimina fattura
  const handleDelete = async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questa fattura? L\'azione \u00e8 irreversibile.')) return;
    
    try {
      const res = await fetch(`/api/fatture/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Fattura eliminata' });
        reloadFatture();
      } else {
        setMessage({ type: 'error', text: data.error || 'Errore eliminazione' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Errore di connessione' });
    }
    setDeletingId(null);
  };

  // Salva modifiche fattura (tutti i campi)
  const handleSaveEdit = async () => {
    if (!editingFattura) return;
    setSaving(true);
    
    // Calcola nuovi totali se l'importo è cambiato
    const nuovoSubtotal = parseFloat(editSubtotal) || editingFattura.subtotal;
    const nuovoContributo = Math.round((nuovoSubtotal * 0.04) * 100) / 100;
    const nuovoTotaleLordo = nuovoSubtotal + nuovoContributo;
    const nuovoBollo = nuovoTotaleLordo > 77.47 ? 2 : 0;
    const nuovoTotale = nuovoTotaleLordo + nuovoBollo;
    
    try {
      const res = await fetch(`/api/fatture/${editingFattura.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: editStatus,
          paymentMethod: editPayment,
          invoiceDate: editDate,
          invoiceNumber: editNumber,
          description: editDescription,
          subtotal: nuovoSubtotal,
          contributo: nuovoContributo,
          bollo: nuovoBollo,
          total: nuovoTotale
        })
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Fattura aggiornata' });
        setEditingFattura(null);
        reloadFatture();
      } else {
        setMessage({ type: 'error', text: data.error || 'Errore salvataggio' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Errore di connessione' });
    }
    setSaving(false);
  };

  // Apri modal modifica con tutti i campi
  const openEditModal = (fattura: Fattura) => {
    setEditingFattura(fattura);
    setEditStatus(fattura.status);
    setEditPayment(fattura.paymentMethod || 'MP05');
    setEditDate(fattura.invoiceDate.split('T')[0]);
    setEditNumber(fattura.invoiceNumber);
    setEditDescription(fattura.description || 'Prestazione sanitaria');
    setEditSubtotal(fattura.subtotal.toFixed(2));
  };

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

  // Carica nature spesa da API
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
      }
    };
    fetchExpenseTypes();
  }, []);

  // Salva nuova natura spesa
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
      }
    } catch (err) {
      console.error('Errore salvataggio natura:', err);
    }
    
    setNuovaDescrizione('');
    setNuovoImporto('');
    setShowNuovaNatura(false);
  };

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
    switch (stato.toUpperCase()) {
      case 'PAGATA': return 'bg-green-100 text-green-700';
      case 'EMESSA': return 'bg-amber-100 text-amber-700';
      case 'ANNULLATA': return 'bg-red-100 text-red-700';
      default: return 'bg-sage-100 text-sage-700';
    }
  };

  // Metodo pagamento label
  const getPaymentLabel = (code: string) => {
    switch (code) {
      case 'MP01': return 'Contanti';
      case 'MP05': return 'Bonifico';
      case 'MP08': return 'POS (Carta)';
      default: return code;
    }
  };

  // Nascondi messaggio dopo 3 secondi
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

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
                        onClick={() => openEditModal(fattura)}
                        className="p-2 text-sage-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Modifica fattura"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => stampaPDF(preparaDatiPDF(fattura))}
                        className="p-2 text-sage-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                        title="Stampa PDF"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => scaricaPDF(preparaDatiPDF(fattura))}
                        className="p-2 text-sage-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Scarica PDF"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(fattura.id)}
                        className="p-2 text-sage-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Elimina fattura"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Messaggio feedback */}
      {message && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 ${
          message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {message.text}
        </div>
      )}

      {/* Modal dettaglio/stampa fattura */}
      {selectedFattura && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-sage-900">
                Fattura n. {selectedFattura.invoiceNumber}
              </h3>
              <button
                onClick={() => setSelectedFattura(null)}
                className="p-2 hover:bg-sage-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Anteprima PDF-style */}
            <div id="fattura-print" className="bg-white border border-sage-200 rounded-xl p-6 mb-4">
              {/* Header fattura */}
              <div className="grid grid-cols-2 gap-8 mb-6">
                <div>
                  <p className="font-bold">Dott. Bernardo Giammetta</p>
                  <p className="text-sm text-sage-600">Biologo Nutrizionista</p>
                  <p className="text-sm text-sage-600">Via Daniele Manin n°10</p>
                  <p className="text-sm text-sage-600">40129 Bologna</p>
                  <p className="text-sm text-sage-600">P.IVA: 02712040811</p>
                  <p className="text-sm text-sage-600">Cell: +39 3920979135</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{getNomePaziente(selectedFattura.user)}</p>
                  <p className="text-sm text-sage-600">{selectedFattura.user.email}</p>
                  <p className="text-sm font-mono text-sage-500">CF: {selectedFattura.user.codiceFiscale || 'N/D'}</p>
                </div>
              </div>

              {/* Numero e data */}
              <div className="mb-6">
                <p className="font-bold text-lg">Fattura n. {selectedFattura.invoiceNumber}</p>
                <p className="text-sage-600">del {format(new Date(selectedFattura.invoiceDate), 'd/MM/yyyy')}</p>
              </div>

              {/* Tabella importi */}
              <table className="w-full mb-4">
                <thead>
                  <tr className="border-b-2 border-sage-300">
                    <th className="text-left py-2">Descrizione</th>
                    <th className="text-right py-2">Importo</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-sage-200">
                    <td className="py-2">Prestazione sanitaria</td>
                    <td className="text-right">€ {selectedFattura.subtotal?.toFixed(2) || '0.00'}</td>
                  </tr>
                  <tr className="border-b border-sage-200">
                    <td className="py-2 text-sage-600">Contributo integrativo Enpab 4.0%</td>
                    <td className="text-right text-sage-600">€ {selectedFattura.contributo?.toFixed(2) || '0.00'}</td>
                  </tr>
                </tbody>
              </table>

              {/* Totali */}
              <div className="space-y-1 mb-4">
                <div className="flex justify-between">
                  <span>Imponibile:</span>
                  <span>€ {((selectedFattura.subtotal || 0) + (selectedFattura.contributo || 0)).toFixed(2)}</span>
                </div>
                {(selectedFattura.bollo || 0) > 0 && (
                  <div className="flex justify-between border-t border-sage-200 pt-1">
                    <span>MARCA DA BOLLO:</span>
                    <span>€ {selectedFattura.bollo?.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg border-t-2 border-sage-300 pt-2">
                  <span>TOTALE FATTURA:</span>
                  <span>€ {selectedFattura.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Metodo pagamento */}
              <p className="text-sm mt-4">
                <strong>Fattura pagata tramite {getPaymentLabel(selectedFattura.paymentMethod)}</strong>
              </p>

              {/* Note legali */}
              <div className="text-xs text-sage-500 mt-6 pt-4 border-t border-sage-200">
                <p>Operazione effettuata in franchigia d'iva e ritenuta d'acconto ai sensi dell'art.1 comma 67 della legge 23 dicembre 2014 n.190</p>
                <p>Bollo assolto sull'originale ove dovuto</p>
              </div>
            </div>

            {/* Stato */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sage-600">Stato:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatoColor(selectedFattura.status)}`}>
                {selectedFattura.status}
              </span>
            </div>

            {/* Azioni */}
            <div className="flex gap-3">
              <button 
                onClick={() => {
                  const printContent = document.getElementById('fattura-print');
                  if (printContent) {
                    const printWindow = window.open('', '_blank');
                    if (printWindow) {
                      printWindow.document.write(`
                        <html>
                          <head>
                            <title>Fattura ${selectedFattura.invoiceNumber}</title>
                            <style>
                              body { font-family: Arial, sans-serif; padding: 40px; }
                              table { width: 100%; border-collapse: collapse; }
                              th, td { padding: 8px; text-align: left; }
                              th { border-bottom: 2px solid #333; }
                              td { border-bottom: 1px solid #ddd; }
                              .text-right { text-align: right; }
                            </style>
                          </head>
                          <body>${printContent.innerHTML}</body>
                        </html>
                      `);
                      printWindow.document.close();
                      printWindow.print();
                    }
                  }
                }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-xl hover:bg-amber-600"
              >
                <Printer className="w-4 h-4" />
                Stampa
              </button>
              <button 
                onClick={() => {
                  if (selectedFattura) {
                    scaricaPDF(preparaDatiPDF(selectedFattura));
                  }
                }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600"
              >
                <Download className="w-4 h-4" />
                Scarica PDF
              </button>
              <button 
                onClick={() => setSelectedFattura(null)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-sage-100 text-sage-700 rounded-xl hover:bg-sage-200"
              >
                Chiudi
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal modifica fattura COMPLETO */}
      {editingFattura && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-sage-900">
                Modifica Fattura Completa
              </h3>
              <button
                onClick={() => setEditingFattura(null)}
                className="p-2 hover:bg-sage-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Info paziente (readonly) */}
              <div className="bg-sage-50 rounded-xl p-4">
                <p className="text-sm text-sage-500 mb-1">Paziente (non modificabile)</p>
                <p className="font-semibold text-sage-800">{getNomePaziente(editingFattura.user)}</p>
                <p className="text-sm text-sage-600">{editingFattura.user.email}</p>
              </div>

              {/* Numero e Data fattura (modificabili) */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-sage-700 mb-2">Numero Fattura</label>
                  <input
                    type="text"
                    value={editNumber}
                    onChange={(e) => setEditNumber(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-sage-200 focus:border-sage-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-sage-700 mb-2">Data Fattura</label>
                  <input
                    type="date"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-sage-200 focus:border-sage-400 outline-none"
                  />
                </div>
              </div>

              {/* Nature di spesa disponibili */}
              <div>
                <label className="block text-sm font-medium text-sage-700 mb-2">
                  Seleziona Prestazione (con bollo e ENPAB già inclusi)
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                  {natureSalvate.map(natura => (
                    <button
                      key={natura.id}
                      type="button"
                      onClick={() => {
                        setEditDescription(natura.descrizione);
                        setEditSubtotal(natura.importo.toFixed(2));
                      }}
                      className={`p-2 text-left rounded-lg border transition-colors text-sm ${
                        editDescription === natura.descrizione 
                          ? 'bg-lavender-100 border-lavender-400' 
                          : 'bg-sage-50 border-sage-200 hover:border-sage-400'
                      }`}
                    >
                      <span className="font-medium">{natura.descrizione}</span>
                      <span className="text-sage-500 ml-2">€{natura.importo}</span>
                    </button>
                  ))}
                </div>
                
                {/* Aggiungi nuova natura */}
                {!showNuovaNatura ? (
                  <button
                    type="button"
                    onClick={() => setShowNuovaNatura(true)}
                    className="mt-2 text-sm text-lavender-600 hover:text-lavender-700"
                  >
                    + Aggiungi nuova prestazione
                  </button>
                ) : (
                  <div className="mt-2 p-3 bg-sage-50 rounded-xl space-y-2">
                    <input
                      type="text"
                      value={nuovaDescrizione}
                      onChange={(e) => setNuovaDescrizione(e.target.value)}
                      placeholder="Descrizione prestazione"
                      className="w-full px-3 py-2 rounded-lg border border-sage-200 text-sm"
                    />
                    <div className="flex gap-2">
                      <input
                        type="number"
                        step="0.01"
                        value={nuovoImporto}
                        onChange={(e) => setNuovoImporto(e.target.value)}
                        placeholder="Importo €"
                        className="flex-1 px-3 py-2 rounded-lg border border-sage-200 text-sm"
                      />
                      <button
                        type="button"
                        onClick={handleSaveNuovaNatura}
                        className="px-3 py-2 bg-lavender-500 text-white rounded-lg text-sm"
                      >
                        Salva
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowNuovaNatura(false)}
                        className="px-3 py-2 bg-sage-200 rounded-lg text-sm"
                      >
                        Annulla
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Descrizione prestazione (modificabile) */}
              <div>
                <label className="block text-sm font-medium text-sage-700 mb-2">Descrizione Prestazione</label>
                <input
                  type="text"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Es: Prima visita nutrizionale"
                  className="w-full px-4 py-2 rounded-xl border border-sage-200 focus:border-sage-400 outline-none"
                />
              </div>

              {/* Importo (modificabile) */}
              <div>
                <label className="block text-sm font-medium text-sage-700 mb-2">Importo Totale (€) - già inclusivo di bollo e ENPAB</label>
                <input
                  type="number"
                  step="0.01"
                  value={editSubtotal}
                  onChange={(e) => setEditSubtotal(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-sage-200 focus:border-sage-400 outline-none"
                />
                <p className="text-xs text-sage-500 mt-1">
                  Contributo ENPAB 4% e bollo verranno scorporati automaticamente
                </p>
              </div>

              {/* Stato e Metodo pagamento */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-sage-700 mb-2">Stato fattura</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-sage-200 focus:border-sage-400 outline-none bg-white"
                  >
                    <option value="EMESSA">Emessa</option>
                    <option value="PAGATA">Pagata</option>
                    <option value="ANNULLATA">Annullata</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-sage-700 mb-2">Metodo pagamento</label>
                  <select
                    value={editPayment}
                    onChange={(e) => setEditPayment(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-sage-200 focus:border-sage-400 outline-none bg-white"
                  >
                    <option value="MP08">POS (Carta)</option>
                    <option value="MP05">Bonifico</option>
                    <option value="MP01">Contanti</option>
                  </select>
                </div>
              </div>

              {/* Anteprima totali calcolati */}
              {editSubtotal && (
                <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                  <p className="text-sm font-medium text-green-800 mb-2">Anteprima Totali:</p>
                  <div className="text-sm text-green-700 space-y-1">
                    <div className="flex justify-between">
                      <span>Imponibile:</span>
                      <span>€ {parseFloat(editSubtotal).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Contributo ENPAB 4%:</span>
                      <span>€ {(parseFloat(editSubtotal) * 0.04).toFixed(2)}</span>
                    </div>
                    {(parseFloat(editSubtotal) * 1.04) > 77.47 && (
                      <div className="flex justify-between">
                        <span>Marca da bollo:</span>
                        <span>€ 2.00</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold pt-2 border-t border-green-300">
                      <span>TOTALE:</span>
                      <span>€ {((parseFloat(editSubtotal) * 1.04) + ((parseFloat(editSubtotal) * 1.04) > 77.47 ? 2 : 0)).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Azioni */}
              <div className="flex gap-3 mt-6">
                <button 
                  onClick={handleSaveEdit}
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-xl hover:bg-amber-600 disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Salva modifiche
                </button>
                <button 
                  onClick={() => setEditingFattura(null)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-sage-100 text-sage-700 rounded-xl hover:bg-sage-200"
                >
                  Annulla
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Bottone Modifica dati fatturazione */}
      <div className="mt-8 pt-6 border-t border-sage-200">
        <button
          onClick={() => window.location.href = '/profilo'}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-lavender-500 to-lavender-600 text-white rounded-2xl font-semibold text-lg hover:from-lavender-600 hover:to-lavender-700 transition-all shadow-lg hover:shadow-xl"
        >
          <Edit className="w-6 h-6" />
          Modifica i miei dati di fatturazione
        </button>
      </div>
    </div>
  );
}
