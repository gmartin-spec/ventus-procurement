import { google } from 'googleapis';

function getSheets() {
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  return google.sheets({ version: 'v4', auth });
}

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;

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
      const sheets = getSheets();
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range,
      });
      return res.json({ values: response.data.values || [] });
    }

    if (action === 'write') {
      const { range, values, mode } = req.body || {};
      if (!range || !values) return res.status(400).json({ error: 'range and values required' });
      const sheets = getSheets();
      if (mode === 'append') {
        const response = await sheets.spreadsheets.values.append({
          spreadsheetId: SPREADSHEET_ID,
          range,
          valueInputOption: 'USER_ENTERED',
          insertDataOption: 'INSERT_ROWS',
          resource: { values },
        });
        return res.json({ updated: response.data.updates });
      } else {
        const response = await sheets.spreadsheets
