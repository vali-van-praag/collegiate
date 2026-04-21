// Seeded RNG to match Python's np.random.seed(42) behavior approximately
function mkRng(seed) {
  let s = seed >>> 0;
  return () => {
    s ^= s << 13; s ^= s >> 17; s ^= s << 5;
    return (s >>> 0) / 0xffffffff;
  };
}
function randInt(rng, lo, hi) { return Math.floor(rng() * (hi - lo)) + lo; }

const salaryMap = {
  // Elite Private
  Stanford: 164200, MIT: 163900, Harvard: 159400, 'Yale University': 154600,
  Princeton: 157200, 'Columbia University': 140800, 'Duke University': 145400,
  UPenn: 152900, 'Dartmouth College': 152500, 'Brown University': 144800,
  'Cornell University': 140200, 'Johns Hopkins U.': 129200, Georgetown: 148900,
  Vanderbilt: 129400, 'Northwestern University': 128900, 'University of Chicago': 128800,
  'Washington U. St. L.': 126200, 'Emory University': 126600, 'New York University': 129100,
  USC: 130800, 'Boston College': 124400, 'Tufts University': 137900,
  'Notre Dame': 142300, 'Wake Forest University': 130200, 'Rice University': 139500,
  'Tulane University': 118400, 'Fordham University': 112000, 'George Washington U.': 131300,
  'Boston University': 126300, 'Brandeis University': 128100, 'Case Western Reserve': 127000,
  'Syracuse University': 112900, 'American University': 108000, 'Northeastern University': 113500,
  'Villanova University': 129300,

  // Public Ivy
  'UC-Berkeley': 146700, UCLA: 129400, UVA: 131200, 'University of Michigan': 121500,
  'University of Florida': 111000, 'U. of Wisconsin-Madison': 110000, 'Penn. State University': 110800,
  'University of Texas': 114000, 'Ohio State University': 109000, 'University of Washington': 116000,
  'University of Illinois': 118000, 'Purdue University': 114200, 'Michigan State University': 104000,
  'University of Georgia': 105000, 'University of North Carolina': 112000, 'University of Maryland': 115000,
  'University of Minnesota': 108000, 'Indiana University': 100000, 'University of Colorado': 103000,
  'Arizona State University': 98000, 'University of Arizona': 97000, 'UC San Diego': 124000,
  'UC Davis': 112000, 'UC Santa Barbara': 110000,

  // Tech Power
  'Harvey Mudd': 160600, 'Cal Tech': 159900, 'Georgia Tech': 141800, 'Carnegie Mellon': 144500,
  Purdue: 114200, WPI: 143200, 'Rensselaer Polytech': 140800, 'Lehigh University': 144500,
  'Virginia Tech': 112000, 'Rochester Institute': 108000, 'Stevens Institute': 128000,
  'Colorado School of Mines': 120000, 'Missouri S&T': 106000,

  // Liberal Arts
  'Williams College': 143400, 'Amherst College': 139800, 'Swarthmore College': 142300,
  'Pomona College': 137800, 'Bowdoin College': 134600, 'Colgate University': 145600,
  'Davidson College': 127400, 'Bucknell University': 143000, 'Claremont McKenna': 150000,
  'Washington and Lee': 145400, 'Lafayette College': 137500, 'Middlebury College': 130000,
  'Vassar College': 118000, 'Oberlin College': 112000, 'Bates College': 130100,
  'Colby College': 128000, 'Hamilton College': 132000, 'Haverford College': 141900,
  'Grinnell College': 116000, 'Carleton College': 128000, 'Wesleyan University': 134000,

  // Service Academy
  'U.S. Naval Academy': 160700, 'U.S. Military Academy': 158100, 'U.S. Air Force Academy': 146200,
  'U.S. Coast Guard Academy': 138000, 'U.S. Merchant Marine Academy': 132000,
};

