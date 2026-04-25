import { prisma } from "../../lib/prisma";

export const chatService = {
  async findOrCreateConversation(userA: string, userB: string) {
    const [participantA, participantB] = [userA, userB].sort();

    let conversation = await prisma.conversation.findUnique({
      where: {
        participantA_participantB: {
          participantA,
          participantB,
        },
      },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          participantA,
          participantB,
        },
      });
    }

    return conversation;
  },

  async getConversations(userId: string) {
    return prisma.conversation.findMany({
      where: {
        OR: [{ participantA: userId }, { participantB: userId }],
      },
      include: {
        userA: {
          select: {
            id: true,
            name: true,
            role: true,
            candidate: {
              select: { id: true, avatar: true, aboutMe: true, location: true },
            },
            company: {
              select: {
                id: true,
                logo: true,
                description: true,
                location: true,
              },
            },
          },
        },
        userB: {
          select: {
            id: true,
            name: true,
            role: true,
            candidate: {
              select: { id: true, avatar: true, aboutMe: true, location: true },
            },
            company: {
              select: {
                id: true,
                logo: true,
                description: true,
                location: true,
              },
            },
          },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1, // Get the latest message for the list
        },
        _count: {
          select: {
            messages: {
              where: {
                isRead: false,
                senderId: { not: userId },
              },
            },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });
  },

  async getMessages(conversationId: string, userId: string) {
    // Mark as read when fetching
    await prisma.message.updateMany({
      where: {
        conversationId,
        senderId: { not: userId },
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    return prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
      include: {
        sender: {
          select: { id: true, name: true },
        },
      },
    });
  },

  async createMessage(
    conversationId: string,
    senderId: string,
    content: string,
  ) {
    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId,
        content,
      },
      include: {
        sender: {
          select: { id: true, name: true },
        },
      },
    });

    // Update conversation updatedAt
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    return message;
  },

  async markAsRead(conversationId: string, userId: string) {
    return prisma.message.updateMany({
      where: {
        conversationId,
        senderId: { not: userId },
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });
  },
};
