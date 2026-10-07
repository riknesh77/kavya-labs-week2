import { get, put } from '@vercel/blob';
import { mkdir, readFile, writeFile, rename } from 'node:fs/promises';
import { initialState } from './model.js';
const pathname = 'kavya-week3/workspace.json';
const local = '.data/state.json';
const cloud = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);
export async function readState() {
  if (cloud()) {
    const result = await get(pathname, { access:'private', useCache:false });
    if (result) return { state: await new Response(result.stream).json(), etag: result.blob.etag };
    try { await put(pathname, JSON.stringify(initialState()), { access:'private',addRandomSuffix:false,allowOverwrite:false,contentType:'application/json' }); }
    catch(e) { if (!/already exists/i.test(e.message)) throw e; }
    return readState();
  }
  if (process.env.VERCEL) throw new Error('Storage is not configured.');
  try { return { state:JSON.parse(await readFile(local,'utf8')),etag:null }; }
  catch(e) { if (e.code !== 'ENOENT') throw e; await mkdir('.data',{recursive:true}); const state=initialState(); await writeFile(local,JSON.stringify(state)); return {state,etag:null}; }
}
export async function saveState(state, etag) {
  if (cloud()) { await put(pathname,JSON.stringify(state),{access:'private',addRandomSuffix:false,allowOverwrite:true,ifMatch:etag,contentType:'application/json'}); return; }
  await writeFile(`${local}.tmp`,JSON.stringify(state)); await rename(`${local}.tmp`,local);
}
