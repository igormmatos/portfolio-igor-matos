# 🚀 Como Usar as Melhorias

## Opção 1: Deploy Automático (Recomendado)

Se você usa Vercel, Netlify ou GitHub Pages, o deploy será automático:

1. As alterações já foram enviadas para o repositório
2. Aguarde o deploy automático (geralmente 2-5 minutos)
3. Acesse seu site para ver as melhorias

## Opção 2: Deploy Manual

### Passo 1: Atualizar seu repositório local
```bash
git pull origin main
```

### Passo 2: Instalar dependências
```bash
pnpm install
# ou
npm install
```

### Passo 3: Testar localmente
```bash
pnpm dev
# ou
npm run dev
```

Acesse: http://localhost:5173

### Passo 4: Build para produção
```bash
pnpm build
# ou
npm run build
```

### Passo 5: Deploy
Os arquivos estarão na pasta `dist/` prontos para deploy.

## 🎨 Personalizações Opcionais

### Alterar Cores dos Blobs
Edite `components/LandingPageImproved.tsx`, linhas 186-188:
```tsx
<div className="absolute top-20 left-10 w-96 h-96 bg-indigo-600 blob"></div>
<div className="absolute bottom-20 right-10 w-80 h-80 bg-cyan-600 blob"></div>
<div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-purple-600 blob"></div>
```

Troque `bg-indigo-600`, `bg-cyan-600`, `bg-purple-600` por outras cores do Tailwind.

### Ajustar Velocidade das Animações
Edite `custom-animations.css` e altere os valores de `duration`:
```css
@keyframes gradient-shift {
  /* Mude de 8s para outro valor */
  animation: gradient-shift 8s ease infinite;
}
```

### Desabilitar Animações ao Scroll
Se preferir sem animações ao scroll, substitua no `LandingPageImproved.tsx`:
```tsx
<ScrollReveal>
  {/* conteúdo */}
</ScrollReveal>
```

Por:
```tsx
<div>
  {/* conteúdo */}
</div>
```

## 🐛 Solução de Problemas

### Problema: Site não carrega
**Solução:** Limpe o cache do navegador (Ctrl+Shift+R)

### Problema: Animações não funcionam
**Solução:** Verifique se o arquivo `custom-animations.css` foi importado corretamente

### Problema: Erros de build
**Solução:** Delete `node_modules` e reinstale as dependências

## 📞 Suporte

Se precisar de ajuda, abra uma issue no GitHub ou entre em contato.

---

**Bom uso das melhorias! 🎉**
