import {configModule} from '@medusajs/framework/utils'


const NODE_ENV = process.env.NODE_ENV || "development"
const isProduction = NODE_ENV === "production"
const isStaging = NODE_ENV === "staging"
const isTest = NODE_ENV === "test"

export default {
  config: configModule,
  isProduction,
  isStaging,
  isTest,
  nodeEnv: NODE_ENV,
}
