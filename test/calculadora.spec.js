import { test, expect } from '@playwright/test';

const operacoesBasicas = [
  {
    descricao: 'soma: 8 + 5 = 13',
    operandoA: '8',
    simboloBotao: '+',
    operandoB: '5',
    resultadoEsperado: '13',
  },
  {
    descricao: 'subtração: 9 - 4 = 5',
    operandoA: '9',
    simboloBotao: '-',
    operandoB: '4',
    resultadoEsperado: '5',
  },
  {
    descricao: 'multiplicação: 7 × 3 = 21',
    operandoA: '7',
    simboloBotao: '×',
    operandoB: '3',
    resultadoEsperado: '21',
  },
  {
    descricao: 'divisão: 16 ÷ 2 = 8',
    operandoA: '16',   // Garante o teste de 2 dígitos que o Claude apontou!
    simboloBotao: '÷',
    operandoB: '2',
    resultadoEsperado: '8',
  },
];

// LISTA PARAMETRIZADA — Calculadora de Juros
const cenariosJurosSimples = [
  {
    descricao: 'R$ 1.000 | 10% ao mês | 2 meses → R$ 1.200,00',
    capital: '1000',
    taxa: '10',
    tempoTaxa: 'mes',
    periodo: '2',
    tempoPeriodo: 'meses',
    resultadoContem: '1.200,00',
  },
  {
    descricao: 'R$ 500 | 5% ao mês | 4 meses → R$ 600,00',
    capital: '500',
    taxa: '5',
    tempoTaxa: 'mes',
    periodo: '4',
    tempoPeriodo: 'meses',
    resultadoContem: '600,00',
  },
];

const cenariosJurosCompostos = [
  {
    descricao: 'R$ 1.000 | 10% ao mês | 2 meses → R$ 1.210,00',
    capital: '1000',
    taxa: '10',
    tempoTaxa: 'mes',
    periodo: '2',
    tempoPeriodo: 'meses',
    resultadoContem: '1.210,00',
  },
  {
    descricao: 'R$ 2.000 | 5% ao mês | 3 meses → R$ 2.315,25',
    capital: '2000',
    taxa: '5',
    tempoTaxa: 'mes',
    periodo: '3',
    tempoPeriodo: 'meses',
    resultadoContem: '2.315,25',
  },
];

// BLOCO DE TESTES
test.describe('CT08 - Operação Matemática na Calculadora', () => {

  // Login e navegação para a calculadora antes de cada teste
  test.beforeEach(async ({ page }) => {
    await page.goto('http://127.0.0.1:8000/auth/login');
    await page.fill('input[name="email"]', 'user@mail.com');
    await page.fill('input[name="password"]', '12345678');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/dashboard/);
    await page.goto('http://127.0.0.1:8000/calculadora');
    await expect(page.locator('h1')).toContainText('Calculadora');
  });

  // CT08a — Loop das 4 operações básicas (valores aleatórios)
  for (const op of operacoesBasicas) {

    test(`CT08a - Calculadora Comum: deve calcular ${op.descricao}`, async ({ page }) => {
      
      // Digita o primeiro operando clicando dígito por dígito
      for (const digito of op.operandoA) {
        await page.getByRole('button', { name: digito, exact: true }).click();
      }

      // Clica no operador
      await page.getByRole('button', { name: op.simboloBotao, exact: true }).click();

      // Digita o segundo operando clicando dígito por dígito
      for (const digito of op.operandoB) {
        await page.getByRole('button', { name: digito, exact: true }).click();
      }

      // Clica em igual
      await page.getByRole('button', { name: '=', exact: true }).click();

      // Valida o resultado no display
      await expect(page.locator('#comum_resultado')).toHaveText(op.resultadoEsperado);
    });

  }

  // CT08b — Botão AC limpa o display
  test('CT08b - Calculadora Comum: botão AC deve limpar a expressão e zerar o resultado', async ({ page }) => {
    // Digita uma expressão qualquer
    await page.getByRole('button', { name: '5', exact: true }).click();
    await page.getByRole('button', { name: '+', exact: true }).click();
    await page.getByRole('button', { name: '3', exact: true }).click();

    // A expressão deve aparecer no display
    await expect(page.locator('#comum_expressao')).toContainText('5+3');

    // Pressiona AC
    await page.getByRole('button', { name: 'AC', exact: true }).click();

    // Display deve ser zerado
    await expect(page.locator('#comum_expressao')).toHaveText('');
    await expect(page.locator('#comum_resultado')).toHaveText('0');
  });

  // CT08c — Loop Juros Simples
  for (const cenario of cenariosJurosSimples) {

    test(`CT08c - Calculadora de Juros Simples: ${cenario.descricao}`, async ({ page }) => {
      // Muda para a aba Juros
      await page.locator('label[for="tab-juros"]').click();

      await page.locator('#valor_inicial').fill(cenario.capital);
      await page.locator('#tipo_juros').selectOption('simples');
      await page.locator('#taxa_juros').fill(cenario.taxa);
      await page.locator('#tempo_taxa').selectOption(cenario.tempoTaxa);
      await page.locator('#periodo').fill(cenario.periodo);
      await page.locator('#tempo_periodo').selectOption(cenario.tempoPeriodo);

      await page.getByRole('button', { name: 'Calcular' }).click();

      // Valida o valor final exibido
      await expect(page.locator('#res_valor_final')).toContainText(cenario.resultadoContem);
    });

  }

  // CT08d — Loop Juros Compostos
  for (const cenario of cenariosJurosCompostos) {

    test(`CT08d - Calculadora de Juros Compostos: ${cenario.descricao}`, async ({ page }) => {
      await page.locator('label[for="tab-juros"]').click();

      await page.locator('#valor_inicial').fill(cenario.capital);
      await page.locator('#tipo_juros').selectOption('composto');
      await page.locator('#taxa_juros').fill(cenario.taxa);
      await page.locator('#tempo_taxa').selectOption(cenario.tempoTaxa);
      await page.locator('#periodo').fill(cenario.periodo);
      await page.locator('#tempo_periodo').selectOption(cenario.tempoPeriodo);

      await page.getByRole('button', { name: 'Calcular' }).click();

      await expect(page.locator('#res_valor_final')).toContainText(cenario.resultadoContem);
    });

  }

});