import Login from './form.js';
export default function LoginPage() { return <Login google={Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)}/>; }
