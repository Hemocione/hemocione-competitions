export const pickWinningTeam = (
  ranking: Array<{ teamId: number; donation_count: number | null }>
): { teamId: number; donation_count: number | null } | null => {
  if (ranking.length === 0) return null;

  const sorted = [...ranking].sort(
    (a, b) => (b.donation_count ?? 0) - (a.donation_count ?? 0)
  );
  if ((sorted[0].donation_count ?? 0) === 0) return null;

  return sorted[0];
};
