// ScopePay's tiny, locally trained multinomial Naive Bayes classifier.
// Training sentences are original synthetic examples, not customer data.
export const corpus = {
 data: ['clean csv spreadsheet duplicate records','convert json csv excel data files','normalize dataset missing values columns','python pandas data processing script','merge spreadsheets remove duplicate rows','analyze sales dataset report charts','transform structured json records','validate csv schema clean email list'],
 web: ['build responsive website landing page','fix website css mobile layout','create react web application interface','develop frontend form browser website','wordpress page website redesign','integrate web api backend endpoint','repair html javascript navigation','responsive ecommerce product page'],
 design: ['design logo brand identity illustration','create visual icons graphics assets','revise brand typography color palette','design poster artwork print layout','create social media graphic banner','draw original vector illustration','produce visual mockup figma design','design packaging logo revision'],
 writing: ['write technical documentation readme guide','edit article copy proofreading','document api endpoints examples','translate text english spanish','write tutorial user instructions','research sources summarize report','create product copy written content','proofread documentation improve clarity']
};
const tokenize = text => text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').match(/[a-z]{3,}/g)||[];
const vocabulary = new Set(Object.values(corpus).flat().flatMap(tokenize));
const models = Object.fromEntries(Object.entries(corpus).map(([label,docs])=>{const counts={};let total=0; for(const t of docs.flatMap(tokenize)){counts[t]=(counts[t]||0)+1;total++;}return [label,{counts,total}];}));
export function classify(text){
 const tokens=tokenize(text).filter(t=>vocabulary.has(t));
 if(!tokens.length) return {label:'general',strength:'low',evidence:[]};
 const scores=Object.entries(models).map(([label,m])=>({label,score:tokens.reduce((s,t)=>s+Math.log(((m.counts[t]||0)+1)/(m.total+vocabulary.size)),Math.log(0.25))})).sort((a,b)=>b.score-a.score);
 const margin=scores[0].score-scores[1].score;
 return {label:scores[0].label,strength:margin>2?'strong':'low',evidence:[...new Set(tokens)].slice(0,6)};
}
export const checks={data:'Confirm input format, row count and acceptance checks.',web:'Confirm supported browsers, page count and revision limit.',design:'Confirm file formats, usage rights and revision limit.',writing:'Confirm word count, language and revision limit.',general:'Confirm deliverables, acceptance criteria and revision limit.'};
export function cents(value){
 const s=String(value).trim(); if(!/^(?:0|[1-9]\d{0,5})(?:\.\d{1,2})?$/.test(s))throw new Error('Use a positive amount with up to two decimal places.');
 const [whole,decimal='']=s.split('.');const n=Number(whole)*100+Number(decimal.padEnd(2,'0'));
 if(n<=0||n>10000000)throw new Error('Each item must be between 0.01 and 100,000.00.');return n;
}
export const amount = n => (n/100).toFixed(2);
export function analyze(brief){
 const category=classify(brief); const items=[],unresolved=[]; const currencies=new Set();
 const lines=brief.split(/\n/).map(s=>s.trim()).filter(Boolean);
 for(const line of lines){
  if(/^(client|email|currency|customer)\s*:/i.test(line))continue;
  const match=line.match(/^(.+?)\s*(?:—|–|:|\s-\s)\s*(?:(EUR|USD|GBP|€|\$|£)\s*)?([0-9]+(?:\.[0-9]{1,2})?)\s*(EUR|USD|GBP|€|\$|£)?$/i);
  if(!match){unresolved.push(line);continue;}
  const code=x=>({'€':'EUR','$':'USD','£':'GBP'}[x]||x?.toUpperCase());
  const left=code(match[2]),right=code(match[4]);if(left&&right&&left!==right){unresolved.push(line);continue;}
  const currency=left||right;
  if(!currency){unresolved.push(line);continue;}
  try {const price=cents(match[3]);currencies.add(currency);items.push({name:match[1].slice(0,127),price:amount(price),source:line});}catch{unresolved.push(line);}
 }
 const mixed=currencies.size>1;
 return {category,items,unresolved,currency:currencies.values().next().value||'EUR',mixed,check:checks[category.label],email:brief.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0]||''};
}
export function validateQuote(q){
 if(!q||q.approved!==true)throw new Error('Review and approve the quote first.');
 if(!['EUR','USD','GBP'].includes(q.currency))throw new Error('Choose EUR, USD or GBP.');
 if(typeof q.email!=='string'||q.email.length>254||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(q.email))throw new Error('Enter a valid sandbox customer email.');
 if(!Array.isArray(q.items)||!q.items.length||q.items.length>20)throw new Error('Include 1–20 priced deliverables.');
 let total=0;const items=q.items.map(i=>{if(typeof i.name!=='string'||!i.name.trim()||i.name.length>127)throw new Error('Each deliverable needs a name (up to 127 characters).');const price=cents(i.price);total+=price;return {name:i.name.trim(),price:amount(price)};});
 if(total>10000000)throw new Error('Quote total exceeds 100,000.00.');
 return {email:q.email.trim(),currency:q.currency,items,total:amount(total)};
}
export function invoicePayload(q){const v=validateQuote(q);return {detail:{currency_code:v.currency,note:'ScopePay sandbox demo. Draft only. No real payment. No tax calculated.',payment_term:{term_type:'DUE_ON_RECEIPT'}},primary_recipients:[{billing_info:{email_address:v.email}}],items:v.items.map(i=>({name:i.name,quantity:'1',unit_amount:{currency_code:v.currency,value:i.price}}))};}
