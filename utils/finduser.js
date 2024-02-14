const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const findUser = async (user_email) => {
  try {
    const user = await prisma.users.findFirst({
      where: {
        email: user_email,
      },
    });

    return user;
  } catch (error) {
    console.error("Error in findUser:", error);
    throw new Error("Error finding user by email");
  } finally {
    await prisma.$disconnect();
  }
};

module.exports = { findUser };
