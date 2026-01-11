// =============================================================================
// GENERATORE PDF FATTURE PROFESSIONALI
// Genera PDF in stile professionale per fatture sanitarie
// =============================================================================

// Dati del dottore (configurabili)
export const DATI_DOTTORE = {
  nome: 'Dott. Bernardo Giammetta',
  professione: 'Biologo Nutrizionista',
  indirizzo: 'Via Example 123',
  cap: '00000',
  citta: 'Roma',
  provincia: 'RM',
  codiceFiscale: 'XXXXXXXXXXXXXXXX',
  partitaIva: 'XXXXXXXXXXX',
  telefono: '000 0000000',
  email: 'info@example.com',
  alboNumero: '000000',
  alboSezione: 'A',
};

// Interfaccia dati fattura per PDF
export interface DatiFatturaPDF {
  numeroFattura: string;
  dataFattura: string;
  paziente: {
    nome: string;
    codiceFiscale?: string;
    indirizzo?: string;
    cap?: string;
    citta?: string;
  };
  prestazioni: Array<{
    descrizione: string;
    importo: number;
  }>;
  imponibile: number;
  contributoENPAB: number;
  marcaDaBollo: number;
  totale: number;
  metodoPagamento: string;
  stato: string;
}

// Converte codice metodo pagamento in testo
export function getMetodoPagamentoText(codice: string): string {
  switch (codice) {
    case 'MP01': return 'Contanti';
    case 'MP05': return 'Bonifico Bancario';
    case 'MP08': return 'POS (Carta)';
    default: return codice;
  }
}

