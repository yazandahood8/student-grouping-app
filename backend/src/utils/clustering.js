export const groupStudents = (answers, numGroups = 3) => {
  const sorted = [...answers].sort((a, b) => b.score - a.score);
  const groups = Array.from({ length: numGroups }, () => []);

  sorted.forEach((ans, idx) => {
    groups[idx % numGroups].push(ans.student);
  });

  return groups;
};
