import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import Header from '../components/header';
import './root.css';

export const Route = createRootRoute({
  component: () => (
    <div className="page">
      {/* navbar */}
      <Header
        menu={[
          {
            title: 'Home',
            icon: 'IconHome2',
            link: '/',
            child: null,
          },
          {
            title: 'Mechanical',
            icon: 'IconHome2',
            link: '/mechanical',
            child: null,
          },
          {
            title: 'Agronomist',
            icon: 'IconHome2',
            link: '/agronomist',
            child: null,
          },
          {
            title: 'Plumber',
            icon: 'IconHome2',
            link: '/plumber',
            child: null,
          },
          {
            title: 'Electrical & Software',
            icon: 'IconHome2',
            link: '/software',
            child: null,
          },
          // {
          //   title: 'Agronomist',
          //   icon: 'IconHome2',
          //   child: [
          //     {
          //       title: 'Artikel',
          //       link: '/about',
          //     },
          //   ],
          // },
        ]}
      />

      {/* content */}
      <div className="content">
        <Outlet />
      </div>

      <TanStackRouterDevtools />
    </div>
  ),
});
