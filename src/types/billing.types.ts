export interface SubscriptionInfo {
  plan: 'FREE' | 'PRO' | 'BYOK';
  status: 'ACTIVE' | 'CANCELED' | 'PAST_DUE' | 'TRIALING';
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  provider: 'STRIPE' | 'RAZORPAY';
  createdAt: string;
}

export interface SubscriptionResponse {
  data: SubscriptionInfo | null;
}

export type CheckoutResult =
  | { type: 'redirect'; url: string }
  | {
      type: 'modal';
      subscriptionId: string;
      keyId: string;
      prefill: { name: string; email: string };
    };

export interface CheckoutResponse {
  data: CheckoutResult;
}

export interface PortalResult {
  url: string | null;
  provider: string;
}

export interface PortalResponse {
  data: PortalResult;
}

export interface ActiveProviderResponse {
  data: { provider: string };
}
