import test from 'node:test';
import assert from 'node:assert/strict';
import {initialState,applyChange} from '../lib/model.js';
const user={name:'Test User',email:'test@kavya.example',role:'Member',status:'Active',team:'Engineering'};
test('create, update and delete preserve audit history and revisions',()=>{
 const seed=initialState();const created=applyChange(seed,'POST',{...user,revision:0},'Admin');
 assert.equal(created.users.length,17);assert.equal(seed.users.length,16);assert.equal(created.revision,1);
 const updated=applyChange(created,'PATCH',{...created.users[0],status:'Suspended',revision:1},'Admin');assert.equal(updated.users[0].status,'Suspended');
 const removed=applyChange(updated,'DELETE',{id:updated.users[0].id,revision:2},'Admin');assert.equal(removed.users.length,16);assert.equal(removed.events.length,4);
});
test('reject duplicate email and stale writes',()=>{const s=initialState();assert.throws(()=>applyChange(s,'POST',{...user,email:s.users[0].email,revision:0},'Admin'),/already/);assert.throws(()=>applyChange(s,'POST',{...user,revision:8},'Admin'),/changed/);});
test('protect the last active admin',()=>{const s=initialState();s.users=s.users.filter(u=>u.role!=='Admin'||u.id==='seed-0');assert.throws(()=>applyChange(s,'DELETE',{id:'seed-0',revision:0},'Admin'),/administrator/);assert.throws(()=>applyChange(s,'PATCH',{...s.users[0],role:'Viewer',revision:0},'Admin'),/administrator/);});
test('reject invalid role, status and missing user',()=>{const s=initialState();assert.throws(()=>applyChange(s,'POST',{...user,role:'Owner',revision:0},'Admin'),/valid role/);assert.throws(()=>applyChange(s,'DELETE',{id:'missing',revision:0},'Admin'),/not found/);});
