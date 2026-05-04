import './App.css';

import { NavLink, Route, Routes } from 'react-router-dom';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';

const octofitLogoUrl = 'https://raw.githubusercontent.com/GrzegorzMakolab/skills-build-applications-w-copilot-agent-mode/build-octofit-app/docs/octofitapp-small.png';

const navigationItems = [
  { path: '/', label: 'Users', element: <Users /> },
  { path: '/activities', label: 'Activities', element: <Activities /> },
  { path: '/teams', label: 'Teams', element: <Teams /> },
  { path: '/leaderboard', label: 'Leaderboard', element: <Leaderboard /> },
  { path: '/workouts', label: 'Workouts', element: <Workouts /> },
];

function App() {
  return (
    <main className="app-shell">
      <div className="app-backdrop" />
      <div className="app-content container-xl py-4 py-lg-5">
        <header className="hero-panel card border-0 shadow-lg">
          <div className="card-body p-4 p-lg-5">
            <div className="hero-layout">
              <div>
                <div className="brand-mark mb-4">
                  <img className="brand-logo" src={octofitLogoUrl} alt="OctoFit Tracker logo" />
                  <div>
                    <p className="eyebrow mb-2">OctoFit Tracker</p>
                    <p className="brand-caption mb-0">Fitness dashboard for teams, workouts and competitive progress.</p>
                  </div>
                </div>
                <h1 className="display-5 fw-semibold mb-3">Frontend connected to the Django REST API.</h1>
                <p className="lead lead-text mb-0">
                  Browse core fitness data from the backend through routed React components.
                </p>
              </div>
              <nav aria-label="Main navigation" className="main-nav navbar navbar-expand-lg">
                <div className="w-100">
                  <span className="navbar-text text-uppercase small fw-semibold tracking-label mb-2 d-block">
                    Explore resources
                  </span>
                  <div className="nav nav-pills flex-wrap gap-2 justify-content-lg-end">
                    {navigationItems.map((item) => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/'}
                        className={({ isActive }) =>
                          isActive ? 'nav-link active nav-pill' : 'nav-link nav-pill'
                        }
                      >
                        {item.label}
                      </NavLink>
                    ))}
                  </div>
                </div>
              </nav>
            </div>
          </div>
        </header>

        <section className="content-panel card border-0 shadow-lg">
          <div className="card-body p-3 p-lg-4">
          <Routes>
            {navigationItems.map((item) => (
              <Route key={item.path} path={item.path} element={item.element} />
            ))}
          </Routes>
          </div>
        </section>
      </div>
    </main>
  );
}

export default App;
