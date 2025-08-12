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
        waitForLocator: {
          getBy: 'role',
          selector: 'heading',
          name: 'Log In',
        },
        actionReasoning: 'Navigating to WordPress Admin',
      },
      {
        action: 'fill',
        targetLocator: {
          getBy: 'role',
          selector: 'textbox',
          name: 'Username',
        },
        value: 'admin',
        actionReasoning: 'Filling username',
      },
      {
        action: 'fill',
        targetLocator: {
          getBy: 'role',
          selector: 'textbox',
          name: 'Password',
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
        waitForLocator: {
          getBy: 'role',
          selector: 'link',
          name: 'WooCommerce',
        },
        actionReasoning: 'Clicking login button',
      },
    ],
    planReasoning: 'Login to WordPress Admin. User see WooCommerce menu',
  },
  state: 'executing',
  currentStep: 0,
}

const COUPONS_PLAN: IntentExecution = {
  intent: 'Navigate to Coupons page',
  actionPlan: {
    steps: [
      {
        action: 'navigate',
        value: 'https://wordpress.test/wp-admin/edit.php?post_type=shop_coupon',
        waitForLocator: {
          getBy: 'css',
          selector: 'h1.wp-heading-inline',
          name: 'Coupons',
        },
        actionReasoning: 'Navigating to Coupons page',
      },
      {
        action: 'click',
        targetLocator: {
          getBy: 'role',
          selector: 'button',
          name: 'Add new coupon',
        },
        waitForLocator: {
          getBy: 'css',
          selector: 'h1.wp-heading-inline',
          name: 'Add Coupon',
        },
        actionReasoning: 'Clicking Add New button',
      },
    ],
    planReasoning: 'Navigating to Coupons page. Checking New button',
  },
  state: 'executing',
  currentStep: 0,
}
