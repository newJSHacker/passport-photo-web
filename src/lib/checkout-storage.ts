import type { Order } from "@/lib/api";

export const CHECKOUT_ORDER_STORAGE_KEY = "passport_checkout_order";

export interface StoredCheckoutOrder {
  order_id: string;
  photo_job_id: string;
  email: string;
  demo_mode: boolean;
}

export function saveCheckoutOrder(order: StoredCheckoutOrder): void {
  try {
    sessionStorage.setItem(CHECKOUT_ORDER_STORAGE_KEY, JSON.stringify(order));
  } catch {
    // sessionStorage unavailable
  }
}

export function readCheckoutOrder(): StoredCheckoutOrder | null {
  try {
    const raw = sessionStorage.getItem(CHECKOUT_ORDER_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredCheckoutOrder;
  } catch {
    return null;
  }
}

export function clearCheckoutOrder(): void {
  try {
    sessionStorage.removeItem(CHECKOUT_ORDER_STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function orderFromStored(stored: StoredCheckoutOrder): Order {
  return {
    id: stored.order_id,
    photo_job_id: stored.photo_job_id,
    email: stored.email,
    delivery_type: "digital",
    amount_cents: 0,
    currency: "usd",
    status: "paid",
    created_at: "",
    paid_at: null,
    download_url: `/api/v1/photos/${stored.photo_job_id}/files/processed`,
  };
}