const earlySalaryMap = {
  Stanford: 86800, MIT: 92300, Harvard: 80100, 'Yale University': 77100,
  Princeton: 79900, 'Columbia University': 76100, 'Duke University': 75400,
  UPenn: 76800, 'Dartmouth College': 75500, 'Brown University': 71700,
  'Cornell University': 74600, 'Johns Hopkins U.': 72800, Georgetown: 69400,
  Vanderbilt: 68200, 'Northwestern University': 72100, 'University of Chicago': 73400,
  'Washington U. St. L.': 68900, 'Emory University': 67800, 'New York University': 65600,
  USC: 68200, 'Boston College': 66100, 'Tufts University': 68300,
  'Notre Dame': 70500, 'Wake Forest University': 66800, 'Rice University': 74200,
  'Tulane University': 60000, 'Fordham University': 58000, 'George Washington U.': 64000,
  'Boston University': 64200, 'Brandeis University': 65000, 'Case Western Reserve': 66000,
  'Syracuse University': 57000, 'American University': 54000, 'Northeastern University': 68000,
  'Villanova University': 67000,
  'UC-Berkeley': 74500, UCLA: 65600, UVA: 67900, 'University of Michigan': 67800,
  'University of Florida': 59600, 'U. of Wisconsin-Madison': 60900, 'Penn. State University': 58000,
  'University of Texas': 60000, 'Ohio State University': 57000, 'University of Washington': 63000,
  'University of Illinois': 64000, 'Purdue University': 64400, 'Michigan State University': 55000,
  'University of Georgia': 54000, 'University of North Carolina': 59000, 'University of Maryland': 61000,
  'University of Minnesota': 57000, 'Indiana University': 52000, 'University of Colorado': 54000,
  'Arizona State University': 50000, 'University of Arizona': 50000, 'UC San Diego': 68000,
  'UC Davis': 59000, 'UC Santa Barbara': 58000,
  'Harvey Mudd': 93100, 'Cal Tech': 93200, 'Georgia Tech': 75800, 'Carnegie Mellon': 80800,
  Purdue: 64400, WPI: 76500, 'Rensselaer Polytech': 74700, 'Lehigh University': 72300,
  'Virginia Tech': 60000, 'Rochester Institute': 60000, 'Stevens Institute': 70000,
  'Colorado School of Mines': 66000, 'Missouri S&T': 58000,
  'Williams College': 69900, 'Amherst College': 68100, 'Swarthmore College': 69700,
  'Pomona College': 69100, 'Bowdoin College': 65200, 'Colgate University': 70000,
  'Davidson College': 64000, 'Bucknell University': 69500, 'Claremont McKenna': 73800,
  'Washington and Lee': 69100, 'Lafayette College': 68000, 'Middlebury College': 65000,
  'Vassar College': 58000, 'Oberlin College': 55000, 'Bates College': 62000,
  'Colby College': 63000, 'Hamilton College': 66000, 'Haverford College': 68000,
  'Grinnell College': 58000, 'Carleton College': 64000, 'Wesleyan University': 66000,
  'U.S. Naval Academy': 85800, 'U.S. Military Academy': 84800, 'U.S. Air Force Academy': 81100,
  'U.S. Coast Guard Academy': 78000, 'U.S. Merchant Marine Academy': 74000,
};

