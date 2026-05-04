import { redirect } from 'next/navigation';

export default function DashboardRedirect() {
  // Redirect to the v2 dashboard route
  redirect('/dashboard-v2');
}
