import type { ScreenProps } from '../navigation';
import { tests } from '../tests';

export function TestScreen({ route }: ScreenProps<'Test'>) {
  const Test = tests[route.params.id];
  return <Test />;
}
