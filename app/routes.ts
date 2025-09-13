import { type RouteConfig, index } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  {
    path: '',
    file: 'routes/protected.tsx',
    children: [
      {
        path: '',
        file: 'components/dashboard-layout.tsx',
        children: [
          {
            path: 'dashboard',
            file: 'routes/dashboard-overview.tsx',
          },
          {
            path: 'transactions',
            file: 'routes/transactions/transactions.tsx',
          },
          {
            path: 'transactions/create',
            file: 'routes/transactions/create-transaction.tsx',
          },
          {
            path: 'transactions/edit/:id',
            file: 'routes/transactions/create-transaction.tsx',
          },
          {
            path: 'reports',
            file: 'routes/reports.tsx',
          },
        ],
      },
    ],
  },
] satisfies RouteConfig;
