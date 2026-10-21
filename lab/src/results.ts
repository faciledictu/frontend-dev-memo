import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

import type { Case } from './cases';

export type Verdict = 'as-expected' | 'differs' | 'unclear';

export type Result = {
  verdict: Verdict;
  note: string;
  at: string;
};

export const verdictLabels: Record<Verdict, string> = {
  'as-expected': 'As expected',
  'differs': 'Differs',
  'unclear': 'Unclear',
};

const key = (caseId: string) => `result:${caseId}`;

export async function loadResults(
  caseIds: string[]
): Promise<Record<string, Result>> {
  const pairs = await AsyncStorage.multiGet(caseIds.map(key));
  const results: Record<string, Result> = {};
  pairs.forEach(([, value], index) => {
    if (value) results[caseIds[index]] = JSON.parse(value) as Result;
  });
  return results;
}

export async function saveResult(
  caseId: string,
  result: Result
): Promise<void> {
  await AsyncStorage.setItem(key(caseId), JSON.stringify(result));
}

export async function clearResults(caseIds: string[]): Promise<void> {
  await AsyncStorage.multiRemove(caseIds.map(key));
}

export function describeDevice(): string {
  const { major, minor, patch } = Platform.constants.reactNativeVersion;
  const rn = `React Native ${major}.${minor}.${patch}`;
  if (Platform.OS === 'android') {
    const { Brand, Model, Release } = Platform.constants;
    return `Android ${Release} (API ${Platform.Version}), ${Brand} ${Model}, ${rn}`;
  }
  if (Platform.OS === 'ios') {
    return `iOS ${Platform.Version}, ${Platform.constants.interfaceIdiom}, ${rn}`;
  }
  return `${Platform.OS} ${Platform.Version}, ${rn}`;
}

export function buildReport(
  cases: Case[],
  results: Record<string, Result>
): string {
  const lines = [`# Memo Lab report`, ``, describeDevice(), ``];
  for (const item of cases) {
    const result = results[item.id];
    lines.push(`## ${item.title} (${item.id})`);
    if (!result) {
      lines.push(`Not tested.`, ``);
      continue;
    }
    lines.push(`Verdict: ${verdictLabels[result.verdict]} (${result.at})`);
    if (result.note.trim()) lines.push(`Note: ${result.note.trim()}`);
    lines.push(``);
  }
  return lines.join('\n');
}
