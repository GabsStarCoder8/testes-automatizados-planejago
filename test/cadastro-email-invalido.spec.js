import { test, expect } from '@playwright/test';

test('CT03 Validação de Dados: Deve bloquear cadastro com e-mail inválido', async ({ page }) => {

  // Acessa a tela
  await page.goto('http://127.0.0.1:8000/auth/create');
  
  // Preenche os campos normalmente
  await page.fill('input[name="name"]', 'Viana');
  await page.fill('input[name="data_nascimento"]', '2006-07-30');
  
  // Entrada inválida proposital (sem o @)
  await page.fill('input[name="email"]', 'email-invalido'); 
  
  await page.fill('input[name="password"]', 'senha12345');
  await page.fill('input[name="password_confirmation"]', 'senha12345');
  
  // Envia o formulário
  await page.click('button[type="submit"]');

  // Valida se a mensagem exata configurada no backend foi exibida na tela
  await expect(page.locator('text="Insira um Email valido"')).toBeVisible();
});