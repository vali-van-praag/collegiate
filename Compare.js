import { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, Legend, Cell,
} from 'recharts';
import { ALL_COLLEGES, CAT_COLORS } from '../data';
import { computeScores } from '../utils';
import { useApp } from '../App';

const $ = v => '$' + Math.round(v).toLocaleString();
const PALETTE = ['#d4c9a8', '#a8b8c8', '#a8c4b0'];

const METRICS = [
  { label: 'Mid-Career Salary',  field: 'earnings',    fmt: $,  invert: false },
  { label: 'Early Career Salary',field: 'earlySalary', fmt: $,  invert: false },
  { label: 'Graduation Rate',    field: 'gradRate',    fmt: v=>`${v}%`, invert: false },
  { label: 'Annual Net Price',   field: 'netPrice',    fmt: $,  invert: true  },
  { label: 'Acceptance Rate',    field: 'acceptRate',  fmt: v=>`${v}%`, invert: true  },
  { label: 'Student Life',       field: 'studentLife', fmt: v=>`${v}/100`, invert: false },
  { label: '30-Year ROI',        field: 'roi',         fmt: v=>`${v.toFixed(1)}×`, invert: false },
];

const VERDICT_ROWS = [
  { label: 'Mid-Career Earnings', field: 'earnings',    invert: false, fmt: $ },
  { label: 'Affordability',       field: 'netPrice',    invert: true,  fmt: v=>$(v)+'/yr' },
  { label: 'Selectivity',         field: 'acceptRate',  invert: true,  fmt: v=>`${v}%` },
  { label: 'Graduation Rate',     field: 'gradRate',    invert: false, fmt: v=>`${v}%` },
  { label: '30-Year ROI',         field: 'roi',         invert: false, fmt: v=>`${v.toFixed(1)}×` },
];

