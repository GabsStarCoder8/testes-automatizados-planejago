import { test, expect } from '@playwright/test';

test('CT04 Validação de Dados: Deve realizar login com credenciais válidas (Caminho Feliz)', async ({ page }) => {
  //  Acesso à tela de autenticação
  await page.goto('http://127.0.0.1:8000/auth/login');

  // Preenchimento de dados válidos com fill()
  await page.fill('input[name="email"]', 'user@mail.com');
  await page.fill('input[name="password"]', '12345678');

  // Clique no botão com click()
  await page.click('button[type="submit"]');

  // Validação com expect(): O sistema deve redirecionar para o painel interno protegido
  await expect(page).toHaveURL(/.*dashboard/);

});