export interface VenueFeedbackData {
  id: number;
  client: {
    id: number;
    image: string | null;
    fullName: string | null;
  };
  text: string;
  rating: number;
  createdAt: string;
}