export default function Compare() {
  const { state } = useApp();
  const allNames = useMemo(() => ALL_COLLEGES.map(c => c.college).sort(), []);
  const ranked   = useMemo(
    () => computeScores(ALL_COLLEGES, state, state.selectedRegions, state.selectedCategories),
    [state]
  );

  const [schoolA, setSchoolA] = useState(allNames[0] || '');
  const [schoolB, setSchoolB] = useState(allNames[1] || '');
  const [schoolC, setSchoolC] = useState('');
  const [barTab,  setBarTab]  = useState(0);

  const selected = useMemo(() => {
    const names = [schoolA, schoolB, schoolC].filter(Boolean);
    return names.map(n => {
      const base = ALL_COLLEGES.find(c => c.college === n);
      const sc   = ranked.find(c => c.college === n);
      return base ? { ...base, matchScore: sc?.matchScore } : null;
    }).filter(Boolean);
  }, [schoolA, schoolB, schoolC, ranked]);

  const radarData = useMemo(() => {
    if (!selected.length) return [];
    const cats = ['Earnings','Grad Rate','Selectivity','Student Life','ROI','Early Pay'];
    const vals = s => [
      Math.round((s.earnings/170000)*100),
      s.gradRate,
      100 - s.acceptRate,
      s.studentLife,
      Math.min(Math.round(s.roi), 100),
      Math.round((s.earlySalary/100000)*100),
    ];
    return cats.map((cat, i) => {
      const row = { subject: cat };
      selected.forEach((s, si) => { row[`s${si}`] = vals(s)[i]; });
      return row;
    });
  }, [selected]);

  const salaryData = [
    { name:'Early Career', ...Object.fromEntries(selected.map((s,i)=>[`s${i}`,s.earlySalary])) },
    { name:'Mid-Career',   ...Object.fromEntries(selected.map((s,i)=>[`s${i}`,s.earnings])) },
  ];

  const outcomeData = selected.length ? [
    { name:'Grad Rate',   ...Object.fromEntries(selected.map((s,i)=>[`s${i}`,s.gradRate])) },
    { name:'Student Life',...Object.fromEntries(selected.map((s,i)=>[`s${i}`,s.studentLife])) },
    { name:'Selectivity', ...Object.fromEntries(selected.map((s,i)=>[`s${i}`,100-s.acceptRate])) },
    { name:'ROI Score',   ...Object.fromEntries(selected.map((s,i)=>[`s${i}`,Math.min(Math.round(s.roi),100)])) },
  ] : [];

  return (
    <div className="page-wrap">
      <div className="page-header">
        <div className="page-eyebrow">◈ &nbsp; Head-to-Head</div>
        <div className="page-title">Compare Institutions</div>
        <div className="page-sub">Select up to three schools for a side-by-side analysis</div>
      </div>

      {/* selectors */}
      <div className="grid-3" style={{ marginBottom:'2rem' }}>
        {[
          ['Institution A', schoolA, setSchoolA],
          ['Institution B', schoolB, setSchoolB],
          ['Institution C (Optional)', schoolC, setSchoolC],
        ].map(([label, val, setter]) => (
          <div key={label}>
            <label className="field-label">{label}</label>
            <select className="select" value={val} onChange={e => setter(e.target.value)}>
              {label.includes('Optional') && <option value="">— None —</option>}
              {allNames.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        ))}
      </div>

      {selected.length < 2 && (
        <div style={{ padding:'3rem', textAlign:'center', border:'1px solid rgba(255,255,255,0.05)', color:'#333' }}>
          Select at least two institutions to compare
        </div>
      )}

      {selected.length >= 2 && (<>
        {/* header cards */}
        <div className="divider"><span className="divider-diamond">◆</span></div>
        <div className="section-title">Side-by-Side Overview</div>
        <div style={{ display:'grid', gridTemplateColumns:`repeat(${selected.length},1fr)`, gap:'1px', background:'rgba(255,255,255,0.055)', marginBottom:'1.5rem' }}>
          {selected.map((s, i) => (
            <div key={s.college} className="compare-header-card" style={{ borderTop:`2px solid ${PALETTE[i]}40` }}>
              <div style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'1.55rem', fontWeight:300, color:'#f0ece6', lineHeight:1.2, marginBottom:'0.3rem' }}>
                {s.college}
              </div>
              <div style={{ fontSize:'0.62rem', letterSpacing:'0.14em', textTransform:'uppercase', color:'#444' }}>{s.category}</div>
              <div style={{ fontSize:'0.62rem', color:'#333', marginTop:'0.15rem' }}>{s.region} Region</div>
              {s.matchScore != null && (
                <div style={{ fontSize:'0.68rem', color:'#444', marginTop:'0.5rem' }}>
                  Match Score: <span style={{ color: PALETTE[i] }}>{s.matchScore.toFixed(1)}%</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* metrics comparison */}
        {METRICS.map(({ label, field, fmt, invert }) => {
          const vals = selected.map(s => s[field]);
          const bestIdx = invert ? vals.indexOf(Math.min(...vals)) : vals.indexOf(Math.max(...vals));
          return (
            <div key={field} style={{ display:'grid', gridTemplateColumns:`repeat(${selected.length},1fr)`, gap:'1px', marginBottom:'1px' }}>
              {selected.map((s, i) => (
                <div key={i} style={{ padding:'0.65rem 1rem', borderBottom:'1px solid rgba(255,255,255,0.04)', background:'rgba(255,255,255,0.008)' }}>
                  <div style={{ fontSize:'0.58rem', letterSpacing:'0.16em', textTransform:'uppercase', color:'#2a2a2a', marginBottom:'0.15rem' }}>{label}</div>
                  <div style={{ fontSize:'1.1rem', fontFamily:'Cormorant Garamond,serif', fontWeight:300, color: i===bestIdx ? PALETTE[i] : '#555' }}>
                    {fmt(s[field])}
                    {i===bestIdx && <span style={{ fontSize:'0.5rem', letterSpacing:'0.1em', textTransform:'uppercase', color:PALETTE[i], marginLeft:'0.4rem' }}>▲ best</span>}
                  </div>
                </div>
              ))}
            </div>
          );
        })}

        <div className="divider"><span className="divider-diamond">◆</span></div>

        {/* radar */}
        <div className="section-title">Multi-Dimensional Comparison</div>
        <div className="section-sub">Normalized radar across key dimensions</div>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={radarData} margin={{ top:20, right:60, bottom:20, left:60 }}>
            <PolarGrid stroke="rgba(255,255,255,0.06)" />
            <PolarAngleAxis dataKey="subject" tick={{ fill:'#777', fontSize:11 }} />
            {selected.map((s,i) => (
              <Radar key={s.college} name={s.college.split(' ')[0]} dataKey={`s${i}`}
                stroke={PALETTE[i]} fill={PALETTE[i]} fillOpacity={0.08} strokeWidth={2} />
            ))}
            <Legend wrapperStyle={{ fontSize:'0.7rem', color:'#666' }} />
            <Tooltip contentStyle={{ background:'#111', border:'1px solid rgba(255,255,255,0.1)', fontSize:'0.75rem', color:'#b8b4af' }} />
          </RadarChart>
        </ResponsiveContainer>

        <div className="divider"><span className="divider-diamond">◆</span></div>

        {/* bar charts */}
        <div className="section-title">Metric Comparison Chart</div>
        <div className="tabs" style={{ marginBottom:'1.5rem' }}>
          {['Salary Comparison','Outcomes Comparison'].map((t,i) => (
            <button key={t} className={`tab${barTab===i?' active':''}`} onClick={()=>setBarTab(i)}>{t}</button>
          ))}
        </div>

        <ResponsiveContainer width="100%" height={340}>
          <BarChart data={barTab===0 ? salaryData : outcomeData} margin={{ top:10, right:20, bottom:20, left:60 }}>
            <XAxis dataKey="name" tick={{ fill:'#888', fontSize:10 }} stroke="rgba(255,255,255,0.07)" />
            <YAxis tickFormatter={barTab===0 ? v=>'$'+Math.round(v/1000)+'k' : v=>v} tick={{ fill:'#555', fontSize:10 }} stroke="rgba(255,255,255,0.07)" />
            <Tooltip contentStyle={{ background:'#111', border:'1px solid rgba(255,255,255,0.1)', fontSize:'0.78rem', color:'#b8b4af' }}
              formatter={(v,n)=>[barTab===0 ? '$'+v.toLocaleString() : v, selected[parseInt(n.replace('s',''))]?.college]} />
            {selected.map((_,i) => <Bar key={i} dataKey={`s${i}`} fill={PALETTE[i]} fillOpacity={0.7} radius={0} />)}
          </BarChart>
        </ResponsiveContainer>

        <div className="divider"><span className="divider-diamond">◆</span></div>

        {/* verdict */}
        <div className="section-title">Collegiate Verdict</div>
        <div className="section-sub">Which institution excels in each dimension</div>
        {VERDICT_ROWS.map(({ label, field, invert, fmt }) => {
          const vals = selected.map(s => s[field]);
          const winnerIdx = invert ? vals.indexOf(Math.min(...vals)) : vals.indexOf(Math.max(...vals));
          const winner = selected[winnerIdx];
          return (
            <div key={field} className="verdict-row">
              <div style={{ fontSize:'0.62rem', letterSpacing:'0.14em', textTransform:'uppercase', color:'#333', width:'14rem', flexShrink:0 }}>{label}</div>
              <div style={{ fontSize:'0.85rem', color: PALETTE[winnerIdx], fontWeight:400 }}>{winner.college.split(' ')[0]}</div>
              <div style={{ fontSize:'0.78rem', color:'#444' }}>{fmt(vals[winnerIdx])}</div>
            </div>
          );
        })}
      </>)}
    </div>
  );
}
