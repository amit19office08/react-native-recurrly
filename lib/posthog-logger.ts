import {posthog} from '@/lib/posthog'

export const posthogLog = {
  signInCompleted: () =>
    posthog?.logger.info('Authentication completed', {
      operation: 'sign_in',
      outcome: 'completed',
    }),
  signUpCompleted: () =>
    posthog?.logger.info('Authentication completed', {
      operation: 'sign_up',
      outcome: 'completed',
    }),
  subscriptionDetailsToggled: (isExpanded: boolean) =>
    posthog?.logger.info('Subscription details toggled', {
      is_expanded: isExpanded,
    }),
}
