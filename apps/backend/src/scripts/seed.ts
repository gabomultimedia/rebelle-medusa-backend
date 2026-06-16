import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export default async function seedRebelle({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const userModuleService = container.resolve(Modules.USER)
  const authModuleService = container.resolve(Modules.AUTH)
  const apiKeyService = container.resolve(Modules.API_KEY)
  const salesChannelService = container.resolve(Modules.SALES_CHANNEL)
  const link = container.resolve(ContainerRegistrationKeys.LINK)

  logger.info("🌱 Seeding Rebelle data...")

  // 1. Create admin user
  const email = "admin@rebelleboutique.com"
  const password = "Admin2024!Rebelle"
  let user
  try {
    user = await userModuleService.createUsers({
      email,
      first_name: "Thalia",
      last_name: "Rebelle",
    })
    logger.info(`✓ Admin user created: ${email}`)
  } catch (e: any) {
    logger.info(`Admin user may already exist, continuing...`)
    const existing = await userModuleService.listUsers({ email })
    user = existing[0]
  }

  if (user) {
    try {
      const authIdentity = await authModuleService.createAuthIdentities({
        provider: "emailpass",
        provider_metadata: { password },
      })
      await link.create({
        [Modules.USER]: { user_id: user.id },
        [Modules.AUTH]: { auth_identity_id: authIdentity.id },
      })
      logger.info("✓ Auth identity created for admin")
    } catch (e: any) {
      logger.info("Auth identity may already exist")
    }
  }

  // 2. Create publishable API key
  try {
    const key = await apiKeyService.createApiKeys({
      title: "Rebelle Storefront",
      type: "publishable",
      created_by: user?.id || "system",
    })
    logger.info(`✓ Publishable API Key: ${key.token}`)
  } catch (e: any) {
    logger.info("Publishable key may already exist")
  }

  // 3. Create default sales channel
  try {
    const channel = await salesChannelService.createSalesChannels({
      name: "Rebelle Default",
      description: "Default sales channel for Rebelle",
    })
    logger.info(`✓ Sales channel: ${channel.id}`)
  } catch (e: any) {
    logger.info("Sales channel may already exist")
  }

  logger.info("🎉 Seed completed!")
}
