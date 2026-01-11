// =============================================================================
// FATTURE PAZIENTE - DOTT. BERNARDO GIAMMETTA
// Sezione per visualizzare le proprie fatture (solo lettura)
// =============================================================================

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  FileText,
  Printer,
  Download,
  Eye,
  Calendar,
  Loader2,
  X
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
  subtotal: number;
  contributo: number;
  bollo: number;
  total: number;
  status: string;
  paymentMethod: string;
}

// =============================================================================
// COMPONENTE PRINCIPALE
// =============================================================================

export function FatturePaziente() {
  const [fatture, setFatture] = useState<Fattura[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedFattura, setSelectedFattura] = useState<Fattura | null>(null);

  // Carica fatture da API
  useEffect(() => {
    const fetchFatture = async () => {
      try {
        const res = await fetch('/api/user/fatture');
        const data = await res.json();
        if (data.success) {
          setFatture(data.fatture || []);
        }
      } catch (err) {
        console.error('Errore caricamento fatture:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFatture();
  }, []);

  // Filtra fatture per ricerca
  const fattureFiltrate = fatture.filter(f => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase().trim();
    
    const dataObj = new Date(f.invoiceDate);
    const dataIT = format(dataObj, 'dd/MM/yyyy');
    const dataMese = format(dataObj, 'MMMM yyyy', { locale: it }).toLowerCase();
    
    return (
      f.invoiceNumber.toLowerCase().includes(query) ||
      dataIT.includes(query) ||
      dataMese.includes(query) ||
      f.total.toString().includes(query)
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

  // Prepara dati per PDF (paziente non ha accesso ai propri dati completi via fattura)
  const preparaDatiPDF = (fattura: Fattura): DatiFatturaPDF => ({
    numeroFattura: fattura.invoiceNumber,
    dataFattura: fattura.invoiceDate,
    paziente: {
      nome: 'Paziente', // I dati paziente non sono inclusi nella fattura per privacy
    },
    prestazioni: [{
      descrizione: 'Prestazione sanitaria',
      importo: fattura.subtotal
    }],
    imponibile: fattura.subtotal,
    contributoENPAB: fattura.contributo,
    marcaDaBollo: fattura.bollo,
    totale: fattura.total,
    metodoPagamento: fattura.paymentMethod,
    stato: fattura.status
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-soft">
        <h1 className="text-2xl font-bold text-sage-800 mb-2">Le Mie Fatture</h1>
        <p className="text-sage-600">Visualizza e stampa le tue fatture</p>
      </div>

      {/* Barra ricerca */}
      <div className="bg-white rounded-2xl p-4 shadow-soft">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sage-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cerca per numero, data, importo..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-sage-200 focus:border-sage-400 focus:ring-2 focus:ring-sage-100 outline-none"
          />
        </div>
      </div>

      {/* Lista fatture */}
      <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
        <div className="p-4 border-b border-sage-100">
          <h2 className="font-semibold text-sage-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-lavender-500" />
            Fatture ({fattureFiltrate.length})
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
            <p className="text-sage-600">
              {searchQuery ? 'Nessuna fattura trovata' : 'Non hai ancora fatture'}
            </p>
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
                          {fattura.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-sage-500 mt-1">
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
                        onClick={() => stampaPDF(preparaDatiPDF(fattura))}
                        className="p-2 text-sage-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                        title="Stampa"
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
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modal visualizzazione/stampa fattura */}
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
            <div id="fattura-paziente-print" className="bg-white border border-sage-200 rounded-xl p-6 mb-4">
              {/* Header fattura */}
              <div className="mb-6">
                <p className="font-bold">Dott. Bernardo Giammetta</p>
                <p className="text-sm text-sage-600">Biologo Nutrizionista</p>
                <p className="text-sm text-sage-600">Via Daniele Manin n°10, 40129 Bologna</p>
                <p className="text-sm text-sage-600">P.IVA: 02712040811</p>
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
                    <td className="text-right">€ {selectedFattura.subtotal.toFixed(2)}</td>
                  </tr>
                  <tr className="border-b border-sage-200">
                    <td className="py-2 text-sage-600">Contributo integrativo Enpab 4.0%</td>
                    <td className="text-right text-sage-600">€ {selectedFattura.contributo.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>

              {/* Totali */}
              <div className="space-y-1 mb-4">
                <div className="flex justify-between">
                  <span>Imponibile:</span>
                  <span>€ {(selectedFattura.subtotal + selectedFattura.contributo).toFixed(2)}</span>
                </div>
                {selectedFattura.bollo > 0 && (
                  <div className="flex justify-between border-t border-sage-200 pt-1">
                    <span>MARCA DA BOLLO:</span>
                    <span>€ {selectedFattura.bollo.toFixed(2)}</span>
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

            {/* Azioni */}
            <div className="flex gap-3">
              <button 
                onClick={() => {
                  const printContent = document.getElementById('fattura-paziente-print');
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
                onClick={() => setSelectedFattura(null)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-sage-100 text-sage-700 rounded-xl hover:bg-sage-200"
              >
                Chiudi
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
