/**
 * Aggregates every bank file's rows for the validator/importer.
 * Run tools via: bun validate-and-import.ts <lint|import>
 */
import { clauseRows as clauseRowsEn } from "./clauses.en";
import { clauseRows as clauseRowsHi } from "./clauses.hi";
import { overviewRows as overviewRowsEn } from "./yearly-overview.en";
import { overviewRows as overviewRowsHi } from "./yearly-overview.hi";
import { businessRows as businessRowsEn } from "./yearly-business.en";
import { businessRows as businessRowsHi } from "./yearly-business.hi";
import { careerRows as careerRowsEn } from "./yearly-career.en";
import { careerRows as careerRowsHi } from "./yearly-career.hi";
import { childrenRows as childrenRowsEn } from "./yearly-children.en";
import { childrenRows as childrenRowsHi } from "./yearly-children.hi";
import { educationRows as educationRowsEn } from "./yearly-education.en";
import { educationRows as educationRowsHi } from "./yearly-education.hi";
import { familyRows as familyRowsEn } from "./yearly-family.en";
import { familyRows as familyRowsHi } from "./yearly-family.hi";
import { healthRows as healthRowsEn } from "./yearly-health.en";
import { healthRows as healthRowsHi } from "./yearly-health.hi";
import { loveRows as loveRowsEn } from "./yearly-love.en";
import { loveRows as loveRowsHi } from "./yearly-love.hi";
import { marriageRows as marriageRowsEn } from "./yearly-marriage.en";
import { marriageRows as marriageRowsHi } from "./yearly-marriage.hi";
import { wealthRows as wealthRowsEn } from "./yearly-wealth.en";
import { wealthRows as wealthRowsHi } from "./yearly-wealth.hi";
import { dailyOverviewRows } from "./daily-overview.en";
import { dailyCareerRows } from "./daily-career.en";
import { dailyMoneyRows } from "./daily-money.en";
import { dailyLoveRows } from "./daily-love.en";
import { dailyEducationRows } from "./daily-education.en";
import { dailyFamilyRows } from "./daily-family.en";
import { dailyHealthRows } from "./daily-health.en";
import { weeklyOverviewRows } from "./weekly-overview.en";
import { weeklyCareerRows } from "./weekly-career.en";
import { weeklyMoneyRows } from "./weekly-money.en";
import { weeklyLoveRows } from "./weekly-love.en";
import { weeklyEducationRows } from "./weekly-education.en";
import { weeklyFamilyRows } from "./weekly-family.en";
import { weeklyHealthRows } from "./weekly-health.en";
import { monthlyOverviewRows } from "./monthly-overview.en";
import { monthlyCareerRows } from "./monthly-career.en";
import { monthlyMoneyRows } from "./monthly-money.en";
import { monthlyLoveRows } from "./monthly-love.en";
import { monthlyEducationRows } from "./monthly-education.en";
import { monthlyFamilyRows } from "./monthly-family.en";
import { monthlyHealthRows } from "./monthly-health.en";
import { weeklyOverviewRowsHi } from "./weekly-overview.hi";
import { weeklyCareerRowsHi } from "./weekly-career.hi";
import { weeklyMoneyRowsHi } from "./weekly-money.hi";
import { weeklyLoveRowsHi } from "./weekly-love.hi";
import { weeklyEducationRowsHi } from "./weekly-education.hi";
import { weeklyFamilyRowsHi } from "./weekly-family.hi";
import { weeklyHealthRowsHi } from "./weekly-health.hi";
import { monthlyOverviewRowsHi } from "./monthly-overview.hi";
import { monthlyCareerRowsHi } from "./monthly-career.hi";
import { monthlyMoneyRowsHi } from "./monthly-money.hi";
import { monthlyLoveRowsHi } from "./monthly-love.hi";
import { monthlyEducationRowsHi } from "./monthly-education.hi";
import { monthlyFamilyRowsHi } from "./monthly-family.hi";
import { monthlyHealthRowsHi } from "./monthly-health.hi";
import { dailyOverviewRowsHi } from "./daily-overview.hi";
import { dailyCareerRowsHi } from "./daily-career.hi";
import { dailyMoneyRowsHi } from "./daily-money.hi";
import { dailyLoveRowsHi } from "./daily-love.hi";
import { dailyEducationRowsHi } from "./daily-education.hi";
import { dailyFamilyRowsHi } from "./daily-family.hi";
import { dailyHealthRowsHi } from "./daily-health.hi";
import { thoughtRows } from "./thought.en";
import { thoughtRowsHi } from "./thought.hi";
import { dosRows } from "./dos.en";
import { dosRowsHi } from "./dos.hi";
import { dontsRows } from "./donts.en";
import { dontsRowsHi } from "./donts.hi";
import type { BankRow } from "./types";

export const allRows: BankRow[] = [
  ...clauseRowsEn,
  ...clauseRowsHi,
  ...overviewRowsEn,
  ...overviewRowsHi,
  ...businessRowsEn,
  ...businessRowsHi,
  ...careerRowsEn,
  ...careerRowsHi,
  ...childrenRowsEn,
  ...childrenRowsHi,
  ...educationRowsEn,
  ...educationRowsHi,
  ...familyRowsEn,
  ...familyRowsHi,
  ...healthRowsEn,
  ...healthRowsHi,
  ...loveRowsEn,
  ...loveRowsHi,
  ...marriageRowsEn,
  ...marriageRowsHi,
  ...wealthRowsEn,
  ...wealthRowsHi,
  ...thoughtRows,
  ...thoughtRowsHi,
  ...dosRows,
  ...dosRowsHi,
  ...dontsRows,
  ...dontsRowsHi,
  ...dailyOverviewRows,
  ...dailyCareerRows,
  ...dailyMoneyRows,
  ...dailyLoveRows,
  ...dailyEducationRows,
  ...dailyFamilyRows,
  ...dailyHealthRows,
  ...weeklyOverviewRows,
  ...weeklyCareerRows,
  ...weeklyMoneyRows,
  ...weeklyLoveRows,
  ...weeklyEducationRows,
  ...weeklyFamilyRows,
  ...weeklyHealthRows,
  ...monthlyOverviewRows,
  ...monthlyCareerRows,
  ...monthlyMoneyRows,
  ...monthlyLoveRows,
  ...monthlyEducationRows,
  ...monthlyFamilyRows,
  ...monthlyHealthRows,
  ...weeklyOverviewRowsHi,
  ...weeklyCareerRowsHi,
  ...weeklyMoneyRowsHi,
  ...weeklyLoveRowsHi,
  ...weeklyEducationRowsHi,
  ...weeklyFamilyRowsHi,
  ...weeklyHealthRowsHi,
  ...monthlyOverviewRowsHi,
  ...monthlyCareerRowsHi,
  ...monthlyMoneyRowsHi,
  ...monthlyLoveRowsHi,
  ...monthlyEducationRowsHi,
  ...monthlyFamilyRowsHi,
  ...monthlyHealthRowsHi,
  ...dailyOverviewRowsHi,
  ...dailyCareerRowsHi,
  ...dailyMoneyRowsHi,
  ...dailyLoveRowsHi,
  ...dailyEducationRowsHi,
  ...dailyFamilyRowsHi,
  ...dailyHealthRowsHi,
];
