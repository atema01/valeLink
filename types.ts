export interface BackgroundTheme {
  id: string;
  name: string;
  url: string;
  previewUrl: string;
  textColor: string;
  alt: string;
}

export interface ProposalData {
  senderName: string;
  receiverName: string;
  photoUrl: string | null;
  backgroundId: string;
  message: string;
  buttonStyle: 'standard' | 'persistent' | 'decoy';
  template: string;
}

export interface CreatedLinkState {
  data: ProposalData;
  slug: string;
  shareUrl: string;
  viewCount?: number;
}

export type StepProps = {
  data: ProposalData;
  updateData: (fields: Partial<ProposalData>) => void;
  onNext: () => void;
  onBack: () => void;
  isSubmitting?: boolean;
  error?: string | null;
};
