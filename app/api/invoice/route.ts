import { env } from 'cloudflare:workers';
import { createDraft } from '../../../lib/paypal.mjs';
export async function POST(request:Request){
 const origin=request.headers.get('origin');if(!origin||origin!==new URL(request.url).origin)return Response.json({error:'Same-origin requests only.'},{status:403});
 if(Number(request.headers.get('content-length')||0)>16000)return Response.json({error:'Request too large.'},{status:413});
 try{const raw=await request.text();if(raw.length>16000)return Response.json({error:'Request too large.'},{status:413});const e=env as unknown as Record<string,string>;const data=await createDraft(JSON.parse(raw),{client:e.PAYPAL_SANDBOX_CLIENT_ID,secret:e.PAYPAL_SANDBOX_CLIENT_SECRET});return Response.json(data,{headers:{'Cache-Control':'no-store'}});}catch(error){const message=error instanceof Error?error.message:'Unable to create draft.';return Response.json({error:message.includes('timeout')?'PayPal timed out. Check the sandbox dashboard before retrying.':message},{status:400});}
}