// ── ACCEPTANCE RATES (%) — edit these manually ────────────
const acceptMap = {
  // Elite Private
  Stanford: 4, MIT: 4, Harvard: 4, 'Yale University': 5,
  Princeton: 4, 'Columbia University': 4, 'Duke University': 7,
  UPenn: 7, 'Dartmouth College': 6, 'Brown University': 6,
  'Cornell University': 8, 'Johns Hopkins U.': 7, Georgetown: 11,
  Vanderbilt: 4, 'Northwestern University': 7, 'University of Chicago': 4,
  'Washington U. St. L.': 12, 'Emory University': 10, 'New York University': 8,
  USC: 10, 'Boston College': 13, 'Tufts University': 10,
  'Notre Dame': 10, 'Wake Forest University': 22, 'Rice University': 8,
  'Tulane University': 14, 'Fordham University': 47, 'George Washington U.': 41,
  'Boston University': 11, 'Brandeis University': 41, 'Case Western Reserve': 30,
  'Syracuse University': 44, 'American University': 60, 'Northeastern University': 5,
  'Villanova University': 24,

  // Public Ivy
  'UC-Berkeley': 11, UCLA: 9, UVA: 15, 'University of Michigan': 15,
  'University of Florida': 24, 'U. of Wisconsin-Madison': 39, 'Penn. State University': 55,
  'University of Texas': 22, 'Ohio State University': 44, 'University of Washington': 41,
  'University of Illinois': 37, 'Purdue University': 50, 'Michigan State University': 85,
  'University of Georgia': 38, 'University of North Carolina': 15, 'University of Maryland': 44,
  'University of Minnesota': 80, 'Indiana University': 78, 'University of Colorado': 78,
  'Arizona State University': 88, 'University of Arizona': 86, 'UC San Diego': 26,
  'UC Davis': 45, 'UC Santa Barbara': 38,

  // Tech Power
  'Harvey Mudd': 13, 'Cal Tech': 3, 'Georgia Tech': 14, 'Carnegie Mellon': 12,
  WPI: 60, 'Rensselaer Polytech': 63, 'Lehigh University': 25,
  'Virginia Tech': 55, 'Rochester Institute': 67, 'Stevens Institute': 48,
  'Colorado School of Mines': 61,
  // Liberal Arts
  'Williams College': 8, 'Amherst College': 9, 'Swarthmore College': 7,
  'Pomona College': 7, 'Bowdoin College': 7, 'Colgate University': 14,
  'Davidson College': 13, 'Bucknell University': 29, 'Claremont McKenna': 10,
  'Washington and Lee': 14, 'Lafayette College': 31, 'Middlebury College': 11,
  'Vassar College': 19, 'Oberlin College': 34, 'Bates College': 13,
  'Colby College': 7, 'Hamilton College': 14, 'Haverford College': 12,
  'Grinnell College': 15, 'Carleton College': 20, 'Wesleyan University': 16,

  // Service Academy
  'U.S. Naval Academy': 9, 'U.S. Military Academy': 12, 'U.S. Air Force Academy': 14,
  'U.S. Coast Guard Academy': 22, 'U.S. Merchant Marine Academy': 32,
};

