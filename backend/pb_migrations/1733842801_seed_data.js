/// <reference path="../pb_data/types.d.ts" />

migrate((db) => {
  const announcements = db.collections.getByName('announcements');
  const documents = db.collections.getByName('documents');

  // Seed Announcements
  const announcementsData = [
    {
      title: 'Community Pool Opens for the Season',
      slug: 'community-pool-opens-2024',
      content:
        'The community pool will officially open for the summer season on <strong>Saturday, May 25th, 2024</strong>. We look forward to seeing everyone there! Please review the updated pool rules available in the document library.',
      published_date: '2024-05-15',
      featured: true,
    },
    {
      title: 'Annual HOA Board Meeting',
      slug: 'annual-hoa-board-meeting-2024',
      content:
        'The annual HOA board meeting will be held on <strong>July 15th, 2024, at 7:00 PM</strong> at the community clubhouse. All homeowners are encouraged to attend. An agenda will be posted one week prior to the meeting.',
      published_date: '2024-06-20',
      featured: false,
    },
    {
      title: 'July 4th Neighborhood Block Party',
      slug: 'july-4th-block-party-2024',
      content:
        "Join us for our annual Fourth of July block party! We'll have food, games, and a fireworks display. The party starts at <strong>4:00 PM in the common area</strong>. Please RSVP by June 30th so we can get a headcount.",
      published_date: '2024-06-10',
      featured: true,
    },
  ];

  for (const data of announcementsData) {
    const record = new Record(announcements, data);
    db.records.save(record);
  }

  // Seed Documents
  const documentsData = [
    {
      title: 'Community Pool Rules - 2024 Update',
      category: 'Architectural Guidelines',
      year: 2024,
      file: 'pool-rules-2024.pdf', // This file needs to exist
      description: 'Updated pool regulations for the 2024 season.',
    },
    {
      title: 'HOA Bylaws (Amended 2023)',
      category: 'Bylaws',
      year: 2023,
      file: 'hoa-bylaws-2023.pdf', // This file needs to exist
      description: 'The official governing bylaws for the Jackson Trails HOA.',
    },
    {
      title: 'Q1 2024 Financial Report',
      category: 'Financial Reports',
      year: 2024,
      file: 'q1-2024-financials.pdf', // This file needs to exist
      description: 'Financial statement for the first quarter of 2024.',
    },
    {
      title: 'February 2024 Meeting Minutes',
      category: 'Meeting Minutes',
      year: 2024,
      file: 'feb-2024-minutes.pdf', // This file needs to exist
      description: 'Minutes from the monthly HOA board meeting held in February 2024.',
    },
  ];

  // NOTE: This migration assumes that PDF files with the specified names
  // exist in the `pb_data/storage/documents_collection` directory.
  // In a real scenario, you would need to upload these files.
  // For testing purposes, we are just creating the records.
  for (const data of documentsData) {
    const record = new Record(documents, data);
    db.records.save(record);
  }

  return true;
}, (db) => {
  // Rollback: Delete the seeded data
  const announcementsData = db.records.findMany('announcements', "slug LIKE '%-2024'");
  for (const record of announcementsData) {
    db.records.delete(record);
  }

  const documentsData = db.records.findMany('documents', "year >= 2023");
  for (const record of documentsData) {
    db.records.delete(record);
  }

  return true;
});
