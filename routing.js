'use strict';

// ─── src/routes/index.tsx ─────────────────────────────────────────────────────
function makeRouterIndex(config) {
  return `import React, { Suspense, lazy } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';

// Lazy-load pages for code splitting
const Home = lazy(() => import('../pages/Home'));
const About = lazy(() => import('../pages/About'));
const NotFound = lazy(() => import('../pages/NotFound'));

const PageLoader: React.FC = () => (
  <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
    <span>Loading…</span>
  </div>
);

const Nav: React.FC = () => (
  <nav>
    <NavLink to="/" end>Home</NavLink>
    <NavLink to="/about">About</NavLink>
  </nav>
);

export const AppRoutes: React.FC = () => (
  <>
    <Nav />
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  </>
);
`;
}

// ─── src/pages/Home.tsx ───────────────────────────────────────────────────────
function makeHomePage(config) {
  const reduxSection = config.redux
    ? `import { useAppSelector, useAppDispatch } from '../hooks';
import { increment, decrement, reset } from '../features/counter/counterSlice';

`
    : '';

  const reduxBody = config.redux
    ? `
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();
`
    : '';

  const counterUI = config.redux
    ? `
        <div className="counter">
          <h2>Counter: {count}</h2>
          <button onClick={() => dispatch(decrement())}>−</button>
          <button onClick={() => dispatch(reset())}>Reset</button>
          <button onClick={() => dispatch(increment())}>+</button>
        </div>`
    : '';

  return `import React from 'react';
${reduxSection}const Home: React.FC = () => {${reduxBody}
  return (
    <main className="page">
      <h1>🏠 Home</h1>
      <p>Welcome to your Budgie React app — edit <code>src/pages/Home.tsx</code> to get started.</p>${counterUI}
    </main>
  );
};

export default Home;
`;
}

// ─── src/pages/About.tsx ──────────────────────────────────────────────────────
function makeAboutPage() {
  return `import React from 'react';

const About: React.FC = () => (
  <main className="page">
    <h1>ℹ️ About</h1>
    <p>
      This project was bootstrapped with{' '}
      <a href="https://github.com/yashdatir/budgie-react" target="_blank" rel="noopener noreferrer">
        Budgie React 🐦
      </a>
      .
    </p>
    <p>Built with React 18, TypeScript, Webpack 5, and a whole lot of love.</p>
  </main>
);

export default About;
`;
}

// ─── src/pages/NotFound.tsx ───────────────────────────────────────────────────
function makeNotFoundPage() {
  return `import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => (
  <main className="not-found page">
    <h1>404</h1>
    <p>Oops — this page does not exist.</p>
    <Link to="/">← Back to Home</Link>
  </main>
);

export default NotFound;
`;
}

module.exports = { makeRouterIndex, makeHomePage, makeNotFoundPage, makeAboutPage };
