import { invoicePayload } from './scope.mjs';
const BASE='https://api-m.sandbox.paypal.com';
export async function createDraft(quote,credentials,fetcher=fetch){
 const payload=invoicePayload(quote);
 if(!credentials.client||!credentials.secret)throw new Error('PayPal sandbox is not connected yet.');
 const tokenResponse=await fetcher(BASE+'/v1/oauth2/token',{method:'POST',headers:{Authorization:'Basic '+btoa(credentials.client+':'+credentials.secret),'Content-Type':'application/x-www-form-urlencoded'},body:'grant_type=client_credentials',signal:AbortSignal.timeout(20000)});
 if(!tokenResponse.ok)throw new Error('PayPal sandbox authentication failed. Check the server credentials.');
 const token=await tokenResponse.json(); if(!token.access_token)throw new Error('PayPal returned no access token.');
 const response=await fetcher(BASE+'/v2/invoicing/invoices',{method:'POST',headers:{Authorization:'Bearer '+token.access_token,'Content-Type':'application/json',Prefer:'return=representation'},body:JSON.stringify(payload),signal:AbortSignal.timeout(20000)});
 if(!response.ok)throw new Error('PayPal rejected the draft. Check the sandbox business account and invoice fields.');
 const result=await response.json();if(!result.id)throw new Error('PayPal did not confirm an invoice ID. Verify the sandbox dashboard before retrying.');
 return {id:result.id,status:result.status||'DRAFT',environment:'sandbox'};
}
