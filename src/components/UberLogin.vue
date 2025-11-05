<template>
  <div class="page">
    <header class="topbar">Uber Eats</header>

    <div class="container">
      <div class="card">
        <h1>Indiquez votre numéro de téléphone ou votre adresse e-mail</h1>

        <input class="input" placeholder="Saisissez un numéro de téléphone ou une adresse e-mail" />

        <button class="btn primary">Continuer</button>

        <div class="divider"><span>ou</span></div>

        <button class="btn ghost">
          <svg class="icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <g fill="none" fill-rule="evenodd">
              <path d="M12 11.5a1 1 0 100-2 1 1 0 000 2z" fill="#EA4335"></path>
            </g>
          </svg>
          Continuer avec Google
        </button>

        <button class="btn ghost">
          <svg class="icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path d="M16.365 1.43c-.98.07-2.29.66-3.06 1.45-.67.69-1.43 1.8-1.25 2.86 1.35.06 2.71-.7 3.58-1.57.78-.77 1.34-1.98 0-2.74z" fill="#000"/>
          </svg>
          Continuer avec Apple
        </button>

        <div class="divider"><span>ou</span></div>

        <button class="btn ghost">
          <svg class="icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="2" stroke="#000" fill="none" />
            <path d="M7 7h10v10H7z" fill="#000"/>
          </svg>
          Connectez-vous avec le QR code
        </button>

        <p class="disclaimer">En continuant, vous acceptez de recevoir des appels, y compris par numérotation automatique, des communications sur WhatsApp ou des SMS d'Uber et de ses sociétés affiliées.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
// Composant purement présentatif pour reproduire la maquette
</script>

<style scoped>
:root{
  --card-width: 420px;
}
.page{
  min-height:100vh;
  display:flex;
  flex-direction:column;
}
.topbar{
  background:#000;
  color:#fff;
  padding:18px 24px;
  font-weight:700;
  font-size:22px;
}
.container{
  flex:1;
  display:flex;
  align-items:center;
  justify-content:center;
  padding:40px 16px;
}
.card{
  width:var(--card-width);
  max-width:100%;
  text-align:left;
}
.card h1{
  font-size:20px;
  margin:0 0 16px 0;
  line-height:1.25;
}
.input{
  width:100%;
  padding:12px 14px;
  border:1px solid #bdbdbd;
  border-radius:8px;
  margin-bottom:16px;
  box-sizing:border-box;
}
.btn{
  display:flex;
  align-items:center;
  gap:10px;
  width:100%;
  padding:12px 16px;
  border-radius:8px;
  border:0;
  cursor:pointer;
  font-weight:600;
  margin-bottom:12px;
}
.btn.primary{
  background:#000;
  color:#fff;
}
.btn.ghost{
  background:#efefef;
  color:#000;
  justify-content:flex-start;
}
.icon{display:inline-block}
.divider{
  display:flex;
  align-items:center;
  gap:12px;
  color:#9e9e9e;
  margin:8px 0 12px;
}
.divider::before, .divider::after{
  content:'';
  flex:1;
  height:1px;
  background:#ddd;
}
.divider span{padding:0 8px}
.disclaimer{
  color:#777;
  font-size:12px;
  margin-top:12px;
  line-height:1.4;
}

@media (max-width:480px){
  :root{--card-width:320px}
  .topbar{font-size:18px;padding:14px}
}
</style>
