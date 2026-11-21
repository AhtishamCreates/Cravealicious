const PHONE='447999660309';
document.querySelectorAll('[data-img]').forEach(i=>i.src=IMG[i.dataset.img]);
const B=(c,img)=>[[4,5],[6,7],[9,10],[12,13]].map(([n,p])=>({cat:c,img,name:`${c.slice(0,-1)} box of ${n}`,price:p,desc:c=='Brownies'?'Fudgy brownies with pistachio, Biscoff, Oreo, hazelnut or Kinder toppings.':'Soft sponge with piped buttercream. Themed sets available.'}));
const cake=(name,price,desc)=>({cat:'Cakes',img:'cake',name,price,desc});
const fam=(name,price,desc)=>({cat:'Family cakes',img:'cake',name,price,desc:desc||'Family-size, made to share.'});
const MENU=[
 ...B('Brownies','brownies1'),{cat:'Brownies',img:'brownies2',name:'Single brownie',price:1.5,desc:'One loaded brownie, baked fresh.'},
 ...B('Cupcakes','cupcakes1'),{cat:'Cupcakes',img:'cupcakes2',name:'Single cupcake',price:1,desc:'A classic piped cupcake.'},{cat:'Cupcakes',img:'cupcakes1',name:'Loaded single cupcake',price:1.5,desc:'Extra toppings and decorations.'},
 cake('Milkcake',3,'Soft, soaked and creamy.'),cake('Matilda cake',4,'Rich chocolate slice.'),cake('Coconut cake',3.5,'Light coconut sponge.'),cake('Carrot cake',3,'Spiced carrot sponge.'),cake('Velvet cake',3,'Red velvet slice.'),cake('Sprinkle cake',3,'Colourful and fun.'),cake('Chocolate sponge cake',3,'Classic chocolate sponge.'),
 fam('Milkcake tray',15),fam('Loaded carrot cake',20),fam('Velvet cake',15),fam('Coconut cake',20),fam('Fresh cream cake (from)',8,'Price depends on size.'),fam('Birthday or personalised cake (from)',5,'Price depends on design. Put your idea in the notes.')
].map((x,i)=>({...x,id:i}));
const $=s=>document.querySelector(s);
const money=n=>'£'+(Number.isInteger(n)?n:n.toFixed(2));
let cat='Brownies',cart={};
try{cart=JSON.parse(localStorage.getItem('crave-cart'))||{}}catch(e){}
const save=()=>{try{localStorage.setItem('crave-cart',JSON.stringify(cart))}catch(e){}};
function tabs(){
 $('#tabs').innerHTML=[...new Set(MENU.map(m=>m.cat))].map(c=>`<button role="tab" class="${c==cat?'on':''}">${c}</button>`).join('');
 $('#tabs').querySelectorAll('button').forEach(b=>b.onclick=()=>{cat=b.textContent;tabs();items()});
}
function items(){
 $('#items').innerHTML=MENU.filter(m=>m.cat==cat).map(m=>`<article class="card"><img src="${IMG[m.img]}" alt="${m.name}" loading="lazy"><div class="b"><h3>${m.name}</h3><p>${m.desc}</p><div class="row"><span class="price">${money(m.price)}</span><button class="add" data-id="${m.id}">Add</button></div></div></article>`).join('');
}
$('#items').addEventListener('click',e=>{
 const b=e.target.closest('.add');if(!b)return;
 cart[b.dataset.id]=(cart[b.dataset.id]||0)+1;render();toast(MENU[b.dataset.id].name+' added');
 const c=$('.cart-btn');c.classList.remove('pop');void c.offsetWidth;c.classList.add('pop');
});
function render(){
 const ids=Object.keys(cart).filter(k=>cart[k]>0);let t=0,c=0;
 $('#lines').innerHTML=ids.length?ids.map(k=>{const m=MENU[k];t+=m.price*cart[k];c+=cart[k];
  return `<li><span>${m.name}<br>${money(m.price*cart[k])}</span><div><button data-k="${k}" data-d="-1" aria-label="Remove one">−</button>${cart[k]}<button data-k="${k}" data-d="1" aria-label="Add one">+</button></div></li>`}).join(''):'<li>Your basket is empty. Add something sweet from the menu.</li>';
 $('#total').textContent=money(t);$('#count').textContent=c;save();
}
$('#lines').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;cart[b.dataset.k]=Math.max(0,(cart[b.dataset.k]||0)+Number(b.dataset.d));render()});
function openCart(o){$('#cart').classList.toggle('open',o);$('#veil').classList.toggle('on',o);$('#cart').setAttribute('aria-hidden',!o)}
$('#openCart').onclick=()=>openCart(true);$('#closeCart').onclick=$('#veil').onclick=()=>openCart(false);
$('#order').onsubmit=e=>{
 e.preventDefault();const ids=Object.keys(cart).filter(k=>cart[k]>0);
 if(!ids.length){toast('Add items to your basket first');return}
 const f=new FormData(e.target);
 const lines=ids.map(k=>`• ${cart[k]} x ${MENU[k].name} (${money(MENU[k].price*cart[k])})`).join('\n');
 window.open(`https://wa.me/${PHONE}?text=${encodeURIComponent(`Hi Cravealicious! I'd like to order:\n${lines}\n\nTotal: ${$('#total').textContent}\nName: ${f.get('name')}\nPhone: ${f.get('phone')}\nDate needed: ${f.get('date')}\n${f.get('how')}\nNotes: ${f.get('notes')||'None'}`)}`,'_blank');
 cart={};render();openCart(false);e.target.reset();toast('Order ready to send on WhatsApp');
};
$('#msg').onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);window.open(`https://wa.me/${PHONE}?text=${encodeURIComponent(`Hi, I'm ${f.get('n')}. ${f.get('m')}`)}`,'_blank');e.target.reset()};
$('#order [name=date]').min=new Date().toISOString().split('T')[0];
let tt;function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('on'),2200)}
const nav=$('#links'),bg=$('#burger');
bg.onclick=()=>{const o=nav.classList.toggle('open');bg.setAttribute('aria-expanded',o)};
nav.onclick=()=>{nav.classList.remove('open');bg.setAttribute('aria-expanded',false)};
addEventListener('scroll',()=>$('#nav').classList.toggle('on',scrollY>30),{passive:true});
$('#gal').addEventListener('click',e=>{const i=e.target.closest('img');if(!i)return;$('#lb img').src=i.src;$('#lb').classList.add('on')});
$('#lb').onclick=()=>$('#lb').classList.remove('on');
addEventListener('keydown',e=>{if(e.key=='Escape'){$('#lb').classList.remove('on');openCart(false)}});
document.querySelectorAll('.sec h2,.steps li,.occ article,.gal button').forEach(el=>el.classList.add('rv'));
const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}}),{threshold:.1});
document.querySelectorAll('.rv').forEach(el=>io.observe(el));
$('#yr').textContent=new Date().getFullYear();
tabs();items();render();
