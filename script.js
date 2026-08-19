const habitual = [
  ["Reparación","Kit de reparación",500,1000],
  ["Rendimiento","Piezas de Rendimiento",7000,10000],
  ["Pintura","Kit de pintura",500,1500],
  ["Estética","Piezas Cosméticas",2000,4000],
  ["Ruedas / Llantas","Set de Rines",7000,10000],
  ["Extras","Humo Neumáticos",2500,10000]
];

const full = [
  ["Reparación","Kit de reparación",500,1000],
  ["Rendimiento","Piezas de Rendimiento",7000,10000],
  ["Pintura","Kit de pintura",500,1500],
  ["Estética","Piezas Cosméticas",2000,4000],
  ["Ruedas / Llantas","Set de Rines (Ruedas)",7000,10000],
  ["Humo Neumáticos","Kit de Humo para neumáticos",2500,10000],
  ["Otros","Motor V8 Upgrade",40000,50000],
  ["Otros","Frenos cerámicos",8000,25000],
  ["Otros","Turbo Charger",25000,25000],
  ["Tracción Ambas","Tracción AWD",8000,13000],
  ["Tracción Trasera","Tracción RWD",7000,12000],
  ["Tracción Delantera","Tracción FWD",6000,11000],
  ["Neumáticos","Slick",4000,7000],
  ["Neumáticos","Semi-Slick",3500,7000],
  ["Neumáticos","Offroad",4500,7000],
  ["Extras","Stance o suspensión",3000,10000],
  ["Extras","Extras",4000,10000]
];

const money = n => "$" + Math.round(n).toLocaleString("es-ES");
const storageKey = "grotti-workshop-v1";

function renderCalculator(items, targetId, prefix){
  const target = document.getElementById(targetId);
  target.innerHTML = "";
  let lastCat = "";
  items.forEach((item,i)=>{
    const [cat,name,cost,price] = item;
    if(cat !== lastCat){
      const c = document.createElement("div");
      c.className = "category";
      c.textContent = cat.toUpperCase();
      target.appendChild(c);
      lastCat = cat;
    }
    const row = document.createElement("div");
    row.className = "calc-row";
    row.dataset.index = i;
    row.innerHTML = `<span>${name}</span>
      <span><input type="number" min="0" step="1" value="0" aria-label="${name}"></span>
      <span class="cost">${money(cost)}</span>
      <span class="price">${money(price)}</span>
      <span class="row-total">${money(0)}</span>`;
    row.querySelector("input").addEventListener("input",()=>update(items,targetId,prefix));
    target.appendChild(row);
  });
}

function update(items,targetId,prefix){
  const target = document.getElementById(targetId);
  let total = 0;
  target.querySelectorAll(".calc-row").forEach((row,i)=>{
    const qty = Math.max(0, Number(row.querySelector("input").value)||0);
    const rowTotal = qty * items[Number(row.dataset.index)][3];
    row.querySelector(".row-total").textContent = money(rowTotal);
    total += rowTotal;
  });
  document.getElementById(prefix+"Total").textContent = money(total);
  [5,10,15].forEach(p=>{
    document.getElementById(prefix+p+"total").textContent = money(total);
    document.getElementById(prefix+p+"pay").textContent = money(total*(1-p/100));
  });
  save();
}

function reset(targetId,prefix){
  document.getElementById(targetId).querySelectorAll("input").forEach(i=>i.value=0);
  update(targetId==="habitualRows"?habitual:full,targetId,prefix);
}

function save(){
  const data = {};
  document.querySelectorAll(".calc-row").forEach(row=>{
    const key = row.closest("#habitualRows") ? "h" : "f";
    data[key + row.dataset.index] = row.querySelector("input").value;
  });
  localStorage.setItem(storageKey, JSON.stringify(data));
}

function load(){
  try{
    const data=JSON.parse(localStorage.getItem(storageKey)||"{}");
    document.querySelectorAll(".calc-row").forEach(row=>{
      const key=row.closest("#habitualRows")?"h":"f";
      if(data[key+row.dataset.index] !== undefined) row.querySelector("input").value=data[key+row.dataset.index];
    });
  }catch(e){}
  update(habitual,"habitualRows","habitual");
  update(full,"fullRows","full");
}

renderCalculator(habitual,"habitualRows","habitual");
renderCalculator(full,"fullRows","full");
load();

document.getElementById("clearHabitual").onclick=()=>reset("habitualRows","habitual");
document.getElementById("resetHabitual").onclick=()=>reset("habitualRows","habitual");
document.getElementById("clearFull").onclick=()=>reset("fullRows","full");
document.getElementById("resetFull").onclick=()=>reset("fullRows","full");

document.querySelectorAll("[data-copy]").forEach(btn=>{
  btn.onclick=()=>{
    const text=document.getElementById(btn.dataset.copy).textContent;
    navigator.clipboard?.writeText(text.replace("$","").trim());
    const toast=document.getElementById("toast");
    toast.textContent=`Monto ${text} copiado.`;
    toast.classList.add("show");
    setTimeout(()=>toast.classList.remove("show"),1800);
  };
});

const sidebar=document.getElementById("sidebar"), overlay=document.getElementById("overlay");
document.getElementById("menuBtn").onclick=()=>{sidebar.classList.add("open");overlay.classList.add("show")};
document.getElementById("closeBtn").onclick=()=>{sidebar.classList.remove("open");overlay.classList.remove("show")};
overlay.onclick=()=>{sidebar.classList.remove("open");overlay.classList.remove("show")};

document.querySelectorAll(".nav-btn").forEach(btn=>{
  btn.onclick=()=>{
    document.querySelectorAll(".nav-btn").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    document.querySelectorAll(".view").forEach(v=>v.classList.remove("active"));
    document.getElementById(btn.dataset.view).classList.add("active");
    sidebar.classList.remove("open");overlay.classList.remove("show");
    window.scrollTo({top:0,behavior:"smooth"});
  };
});