// ── SAT RANGES [25th, 75th] — from IVORI Admissions data ────────────
const satMap = {
  // Elite Private
  'Stanford':               [1510, 1570],
  'MIT':                    [1520, 1570],
  'Harvard':                [1500, 1580],
  'Yale University':        [1470, 1570],
  'Princeton':              [1470, 1570],
  'Columbia University':    [1500, 1560],
  'Duke University':        [1480, 1570],
  'UPenn':                  [1500, 1570],
  'Dartmouth College':      [1470, 1560],
  'Brown University':       [1480, 1560],
  'Cornell University':     [1450, 1550],
  'Johns Hopkins U.':       [1510, 1560],
  'Georgetown':             [1410, 1540],
  'Vanderbilt':             [1480, 1560],
  'Northwestern University':[1470, 1560],
  'University of Chicago':  [1510, 1570],
  'Washington U. St. L.':   [1500, 1560],
  'Emory University':       [1430, 1530],
  'New York University':    [1370, 1540],
  'USC':                    [1430, 1540],
  'Boston College':         [1390, 1520],
  'Tufts University':       [1430, 1540],
  'Notre Dame':             [1430, 1540],
  'Wake Forest University': [1360, 1500],
  'Rice University':        [1480, 1560],
  'Tulane University':      [1350, 1490],
  'Fordham University':     [1280, 1430],
  'George Washington U.':   [1310, 1470],
  'Boston University':      [1370, 1510],
  'Brandeis University':    [1330, 1500],
  'Case Western Reserve':   [1360, 1510],
  'Syracuse University':    [1220, 1400],
  'American University':    [1260, 1420],
  'Northeastern University':[1460, 1550],
  'Villanova University':   [1370, 1500],

  // Public Ivy
  'UC-Berkeley':            [1340, 1540],
  'UCLA':                   [1290, 1510],
  'UVA':                    [1380, 1530],
  'University of Michigan': [1350, 1520],
  'University of Florida':  [1310, 1470],
  'U. of Wisconsin-Madison':[1280, 1460],
  'Penn. State University':  [1170, 1370],
  'University of Texas':    [1230, 1490],
  'Ohio State University':  [1220, 1420],
  'University of Washington':[1270, 1470],
  'University of Illinois': [1250, 1490],
  'Purdue University':      [1200, 1470],
  'Michigan State University':[1100, 1310],
  'University of Georgia':  [1270, 1430],
  'University of North Carolina':[1310, 1490],
  'University of Maryland': [1310, 1490],
  'University of Minnesota':[1260, 1450],
  'Indiana University':     [1120, 1330],
  'University of Colorado': [1150, 1370],
  'Arizona State University':[1060, 1330],
  'University of Arizona':  [1060, 1300],
  'UC San Diego':           [1310, 1500],
  'UC Davis':               [1190, 1430],
  'UC Santa Barbara':       [1250, 1470],

  // Tech Power
  'Harvey Mudd':            [1490, 1570],
  'Cal Tech':               [1530, 1580],
  'Georgia Tech':           [1390, 1530],
  'Carnegie Mellon':        [1500, 1570],
  'Purdue':                 [1200, 1470],
  'WPI':                    [1310, 1480],
  'Rensselaer Polytech':    [1330, 1500],
  'Lehigh University':      [1310, 1470],
  'Virginia Tech':          [1200, 1390],
  'Rochester Institute':    [1260, 1440],
  'Stevens Institute':      [1350, 1500],
  'Colorado School of Mines':[1300, 1470],
  'Missouri S&T':           [1240, 1440],

  // Liberal Arts
  'Williams College':       [1460, 1560],
  'Amherst College':        [1470, 1560],
  'Swarthmore College':     [1440, 1550],
  'Pomona College':         [1450, 1550],
  'Bowdoin College':        [1400, 1540],
  'Colgate University':     [1370, 1510],
  'Davidson College':       [1360, 1510],
  'Bucknell University':    [1310, 1460],
  'Claremont McKenna':      [1430, 1540],
  'Washington and Lee':     [1380, 1510],
  'Lafayette College':      [1310, 1470],
  'Middlebury College':     [1380, 1530],
  'Vassar College':         [1380, 1520],
  'Oberlin College':        [1310, 1490],
  'Bates College':          [1370, 1500],
  'Colby College':          [1390, 1530],
  'Hamilton College':       [1410, 1530],
  'Haverford College':      [1420, 1540],
  'Grinnell College':       [1380, 1530],
  'Carleton College':       [1400, 1540],
  'Wesleyan University':    [1390, 1530],

  // Service Academy (estimated — not in dataset)
  'U.S. Naval Academy':           [1310, 1490],
  'U.S. Military Academy':        [1280, 1470],
  'U.S. Air Force Academy':       [1280, 1480],
  'U.S. Coast Guard Academy':     [1220, 1390],
  'U.S. Merchant Marine Academy': [1180, 1360],
};

const ranges = {
  'Elite Private':   [91, 98, 18000, 32000, 3,  18, 68, 88],
  'Public Ivy':      [78, 94, 10000, 20000, 10, 55, 75, 93],
  'Tech Power':      [82, 94, 12000, 28000, 7,  30, 62, 84],
  'Liberal Arts':    [88, 97, 16000, 32000, 6,  20, 72, 92],
  'Service Academy': [80, 86, 0,     5000,  8,  15, 90, 98],
};

