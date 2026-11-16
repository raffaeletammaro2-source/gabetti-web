import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const WEBHOOK_URL = "https://services.leadconnectorhq.com/hooks/7SlIJTlBrBHZi3qeGtPc/webhook-trigger/94f3d84f-f360-4201-8d86-aac5f2dc0b98";

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const payload = await req.json();
    console.log('[forward-lead-webhook] forwarding payload:', JSON.stringify(payload));

    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    console.log('[forward-lead-webhook] upstream status:', res.status, 'body:', text);

    return new Response(
      JSON.stringify({ success: res.ok, status: res.status, upstream: text }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (err) {
    console.error('[forward-lead-webhook] error:', err);
    return new Response(
      JSON.stringify({ success: false, error: String(err) }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
