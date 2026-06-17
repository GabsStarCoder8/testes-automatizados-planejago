import { test, expect } from '@playwright/test';

// Lista com todas as rotas protegidas 
const rotasProtegidas = [
  '/dashboard',
  '/lancamentos',
  '/relatorio',
  '/calculadora'
];

// Loop que cria um teste para cada rota da lista
for (const rota of rotasProtegidas) {
  
  // O nome do teste muda dinamicamente 
  test(`CT01 Segurança: Deve bloquear acesso a ${rota} sem autenticação (CT03)`, async ({ page }) => {
    
    // Acessa a rota atual do loop
    await page.goto(`http://127.0.0.1:8000${rota}`);

    // Valida se foi jogado para o login
    await expect(page).toHaveURL(/.*login/);
  });
  
}