const groups = {
  'Elite Private': [
    ['Stanford','West'],['MIT','East'],['Harvard','East'],['Yale University','East'],
    ['Princeton','East'],['Columbia University','East'],['Duke University','South'],
    ['UPenn','East'],['Dartmouth College','East'],['Brown University','East'],
    ['Cornell University','East'],['Johns Hopkins U.','East'],['Georgetown','East'],
    ['Vanderbilt','South'],['Northwestern University','Midwest'],['University of Chicago','Midwest'],
    ['Washington U. St. L.','Midwest'],['Emory University','South'],['New York University','East'],
    ['USC','West'],['Boston College','East'],['Tufts University','East'],
    ['Notre Dame','Midwest'],['Wake Forest University','South'],['Rice University','South'],
    ['Tulane University','South'],['Fordham University','East'],['George Washington U.','East'],
    ['Boston University','East'],['Brandeis University','East'],['Case Western Reserve','Midwest'],
    ['Syracuse University','East'],['American University','East'],['Northeastern University','East'],
    ['Villanova University','East'],
  ],
  'Public Ivy': [
    ['UC-Berkeley','West'],['UCLA','West'],['UVA','East'],['University of Michigan','Midwest'],
    ['University of Florida','South'],['U. of Wisconsin-Madison','Midwest'],['Penn. State University','East'],
    ['University of Texas','South'],['Ohio State University','Midwest'],['University of Washington','West'],
    ['University of Illinois','Midwest'],['Purdue University','Midwest'],['Michigan State University','Midwest'],
    ['University of Georgia','South'],['University of North Carolina','South'],['University of Maryland','East'],
    ['University of Minnesota','Midwest'],['Indiana University','Midwest'],['University of Colorado','West'],
    ['Arizona State University','West'],['University of Arizona','West'],['UC San Diego','West'],
    ['UC Davis','West'],['UC Santa Barbara','West'],
  ],
  'Tech Power': [
    ['Harvey Mudd','West'],['Cal Tech','West'],['Georgia Tech','South'],['Carnegie Mellon','East'],
    ['Purdue','Midwest'],['WPI','East'],['Rensselaer Polytech','East'],['Lehigh University','East'],
    ['Virginia Tech','South'],['Rochester Institute','East'],['Stevens Institute','East'],
    ['Colorado School of Mines','West'],['Missouri S&T','Midwest'],
  ],
  'Liberal Arts': [
    ['Williams College','East'],['Amherst College','East'],['Swarthmore College','East'],
    ['Pomona College','West'],['Bowdoin College','East'],['Colgate University','East'],
    ['Davidson College','South'],['Bucknell University','East'],['Claremont McKenna','West'],
    ['Washington and Lee','South'],['Lafayette College','East'],['Middlebury College','East'],
    ['Vassar College','East'],['Oberlin College','Midwest'],['Bates College','East'],
    ['Colby College','East'],['Hamilton College','East'],['Haverford College','East'],
    ['Grinnell College','Midwest'],['Carleton College','Midwest'],['Wesleyan University','East'],
  ],
  'Service Academy': [
    ['U.S. Naval Academy','East'],['U.S. Military Academy','East'],['U.S. Air Force Academy','West'],
    ['U.S. Coast Guard Academy','East'],['U.S. Merchant Marine Academy','East'],
  ],
};

function buildData() {
  const rng = mkRng(42);
  const rows = [];
  for (const [cat, schools] of Object.entries(groups)) {
    const [g0,g1,n0,n1,a0,a1,s0,s1] = ranges[cat];
    for (const [name, region] of schools) {
      const midEarn    = salaryMap[name]      || 115000;
      const earlyEarn  = earlySalaryMap[name] || Math.round(midEarn * 0.58);
      const gradRate   = randInt(rng, g0, g1);
      const netPrice   = randInt(rng, n0, n1);
      const acceptRate = acceptMap[name] !== undefined ? acceptMap[name] : randInt(rng, a0, a1);
      const stuLife    = randInt(rng, s0, s1);
      const roi = ((midEarn - 55000) * 30) / Math.max(netPrice * 4, 1);
      const sat = satMap[name] || null;
      rows.push({ college: name, category: cat, region, earnings: midEarn,
        earlySalary: earlyEarn, gradRate, netPrice, acceptRate, studentLife: stuLife, roi, sat });
    }
  }
  return rows;
}

export const ALL_COLLEGES = buildData();

export const CAT_COLORS = {
  'Elite Private':   '#c9973a',
  'Public Ivy':      '#3a7fc9',
  'Tech Power':      '#3ab87a',
  'Liberal Arts':    '#b83a7a',
  'Service Academy': '#7a3ab8',
};


export const CATEGORIES = Object.keys(CAT_COLORS);
export const REGIONS    = [...new Set(ALL_COLLEGES.map(c => c.region))];
