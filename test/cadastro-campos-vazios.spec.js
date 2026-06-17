import { test, expect } from '@playwright/test';

// Lista com os cenários de qual campo ficará vazio
const cenariosVazios = [
  {
    campo: 'name',
    nomeNoRelatorio: 'Nome',
    erroEsperado: 'Esse campo é obrigatório'
  },
  {
    campo: 'data_nascimento',
    nomeNoRelatorio: 'Data de Nascimento',
    erroEsperado: 'Informe uma data'
  },
  {
    campo: 'email',
    nomeNoRelatorio: 'Email',
    erroEsperado: 'Esse campo de Email é obrigatório'
  },
  {
    campo: 'password',
    nomeNoRelatorio: 'Senha',
    erroEsperado: 'A senha é um Campo obrigatório'
  },
  {
    campo: 'password_confirmation',
    nomeNoRelatorio: 'Confirmar Senha',
    erroEsperado: 'Digite a mesma senha'
  }
];

// Loop vai criar um teste separado para cada item da lista acima
for (const cenario of cenariosVazios) {
  
  test(`CT02 Validação de Dados: Deve exibir erro se apenas o campo ${cenario.nomeNoRelatorio} estiver vazio`, async ({ page }) => {
    await page.goto('http://127.0.0.1:8000/auth/create');

    // Preenche TODOS os campos corretamente primeiro
    await page.fill('input[name="name"]', 'Viana');
    await page.fill('input[name="data_nascimento"]', '2006-07-30');
    await page.fill('input[name="email"]', `viana_${Date.now()}@gmail.com`); 
    await page.fill('input[name="password"]', 'senha12345');
    await page.fill('input[name="password_confirmation"]', 'senha12345');

    // PAGA o texto apenas do campo que estamos testando nesta rodada
    await page.fill(`input[name="${cenario.campo}"]`, '');

    // Tenta enviar
    await page.click('button[type="submit"]');

    // Valida se a mensagem de erro específica daquele campo apareceu
    await expect(page.locator(`text="${cenario.erroEsperado}"`)).toBeVisible();
    
    // Valida se o usuário continuou preso na tela de cadastro
    await expect(page).toHaveURL(/.*\/auth\/create/);
  });
  
}