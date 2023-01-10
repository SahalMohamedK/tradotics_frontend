import SLnTG from './pages/SLnTG';
import Trades from './pages/Trades';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import Compare from './pages/Compare';
import Navbar from './elements/Navbar';
import Features from './pages/Features';
import DayViews from './pages/DayViews';
import Settings from './pages/Settings';
import Sidebar from './elements/Sidebar';
import AddTrades from './pages/AddTrades';
import Institute from './pages/Institute';
import Dashboard from './pages/Dashboard';
import ChartViews from './pages/ChartViews';
import TradeAnalytics from './pages/TradeAnalytics';
import UIProvider from './contexts/UIContext';
import AuthProvider from './contexts/AuthContext';
import CalendarViews from './pages/CalendarViews';
import InstitutePage1 from './pages/InstitutePage1';
import DetailedReport from './pages/DetailedReport';
import InstituteAdmin from './pages/InstituteAdmin';
import InstituteDashboard from './pages/InstituteDashboard';
import { Chart, registerables } from 'chart.js';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import EarlyAccess from './pages/EarlyAccess';

Chart.register(...registerables);

function Wrapper({children, filter = true}){
  return (<>
    <Navbar filter={filter}/>
    <Sidebar/>
    <div className='relative md:ml-[57px]'>
      <div className='p-3 md:h-screen overflow-y-auto mb-16 md:mb-0'>{children}</div>
    </div>  
  </>
  )
}

function App() {
  return (
    <div>
      <UIProvider>
        <AuthProvider>
          <Router>
              <Routes>
                <Route path='/dashboard' element={<Wrapper><Dashboard /></Wrapper>} />
                <Route path='/detailed-report' element={<Wrapper><DetailedReport/></Wrapper>} />
                <Route path='/day-views' element={<Wrapper><DayViews/></Wrapper>} />
                <Route path='/compare' element={<Wrapper filter={false}><Compare/></Wrapper>} />
                <Route path='/stopless-and-target' element={<Wrapper><SLnTG /></Wrapper>} />
                <Route path='/settings' element={<Wrapper><Settings /></Wrapper>} />
                <Route path='/add-trades' element={<Wrapper><AddTrades /></Wrapper>} />
                <Route path='/trades' element={<Wrapper><Trades/></Wrapper>} />
                <Route path='/calendar-views' element={<Wrapper><CalendarViews/></Wrapper>} />
                <Route path='/institute' element={<Wrapper><Institute/></Wrapper>} />
                <Route path='/institute-admin' element={<Wrapper><InstituteAdmin/></Wrapper>} /> 
                <Route path='/institute-page1' element={<Wrapper><InstitutePage1/></Wrapper>} /> 
                <Route path='/institute-dashboard' element={<Wrapper><InstituteDashboard/></Wrapper>} /> 
                <Route path='/trade-analytics' element={<Wrapper><TradeAnalytics /></Wrapper>} />
                <Route path='/chart-views' element={<Wrapper><ChartViews/></Wrapper>} />
                <Route path='/signin' element={<Signin />} />
                <Route path='/signup' element={<Signup />} />
                <Route path='/early-access' element={<EarlyAccess />} />
                <Route path='/features' element={<Features />} />
                <Route index element={<Home/>}/>
              </Routes>
          </Router>
        </AuthProvider>
      </UIProvider>
    </div>
  );
}

export default App;
