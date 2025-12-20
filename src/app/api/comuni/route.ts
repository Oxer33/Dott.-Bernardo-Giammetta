// =============================================================================
// API COMUNI ITALIANI - DOTT. BERNARDO GIAMMETTA
// Endpoint per ricerca comuni con codice catastale per calcolo CF
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import comuniData from '../../../../public/data/comuni.json';

// =============================================================================
// TIPI
// =============================================================================

interface ComuneRaw {
  sigla_provincia: string;
  codice_istat: string;
  denominazione_ita: string;
  denominazione_ita_altra: string;
  codice_belfiore: string;
  flag_capoluogo: string;
}

interface ComuneResponse {
  nome: string;
  provincia: string;
  codiceCatastale: string;
  capoluogo: boolean;
}

// =============================================================================
// CACHE DEI COMUNI (caricato una volta)
// =============================================================================

const comuni: ComuneResponse[] = (comuniData as ComuneRaw[]).map(c => ({
  nome: c.denominazione_ita,
  provincia: c.sigla_provincia,
  codiceCatastale: c.codice_belfiore,
  capoluogo: c.flag_capoluogo === 'SI'
}));

// =============================================================================
// GET - Ricerca comuni
// =============================================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.toLowerCase() || '';
    const provincia = searchParams.get('provincia')?.toUpperCase();
    const limit = parseInt(searchParams.get('limit') || '20');
    
    // Se nessuna query, ritorna errore
    if (!query && !provincia) {
      return NextResponse.json({
        success: false,
        error: 'Specificare parametro q (query) o provincia'
      }, { status: 400 });
    }
    
    // Filtra comuni
    let risultati = comuni;
    
    // Filtro per query (nome comune)
    if (query && query.length >= 2) {
      risultati = risultati.filter(c => 
        c.nome.toLowerCase().includes(query) ||
        c.nome.toLowerCase().startsWith(query)
      );
      
      // Ordina: prima quelli che iniziano con la query
      risultati.sort((a, b) => {
        const aStarts = a.nome.toLowerCase().startsWith(query);
        const bStarts = b.nome.toLowerCase().startsWith(query);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        return a.nome.localeCompare(b.nome);
      });
    }
    
    // Filtro per provincia
    if (provincia) {
      risultati = risultati.filter(c => c.provincia === provincia);
    }
    
    // Limita risultati
    risultati = risultati.slice(0, limit);
    
    return NextResponse.json({
      success: true,
      count: risultati.length,
      comuni: risultati
    });
    
  } catch (error) {
    console.error('Errore API comuni:', error);
    return NextResponse.json({
      success: false,
      error: 'Errore nella ricerca comuni'
    }, { status: 500 });
  }
}

// =============================================================================
// POST - Trova comune per codice catastale
// =============================================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { codiceCatastale, nome } = body;
    
    let comune: ComuneResponse | undefined;
    
    // Cerca per codice catastale
    if (codiceCatastale) {
      comune = comuni.find(c => 
        c.codiceCatastale.toUpperCase() === codiceCatastale.toUpperCase()
      );
    }
    
    // Cerca per nome esatto
    if (!comune && nome) {
      comune = comuni.find(c => 
        c.nome.toLowerCase() === nome.toLowerCase()
      );
    }
    
    if (!comune) {
      return NextResponse.json({
        success: false,
        error: 'Comune non trovato'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      comune
    });
    
  } catch (error) {
    console.error('Errore API comuni POST:', error);
    return NextResponse.json({
      success: false,
      error: 'Errore nella ricerca comune'
    }, { status: 500 });
  }
}
