export function normalize(arr, invert = false) {
  const min = Math.min(...arr);
  const max = Math.max(...arr);
  if (max === min) return arr.map(() => 0.5);
  return arr.map(v => {
    const n = (v - min) / (max - min);
    return invert ? 1 - n : n;
  });
}

export function computeScores(colleges, weights, regions, categories) {
  let df = colleges.filter(
    c => regions.includes(c.region) && categories.includes(c.category)
  );
  if (!df.length) return [];

  const { wEarn=7, wGrad=5, wPrice=5, wLife=3, wSelect=5 } = weights;
  const totalW = wEarn + wGrad + wPrice + wLife * 0.7 + wSelect || 1;

  const nEarn   = normalize(df.map(c => c.earnings));
  const nGrad   = normalize(df.map(c => c.gradRate));
  const nPrice  = normalize(df.map(c => c.netPrice), true);
  const nLife   = normalize(df.map(c => c.studentLife));
  const nSelect = normalize(df.map(c => c.acceptRate), true);

  return df.map((c, i) => ({
    ...c,
    matchScore: ((nEarn[i]*wEarn + nGrad[i]*wGrad + nPrice[i]*wPrice +
                  nLife[i]*wLife*0.7 + nSelect[i]*wSelect) / totalW) * 100,
  })).sort((a, b) => b.matchScore - a.matchScore);
}

export const fmt = {
  dollar: v => '$' + Math.round(v).toLocaleString(),
  pct:    v => v + '%',
  roi:    v => v.toFixed(1) + '×',
};
