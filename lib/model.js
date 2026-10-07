import { randomUUID } from 'node:crypto';
export const roles = ['Admin', 'Member', 'Viewer'];
export const statuses = ['Active', 'Invited', 'Suspended'];
export function initialState() {
  const people = [
    ['Rohan Mehta','rohan@kavya.example','Admin','Active','Engineering'],
    ['Ananya Rao','ananya@kavya.example','Admin','Active','Product'],
    ['Arjun Sharma','arjun@kavya.example','Member','Active','Engineering'],
    ['Priya Nair','priya@kavya.example','Member','Active','Design'],
    ['Vikram Das','vikram@kavya.example','Member','Active','Engineering'],
    ['Meera Iyer','meera@kavya.example','Viewer','Active','Operations'],
    ['Aditya Singh','aditya@kavya.example','Member','Invited','Product'],
    ['Kavya Menon','kavya@kavya.example','Member','Active','Design'],
    ['Nikhil Patel','nikhil@kavya.example','Viewer','Suspended','Operations'],
    ['Sara Khan','sara@kavya.example','Member','Active','Engineering'],
    ['Dev Kapoor','dev@kavya.example','Member','Invited','Engineering'],
    ['Isha Reddy','isha@kavya.example','Viewer','Active','Product'],
    ['Neha Gupta','neha@kavya.example','Member','Active','Design'],
    ['Kabir Sethi','kabir@kavya.example','Member','Active','Product'],
    ['Diya Shah','diya@kavya.example','Viewer','Invited','Operations'],
    ['Aarav Joshi','aarav@kavya.example','Member','Active','Engineering']
  ];
  const now = Date.now();
  return { revision: 0, users: people.map(([name,email,role,status,team], i) => ({ id: `seed-${i}`, name,email,role,status,team,createdAt: new Date(now - (70-i*4)*86400000).toISOString() })), events: [{ id: randomUUID(), action: 'Workspace created', detail: '16 sample team members loaded', actor: 'System', at: new Date(now).toISOString() }] };
}
export function applyChange(state, method, input, actor) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Invalid request.');
  if (input.revision !== state.revision) { const e = new Error('The workspace changed. Refresh and try again.'); e.status = 409; throw e; }
  const next = structuredClone(state);
  const index = next.users.findIndex(u => u.id === input.id);
  if (method !== 'POST' && index < 0) { const e = new Error('User not found.'); e.status = 404; throw e; }
  let detail;
  if (method === 'DELETE') {
    const u = next.users[index];
    if (u.role === 'Admin' && u.status === 'Active' && next.users.filter(x => x.role === 'Admin' && x.status === 'Active').length === 1) throw new Error('Keep at least one active administrator.');
    detail = u.name;
    next.users.splice(index,1);
  } else {
    const name = typeof input.name === 'string' ? input.name.trim() : '';
    const email = typeof input.email === 'string' ? input.email.trim().toLowerCase() : '';
    const team = typeof input.team === 'string' ? input.team.trim() : '';
    if (name.length < 2 || name.length > 60) throw new Error('Name must be 2 to 60 characters.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 120) throw new Error('Enter a valid email address.');
    if (!roles.includes(input.role) || !statuses.includes(input.status)) throw new Error('Choose a valid role and status.');
    if (!['Engineering','Product','Design','Operations'].includes(team)) throw new Error('Choose a valid team.');
    if (next.users.some(u => u.email === email && u.id !== input.id)) throw new Error('This email is already in the workspace.');
    if (method === 'POST' && next.users.length >= 250) throw new Error('This demo supports up to 250 users.');
    if (method === 'PATCH' && next.users[index].role === 'Admin' && next.users[index].status === 'Active' && (input.role !== 'Admin' || input.status !== 'Active') && next.users.filter(x => x.role === 'Admin' && x.status === 'Active').length === 1) throw new Error('Keep at least one active administrator.');
    const user = { id: method === 'POST' ? randomUUID() : input.id, name,email,team,role:input.role,status:input.status,createdAt: method === 'POST' ? new Date().toISOString() : next.users[index].createdAt };
    if (method === 'POST') next.users.unshift(user); else next.users[index] = user;
    detail = `${name} - ${input.role}, ${input.status}`;
  }
  next.revision++;
  next.events.unshift({ id:randomUUID(),action:method === 'POST' ? 'User added' : method === 'PATCH' ? 'User updated' : 'User removed',detail,actor,at:new Date().toISOString() });
  next.events = next.events.slice(0,100);
  return next;
}
