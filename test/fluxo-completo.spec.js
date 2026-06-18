import { test, expect } from '@playwright/test';

test('CT10: Fluxo-completo', async ({ page }) => {
  // Gerador de e-mail dinâmico para evitar o erro de "e-mail já cadastrado"
  const emailDinamico = `joao_${Date.now()}@gmail.com`;

  //cadastro
  await page.goto('http://localhost:8000/');
  await page.getByRole('link', { name: 'Começar' }).click();
  await page.getByRole('textbox', { name: 'Ex: João Silva' }).fill('João Silva');
  await page.locator('input[name="data_nascimento"]').fill('2006-02-17');
  await page.getByRole('textbox', { name: 'Ex: usuario@gmail.com' }).fill(emailDinamico);
  await page.locator('input[name="password"]').fill('12345678');
  await page.locator('input[name="password_confirmation"]').fill('12345678');
  await page.getByRole('button', { name: 'Cadastrar-se' }).click();

  // Espera que, após o cadastro, o usuário seja redirecionado ao dashboard com a saudação correta.
  await expect(page.getByRole('heading', { name: 'Olá, João!' })).toBeVisible();

  //logout e login
  await page.getByRole('button', { name: 'Abrir menu de usuário' }).click();
  await page.getByRole('menuitem', { name: 'Deslogar' }).click();
  await page.getByRole('textbox', { name: 'Ex: usuario@gmail.com' }).fill(emailDinamico);
  await page.locator('input[name="password"]').fill('12345678');
  await page.locator('div').filter({ hasText: 'Entrar' }).nth(3).click();

  // Espera que, ao fazer login, o painel principal seja carregado permitindo o acesso do usuário.
  await expect(page.getByRole('heading', { name: 'Olá, João!' })).toBeVisible();

  //criar despesa
  await page.getByRole('link', { name: 'Lançamentos' }).click();
  await page.locator('#btn-dropdown-lancamento').click();
  await page.getByRole('button', { name: 'Nova Despesa' }).click();
  await page.getByRole('textbox', { name: 'Descrição Descrição' }).fill('Conta de luz');
  await page.getByRole('spinbutton', { name: 'Valor Valor' }).fill('350');
  await page.locator('#status').selectOption('false');
  await page.locator('#frequencia').selectOption('4');
  await page.getByRole('textbox', { name: 'Data da Criação Data da Cria' }).fill('2026-06-18');
  await page.getByRole('textbox', { name: 'Data de Vencimento Data de' }).fill('2026-06-19');
  await page.getByRole('button', { name: 'Salvar Despesa' }).click();

  // Espera que a nova despesa criada ("Conta de luz") seja listada visivelmente na tabela.
  await expect(page.getByRole('cell', { name: 'Conta de luz' })).toBeVisible();

  //calculadora -> criar receita
  await page.getByRole('link', { name: 'Calculadora' }).click();
  await page.getByRole('button').nth(1).click();
  await page.getByRole('button', { name: 'Nova Receita' }).click();
  await page.getByRole('spinbutton', { name: 'Valor' }).fill('150');
  await page.getByRole('textbox', { name: 'Data da Criação' }).fill('2026-06-18');
  await page.locator('#categoria_receita').selectOption('5');
  await page.getByRole('button', { name: 'Salvar Receita' }).click();

  // Espera que a receita gerada a partir da calculadora apareça na listagem de lançamentos.
  await expect(page.getByRole('cell', { name: 'Rendimento Calculadora' })).toBeVisible();

  //editar despesa
  await page.locator('.p-2.rounded-md.hover\\:bg-gray-100.transition.group.btn-abrir-modal-editar-despesa').click();
  await page.locator('#modal-descricao').fill('Conta de agua');
  await page.locator('#modal-valor').fill('100');
  await page.getByRole('button', { name: 'Salvar Despesa' }).click();

// Espera que a alteração seja concluída e o novo nome ("Conta de agua") reflita na tabela.
  await expect(page.getByRole('cell', { name: 'Conta de agua' })).toBeVisible();

  //excluir lançamento
  await page.locator('tr:nth-child(2) > .p-3.flex > .p-2.rounded-md.hover\\:bg-rose-50').click();
  await page.getByRole('button', { name: 'Sim, excluir' }).click();

  // Espera que, após a exclusão da despesa, o saldo total da tela seja atualizado corretamente para R$ 150,00.
  await expect(page.getByText('Home Lançamentos Lançamentos Nova Despesa Nova Receita Saldo Total R$ 150,00')).toBeVisible();

  //gerar relatótorios
  await page.getByRole('link', { name: 'Relatórios' }).click();
  await page.getByLabel('Período').selectOption('hoje');
  await page.getByLabel('Tipo de Lançamento').selectOption('1');
  await page.getByRole('button', { name: 'Gerar' }).click();

  // Espera que a tela de relatórios processe os filtros e exiba os resultados na interface.
  await expect(page.locator('div').filter({ hasText: 'Home Relatórios Relatórios' }).first()).toBeVisible();
});