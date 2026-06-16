"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = seedRebelle;
const utils_1 = require("@medusajs/framework/utils");
async function seedRebelle({ container }) {
    const logger = container.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
    const userModuleService = container.resolve(utils_1.Modules.USER);
    const authModuleService = container.resolve(utils_1.Modules.AUTH);
    const apiKeyService = container.resolve(utils_1.Modules.API_KEY);
    const salesChannelService = container.resolve(utils_1.Modules.SALES_CHANNEL);
    const link = container.resolve(utils_1.ContainerRegistrationKeys.LINK);
    logger.info("🌱 Seeding Rebelle data...");
    // 1. Create admin user
    const email = "admin@rebelleboutique.com";
    const password = "Admin2024!Rebelle";
    let user;
    try {
        user = await userModuleService.createUsers({
            email,
            first_name: "Thalia",
            last_name: "Rebelle",
        });
        logger.info(`✓ Admin user created: ${email}`);
    }
    catch (e) {
        logger.info(`Admin user may already exist, continuing...`);
        const existing = await userModuleService.listUsers({ email });
        user = existing[0];
    }
    if (user) {
        try {
            const authIdentity = await authModuleService.createAuthIdentities({
                provider: "emailpass",
                provider_metadata: { password },
            });
            await link.create({
                [utils_1.Modules.USER]: { user_id: user.id },
                [utils_1.Modules.AUTH]: { auth_identity_id: authIdentity.id },
            });
            logger.info("✓ Auth identity created for admin");
        }
        catch (e) {
            logger.info("Auth identity may already exist");
        }
    }
    // 2. Create publishable API key
    try {
        const key = await apiKeyService.createApiKeys({
            title: "Rebelle Storefront",
            type: "publishable",
            created_by: user?.id || "system",
        });
        logger.info(`✓ Publishable API Key: ${key.token}`);
    }
    catch (e) {
        logger.info("Publishable key may already exist");
    }
    // 3. Create default sales channel
    try {
        const channel = await salesChannelService.createSalesChannels({
            name: "Rebelle Default",
            description: "Default sales channel for Rebelle",
        });
        logger.info(`✓ Sales channel: ${channel.id}`);
    }
    catch (e) {
        logger.info("Sales channel may already exist");
    }
    logger.info("🎉 Seed completed!");
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9zY3JpcHRzL3NlZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFHQSw4QkFtRUM7QUFyRUQscURBQThFO0FBRS9ELEtBQUssVUFBVSxXQUFXLENBQUMsRUFBRSxTQUFTLEVBQVk7SUFDL0QsTUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxpQ0FBeUIsQ0FBQyxNQUFNLENBQUMsQ0FBQTtJQUNsRSxNQUFNLGlCQUFpQixHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsZUFBTyxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQ3pELE1BQU0saUJBQWlCLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxlQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDekQsTUFBTSxhQUFhLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxlQUFPLENBQUMsT0FBTyxDQUFDLENBQUE7SUFDeEQsTUFBTSxtQkFBbUIsR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLGVBQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQTtJQUNwRSxNQUFNLElBQUksR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLGlDQUF5QixDQUFDLElBQUksQ0FBQyxDQUFBO0lBRTlELE1BQU0sQ0FBQyxJQUFJLENBQUMsNEJBQTRCLENBQUMsQ0FBQTtJQUV6Qyx1QkFBdUI7SUFDdkIsTUFBTSxLQUFLLEdBQUcsMkJBQTJCLENBQUE7SUFDekMsTUFBTSxRQUFRLEdBQUcsbUJBQW1CLENBQUE7SUFDcEMsSUFBSSxJQUFJLENBQUE7SUFDUixJQUFJLENBQUM7UUFDSCxJQUFJLEdBQUcsTUFBTSxpQkFBaUIsQ0FBQyxXQUFXLENBQUM7WUFDekMsS0FBSztZQUNMLFVBQVUsRUFBRSxRQUFRO1lBQ3BCLFNBQVMsRUFBRSxTQUFTO1NBQ3JCLENBQUMsQ0FBQTtRQUNGLE1BQU0sQ0FBQyxJQUFJLENBQUMseUJBQXlCLEtBQUssRUFBRSxDQUFDLENBQUE7SUFDL0MsQ0FBQztJQUFDLE9BQU8sQ0FBTSxFQUFFLENBQUM7UUFDaEIsTUFBTSxDQUFDLElBQUksQ0FBQyw2Q0FBNkMsQ0FBQyxDQUFBO1FBQzFELE1BQU0sUUFBUSxHQUFHLE1BQU0saUJBQWlCLENBQUMsU0FBUyxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQTtRQUM3RCxJQUFJLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQ3BCLENBQUM7SUFFRCxJQUFJLElBQUksRUFBRSxDQUFDO1FBQ1QsSUFBSSxDQUFDO1lBQ0gsTUFBTSxZQUFZLEdBQUcsTUFBTSxpQkFBaUIsQ0FBQyxvQkFBb0IsQ0FBQztnQkFDaEUsUUFBUSxFQUFFLFdBQVc7Z0JBQ3JCLGlCQUFpQixFQUFFLEVBQUUsUUFBUSxFQUFFO2FBQ2hDLENBQUMsQ0FBQTtZQUNGLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQztnQkFDaEIsQ0FBQyxlQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLEVBQUUsRUFBRTtnQkFDcEMsQ0FBQyxlQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxnQkFBZ0IsRUFBRSxZQUFZLENBQUMsRUFBRSxFQUFFO2FBQ3RELENBQUMsQ0FBQTtZQUNGLE1BQU0sQ0FBQyxJQUFJLENBQUMsbUNBQW1DLENBQUMsQ0FBQTtRQUNsRCxDQUFDO1FBQUMsT0FBTyxDQUFNLEVBQUUsQ0FBQztZQUNoQixNQUFNLENBQUMsSUFBSSxDQUFDLGlDQUFpQyxDQUFDLENBQUE7UUFDaEQsQ0FBQztJQUNILENBQUM7SUFFRCxnQ0FBZ0M7SUFDaEMsSUFBSSxDQUFDO1FBQ0gsTUFBTSxHQUFHLEdBQUcsTUFBTSxhQUFhLENBQUMsYUFBYSxDQUFDO1lBQzVDLEtBQUssRUFBRSxvQkFBb0I7WUFDM0IsSUFBSSxFQUFFLGFBQWE7WUFDbkIsVUFBVSxFQUFFLElBQUksRUFBRSxFQUFFLElBQUksUUFBUTtTQUNqQyxDQUFDLENBQUE7UUFDRixNQUFNLENBQUMsSUFBSSxDQUFDLDBCQUEwQixHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQTtJQUNwRCxDQUFDO0lBQUMsT0FBTyxDQUFNLEVBQUUsQ0FBQztRQUNoQixNQUFNLENBQUMsSUFBSSxDQUFDLG1DQUFtQyxDQUFDLENBQUE7SUFDbEQsQ0FBQztJQUVELGtDQUFrQztJQUNsQyxJQUFJLENBQUM7UUFDSCxNQUFNLE9BQU8sR0FBRyxNQUFNLG1CQUFtQixDQUFDLG1CQUFtQixDQUFDO1lBQzVELElBQUksRUFBRSxpQkFBaUI7WUFDdkIsV0FBVyxFQUFFLG1DQUFtQztTQUNqRCxDQUFDLENBQUE7UUFDRixNQUFNLENBQUMsSUFBSSxDQUFDLG9CQUFvQixPQUFPLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQTtJQUMvQyxDQUFDO0lBQUMsT0FBTyxDQUFNLEVBQUUsQ0FBQztRQUNoQixNQUFNLENBQUMsSUFBSSxDQUFDLGlDQUFpQyxDQUFDLENBQUE7SUFDaEQsQ0FBQztJQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQTtBQUNuQyxDQUFDIn0=