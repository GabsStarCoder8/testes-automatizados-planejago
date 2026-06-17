import { test, expect } from '@playwright/test';

test('CT06 Segurança: Deve bloquear injeção de script (XSS) na descrição da despesa', async ({ page }) => {

  // Configura um Event Listener para interceptar diálogos e falhar o teste caso o JS seja executado
  page.on('dialog', dialog => {
    // Se entrar aqui, significa que o <script> rodou e o teste falhou
    expect(dialog.message()).not.toContain('Ataque XSS');
  });

  // login
  await page.goto('http://127.0.0.1:8000/auth/login');
  await page.fill('input[name="email"]', 'user@mail.com');
  await page.fill('input[name="password"]', '12345678');
  await page.click('button[type="submit"]');

  // Navega para a tela de lançamentos
  await page.goto('http://127.0.0.1:8000/lancamentos');

  // Abre o menu e clica em Nova Despesa
  await page.locator('#btn-dropdown-lancamento').first().click();
  await page.waitForTimeout(500); // Aguarda a animação do dropdown
  await page.click('text="Nova Despesa"'); 

  // O Teste de Injeção de Segurança (Payload XSS)
  await page.fill('#descricao', '<script>alert("Ataque XSS")</script>');
  
  // Preenche o resto com dados válidos
  await page.selectOption('#categoria', '1');
  await page.selectOption('#frequencia', '1');
  await page.fill('#dataCriacao', '2026-06-16');
  await page.fill('#dataVencimento', '2026-06-20');
  await page.fill('#valor', '100.00');

  // Clica em salvar
  await page.click('button:has-text("Salvar Despesa")');

  // Confirma que o XSS falhou e a navegação ocorreu normalmente.
  await expect(page).toHaveURL(/.*lancamentos/);
});