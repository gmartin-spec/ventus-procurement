// ─── BACKEND: API para Google Sheets ────────────────────────────────────────
// Este archivo se despliega como serverless function en Vercel.
//
// Endpoints:
//   POST /api/sheets/read        → Lee un rango del Sheet
//   POST /api/sheets/write       → Escribe/appenda filas
//   POST /api/sheets/update-cell → Actualiza una celda por po_id
//   POST /api/sheets/update-docs → Agrega/quita doc recibido por po_id
//   GET  /api/sheets/health      → Health check
// ────────────────────────────────────────────────────────────────────────────

import { google } from 'googleapis';

// ─── AUTH ──────────────────────────────────────────────────────────────────

function getAuth() {
  // La Service Account key viene como variable de entorno (JSON stringified)
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return auth;
}

function getSheets() {
  const auth = getAuth();
  return google.sheets({ version: 'v4', auth });
}

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;

// ─── HANDLERS ──────────────────────────────────────────────────────────────

async function handleRead(req, res) {
  const { range } = req.body;

  if (!range) {
    return res.status(400).json({ error: 'range is required' });
  }

  try {
    const sheets = getSheets();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range,
    });

    res.json({ values: response.data.values || [] });
  } catch (error) {
    console.error('Read error:', error.message);
    res.status(500).json({ error: error.message });
  }
}

async function handleWrite(req, res) {
  const { range, values, mode } = req.body;

  if (!range || !values) {
    return res.status(400).json({ error: 'range and values are required' });
  }

  try {
    const sheets = getSheets();

    if (mode === 'append') {
      const response = await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range,
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        resource: { values },
      });
      res.json({ updated: response.data.updates });
    } else {
      // update mode
      const response = await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range,
        valueInputOption: 'USER_ENTERED',
        resource: { values },
      });
      res.json({ updated: response.data });
    }
  } catch (error) {
    console.error('Write error:', error.message);
    res.status(500).json({ error: error.message });
  }
}

async function handleUpdateCell(req, res) {
  const { poId, column, value } = req.body;

  if (!poId || !column) {
    return res.status(400).json({ error: 'poId and column are required' });
  }

  try {
    const sheets = getSheets();

    // 1. Leer todos los datos para encontrar la fila del PO
    const readResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'OC!A:Z',
    });

    const rows = readResponse.data.values || [];
    if (rows.length < 2) {
      return res.status(404).json({ error: 'No data found' });
    }

    const headers = rows[0];
    const colIndex = headers.indexOf(column);
    if (colIndex === -1) {
      return res.status(400).json({ error: `Column "${column}" not found` });
    }

    // Buscar fila por po_id (columna A)
    const rowIndex = rows.findIndex((row, i) => i > 0 && row[0] === poId);
    if (rowIndex === -1) {
      return res.status(404).json({ error: `PO "${poId}" not found` });
    }

    // Convertir índice de columna a letra
    const colLetter = String.fromCharCode(65 + colIndex);
    const cellRange = `OC!${colLetter}${rowIndex + 1}`;

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: cellRange,
      valueInputOption: 'USER_ENTERED',
      resource: { values: [[value]] },
    });

    res.json({ success: true, cell: cellRange, value });
  } catch (error) {
    console.error('Update cell error:', error.message);
    res.status(500).json({ error: error.message });
  }
}

async function handleUpdateDocs(req, res) {
  const { poId, docType, action } = req.body;

  if (!poId || !docType) {
    return res.status(400).json({ error: 'poId and docType are required' });
  }

  try {
    const sheets = getSheets();

    const readResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'OC!A:Z',
    });

    const rows = readResponse.data.values || [];
    const headers = rows[0];
    const docsReceivedIdx = headers.indexOf('docs_received');

    if (docsReceivedIdx === -1) {
      return res.status(400).json({ error: 'docs_received column not found' });
    }

    const rowIndex = rows.findIndex((row, i) => i > 0 && row[0] === poId);
    if (rowIndex === -1) {
      return res.status(404).json({ error: `PO "${poId}" not found` });
    }

    const currentDocs = (rows[rowIndex][docsReceivedIdx] || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    let updatedDocs;
    if (action === 'add') {
      updatedDocs = [...new Set([...currentDocs, docType])];
    } else {
      updatedDocs = currentDocs.filter(d => d !== docType);
    }

    const colLetter = String.fromCharCode(65 + docsReceivedIdx);
    const cellRange = `OC!${colLetter}${rowIndex + 1}`;

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: cellRange,
      valueInputOption: 'USER_ENTERED',
      resource: { values: [[updatedDocs.join(', ')]] },
    });

    res.json({ success: true, docs: updatedDocs });
  } catch (error) {
    console.error('Update docs error:', error.message);
    res.status(500).json({ error: error.message });
  }
}

// ─── ROUTER ────────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Extract the path after /api/sheets/
  const path = req.url.replace('/api/sheets', '').replace(/^\//, '').split('?')[0];

  try {
    switch (path) {
      case 'health':
        return res.json({ status: 'ok', timestamp: new Date().toISOString() });
      case 'read':
        return await handleRead(req, res);
      case 'write':
        return await handleWrite(req, res);
      case 'update-cell':
        return await handleUpdateCell(req, res);
      case 'update-docs':
        return await handleUpdateDocs(req, res);
      default:
        return res.status(404).json({ error: `Unknown endpoint: ${path}` });
    }
  } catch (error) {
    console.error('Unhandled error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
