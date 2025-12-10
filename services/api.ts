import { config } from '@/utils/env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

// ============================================
// CONFIG
// ============================================


const STORAGE_KEYS = {
  OFFLINE_QUEUE: '@offline_queue',
  CACHED_TRIPS: '@cached_trips',
};

// ============================================
// TYPES
// ============================================

interface QueuedAction {
  id: string;
  type: 'CREATE' | 'UPDATE' | 'DELETE';
  endpoint: string;
  method: 'POST' | 'PUT' | 'DELETE';
  payload: any;
  timestamp: number;
}

interface Trip {
  id?: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  description: string;
  image?: string;
  photos?: string[];
}

// ============================================
// HELPERS RÉSEAU
// ============================================

const checkIsOnline = async (): Promise<boolean> => {
  const state = await NetInfo.fetch();
  return state.isConnected ?? false;
};

// ============================================
// QUEUE OFFLINE
// ============================================

const getQueue = async (): Promise<QueuedAction[]> => {
  const stored = await AsyncStorage.getItem(STORAGE_KEYS.OFFLINE_QUEUE);
  return stored ? JSON.parse(stored) : [];
};

const addToQueue = async (action: Omit<QueuedAction, 'id' | 'timestamp'>): Promise<void> => {
  const queue = await getQueue();
  
  const newAction: QueuedAction = {
    ...action,
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: Date.now(),
  };
  
  queue.push(newAction);
  await AsyncStorage.setItem(STORAGE_KEYS.OFFLINE_QUEUE, JSON.stringify(queue));
  
  console.log('📥 Action ajoutée à la queue offline:', newAction.type);
};

const removeFromQueue = async (actionId: string): Promise<void> => {
  const queue = await getQueue();
  const filtered = queue.filter(a => a.id !== actionId);
  await AsyncStorage.setItem(STORAGE_KEYS.OFFLINE_QUEUE, JSON.stringify(filtered));
};

// ============================================
// SYNC
// ============================================

const syncQueue = async (): Promise<{ synced: number; failed: number }> => {
  const isOnline = await checkIsOnline();
  if (!isOnline) {
    return { synced: 0, failed: 0 };
  }

  const queue = await getQueue();
  if (queue.length === 0) {
    return { synced: 0, failed: 0 };
  }

  console.log(`🔄 Synchronisation de ${queue.length} action(s)...`);

  let synced = 0;
  let failed = 0;

  for (const action of queue) {
    try {
      const response = await fetch(`${config.mockBackendUrl}${action.endpoint}`, {
        method: action.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(action.payload),
      });

      if (response.ok) {
        await removeFromQueue(action.id);
        synced++;
        console.log(`✅ Synced: ${action.type}`);
      } else {
        failed++;
      }
    } catch (error) {
      failed++;
      console.error(`❌ Sync failed: ${action.type}`, error);
    }
  }

  return { synced, failed };
};

// ============================================
// CACHE TRIPS
// ============================================

const cacheTrips = async (trips: Trip[]): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_KEYS.CACHED_TRIPS, JSON.stringify({
    data: trips,
    cachedAt: Date.now(),
  }));
};

const getCachedTrips = async (): Promise<Trip[] | null> => {
  const stored = await AsyncStorage.getItem(STORAGE_KEYS.CACHED_TRIPS);
  if (stored) {
    const { data } = JSON.parse(stored);
    return data;
  }
  return null;
};

// ============================================
// API FUNCTIONS
// ============================================

const uploadImage = async (uri: string): Promise<string> => {
  const formData = new FormData();
  
  const filename = uri.split('/').pop() || 'photo.jpg';
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : 'image/jpeg';

  formData.append('file', {
    uri,
    name: filename,
    type,
  } as any);

  const response = await fetch(`${config.mockBackendUrl}/uploads`, {
    method: 'POST',
    body: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  if (!response.ok) {
    throw new Error('Erreur upload image');
  }

  const data = await response.json();
  return data.url;
};

const getTrips = async (): Promise<Trip[]> => {
  const isOnline = await checkIsOnline();

  if (isOnline) {
    try {
      const response = await fetch(`${config.mockBackendUrl}/trips`);
      const trips = await response.json();
      
      // Met en cache
      await cacheTrips(trips);
      
      return trips;
    } catch (error) {
      console.log('Erreur fetch, utilisation du cache');
      const cached = await getCachedTrips();
      return cached || [];
    }
  } else {
    // Mode offline: retourne le cache
    console.log('📴 Offline: utilisation du cache');
    const cached = await getCachedTrips();
    return cached || [];
  }
};

const createTrip = async (trip: Trip): Promise<Trip | null> => {
  const isOnline = await checkIsOnline();

  if (isOnline) {
    // En ligne: crée directement
    const response = await fetch(`${config.mockBackendUrl}/trips`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(trip),
    });

    if (!response.ok) {
      throw new Error('Erreur création voyage');
    }

    return response.json();
  } else {
    // Hors ligne: ajoute à la queue
    console.log('📴 Offline: ajout à la queue');
    
    await addToQueue({
      type: 'CREATE',
      endpoint: '/trips',
      method: 'POST',
      payload: trip,
    });

    // Retourne un trip temporaire avec ID local
    return {
      ...trip,
      id: `local-${Date.now()}`,
    };
  }
};

// ============================================
// EXPORTS
// ============================================

export const API = {
  // Core
  uploadImage,
  getTrips,
  createTrip,
  
  // Offline
  checkIsOnline,
  getQueue,
  syncQueue,
  getCachedTrips,
  
};