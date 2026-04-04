import api from './axios';
import type {
  SubscriptionInfo,
  SubscriptionResponse,
  CheckoutResult,
  CheckoutResponse,
  PortalResult,
  PortalResponse,
  ActiveProviderResponse,
} from '@/types/billing.types';

export async function apiGetSubscription(): Promise<SubscriptionInfo | null> {
  const res = await api.get<SubscriptionResponse>('/billing/subscription');
  return res.data.data;
}

export async function apiCreateCheckout(
  plan: 'PRO' | 'BYOK',
): Promise<CheckoutResult> {
  const res = await api.post<CheckoutResponse>('/billing/checkout', { plan });
  return res.data.data;
}

export async function apiCreatePortal(): Promise<PortalResult> {
  const res = await api.post<PortalResponse>('/billing/portal');
  return res.data.data;
}

export async function apiCancelSubscription(): Promise<void> {
  await api.post('/billing/cancel');
}

export async function apiVerifyRazorpayPayment(
  paymentId: string,
  subscriptionId: string,
  signature: string,
): Promise<void> {
  await api.post('/billing/razorpay/verify', {
    razorpay_payment_id: paymentId,
    razorpay_subscription_id: subscriptionId,
    razorpay_signature: signature,
  });
}

export async function apiGetActiveProvider(): Promise<string> {
  const res = await api.get<ActiveProviderResponse>('/billing/active-provider');
  return res.data.data.provider;
}
