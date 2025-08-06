module.exports = async function (fastify) {
  const repo = fastify.db.getRepository("Notification");

  // Get unread count
  fastify.get("/notifications/unread-count/:id", async (req, reply) => {
    const { id } = req.params;
    if (!id) {
      return reply.code(400).send({ message: "ID parameter is required" });
    }

    const count = await repo.count({
      where: {
        toUser: { id: parseInt(id) },
        isRead: false,
      },
    });

    return reply.send({ unreadCount: count });
  });

  // Get unread notifications for user
  fastify.get("/notifications/:id", async (req, reply) => {
    const { id } = req.params;
    if (!id) {
      return reply.code(400).send({ message: "ID parameter is required" });
    }

    const items = await repo.find({
      where: {
        toUser: { id: parseInt(id) },
        isRead: false,
      },
      order: { created_at: "DESC" },
    });

    return reply.send({ notifications: items });
  });

  // Mark as read
  fastify.post("/notifications/:id", async (req, reply) => {
    const { id } = req.params;
    const { markAsAllRead } = req.body;
    const { userId, orgId } = req.user;

    if (!id) {
      return reply.code(400).send({ message: "ID parameter is required" });
    }

    if (markAsAllRead === true) {
      const result = await repo
        .createQueryBuilder()
        .update()
        .set({ isRead: true, readAt: () => "CURRENT_TIMESTAMP" })
        .where("to_user_id = :id", { id })
        .execute();

      await fastify.logAudit({
        userId,
        orgId,
        entity: "Notification",
        tableId: null,
        action: "MARK_ALL_READ",
        details: { userId: id },
      });

      return reply.send({ message: "All notifications marked as read" });
    }

    const notification = await repo.findOne({
      where: { id: parseInt(id) },
    });

    if (!notification) {
      return reply.code(404).send({ message: "Notification not found" });
    }

    notification.isRead = true;
    notification.readAt = new Date();
    const saved = await repo.save(notification);

    await fastify.logAudit({
      userId,
      orgId,
      entity: "Notification",
      tableId: saved.id,
      action: "MARK_READ",
      details: saved,
    });

    return reply.send({ message: "Notification marked as read" });
  });
};
