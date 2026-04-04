export interface PlanFeature {
  text: string;
}

export interface PlanInfo {
  name: string;
  key: 'FREE' | 'PRO' | 'BYOK';
  price: string;
  period: string;
  description: string;
  features: PlanFeature[];
  highlight?: boolean;
  badge?: string;
}

export const PLANS: PlanInfo[] = [
  {
    name: 'Free',
    key: 'FREE',
    price: '₹0',
    period: 'forever',
    description: 'Get started with basic AI agent capabilities',
    features: [
      { text: '10 runs per month' },
      { text: 'Mistral 7B model only' },
      { text: '1 agent team' },
      { text: 'Basic memory' },
    ],
  },
  {
    name: 'Pro',
    key: 'PRO',
    price: '₹2,000',
    period: '/month',
    description: 'For professionals who need more power',
    features: [
      { text: '500 runs per month' },
      { text: 'All LLM models' },
      { text: '10 agent teams' },
      { text: 'Advanced memory' },
      { text: 'Optional BYOK' },
    ],
    highlight: true,
    badge: 'Most Popular',
  },
  {
    name: 'BYOK',
    key: 'BYOK',
    price: '₹900',
    period: '/month',
    description: 'Bring your own OpenRouter key',
    features: [
      { text: 'Unlimited runs' },
      { text: 'All LLM models' },
      { text: 'Unlimited agent teams' },
      { text: 'Advanced memory' },
      { text: 'Use your own API key' },
    ],
  },
];
