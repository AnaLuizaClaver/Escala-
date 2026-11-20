const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Cache-Control': 'no-store',
};

const json = (body: object, status: number) => Response.json(body, { status, headers: cors });
const invalid = () => json({ error: 'invalid_credentials' }, 401);

Deno.serve(async request => {
  if (request.method === 'OPTIONS') return new Response(null, { headers: cors });
  if (request.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

  const url = Deno.env.get('SUPABASE_URL');
  const publicKey = Deno.env.get('SUPABASE_ANON_KEY');
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !publicKey || !serviceKey) return json({ error: 'unavailable' }, 503);

  let fields: { username?: unknown; password?: unknown };
  try {
    const body = await request.text();
    if (body.length > 4096) return json({ error: 'invalid_request' }, 400);
    fields = JSON.parse(body);
  } catch {
    return json({ error: 'invalid_request' }, 400);
  }
  if (!fields || typeof fields.username !== 'string' || typeof fields.password !== 'string') return invalid();
  const username = fields.username.trim().toLowerCase();
  if (!/^[a-z0-9_]{3,24}$/.test(username) || fields.password.length > 256 || !fields.password) return invalid();

  const serviceHeaders = { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` };
  try {
    const lookup = new URL('/rest/v1/profiles', url);
    lookup.searchParams.set('select', 'id');
    lookup.searchParams.set('username', `eq.${username}`);
    lookup.searchParams.set('limit', '1');
    const profiles = await fetch(lookup, { headers: serviceHeaders });
    if (!profiles.ok) return json({ error: 'unavailable' }, 503);
    const [profile] = await profiles.json();
    let email = 'no-matching-user@example.invalid';
    if (profile) {
      const account = await fetch(new URL(`/auth/v1/admin/users/${profile.id}`, url), { headers: serviceHeaders });
      if (account.ok) email = (await account.json()).email ?? email;
      else if (account.status !== 404) return json({ error: 'unavailable' }, 503);
    }

    const token = await fetch(new URL('/auth/v1/token?grant_type=password', url), {
      method: 'POST',
      headers: { apikey: publicKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: fields.password }),
    });
    if (token.status === 429) return json({ error: 'rate_limited' }, 429);
    if (token.status >= 500) return json({ error: 'unavailable' }, 503);
    if (!token.ok || !profile) return invalid();
    const { access_token, refresh_token } = await token.json();
    return json({ access_token, refresh_token }, 200);
  } catch {
    return json({ error: 'unavailable' }, 503);
  }
});
