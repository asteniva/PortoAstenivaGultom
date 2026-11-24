const svg = (k, cls="") => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[k]||""}</svg>`;
const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];
document.documentElement.classList.add("js");

function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove("show"),2600)}

/* Social icons, contact rows, links */
const mailHref = "https://mail.google.com/mail/?view=cm&to="+CONFIG.email;
$$("[data-socials]").forEach(el=>{
  el.innerHTML = [["linkedin","LinkedIn",CONFIG.linkedin],["githubc","GitHub",CONFIG.github],["mail","Email",mailHref],["instagram","Instagram",CONFIG.instagram]]
    .map(([k,n,h])=>`<a href="${h}" target="_blank" rel="noopener" aria-label="${n}" title="${n}">${svg(k)}</a>`).join("");
});
const cv=$("#cvBtn");
if(CONFIG.cv){cv.href=CONFIG.cv}else{cv.addEventListener("click",e=>{e.preventDefault();toast("Tambahkan link CV di CONFIG.cv")})}
$$("[data-link]").forEach(a=>{const h=CONFIG.projects[a.dataset.link];if(h){a.href=h}else{a.addEventListener("click",e=>{e.preventDefault();toast("Tambahkan link proyek di CONFIG.projects")})}});

const contacts=[["mail",CONFIG.email,mailHref,CONFIG.email],
["linkedin",CONFIG.linkedin.replace("https://",""),CONFIG.linkedin,CONFIG.linkedin],
["githubc",CONFIG.github.replace("https://",""),CONFIG.github,CONFIG.github]];
$("#clist").innerHTML=contacts.map(([k,t,h,c])=>`<div class="crow">
${svg(k)}<a href="
${h}" target="_blank" rel="noopener">
${t}</a><button class="copy" type="button" data-copy="${c}">Salin</button></div>`).join("");
async function copyText(txt){try{await navigator.clipboard.writeText(txt);toast("Tersalin")}catch(e){toast("Salin manual: "+txt)}}
document.addEventListener("click",e=>{const b=e.target.closest("[data-copy]");if(b)copyText(b.dataset.copy)});

/* Software skills */
const SW=[["python","Python"],["colab","Google Colab"],["excel","Microsoft Excel"],["looker","Looker Studio"],["powerbi","Power BI"],["mysql","SQL / MySQL"],["php","PHP"],["htmlcss","HTML & CSS"],["wordpress","WordPress"],["github","GitHub"],["office","Microsoft Office"]];
$("#swGrid").innerHTML=SW.map(([k,n])=>k==="htmlcss"
  ?`<div class="sk"><span class="pair">${svg("html")}${svg("css")}</span>${n}</div>`
  :`<div class="sk">${svg(k)}${n}</div>`).join("")
  +`<div class="sk soon"><span style="font-size:26px;line-height:42px;font-weight:300">+</span>Terus belajar</div>`;

/* Photos: show image, keep built-in illustration, or show a placeholder you can click to preview a local image */
const camera='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="18" height="14" rx="3"/><circle cx="12" cy="13" r="3.5"/><path d="M8 6l1.5-2.5h5L16 6"/></svg>';
const person='<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="8.5" r="4"/><path d="M4 21c.6-4.6 4-7 8-7s7.4 2.4 8 7z"/></svg>';
function setImg(el,src){el.classList.remove("empty");el.removeAttribute("tabindex");el.removeAttribute("role");el.innerHTML=`<img src="${src}" alt="${el.dataset.alt||""}" loading="lazy">`}
$$("[data-photo]").forEach(el=>{
  const src=PHOTOS[el.dataset.photo];
  el.classList.add("ph");
  if(src){setImg(el,src);return}
  if(el.children.length)return;          // keep built-in illustration
  const key=el.dataset.photo;
  el.classList.add("empty");el.setAttribute("tabindex","0");el.setAttribute("role","button");
  el.setAttribute("aria-label","Pratinjau foto: "+(el.dataset.label||key));
  el.innerHTML=`<span class="hint">${key==="profile"?person:camera}${el.dataset.label||key}<small>PHOTOS["${key}"]</small></span>`;
  const pick=()=>{const i=document.createElement("input");i.type="file";i.accept="image/*";i.onchange=()=>{const f=i.files[0];if(f)setImg(el,URL.createObjectURL(f))};i.click()};
  el.addEventListener("click",pick);
  el.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();pick()}});
});

/* Gallery filter */
$("#filters").addEventListener("click",e=>{
  const b=e.target.closest("button");if(!b)return;
  $$("#filters button").forEach(x=>x.setAttribute("aria-pressed",x===b));
  $$("#gal figure").forEach(f=>f.hidden=!(b.dataset.f==="all"||f.dataset.cat===b.dataset.f));
});

/* Contact form: compose message, copy it */
$("#msgForm").addEventListener("submit",e=>{
  e.preventDefault();
  const n=$("#fName").value.trim(),m=$("#fMail").value.trim(),t=$("#fMsg").value.trim(),o=$("#out");
  if(!n||!m||!t){o.hidden=false;o.innerHTML="<b>Lengkapi nama, email, dan pesan terlebih dahulu.</b>";return}
  const body=`Halo Asteniva,\n\n${t}\n\nSalam,\n${n}\n${m}`;
  o.hidden=false;
  o.innerHTML=`<b>Pesan siap dikirim ke ${CONFIG.email}</b><pre></pre><button class="btn btn-teal" type="button" id="cp">Salin pesan</button>`;
  $("pre",o).textContent=body;
  $("#cp").onclick=()=>copyText(body);
});

/* Navbar */
const links=$("#links"),burger=$("#burger");
burger.addEventListener("click",()=>{const o=links.classList.toggle("open");burger.setAttribute("aria-expanded",o)});
links.addEventListener("click",e=>{if(e.target.closest("a")){links.classList.remove("open");burger.setAttribute("aria-expanded","false")}});
const map={};$$("#links a").forEach(a=>map[a.getAttribute("href").slice(1)]=a);
const secs=$$("main section[id]");
const alias={activities:"organization",education:"organization"};
const spy=()=>{
  const y=window.scrollY+120;let cur="home";
  secs.forEach(s=>{if(s.offsetTop<=y)cur=s.id});
  const k=alias[cur]||cur;
  Object.entries(map).forEach(([id,a])=>a.classList.toggle("on",id===k));
};
addEventListener("scroll",spy,{passive:true});spy();

/* Theme toggle */
$("#themeBtn").addEventListener("click",()=>{
  const r=document.documentElement;
  const dark=r.dataset.theme?r.dataset.theme==="dark":matchMedia("(prefers-color-scheme: dark)").matches;
  r.dataset.theme=dark?"light":"dark";
  try{localStorage.setItem("theme",r.dataset.theme)}catch(e){}
});
try{const s=localStorage.getItem("theme");if(s)document.documentElement.dataset.theme=s}catch(e){}

/* Scroll reveal */
const io=new IntersectionObserver((es)=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add("in");io.unobserve(x.target)}}),{threshold:.08,rootMargin:"0px 0px -40px 0px"});
$$(".rv").forEach(el=>io.observe(el));
