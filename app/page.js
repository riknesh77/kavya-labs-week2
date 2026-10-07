import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '../lib/auth.js';
import Dashboard from './dashboard.js';
export default async function Page() { const session=await getServerSession(authOptions); if(!session) redirect('/login'); return <Dashboard account={session.user}/>; }
