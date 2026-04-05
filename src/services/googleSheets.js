// ─── GOOGLE SHEETS INTEGRATION SERVICE ──────────────────────────────────────
// Este módulo maneja la lectura y escritura bidireccional con Google Sheets.
//
// CONFIGURACIÓN:
// 1. Ir a https://console.cloud.google.com
// 2. Crear proyecto "Ventus Procurement"
// 3. Habilitar "Google Sheets API"
// 4. Crear credenciales → Service Account
// 5. Descargar el JSON de la Service Account
// 6. Compartir tu Google Sheet con el email de la Service Account
// 7. Configurar las variables de entorno (ver .env.example)
//
// ESTRUCTURA ESPERADA DEL SHEET:
// Hoja "OC"         → Órdenes de compra (1 fila por OC)
// Hoja "Documentos" → Tracking documental
// Hoja "Costos"     → Desglose FOB/CIF/DDP
// Hoja "Config"     → Proyectos, proveedores, estados
// ────────────────────────────────────────────────────────────────────────────

const SHEET_RANGES = {
  orders: 'OC!A:Z',
  documents: 'Documentos!A:Z',
  costs: 'Costos!A:Z',
  config: 'Config!A:Z',
};

// Columnas esperadas en hoja "OC"
const OC_COLUMNS = [
  'po_id',           // A
  'project_id',      // B
  'project_name',    // C
  'description',     // D
  'supplier',        // E
  'category',        // F
  'qty',             // G
  'unit',            // H
  'unit_price',      // I
  'currency',        // J
  'incoterm',        // K
  'status',          // L
  'priority',        // M
  'fob',             // N
  'freight',         // O
  'insurance',       // P
  'cif',             // Q
  'duties',          // R
  'ddp',             // S
  'date_created',    // T
  'date_etd',        // U
  'date_eta',        // V
  'date_delivered',  // W
  'docs_required',   // X  (comma-separated)
  'docs_received',   // Y  (comma-separated)
  'notes',           // Z
];

class GoogleSheetsService {
  constructor() {
    this.baseUrl = '/api/sheets';
    this.cache = new Map();
    this.cacheExpiry = 30000; // 30 seconds
  }

  // ─── READ ────────────────────────────────────────────────────────────────

  async fetchOrders() {
    const cacheKey = 'orders';
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data;
    }

