import { test, expect } from '@playwright/test';

// Pré-requisito: rodar "php artisan db:seed" antes de executar este teste.
// O seed garante que exista ao menos uma despesa cadastrada para o usuário de teste.

test.describe('CT07 - Edição de Despesa Existente', () => {

  test.beforeEach(async ({ page }) => {
    // Autenticação — pré-requisito para acessar rotas protegidas
    await page.goto('http://127.0.0.1:8000/auth/login');
    await page.locator('input[name="email"]').fill('user@mail.com');
    await page.locator('input[name="password"]').fill('12345678');
    await page.getByRole('button', { name: 'Entrar' }).click();

    // Aguarda redirecionamento para o dashboard
    await expect(page).toHaveURL(/dashboard/);
  });

  test('CT07a - deve abrir o modal de edição ao clicar no botão de editar despesa', async ({ page }) => {
    await page.goto('http://127.0.0.1:8000/lancamentos');

    // Clica no primeiro botão de editar despesa disponível na tabela
    const btnEditar = page.locator('.btn-abrir-modal-editar-despesa').first();
    await expect(btnEditar).toBeVisible();
    await btnEditar.click();

    // Verifica se o modal de edição está visível
    const modalEditar = page.locator('#container-modal-editar-despesa');
    await expect(modalEditar).not.toHaveClass(/hidden/);

    // Verifica se os campos do modal estão presentes e preenchidos
    await expect(page.locator('#modal-descricao')).toBeVisible();
    await expect(page.locator('#modal-valor')).toBeVisible();
    await expect(page.locator('#modal-status')).toBeVisible();
    await expect(page.locator('#modal-categoria')).toBeVisible();
    await expect(page.locator('#modal-frequencia')).toBeVisible();
    await expect(page.locator('#modal-dataCriacao')).toBeVisible();
    await expect(page.locator('#modal-dataVencimento')).toBeVisible();
  });

  test('CT07b - deve salvar as alterações de uma despesa com sucesso', async ({ page }) => {
    await page.goto('http://127.0.0.1:8000/lancamentos');

    // Abre o modal de edição da primeira despesa
    const btnEditar = page.locator('.btn-abrir-modal-editar-despesa').first();
    await btnEditar.click();

    // Aguarda o modal estar visível antes de interagir
    await expect(page.locator('#container-modal-editar-despesa')).not.toHaveClass(/hidden/);

    // Altera os campos do formulário de edição
    await page.locator('#modal-descricao').fill('Despesa Editada pelo Playwright');
    await page.locator('#modal-valor').fill('250.00');
    await page.locator('#modal-status').selectOption('false');
    await page.locator('#modal-categoria').selectOption('2'); // Educação
    await page.locator('#modal-frequencia').selectOption('1'); // Não se repete
    await page.locator('#modal-dataCriacao').fill('2026-06-01');
    await page.locator('#modal-dataVencimento').fill('2026-06-30');

    // Submete o formulário clicando em "Salvar Despesa"
    await page.getByRole('button', { name: 'Salvar Despesa' }).click();

    // Verifica se a mensagem de sucesso é exibida após o redirecionamento
    await expect(page.locator('body')).toContainText('Despesa atualizada com sucesso!');
  });

  test('CT07c - deve exibir a despesa editada na listagem após salvar', async ({ page }) => {
    await page.goto('http://127.0.0.1:8000/lancamentos');

    const btnEditar = page.locator('.btn-abrir-modal-editar-despesa').first();
    await btnEditar.click();

    await expect(page.locator('#container-modal-editar-despesa')).not.toHaveClass(/hidden/);

    // Edita a descrição para um valor único e verificável
    const novaDescricao = 'Verificacao Playwright CT07';
    await page.locator('#modal-descricao').fill(novaDescricao);
    await page.locator('#modal-valor').fill('175.50');
    await page.locator('#modal-status').selectOption('true');
    await page.locator('#modal-categoria').selectOption('1'); // Casa
    await page.locator('#modal-frequencia').selectOption('4'); // Mensalmente
    await page.locator('#modal-dataCriacao').fill('2026-06-01');
    await page.locator('#modal-dataVencimento').fill('2026-06-30');

    await page.getByRole('button', { name: 'Salvar Despesa' }).click();

    // Após salvar, o sistema redireciona para /lancamentos
    // Verifica se o texto editado aparece na tabela de lançamentos
    await expect(page.locator('#tabela-lancamentos')).toContainText(novaDescricao);
  });

});