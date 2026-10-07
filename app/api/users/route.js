import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth.js';
import { readState,saveState } from '../../../lib/storage.js';
import { applyChange } from '../../../lib/model.js';
export const dynamic='force-dynamic';
export async function GET() {
  const session=await getServerSession(authOptions);
  if(!session) return Response.json({error:'Sign in to continue.'},{status:401});
  try { const {state}=await readState(); return Response.json(state,{headers:{'Cache-Control':'no-store'}}); }
  catch(e) { console.error('Read failed:',e); return Response.json({error:'Could not load workspace. Try again.'},{status:503}); }
}
async function mutate(request) {
  const session=await getServerSession(authOptions);
  if(!session) return Response.json({error:'Sign in to continue.'},{status:401});
  if(session.user.role !== 'Admin') return Response.json({error:'Administrator access is required.'},{status:403});
  if(request.headers.get('origin') !== new URL(request.url).origin) return Response.json({error:'Invalid request origin.'},{status:403});
  try {
    const text=await request.text();
    if(text.length>4000) return Response.json({error:'Request too large.'},{status:413});
    const input=JSON.parse(text);
    const {state,etag}=await readState();
    const next=applyChange(state,request.method,input,session.user.name);
    await saveState(next,etag);
    return Response.json(next,{headers:{'Cache-Control':'no-store'}});
  } catch(e) {
    const conflict=e.name==='BlobPreconditionFailedError';
    if(e.name.startsWith('Blob') && !conflict) {console.error('Save failed:',e);return Response.json({error:'Could not save changes. Please try again.'},{status:503});}
    return Response.json({error:conflict?'Another change was saved. Refresh and try again.':e.message},{status:conflict?409:e.status||400});
  }
}
export {mutate as POST,mutate as PATCH,mutate as DELETE};
