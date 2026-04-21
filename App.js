import { createContext, useContext, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home     from './pages/Home';
import Rankings from './pages/Rankings';
import Explorer from './pages/Explorer';
import Profile  from './pages/Profile';
import Compare  from './pages/Compare';
import MyList   from './pages/MyList';
import MapPage  from './pages/Map';
import { CATEGORIES, REGIONS } from './data';

const AppCtx = createContext(null);
export const useApp = () => useContext(AppCtx);

const DEFAULTS = {
  wEarn: 7, wGrad: 5, wPrice: 5, wLife: 3, wSelect: 5,
  selectedRegions: [...REGIONS],
  selectedCategories: [...CATEGORIES],
};

export default function App() {
  const [state, setState] = useState(DEFAULTS);
  const set = (key, val) => setState(s => ({ ...s, [key]: val }));
  const reset = () => setState(DEFAULTS);

  return (
    <AppCtx.Provider value={{ state, set, reset }}>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/"         element={<Home />}     />
          <Route path="/rankings" element={<Rankings />} />
          <Route path="/explorer" element={<Explorer />} />
          <Route path="/profile"  element={<Profile />}  />
          <Route path="/compare"  element={<Compare />}  />
          <Route path="/mylist"   element={<MyList />}   />
          <Route path="/map"      element={<MapPage />}  />
        </Routes>
      </BrowserRouter>
    </AppCtx.Provider>
  );
}
