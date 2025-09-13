export function DashboardOverview() {
  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>Dashboard</h1>
        <p className='text-muted-foreground'>
          Welcome to your financial dashboard.
        </p>
      </div>

      {/* Dashboard content */}
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        <div className='p-6 bg-card rounded-lg border'>
          <h3 className='text-lg font-semibold mb-2'>Quick Stats</h3>
          <p className='text-muted-foreground'>Your financial overview</p>
        </div>

        <div className='p-6 bg-card rounded-lg border'>
          <h3 className='text-lg font-semibold mb-2'>Recent Transactions</h3>
          <p className='text-muted-foreground'>Latest activity</p>
        </div>

        <div className='p-6 bg-card rounded-lg border'>
          <h3 className='text-lg font-semibold mb-2'>Budget Overview</h3>
          <p className='text-muted-foreground'>Monthly budget status</p>
        </div>
      </div>
    </div>
  );
}

export default DashboardOverview;