// Formatta data in italiano
export function formatDataItaliana(data: string | Date): string {
  const d = new Date(data);
  return d.toLocaleDateString('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

// Genera HTML per stampa/PDF fattura professionale
export function generaHTMLFattura(dati: DatiFatturaPDF): string {
  const metodoPagamentoText = getMetodoPagamentoText(dati.metodoPagamento);
  
  return `
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <title>Fattura ${dati.numeroFattura}</title>
  <style>
    @page {
      size: A4;
      margin: 15mm;
    }
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.4;
      color: #333;
      background: white;
    }
    .invoice-container {
      max-width: 210mm;
      margin: 0 auto;
      padding: 10mm;
    }
    
    /* Header */
    .header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 2px solid #2c5530;
    }
    .doctor-info {
      flex: 1;
    }
    .doctor-name {
      font-size: 18pt;
      font-weight: bold;
      color: #2c5530;
      margin-bottom: 5px;
    }
    .doctor-profession {
      font-size: 12pt;
      color: #666;
      margin-bottom: 10px;
    }
    .doctor-details {
      font-size: 9pt;
      color: #555;
      line-height: 1.6;
    }
    .invoice-title {
      text-align: right;
    }
    .invoice-title h1 {
      font-size: 24pt;
      color: #2c5530;
      margin-bottom: 10px;
    }
    .invoice-number {
      font-size: 14pt;
      font-weight: bold;
      color: #333;
    }
    .invoice-date {
      font-size: 11pt;
      color: #666;
      margin-top: 5px;
    }
    
    /* Patient info */
    .patient-section {
      margin: 20px 0;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 8px;
    }
    .patient-section h3 {
      font-size: 10pt;
      color: #666;
      text-transform: uppercase;
      margin-bottom: 10px;
    }
    .patient-name {
      font-size: 14pt;
      font-weight: bold;
      color: #333;
      margin-bottom: 5px;
    }
    .patient-details {
      font-size: 10pt;
      color: #555;
    }
    
    /* Items table */
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    .items-table th {
      background: #2c5530;
      color: white;
      padding: 12px 15px;
      text-align: left;
      font-size: 10pt;
      text-transform: uppercase;
    }
    .items-table th:last-child {
      text-align: right;
    }
    .items-table td {
      padding: 12px 15px;
      border-bottom: 1px solid #eee;
    }
    .items-table td:last-child {
      text-align: right;
      font-weight: 500;
    }
    .items-table tr:nth-child(even) {
      background: #f8f9fa;
    }
    
    /* Totals */
    .totals-section {
      margin-top: 20px;
      display: flex;
      justify-content: flex-end;
    }
    .totals-box {
      width: 300px;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #eee;
    }
    .total-row.enpab {
      font-size: 9pt;
      color: #666;
    }
    .total-row.final {
      border-top: 2px solid #2c5530;
      border-bottom: none;
      padding-top: 12px;
      margin-top: 5px;
    }
    .total-row.final .label,
    .total-row.final .value {
      font-size: 14pt;
      font-weight: bold;
      color: #2c5530;
    }
    
    /* Payment info */
    .payment-info {
      margin-top: 20px;
      padding: 15px;
      background: #e8f5e9;
      border-radius: 8px;
      display: flex;
      justify-content: space-between;
    }
    .payment-method,
    .payment-status {
      font-size: 10pt;
    }
    .payment-method strong,
    .payment-status strong {
      color: #2c5530;
    }
    
    /* Footer */
    .footer {
      position: fixed;
      bottom: 15mm;
      left: 15mm;
      right: 15mm;
      text-align: center;
      font-size: 8pt;
      color: #666;
      padding-top: 10px;
      border-top: 1px solid #ddd;
    }
    .legal-note {
      margin-bottom: 5px;
      font-style: italic;
    }
    
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .footer { position: fixed; }
    }
  </style>
</head>
<body>
  <div class="invoice-container">
    <!-- Header -->
    <div class="header">
      <div class="doctor-info">
        <div class="doctor-name">${DATI_DOTTORE.nome}</div>
        <div class="doctor-profession">${DATI_DOTTORE.professione}</div>
        <div class="doctor-details">
          ${DATI_DOTTORE.indirizzo}<br>
          ${DATI_DOTTORE.cap} ${DATI_DOTTORE.citta} (${DATI_DOTTORE.provincia})<br>
          C.F.: ${DATI_DOTTORE.codiceFiscale}<br>
          P.IVA: ${DATI_DOTTORE.partitaIva}<br>
          Tel: ${DATI_DOTTORE.telefono} | Email: ${DATI_DOTTORE.email}<br>
          Albo n. ${DATI_DOTTORE.alboNumero} - Sez. ${DATI_DOTTORE.alboSezione}
        </div>
      </div>
      <div class="invoice-title">
        <h1>FATTURA</h1>
        <div class="invoice-number">N. ${dati.numeroFattura}</div>
        <div class="invoice-date">Data: ${formatDataItaliana(dati.dataFattura)}</div>
      </div>
    </div>
    
    <!-- Patient -->
    <div class="patient-section">
      <h3>Intestatario Fattura</h3>
      <div class="patient-name">${dati.paziente.nome}</div>
      <div class="patient-details">
        ${dati.paziente.codiceFiscale ? `C.F.: ${dati.paziente.codiceFiscale}<br>` : ''}
        ${dati.paziente.indirizzo ? `${dati.paziente.indirizzo}<br>` : ''}
        ${dati.paziente.cap && dati.paziente.citta ? `${dati.paziente.cap} ${dati.paziente.citta}` : ''}
      </div>
    </div>
    
    <!-- Items -->
    <table class="items-table">
      <thead>
        <tr>
          <th>Descrizione Prestazione</th>
          <th>Importo</th>
        </tr>
      </thead>
      <tbody>
        ${dati.prestazioni.map(p => `
          <tr>
            <td>${p.descrizione}</td>
            <td>€ ${p.importo.toFixed(2)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    
    <!-- Totals -->
    <div class="totals-section">
      <div class="totals-box">
        <div class="total-row">
          <span class="label">Imponibile</span>
          <span class="value">€ ${dati.imponibile.toFixed(2)}</span>
        </div>
        <div class="total-row enpab">
          <span class="label">Contributo integrativo Enpab 4.0%<br>(art.8, comma 3, Dlgs 103/96)</span>
          <span class="value">€ ${dati.contributoENPAB.toFixed(2)}</span>
        </div>
        ${dati.marcaDaBollo > 0 ? `
          <div class="total-row">
            <span class="label">Marca da bollo</span>
            <span class="value">€ ${dati.marcaDaBollo.toFixed(2)}</span>
          </div>
        ` : ''}
        <div class="total-row final">
          <span class="label">TOTALE</span>
          <span class="value">€ ${dati.totale.toFixed(2)}</span>
        </div>
      </div>
    </div>
    
    <!-- Payment -->
    <div class="payment-info">
      <div class="payment-method">
        <strong>Metodo di pagamento:</strong> ${metodoPagamentoText}
      </div>
      <div class="payment-status">
        <strong>Stato:</strong> ${dati.stato === 'PAGATA' ? 'PAGATA' : 'DA PAGARE'}
      </div>
    </div>
    
    <!-- Footer -->
    <div class="footer">
      <div class="legal-note">
        Operazione effettuata in franchigia d'iva e ritenuta d'acconto ai sensi dell'art.1 comma 67 della legge 23 dicembre 2014 n.190
      </div>
      <div>
        ${DATI_DOTTORE.nome} - ${DATI_DOTTORE.professione}
      </div>
    </div>
  </div>
</body>
</html>
`;
}

// Apre finestra di stampa con PDF professionale
export function stampaPDF(dati: DatiFatturaPDF): void {
  const html = generaHTMLFattura(dati);
  const printWindow = window.open('', '_blank');
  
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    
    // Aspetta che il contenuto sia caricato prima di stampare
    printWindow.onload = () => {
      printWindow.print();
    };
  }
}

// Scarica PDF direttamente (download automatico senza aprire nuova scheda)
// Usa html2canvas + jsPDF per generare il PDF
export async function scaricaPDF(dati: DatiFatturaPDF): Promise<void> {
  const html = generaHTMLFattura(dati);
  
  // Crea un iframe nascosto per renderizzare l'HTML
  const iframe = document.createElement('iframe');
  iframe.style.position = 'absolute';
  iframe.style.left = '-9999px';
  iframe.style.top = '-9999px';
  iframe.style.width = '210mm';
  iframe.style.height = '297mm';
  document.body.appendChild(iframe);
  
  const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!iframeDoc) {
    document.body.removeChild(iframe);
    return;
  }
  
  iframeDoc.open();
  iframeDoc.write(html);
  iframeDoc.close();
  
  // Aspetta che il contenuto sia caricato
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Usa la funzione print-to-PDF del browser con download automatico
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(`
      <html>
      <head>
        <title>Fattura_${dati.numeroFattura.replace('/', '-')}</title>
        <script>
          window.onload = function() {
            document.title = 'Fattura_${dati.numeroFattura.replace('/', '-')}';
            window.print();
            // Chiudi dopo la stampa
            window.onafterprint = function() { window.close(); };
          };
        </script>
      </head>
      <body>
        ${iframeDoc.body.innerHTML}
        <style>${Array.from(iframeDoc.querySelectorAll('style')).map(s => s.innerHTML).join('')}</style>
      </body>
      </html>
    `);
    printWindow.document.close();
  }
  
  document.body.removeChild(iframe);
}

// Scarica PDF con nome file specifico (numero fattura)
export function scaricaPDFConNome(dati: DatiFatturaPDF, nomeFile?: string): void {
  const html = generaHTMLFattura(dati);
  const fileName = nomeFile || `Fattura_${dati.numeroFattura.replace('/', '-')}`;
  
  // Crea blob HTML e scarica
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  
  // Apri finestra per stampa come PDF
  const printWindow = window.open(url, '_blank');
  if (printWindow) {
    printWindow.document.title = fileName;
    printWindow.onload = () => {
      printWindow.document.title = fileName;
      printWindow.print();
    };
  }
  
  URL.revokeObjectURL(url);
}
