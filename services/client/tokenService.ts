export async function getTokenBalance(): Promise<number> {
  try {
    const response = await fetch('/api/interviewTokens/balance');

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch token balance');
    }

    const data = await response.json();
    return data.balance || 0;
  } catch (error) {
    console.error('Error fetching token balance:', error);
    throw error;
  }
}

export async function useTokens(
  interviewId?: string,
  amount: number = 1,
  description: string = 'Used for interview'
): Promise<number> {
  try {
    const response = await fetch('/api/interviewTokens/use', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        interviewId,
        description,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to use tokens');
    }

    const data = await response.json();
    return data.balance || 0;
  } catch (error) {
    console.error('Error using tokens:', error);
    throw error;
  }
}
