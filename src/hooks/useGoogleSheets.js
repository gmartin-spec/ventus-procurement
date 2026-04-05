// ─── Hook: useGoogleSheets ──────────────────────────────────────────────────
// Conecta la app React con el backend de Google Sheets.
// Si la API no está disponible, usa datos locales (demo mode).
// ────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback, useRef } from 'react';
import sheetsService from '../services/googleSheets';

export function useGoogleSheets(initialData) {
  const [data, setData] = useState(initialData);
  const [syncStatus, setSyncStatus] = useState('offline'); // offline | syncing | synced | error
  const [isConnected, setIsConnected] = useState(false);
  const [lastSync, setLastSync] = useState(null);
  const syncInterval = useRef(null);

  // Check API health on mount
  useEffect(() => {
    checkConnection();

    return () => {
      if (syncInterval.current) clearInterval(syncInterval.current);
    };
  }, []);

  const checkConnection = useCallback(async () => {
    try {
      const res = await fetch('/api/sheets/health');
      if (res.ok) {
        setIsConnected(true);
        setSyncStatus('synced');
        // Auto-sync every 60 seconds when connected
        syncInterval.current = setInterval(sync, 60000);
      } else {
        setIsConnected(false);
        setSyncStatus('offline');
      }
    } catch {
      setIsConnected(false);
      setSyncStatus('offline');
    }
  }, []);

  const sync = useCallback(async () => {
    if (!isConnected) {
      setSyncStatus('offline');
      return data;
    }

    setSyncStatus('syncing');

    try {
      const merged = await sheetsService.fullSync(data);
      setData(merged);
      setSyncStatus('synced');
      setLastSync(new Date());
      return merged;
    } catch (error) {
      console.error('Sync failed:', error);
      setSyncStatus('error');
      return data;
    }
  }, [data, isConnected]);

  const updateOrder = useCallback(async (poId, updates) => {
    // Update locally first (optimistic)
    setData(prev => prev.map(po =>
      po.id === poId ? { ...po, ...updates } : po
    ));

    // Then sync to Sheets if connected
    if (isConnected) {
      try {
        if (updates.status) {
          await sheetsService.updateStatus(poId, updates.status);
        }
      } catch (error) {
        console.error('Remote update failed:', error);
        setSyncStatus('error');
      }
    }
  }, [isConnected]);

  const addOrder = useCallback(async (newOrder) => {
    setData(prev => [newOrder, ...prev]);

    if (isConnected) {
      try {
        await sheetsService.saveOrder(newOrder);
      } catch (error) {
        console.error('Remote save failed:', error);
        setSyncStatus('error');
      }
    }
  }, [isConnected]);

  const markDocReceived = useCallback(async (poId, docType) => {
    setData(prev => prev.map(po => {
      if (po.id !== poId) return po;
      return {
        ...po,
        docs: {
          ...po.docs,
          received: [...new Set([...po.docs.received, docType])],
        },
      };
    }));

    if (isConnected) {
      try {
        await sheetsService.markDocReceived(poId, docType);
      } catch (error) {
        console.error('Remote doc update failed:', error);
        setSyncStatus('error');
      }
    }
  }, [isConnected]);

  return {
    data,
    setData,
    syncStatus,
    isConnected,
    lastSync,
    sync,
    updateOrder,
    addOrder,
    markDocReceived,
    checkConnection,
  };
}
