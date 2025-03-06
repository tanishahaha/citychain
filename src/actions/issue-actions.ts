"use server";
import { createClient } from '@/utils/supabase/server'; // Adjust based on your setup
import { revalidatePath } from 'next/cache';

export async function claimIssue(formData: FormData) {
    const issueId = formData.get('issueId') as string;
    const userId = formData.get('userId') as string;
  
    if (!issueId || !userId) {
      console.error('Missing issueId or userId:', { issueId, userId });
      return { success: false, error: 'Missing required fields' };
    }
  
    const supabase = createClient();
    const { data, error } = await supabase
      .from('tweet')
      .update({ status: 'under_consideration', authority: userId })
      .eq('id', issueId);
  
    if (error) {
      console.error('Supabase error claiming issue:', error.message, error.details, error.hint);
      return { success: false, error: error.message || 'Failed to claim issue' };
    }
  
    console.log('Issue claimed successfully:', data);
    revalidatePath('/')
    return { success: true };
  }

export async function markAsSolved(formData: FormData) {
  const issueId = formData.get('issueId') as string;

  const supabase = createClient();
  const { error } = await supabase
    .from('tweet')
    .update({ status: 'solved' })
        .eq('id', issueId);
   

  if (error) {
    console.error('Error marking issue as solved:', error);
    return { success: false, error };
  }
  return { success: true };
}