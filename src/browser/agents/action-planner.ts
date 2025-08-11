import { IntentExecution, JourneySpec } from '../../types'

export class ActionPlannerAgent {
  journeySpec: JourneySpec

  constructor(journeySpec: JourneySpec) {
    this.journeySpec = journeySpec
  }

  async init() {}

  async planNextAction(intentExecutions: IntentExecution[]) {
    const plans: IntentExecution[] = intentExecutions.map((execution) => {
      if (execution.state !== 'planning') {
        return execution
      }

      if (execution.intent === 'Logged in to WordPress Admin') {
        return LOGGIN_PLAN
      } else if (execution.intent === 'Navigate to Coupons page') {
        return NAV_COUPONS_PLAN
      }

      return execution
    })

    return plans
  }
}

const LOGGIN_PLAN: IntentExecution = {
  intent: 'Logged in to WordPress Admin',
  actionPlan: {
    steps: [
      {
        type: 'navigate',
        target: 'https://wordpress.test/wp-admin/edit.php?post_type=shop_coupon',
        actionReasoning: 'Navigating to WordPress Admin',
        timeout: 5000,
        waitAfter: 0,
      },
    ],
    planReasoning: 'Navigating to WordPress Admin',
  },
  state: 'executing',
  currentStep: 0,
}

const NAV_COUPONS_PLAN: IntentExecution = {
  intent: 'Navigate to Coupons page',
  actionPlan: {
    steps: [
      {
        type: 'navigate',
        target: 'https://wordpress.test/wp-admin',
        actionReasoning: 'Navigating to Coupons page',
        timeout: 5000,
        waitAfter: 0,
      },
    ],
    planReasoning: 'Navigating to Coupons page',
  },
  state: 'executing',
  currentStep: 0,
}
