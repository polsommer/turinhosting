import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      name: "Alex Turin",
      email: "alex@turinhosting.test",
      subscriptions: {
        create: {
          status: "active",
          plan: "pro",
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
          cancelAtPeriodEnd: false
        }
      },
      servers: {
        create: [
          {
            name: "web-01",
            region: "us-east-1",
            status: "running"
          },
          {
            name: "db-01",
            region: "us-east-1",
            status: "provisioning"
          }
        ]
      },
      onboardingSteps: {
        create: [
          { key: "profile" },
          { key: "payment", completedAt: new Date() },
          { key: "first-server" }
        ]
      },
      notifications: {
        create: [
          {
            type: "billing",
            title: "Subscription active",
            body: "Your Pro plan is active."
          },
          {
            type: "server",
            title: "Server provisioning",
            body: "db-01 is being provisioned."
          }
        ]
      }
    },
    include: {
      subscriptions: true,
      servers: true
    }
  });

  const server = user.servers[0];

  const ticket = await prisma.ticket.create({
    data: {
      userId: user.id,
      serverId: server?.id,
      subject: "Need help with setup",
      status: "open",
      priority: "medium",
      messages: {
        create: [
          {
            authorId: user.id,
            body: "Can you help me configure backups?"
          }
        ]
      }
    }
  });

  await prisma.ticketMessage.create({
    data: {
      ticketId: ticket.id,
      authorId: user.id,
      body: "Following up with more details about the backup schedule."
    }
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
