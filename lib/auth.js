import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { scryptSync, timingSafeEqual } from 'node:crypto';
const demoHash = scryptSync('KavyaDemo2026!', 'kavya-week3-public-demo', 64);
const providers = [CredentialsProvider.default ? CredentialsProvider.default({name:'Demo account',credentials:{email:{label:'Email',type:'email'},password:{label:'Password',type:'password'}},authorize}) : CredentialsProvider({name:'Demo account',credentials:{email:{label:'Email',type:'email'},password:{label:'Password',type:'password'}},authorize})];
async function authorize(credentials) {
  if (typeof credentials?.password !== 'string' || credentials.password.length > 128) return null;
  const email = credentials.email?.trim().toLowerCase();
  if (!['admin@kavya.example','viewer@kavya.example'].includes(email)) return null;
  if (!timingSafeEqual(scryptSync(credentials.password,'kavya-week3-public-demo',64),demoHash)) return null;
  return { id:email, email,name:email.startsWith('admin')?'Demo Admin':'Demo Viewer',role:email.startsWith('admin')?'Admin':'Viewer' };
}
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  const Google = GoogleProvider.default || GoogleProvider;
  providers.push(Google({clientId:process.env.GOOGLE_CLIENT_ID,clientSecret:process.env.GOOGLE_CLIENT_SECRET}));
}
export const authOptions = {
  providers, secret:process.env.NEXTAUTH_SECRET, session:{strategy:'jwt',maxAge:8*60*60},pages:{signIn:'/login'},
  callbacks:{
    async jwt({token,user,account,profile}) { if(user) { const allowed=(process.env.ADMIN_EMAILS||'').toLowerCase().split(',').map(s=>s.trim()); token.role=account?.provider === 'google' ? (profile?.email_verified && allowed.includes(user.email?.toLowerCase()) ? 'Admin' : 'Viewer') : user.role; } return token; },
    async session({session,token}) { session.user.role=token.role || 'Viewer'; return session; }
  }
};
