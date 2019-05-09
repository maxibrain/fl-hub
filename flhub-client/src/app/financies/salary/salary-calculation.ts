export interface ExchangeStep {
  part: number;
  rate: number;
  fee: number;
}

export interface Worker {
  name: string;
  rate: number;
  hours: number;
  fee: number;
}

export interface SalaryCalculationInput {
  income: number;
  exchangeSteps: ExchangeStep[];
  taxRate: number;
  salaryExchangeRate: number;
  workers: Worker[];
  dividentsFee: number;
}

export class SalaryCalculation {
  readonly exchangeSteps: number[];
  readonly taxableIncome: number;
  readonly tax: number;
  readonly salary: { [name: string]: number };
  readonly dividents: number;

  constructor(public readonly input: SalaryCalculationInput) {
    const salaries = input.workers.map(w => ({
      name: w.name,
      fee: w.fee,
      salary: w.hours * w.rate * input.salaryExchangeRate
    }));
    const salarySpend = salaries
      .map(s => s.salary * (1 + s.fee))
      .reduce((acc, v) => acc + v, 0);
    const taxableIncomes = input.exchangeSteps.map(s => ({ uah: input.income * s.part * s.rate, fee: s.fee }));
    this.exchangeSteps = taxableIncomes.map(s => s.uah);
    this.taxableIncome = taxableIncomes.reduce((acc, v) => acc + v.uah, 0);
    this.tax = this.taxableIncome * input.taxRate;
    const incomeAfterTaxes = taxableIncomes.map(i => i.uah * (1 - i.fee)).reduce((acc, v) => acc + v, 0) - this.tax;
    this.dividents = (incomeAfterTaxes - salarySpend) * (1 - input.dividentsFee);
    this.salary = salaries.reduce((acc, v) => {
      acc[v.name] = v.salary;
      return acc;
    }, {});
  }
}
