import { GoogleAuth } from 'google-auth-library';

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
const SHEETS_BASE = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}`;

let authClient = null;

async function getToken() {
  if (!authClient) {
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
    const auth = new GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    authClient = await auth.getClient();
  }
  const tokenResponse = await authClient.getAccessToken();
  return tokenResponse.token;
}

async function sheetsRequest(path, options = {}) {
  const token = await getToken();
  const res = await fetch(`${SHEETS_BASE}${path}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  return res.json();
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const slug = req.query.path || [];
  const action = Array.isArray(slug) ? slug[0] : slug;

  try {
    if (action === 'health') {
      return res.json({ status: 'ok', timestamp: new Date().toISOString() });
    }

    if (action === 'read') {
      const { range } = req.body || {};
      if (!range) return res.status(400).json({ error: 'range is required' });
      const data = await sheetsRequest(`/values/${encodeURIComponent(range)}`);
      return res.json({ values: data.values || [] });
    }

    if (action === 'write') {
      const { range, values, mode } = req.body || {};
      if (!range || !values) return res.status(400).json({ error: 'range and values required' });

      if (mode === 'append') {
        const data = await sheetsRequest(
          `/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
          { method: 'POST', body: JSON.stringify({ values }) }
        );
        return res.json({ updated: data });
      } else {
        const data = await sheetsRequest(
          `/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`,
          { method: 'PUT', body: JSON.stringify({ values }) }
        );
        return res.json({ updated: data });
      }
    }

    if (action === 'update-cell') {
      const { poId, column, value } = req.body || {};
      if (!poId || !column) return res.status(400).json({ error: 'poId and column required' });

      const data = await sheetsRequest(`/values/${encodeURIComponent('OC!A:Z')}`);
      const rows = data.values || [];
      if (rows.length < 2) return res.status(404).json({ error: 'No data' });

      const headers = rows[0];
      const colIndex = headers.indexOf(column);
      if (colIndex === -1) return res.status(400).json({ error: `Column "${column}" not found` });

      const rowIndex = rows.findIndex((row, i) => i > 0 && row[0] === poId);
      if (rowIndex === -1) return res.status(404).json({ error: `PO "${poId}" not found` });

      const colLetter = String.fromCharCode(65 + colIndex);
      const cellRange = `OC!${colLetter}${rowIndex + 1}`;

      await sheetsRequest(
        `/values/${encodeURIComponent(cellRange)}?valueInputOption=USER_ENTERED`,
        { method: 'PUT', body: JSON.stringify({ values: [[value]] }) }
      );
      return res.json({ success: true });
    }

    if (action === 'update-docs') {
      const { poId, docType, action: docAction } = req.body || {};
      if (!poId || !docType) return res.status(400).json({ error: 'poId and docType required' });

      const data = await sheetsRequest(`/values/${encodeURIComponent('OC!A:Z')}`);
      const rows = data.values || [];
      const headers = rows[0];
      const docsIdx = headers.indexOf('docs_received');
      if (docsIdx === -1) return res.status(400).json({ error: 'docs_received column not found' });

      const rowIndex = rows.findIndex((row, i) => i > 0 && row[0] === poId);
      if (rowIndex === -1) return res.status(404).json({ error: `PO not found` });

      const currentDocs = (rows[rowIndex][docsIdx] || '').split(',').map(s => s.trim()).filter(Boolean);
      const updatedDocs = docAction === 'add'
        ? [...new Set([...currentDocs, docType])]
        : currentDocs.filter(d => d !== docType);

      const colLetter = String.fromCharCode(65 + docsIdx);
      await sheetsRequest(
        `/values/${encodeURIComponent(`OC!${colLetter}${rowIndex + 1}`)}?valueInputOption=USER_ENTERED`,
        { method: 'PUT', body: JSON.stringify({ values: [[updatedDocs.join(', ')]] }) }
      );
      return res.json({ success: true, docs: updatedDocs });
    }

    return res.status(404).json({ error: `Unknown: ${action}` });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
