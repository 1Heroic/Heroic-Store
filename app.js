let cart = JSON.parse(localStorage.getItem("orderCart") || "{}");
let activeCategory = "All";
let orderNumber = makeOrderNumber();
const $ = (s) => document.querySelector(s);
const money = n => new Intl.NumberFormat("en-US",{style:"currency",currency:STORE.currency}).format(n);

function makeOrderNumber(){const d=new Date();const date=d.toISOString().slice(0,10).replaceAll("-","");const rand=crypto.getRandomValues(new Uint32Array(1))[0].toString(36).slice(0,5).toUpperCase();return `ORD-${date}-${rand}`}
function itemCount(){return Object.values(cart).reduce((a,b)=>a+b,0)}
function discountRate(){const amount=subtotal();return STORE.orderDiscounts.filter(d=>amount>d.minimumSubtotal).sort((a,b)=>b.minimumSubtotal-a.minimumSubtotal)[0]?.percentOff/100||0}
function subtotal(){return STORE.products.reduce((sum,p)=>sum+(cart[p.id]||0)*p.price,0)}
function save(){localStorage.setItem("orderCart",JSON.stringify(cart));renderCart();renderPreview()}
function renderDiscounts(){$("#discountStrip").innerHTML=STORE.orderDiscounts.map(d=>`<div><strong>ORDERS OVER ${money(d.minimumSubtotal)}</strong><span>Save ${d.percentOff}%</span></div>`).join("")}

function renderFilters(){const cats=["All",...new Set(STORE.products.map(p=>p.category))];$("#filters").innerHTML=cats.map(c=>`<button class="${c===activeCategory?'active':''}" data-cat="${c}">${c}</button>`).join("");$("#filters").querySelectorAll("button").forEach(b=>b.onclick=()=>{activeCategory=b.dataset.cat;renderFilters();renderProducts()})}
function renderProducts(){const list=activeCategory==="All"?STORE.products:STORE.products.filter(p=>p.category===activeCategory);$("#productGrid").innerHTML=list.map(p=>`<article class="product"><i class="stock" title="In stock"></i><span class="category">${p.category.toUpperCase()}</span><h3>${p.name}</h3><span class="batch">${p.id} · ${p.batch}</span><div class="product-bottom"><strong class="price">${money(p.price)}</strong><button class="add" data-id="${p.id}" aria-label="Add ${p.name} to cart">+</button></div></article>`).join("");$("#productGrid").querySelectorAll(".add").forEach(b=>b.onclick=()=>{cart[b.dataset.id]=(cart[b.dataset.id]||0)+1;save();openCart()})}
function renderCart(){const items=STORE.products.filter(p=>cart[p.id]);$("#cartCount").textContent=itemCount();$("#cartItems").innerHTML=items.length?items.map(p=>`<div class="cart-item"><div><h4>${p.name}</h4><small>${p.batch} · ${money(p.price)}</small></div><strong>${money(p.price*cart[p.id])}</strong><div class="qty"><button data-act="minus" data-id="${p.id}">−</button><span>${cart[p.id]}</span><button data-act="plus" data-id="${p.id}">+</button></div><button class="remove" data-act="remove" data-id="${p.id}">Remove</button></div>`).join(""):`<p class="empty">Your cart is empty.</p>`;const sub=subtotal(),disc=sub*discountRate();$("#subtotal").textContent=money(sub);$("#discount").textContent=`−${money(disc)}`;$("#total").textContent=money(sub-disc);$("#cartItems").querySelectorAll("button").forEach(b=>b.onclick=()=>{const id=b.dataset.id;if(b.dataset.act==="plus")cart[id]++;if(b.dataset.act==="minus")cart[id]--;if(b.dataset.act==="remove"||cart[id]<=0)delete cart[id];save()})}
function customer(){return {name:$("#name").value.trim(),email:$("#email").value.trim(),phone:$("#phone").value.trim(),address:$("#address").value.trim(),notes:$("#notes").value.trim()}}
function buildOrder(){const c=customer(),items=STORE.products.filter(p=>cart[p.id]);if(!items.length)return "Add an item to begin your order.";const sub=subtotal(),rate=discountRate(),disc=sub*rate;return `${STORE.name} — ORDER FORM\n\nORDER NUMBER: ${orderNumber}\nDATE: ${new Date().toLocaleDateString()}\n\nCUSTOMER\nName: ${c.name||"[enter name]"}\nEmail: ${c.email||"[enter email]"}\nPhone: ${c.phone||"N/A"}\nShipping address: ${c.address||"[enter shipping address]"}\n\nITEMS\n${items.map(p=>`${cart[p.id]} × ${p.name} | ${p.id} | ${p.batch} | ${money(p.price*cart[p.id])}`).join("\n")}\n\nSubtotal: ${money(sub)}\nOrder discount (${Math.round(rate*100)}%): -${money(disc)}\nORDER TOTAL: ${money(sub-disc)}\n\nNOTES\n${c.notes||"None"}\n\nPlease reply to confirm availability, total, and next steps.`}
function renderPreview(){$("#orderPreview").textContent=buildOrder()}
function openCart(){$("#cartPanel").classList.add("open");$("#scrim").classList.add("open");$("#cartPanel").setAttribute("aria-hidden","false")}
function closeCart(){$("#cartPanel").classList.remove("open");$("#scrim").classList.remove("open");$("#cartPanel").setAttribute("aria-hidden","true")}
function valid(){if(!itemCount()){setStatus("Add at least one item first.");return false}if(!$("#customerForm").reportValidity()){setStatus("Complete the required customer fields.");return false}return true}
function setStatus(msg){$("#status").textContent=msg}

$("#cartTrigger").onclick=openCart;$("#closeCart").onclick=closeCart;$("#scrim").onclick=closeCart;$("#checkoutLink").onclick=closeCart;
$("#customerForm").addEventListener("input",renderPreview);
$("#newOrderNumber").onclick=()=>{orderNumber=makeOrderNumber();renderPreview();setStatus(`New order number: ${orderNumber}`)};
$("#copyOrder").onclick=async()=>{if(!valid())return;try{await navigator.clipboard.writeText(buildOrder());setStatus(`Copied ${orderNumber}. Paste it into your email.`)}catch{setStatus("Copy was blocked. Select the preview text and copy it manually.")}};
$("#emailOrder").onclick=()=>{if(!valid())return;const subject=encodeURIComponent(`New order ${orderNumber}`),body=encodeURIComponent(buildOrder());window.location.href=`mailto:${STORE.orderEmail}?subject=${subject}&body=${body}`;setStatus("Opening your email app…")};
renderDiscounts();renderFilters();renderProducts();renderCart();renderPreview();
