import type { ComponentType } from 'react';

import { AnnouncementsTest } from './AnnouncementsTest';
import { FormFieldsTest } from './FormFieldsTest';
import { GroupingTest } from './GroupingTest';
import { KeyboardAvoidingViewTest } from './KeyboardAvoidingViewTest';
import { KeyboardControllerTest } from './KeyboardControllerTest';
import { ModalTest } from './ModalTest';
import { NavigationFocusTest } from './NavigationFocusTest';

/** Test screens by case id, see cases.ts */
export const tests: Record<string, ComponentType> = {
  'keyboard-avoiding-view': KeyboardAvoidingViewTest,
  'keyboard-controller': KeyboardControllerTest,
  'modal': ModalTest,
  'grouping': GroupingTest,
  'navigation-focus': NavigationFocusTest,
  'announcements': AnnouncementsTest,
  'form-fields': FormFieldsTest,
};
