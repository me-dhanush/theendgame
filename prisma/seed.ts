import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.createMany({
    data: [
      { lichessId: "dhanush-me", username: "Dhanush" },

      { lichessId: "magnuscarlsen", username: "MagnusCarlsen" },
      { lichessId: "hikaru", username: "HikaruNakamura" },
      { lichessId: "firouzja", username: "AlirezaFirouzja" },
      { lichessId: "dingliren", username: "DingLiren" },
      { lichessId: "nepomniachtchi", username: "IanNepo" },
      { lichessId: "gukesh", username: "GukeshD" },
      { lichessId: "praggnanandhaa", username: "Pragg" },
      { lichessId: "vidit", username: "ViditGupta" },
      { lichessId: "anishgiri", username: "AnishGiri" },
      { lichessId: "wesleyso", username: "WesleySo" },
      { lichessId: "levonaronian", username: "LevonAronian" },
      { lichessId: "fabianocaruana", username: "FabianoCaruana" },
      { lichessId: "teimourradjabov", username: "Radjabov" },
      { lichessId: "sergeykarjakin", username: "Karjakin" },
      { lichessId: "richardrapport", username: "RichardRapport" },
      { lichessId: "duda", username: "JKDuda" },

      { lichessId: "player17", username: "Player17" },
      { lichessId: "player18", username: "Player18" },
      { lichessId: "player19", username: "Player19" },
      { lichessId: "player20", username: "Player20" },
      { lichessId: "player21", username: "Player21" },
      { lichessId: "player22", username: "Player22" },
      { lichessId: "player23", username: "Player23" },
      { lichessId: "player24", username: "Player24" },
      { lichessId: "player25", username: "Player25" },
      { lichessId: "player26", username: "Player26" },
      { lichessId: "player27", username: "Player27" },
      { lichessId: "player28", username: "Player28" },
      { lichessId: "player29", username: "Player29" },
      { lichessId: "player30", username: "Player30" },
      { lichessId: "player31", username: "Player31" },
      { lichessId: "player32", username: "Player32" },
    ],
    skipDuplicates: true,
  });

  console.log("Users seeded:", users);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
