import { v } from "convex/values";
import { mutation, QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "./_generated/dataModel";

const getMember = async (
    ctx: QueryCtx,
    workspaceId: Id<"workspaces">,
    userId: Id<"users">
) => {
    return await ctx.db
        .query("members")
        .withIndex("by_workspace_id_user_id", (q) => q.eq("workspaceId", workspaceId).eq("userId", userId))
        .unique();
}

export const create = mutation({
    args: {
        body: v.string(),
        image: v.optional(v.id("_storage")),
        workspaceId: v.id("workspaces"),
        channelId: v.optional(v.id("channels")),
        parentMessageId: v.optional(v.id("messages")),
        conversationId: v.optional(v.id("conversations")),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx)

        if (!userId) {
            throw new Error("Unauthorized");
        }

        const member = await getMember(ctx, args.workspaceId, userId);

        if (!member) {
            throw new Error("Unauthorized");
        }

        let _conversationId = args.conversationId;

        if (!args.conversationId && !args.channelId && args.parentMessageId) {
            const parentMessage = await ctx.db.get(args.parentMessageId)

            if (!parentMessage) {
                throw new Error("parent message not found")
            }

            _conversationId = parentMessage.conversationId
        }

        const messageId = await ctx.db.insert("messages", {
            memberId: member._id,
            body: args.body,
            image: args.image,
            channelId: args.channelId,
            conversationId: _conversationId,
            parentMessageId: args.parentMessageId,
            workspaceId: args.workspaceId,
            updatedAt: Date.now()
        });

        return messageId;
    },
})