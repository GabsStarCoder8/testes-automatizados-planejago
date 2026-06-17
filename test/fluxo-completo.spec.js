import { test, expect } from '@playwright/test';

test('CT10: Fluxo-Completo Login > Criar receita > Criar Despesa > Ver Gráfico', async ({ page }) => {
  await page.goto('http://localhost:8000/');
  await page.getByRole('link', { name: 'Começar' }).click();
  await page.getByRole('textbox', { name: 'Ex: João Silva' }).click();
  await page.getByRole('textbox', { name: 'Ex: João Silva' }).fill('Maria');
  await page.locator('input[name="data_nascimento"]').fill('2004-03-12');
  await page.getByRole('textbox', { name: 'Ex: usuario@gmail.com' }).click();
  await page.getByRole('textbox', { name: 'Ex: usuario@gmail.com' }).fill('maria@gmail.com');
  await page.locator('input[name="password"]').click();
  await page.locator('input[name="password"]').fill('senha12345678');
  await page.locator('input[name="password_confirmation"]').click();
  await page.locator('input[name="password_confirmation"]').fill('senha12345678');
  await page.getByRole('button', { name: 'Cadastrar-se' }).click();

  // Validação 1: Espera-se que, após o cadastro/login, o sistema redirecione com sucesso para o Dashboard e exiba a mensagem de boas-vindas ao usuário.
  await expect(page.getByText('Olá, Maria! Poupar hoje é')).toBeVisible();

  await page.getByRole('link', { name: 'Lançamentos' }).click();
  await page.locator('#btn-dropdown-lancamento').click();
  await page.getByRole('button', { name: 'Nova Receita' }).click();
  await page.getByRole('textbox', { name: 'Descrição' }).click();
  await page.getByRole('textbox', { name: 'Descrição' }).fill('Sal');
  await page.getByRole('textbox', { name: 'Descrição' }).press('Dead');
  await page.getByRole('textbox', { name: 'Descrição' }).fill('Salário');
  await page.getByRole('spinbutton', { name: 'Valor' }).click();
  await page.getByRole('spinbutton', { name: 'Valor' }).fill('1500');
  await page.getByRole('textbox', { name: 'Data da Criação' }).fill('2026-06-17');
  await page.locator('#frequencia_receita').selectOption('4');
  await page.getByRole('button', { name: 'Salvar Receita' }).click();

  // Validação 2: Espera-se que, após salvar a transação, a nova receita (Salário) apareça visível como um item na tabela de lançamentos.
  await expect(page.getByRole('cell', { name: 'Salário' }).first()).toBeVisible();

  await page.locator('#btn-dropdown-lancamento').click();
  await page.getByRole('button', { name: 'Nova Despesa' }).click();
  await page.getByRole('textbox', { name: 'Descrição Descrição' }).click();
  await page.getByRole('textbox', { name: 'Descrição Descrição' }).fill('Conta energia');
  await page.getByRole('spinbutton', { name: 'Valor Valor' }).click();
  await page.getByRole('spinbutton', { name: 'Valor Valor' }).fill('350');
  await page.locator('#status').selectOption('false');
  await page.getByRole('textbox', { name: 'Data da Criação Data da Cria' }).fill('2026-06-17');
  await page.getByRole('button', { name: 'Salvar Despesa' }).click();
  await page.getByRole('textbox', { name: 'Data de Vencimento Data de' }).fill('2026-06-17');
  await page.getByRole('button', { name: 'Salvar Despesa' }).click();

  // Validação 3: Espera-se que, após salvar a transação, a nova despesa (Conta energia) também conste visível na tabela de lançamentos.
  await expect(page.getByRole('cell', { name: 'Conta energia' })).toBeVisible();

  await page.locator('div').nth(4).click();
  
  // Validação 4: Espera-se que, ao retornar/acessar a área do painel, o container do gráfico ("Semestre Atual") seja renderizado e esteja visível na tela.
  await expect(page.locator('div').filter({ hasText: 'Semestre Atual' }).nth(2)).toBeVisible();
});