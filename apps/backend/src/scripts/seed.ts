import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export default async function seedRebelle({ container }: ExecArgs) {
  console.log("🌱 Seeding Rebelle data...")
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  
  try {
    const userModuleService = container.resolve(Modules.USER)
    const authModuleService = container.resolve(Modules.AUTH)
    const apiKeyService = container.resolve(Modules.API_KEY)
    const salesChannelService = container.resolve(Modules.SALES_CHANNEL)
    const link = container.resolve(ContainerRegistrationKeys.LINK)

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
      console.log(`✓ Admin user created: ${email}`)
    } catch (e: any) {
      console.log(`Admin user may already exist: ${e.message}`)
      const existing = await userModuleService.listUsers({ email })
      user = existing[0]
    }

    if (user) {
      try {
        const authIdentity = await authModuleService.createAuthIdentities({
          provider_identify: "emailpass",
          provider_metadata: { password },
        } as any)
        await link.create({
          [Modules.USER]: { user_id: user.id },
          [Modules.AUTH]: { auth_identity_id: authIdentity.id },
        } as any)
        console.log("✓ Auth identity created for admin")
      } catch (e: any) {
        console.log(`Auth identity may already exist: ${e.message}`)
      }
    }

    // 2. Create publishable API key
    try {
      const key = await apiKeyService.createApiKeys({
        title: "Rebelle Storefront",
        type: "publishable",
        created_by: user?.id || "system",
      } as any)
      console.log(`✓ Publishable API Key: ${key.token}`)
    } catch (e: any) {
      console.log(`Publishable key may already exist: ${e.message}`)
    }

    // 3. Create default sales channel
    try {
      const channel = await salesChannelService.createSalesChannels({
        name: "Rebelle Default",
        description: "Default sales channel for Rebelle",
      } as any)
      console.log(`✓ Sales channel: ${channel.id}`)
    } catch (e: any) {
      console.log(`Sales channel may already exist: ${e.message}`)
    }

    console.log("🎉 Seed completed!")
  } catch (e: any) {
    console.error("❌ Seed FAILED:", e.message)
    console.error(e.stack)
    throw e
  }
}
