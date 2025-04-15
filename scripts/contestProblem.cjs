const { PrismaClient } = require("@prisma/client");
const database = new PrismaClient();

async function main() {
  try {
    // First, let's check if the database connection works
    await database.$connect();
    console.log("Database connection successful");

    // Check if any users with these emails already exist
    const existingUsers = await database.user.findMany({
      where: {
        OR: [
          { email: "pthanh.dhti15a8hn@sv.uneti.edu.vn" },
          { email: "pxhoan.dhti15a8hn@sv.uneti.edu.vn" },
          { email: "nthien.dhti15a8hn@sv.uneti.edu.vn" },
          { email: "pqhuy.dhti15a8hn@sv.uneti.edu.vn" },
          { email: "mdtuananh.dhti15a8hn@sv.uneti.edu.vn" },
          { email: "vlong.dhti15a8hn@sv.uneti.edu.vn" },
        ]
      }
    });

    if (existingUsers.length > 0) {
      console.log("Some users already exist:", existingUsers.map(u => u.email));
      return;
    }

    // Try to create users one by one instead of createMany
    const users = [
      {
        name: "Phạm Thị Hà Anh",
        email: "pthanh.dhti15a8hn@sv.uneti.edu.vn",
        password: "$2b$10$0uSeHwH9CTC1VjF7xhpF5eo60OftW.CeT4ZCseLyzrY5fO0Mhq9r.",
        role: "USER",
        masv: "21103100400",
        class: "DHTI15A8HN",
        department: "Công nghệ thông tin",
      },
      {
        name: "Phạm Xuân Hoàn",
        email: "pxhoan.dhti15a8hn@sv.uneti.edu.vn",
        password: "$2b$10$0uSeHwH9CTC1VjF7xhpF5eo60OftW.CeT4ZCseLyzrY5fO0Mhq9r.",
        role: "USER",
        masv: "21103100401",
        class: "DHTI15A8HN",
        department: "Công nghệ thông tin",
      },
      {
        name: "Nguyễn Thu Hiền",
        email: "nthien.dhti15a8hn@sv.uneti.edu.vn",
        password: "$2b$10$0uSeHwH9CTC1VjF7xhpF5eo60OftW.CeT4ZCseLyzrY5fO0Mhq9r.",
        role: "USER",
        masv: "21103100402",
        class: "DHTI15A8HN",
        department: "Công nghệ thông tin",
      },
      {
        name: "Phạm Quốc Huy",
        email: "pqhuy.dhti15a8hn@sv.uneti.edu.vn",
        password: "$2b$10$0uSeHwH9CTC1VjF7xhpF5eo60OftW.CeT4ZCseLyzrY5fO0Mhq9r.",
        role: "USER",
        masv: "21103100403",
        class: "DHTI15A8HN",
        department: "Công nghệ thông tin",
      },
      {
        name: "Mạc Đình Tuấn Anh",
        email: "mdtuananh.dhti15a8hn@sv.uneti.edu.vn",
        password: "$2b$10$0uSeHwH9CTC1VjF7xhpF5eo60OftW.CeT4ZCseLyzrY5fO0Mhq9r.",
        role: "USER",
        masv: "21103100404",
        class: "DHTI15A8HN",
        department: "Công nghệ thông tin",
      },
      {
        name: "Vũ Hoàng Long",
        email: "vlong.dhti15a8hn@sv.uneti.edu.vn",
        password: "$2b$10$0uSeHwH9CTC1VjF7xhpF5eo60OftW.CeT4ZCseLyzrY5fO0Mhq9r.",
        role: "USER",
        masv: "21103100405",
        class: "DHTI15A8HN",
        department: "Công nghệ thông tin",
      },
    ];

    // Create users one by one to better track errors
    for (const userData of users) {
      try {
        const user = await database.user.create({
          data: userData
        });
        console.log(`Created user: ${user.email}`);
      } catch (error) {
        console.error(`Failed to create user ${userData.email}:`, error.message);
      }
    }

  } catch (error) {
    console.error("Error in main function:", error);
    if (error.code) {
      console.error("Error code:", error.code);
    }
    if (error.meta) {
      console.error("Error metadata:", error.meta);
    }
  } finally {
    await database.$disconnect();
  }
}

main().catch((error) => {
  console.error("Unhandled error:", error);
  process.exit(1);
});
