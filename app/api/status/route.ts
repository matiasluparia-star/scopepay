import { env } from 'cloudflare:workers';
export async function GET(){const e=env as unknown as Record<string,string>;return Response.json({paypal:!!(e.PAYPAL_SANDBOX_CLIENT_ID&&e.PAYPAL_SANDBOX_CLIENT_SECRET),ai:'local-naive-bayes',environment:'sandbox'},{headers:{'Cache-Control':'no-store'}});}
