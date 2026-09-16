export interface OfflineDeliveryProof {
  orderId: string;
  protocolo: string;
  nomeRecebedor: string;
  docRecebedor: string;
  fotoTirada: boolean;
  assinaturaFeita: boolean;
  timestamp: string;
}

const STORAGE_KEY = "motosus_offline_delivery_queue";

export const offlineSync = {
  savePendingProof: (proof: OfflineDeliveryProof) => {
    if (typeof window === "undefined") return;
    try {
      const existing = offlineSync.getPendingProofs();
      existing.push(proof);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    } catch (e) {
      console.error("Falha ao salvar comprovante offline:", e);
    }
  },

  getPendingProofs: (): OfflineDeliveryProof[] => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  },

  clearPendingProofs: () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEY);
  },
};
