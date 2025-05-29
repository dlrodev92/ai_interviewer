import { apiHandler } from '@/core/apiHandler';

export async function deleteFeedbackById(id: string): Promise<{ success: boolean; error?: string }> {
  return apiHandler.delete(`/api/feedback/${id}`);
}