/** State of the current app launch, reset when the app restarts */
export const session = {
  /**
   * KeyboardProvider changes how Android applies window insets, so the core
   * KeyboardAvoidingView test is valid only before it has been mounted.
   */
  keyboardControllerMounted: false,
};
