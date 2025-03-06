import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Clean existing data
  await prisma.book.deleteMany({});
  await prisma.author.deleteMany({});

  // Create authors
  const authors = [
    { name: 'Steve Krug' },
    { name: 'Don Norman' },
    { name: 'Jake Knapp' },
    { name: 'Jeff Gothelf' },
    { name: 'Nir Eyal' },
    { name: 'Brad Frost' },
    { name: 'Adam Wathan & Steve Schoger' },
    { name: 'Aaron Walter' },
    { name: 'Erika Hall' },
    { name: 'Tom Greever' },
    { name: 'Ellen Lupton' },
    { name: 'Alan Cooper' },
    { name: 'William Lidwell' }
  ];

  // Insert authors and store their IDs
  const authorRecords = await Promise.all(
    authors.map(author => 
      prisma.author.create({
        data: author
      })
    )
  );

  console.log(`Created ${authorRecords.length} authors`);

  // Create books with author relationships
  const books = [
    {
      title: "Don't Make Me Think",
      year: 2013,
      authorId: authorRecords[0].id, // Steve Krug
    },
    {
      title: "The Design of Everyday Things",
      year: 2013,
      authorId: authorRecords[1].id, // Don Norman
    },
    {
      title: "Sprint: How to Solve Big Problems and Test New Ideas in Just Five Days",
      year: 2016,
      authorId: authorRecords[2].id, // Jake Knapp
    },
    {
      title: "Lean UX: Designing Great Products with Agile Teams",
      year: 2016,
      authorId: authorRecords[3].id, // Jeff Gothelf
    },
    {
      title: "Hooked: How to Build Habit-Forming Products",
      year: 2014,
      authorId: authorRecords[4].id, // Nir Eyal
    },
    {
      title: "Atomic Design",
      year: 2016,
      authorId: authorRecords[5].id, // Brad Frost
    },
    {
      title: "Refactoring UI",
      year: 2018,
      authorId: authorRecords[6].id, // Adam Wathan & Steve Schoger
    },
    {
      title: "Designing for Emotion",
      year: 2011,
      authorId: authorRecords[7].id, // Aaron Walter
    },
    {
      title: "Just Enough Research",
      year: 2013,
      authorId: authorRecords[8].id, // Erika Hall
    },
    {
      title: "Articulating Design Decisions",
      year: 2015,
      authorId: authorRecords[9].id, // Tom Greever
    },
    {
      title: "Thinking with Type",
      year: 2010,
      authorId: authorRecords[10].id, // Ellen Lupton
    },
    {
      title: "About Face: The Essentials of Interaction Design",
      year: 2014,
      authorId: authorRecords[11].id, // Alan Cooper
    },
    {
      title: "Universal Principles of Design",
      year: 2010,
      authorId: authorRecords[12].id, // William Lidwell
    },
    {
      title: "Rocket Surgery Made Easy",
      year: 2009,
      authorId: authorRecords[0].id, // Steve Krug
    },
    {
      title: "Emotional Design: Why We Love (or Hate) Everyday Things",
      year: 2005,
      authorId: authorRecords[1].id, // Don Norman
    },
    {
      title: "Make Time: How to Focus on What Matters Every Day",
      year: 2018,
      authorId: authorRecords[2].id, // Jake Knapp
    },
    {
      title: "Lean vs Agile vs Design Thinking",
      year: 2017,
      authorId: authorRecords[3].id, // Jeff Gothelf
    },
    {
      title: "Indistractable: How to Control Your Attention and Choose Your Life",
      year: 2019,
      authorId: authorRecords[4].id, // Nir Eyal
    },
    {
      title: "Responsive Web Design",
      year: 2011,
      authorId: authorRecords[5].id, // Brad Frost
    },
    {
      title: "Graphic Design: The New Basics",
      year: 2008,
      authorId: authorRecords[10].id, // Ellen Lupton
    },
    {
      title: "The Inmates Are Running the Asylum",
      year: 2004,
      authorId: authorRecords[11].id, // Alan Cooper
    },
    {
      title: "Universal Methods of Design",
      year: 2012,
      authorId: authorRecords[12].id, // William Lidwell
    }
  ];

  // Insert books
  const bookRecords = await Promise.all(
    books.map(book => 
      prisma.book.create({
        data: book
      })
    )
  );

  console.log(`Created ${bookRecords.length} books`);
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })