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
      } else if (execution.intent === 'Create a coupon') {
        return COUPONS_PLAN
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
        action: 'navigate',
        value: 'https://wordpress.test/wp-admin',
        actionReasoning: 'Navigating to WordPress Admin',
      },
      {
        action: 'fill',
        targetLocator: {
          getBy: 'label',
          selector: 'username',
        },
        value: 'admin',
        actionReasoning: 'Filling username',
      },
      {
        action: 'fill',
        targetLocator: {
          getBy: 'label',
          selector: 'password',
        },
        value: '1',
        actionReasoning: 'Filling password',
      },
      {
        action: 'click',
        targetLocator: {
          getBy: 'role',
          selector: 'button',
          name: 'Log In',
        },
        actionReasoning: 'Clicking login button',
      },
    ],
    planReasoning: 'Navigating to WordPress Admin. Enter username and password and click login',
  },
  state: 'executing',
  currentStep: 0,
}

const COUPONS_PLAN: IntentExecution = {
  intent: 'Create a coupon',
  actionPlan: {
    steps: [],
    planReasoning: 'Navigating to Coupons page',
  },
  state: 'executing',
  currentStep: 0,
}
