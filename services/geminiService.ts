
import { UserData, DocumentResult } from "../types";

export const generateJobDocuments = async (userData: UserData, identifier: string, feedback?: string): Promise<DocumentResult> => {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userData, identifier, feedback })
  });

  if (!response.ok) {
    const err = await response.json();
    if (response.status === 402) {
      throw new Error("Payment verification failed. Please complete your purchase.");
    }
    throw new Error(err.error || "Generation Failed");
  }

  return await response.json();
};