    try {
      const response = await fetch(`${this.baseUrl}/read`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ range: SHEET_RANGES.orders }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const { values } = await response.json();
      if (!values || values.length < 2) return [];

      const headers = values[0];
      const rows = values.slice(1);

      const orders = rows.map(row => this.rowToOrder(headers, row)).filter(Boolean);

      this.cache.set(cacheKey, { data: orders, timestamp: Date.now() });
      return orders;
    } catch (error) {
      console.error('Error fetching orders from Sheets:', error);
      throw error;
    }
  }

  rowToOrder(headers, row) {
    try {
      const get = (col) => {
        const idx = headers.indexOf(col);
        return idx >= 0 && idx < row.length ? row[idx] : '';
      };

      const parseDate = (val) => val ? new Date(val) : null;
      const parseList = (val) => val ? val.split(',').map(s => s.trim()).filter(Boolean) : [];
      const parseNum = (val) => parseFloat(val) || 0;

      return {
        id: get('po_id'),
        project: {
          id: get('project_id'),
          name: get('project_name'),
          country: get('project_id')?.split('-')[0] || '',
          client: '',
          mwp: 0,
        },
        description: get('description'),
        supplier: get('supplier'),
        category: get('category'),
        qty: parseNum(get('qty')),
        unit: get('unit'),
        unitPrice: parseNum(get('unit_price')),
        currency: get('currency') || 'USD',
        incoterm: get('incoterm') || 'FOB',
        status: get('status') || 'draft',
        priority: get('priority') || 'medium',
        costs: {
          fob: parseNum(get('fob')),
          freight: parseNum(get('freight')),
          insurance: parseNum(get('insurance')),
          cif: parseNum(get('cif')),
          duties: parseNum(get('duties')),
          ddp: parseNum(get('ddp')),
        },
        dates: {
          created: parseDate(get('date_created')),
          etd: parseDate(get('date_etd')),
          eta: parseDate(get('date_eta')),
          delivered: parseDate(get('date_delivered')),
        },
        docs: {
          required: parseList(get('docs_required')),
          received: parseList(get('docs_received')),
        },
        notes: get('notes'),
      };
    } catch (e) {
      console.error('Error parsing row:', e);
      return null;
    }
  }

  // ─── WRITE ───────────────────────────────────────────────────────────────

  async saveOrder(order) {
    const row = this.orderToRow(order);

    try {
      const response = await fetch(`${this.baseUrl}/write`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          range: SHEET_RANGES.orders,
          values: [row],
          mode: 'append',
        }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      this.cache.delete('orders');
      return await response.json();
    } catch (error) {
      console.error('Error saving order to Sheets:', error);
      throw error;
    }
  }

  async updateOrder(order, rowIndex) {
    const row = this.orderToRow(order);

    try {
      const response = await fetch(`${this.baseUrl}/write`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          range: `OC!A${rowIndex + 2}:Z${rowIndex + 2}`, // +2 for header + 0-index
          values: [row],
          mode: 'update',
        }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      this.cache.delete('orders');
      return await response.json();
    } catch (error) {
      console.error('Error updating order in Sheets:', error);
      throw error;
    }
  }

  async updateStatus(poId, newStatus) {
    try {
      const response = await fetch(`${this.baseUrl}/update-cell`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          poId,
          column: 'status',
          value: newStatus,
        }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      this.cache.delete('orders');
      return await response.json();
    } catch (error) {
      console.error('Error updating status in Sheets:', error);
      throw error;
    }
  }

  async markDocReceived(poId, docType) {
    try {
      const response = await fetch(`${this.baseUrl}/update-docs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ poId, docType, action: 'add' }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      this.cache.delete('orders');
      return await response.json();
    } catch (error) {
      console.error('Error marking doc received:', error);
      throw error;
    }
  }

  orderToRow(order) {
    const fmtDate = (d) => d ? d.toISOString().split('T')[0] : '';
    const fmtList = (arr) => (arr || []).join(', ');

    return [
      order.id,
      order.project?.id || '',
      order.project?.name || '',
      order.description,
      order.supplier,
      order.category,
      order.qty,
      order.unit,
      order.unitPrice,
      order.currency || 'USD',
      order.incoterm || 'FOB',
      order.status,
      order.priority || 'medium',
      order.costs?.fob || 0,
      order.costs?.freight || 0,
      order.costs?.insurance || 0,
      order.costs?.cif || 0,
      order.costs?.duties || 0,
      order.costs?.ddp || 0,
      fmtDate(order.dates?.created),
      fmtDate(order.dates?.etd),
      fmtDate(order.dates?.eta),
      fmtDate(order.dates?.delivered),
      fmtList(order.docs?.required),
      fmtList(order.docs?.received),
      order.notes || '',
    ];
  }

  // ─── SYNC ────────────────────────────────────────────────────────────────

  async fullSync(localOrders) {
    try {
      const remoteOrders = await this.fetchOrders();

      // Merge strategy: remote wins for existing, add local-only
      const remoteIds = new Set(remoteOrders.map(o => o.id));
      const localOnly = localOrders.filter(o => !remoteIds.has(o.id));

      // Write new local orders to sheet
      for (const order of localOnly) {
        await this.saveOrder(order);
      }

      // Return merged list (remote + newly pushed local)
      return [...remoteOrders, ...localOnly];
    } catch (error) {
      console.error('Full sync failed:', error);
      throw error;
    }
  }

  clearCache() {
    this.cache.clear();
  }
}

// Singleton
const sheetsService = new GoogleSheetsService();
export default sheetsService;
export { OC_COLUMNS, SHEET_RANGES };
