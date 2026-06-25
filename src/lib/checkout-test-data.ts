export const CHECKOUT_TEST_EMAIL = "test@example.com";
export const CHECKOUT_TEST_CARD_NUMBER = "4242 4242 4242 4242";
export const CHECKOUT_TEST_CARD_EXPIRY = "12/34";
export const CHECKOUT_TEST_CARD_CVV = "123";

export function isCheckoutTestPrefillEnabled(): boolean {
  if (process.env.NEXT_PUBLIC_CHECKOUT_TEST_PREFILL === "true") return true;
  return process.env.NODE_ENV === "development";
}
