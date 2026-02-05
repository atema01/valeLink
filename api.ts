import { ProposalData } from './types';

export type LinkRecord = ProposalData & {
  answer?: string | null;
  answeredAt?: string | null;
};

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function createLink(data: ProposalData) {
  const response = await fetch(`${API_BASE}/api/links`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(body.error || 'Failed to create link');
  }

  return body as { slug: string; shareUrl: string };
}

export async function fetchLink(slug: string) {
  const response = await fetch(`${API_BASE}/api/links/${encodeURIComponent(slug)}`);
  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(body.error || 'Failed to load link');
  }

  return body as { link: LinkRecord; viewCount: number; lastViewedAt?: string };
}

export async function fetchLinkStatus(slug: string) {
  const response = await fetch(`${API_BASE}/api/links/${encodeURIComponent(slug)}/status`);
  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(body.error || 'Failed to load link status');
  }

  return body as { senderName: string; receiverName: string; answer?: string | null; answeredAt?: string | null };
}

export async function submitAnswer(slug: string, answer: 'accepted' | 'rejected') {
  const response = await fetch(`${API_BASE}/api/links/${encodeURIComponent(slug)}/answer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ answer })
  });

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = body.error || 'Failed to save answer';
    const error = new Error(message);
    (error as Error & { status?: number; data?: any }).status = response.status;
    (error as Error & { status?: number; data?: any }).data = body;
    throw error;
  }

  return body as { answer: string; answeredAt?: string | null };
}
