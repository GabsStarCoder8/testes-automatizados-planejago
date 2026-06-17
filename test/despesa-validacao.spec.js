import { test, expect } from '@playwright/test';

test('CT05 Validação de Dados: Deve impedir a criação de despesa com valor negativo', async ({ page }) => {

  // login para acessar a área interna
  await page.goto('http://127.0.0.1:8000/auth/login');
  await page.fill('input[name="email"]', 'user@mail.com');
  await page.fill('input[name="password"]', '12345678');
  await page.click('button[type="submit"]');

  // Navega para a tela de lançamentos
  await page.goto('http://127.0.0.1:8000/lancamentos');

  // Abre o modal 
  await page.locator('#btn-dropdown-lancamento').first().click();
  await page.waitForTimeout(500);
  await page.click('text="Nova Despesa"');

  // Preenche os dados normais
  await page.fill('#descricao', 'Conta de Teste');
  await page.selectOption('#categoria', '1');
  await page.selectOption('#frequencia', '1');
  await page.fill('#dataCriacao', '2026-06-16');
  await page.fill('#dataVencimento', '2026-06-20');

  // O Teste de Valor Negativo
  // page.type() em vez de fill() para simular a digitação humana tecla por tecla.
  await page.type('#valor', '-50.00');

  // Verifica o que realmente ficou no campo (deve ser '50.00', ignorando o sinal negativo)
  const valorDigitado = await page.inputValue('#valor');
  expect(valorDigitado).not.toContain('-');

  // Tenta forçar um valor negativo ignorando o teclado (injetando via código)
  await page.evaluate(() => {
    document.getElementById('valor').value = '-10.00';
  });
  
  await page.click('button:has-text("Salvar Despesa")');

  // Validação: O modal não deve fechar e a página não deve recarregar, pois o formulário é inválido e travou no frontend.
  await expect(page.locator('#valor')).toBeVisible();
});