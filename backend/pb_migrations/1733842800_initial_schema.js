/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  // Create announcements collection
  const announcements = new Collection({
    id: 'announcements_collection',
    name: 'announcements',
    type: 'base',
    system: false,
    schema: [
      {
        name: 'title',
        type: 'text',
        required: true,
        options: {
          min: 1,
          max: 200
        }
      },
      {
        name: 'slug',
        type: 'text',
        required: true,
        options: {
          min: 1,
          max: 200,
          pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$'
        }
      },
      {
        name: 'content',
        type: 'editor',
        required: true,
        options: {
          convertUrls: true
        }
      },
      {
        name: 'published_date',
        type: 'date',
        required: true
      },
      {
        name: 'featured',
        type: 'bool',
        required: false
      }
    ],
    indexes: [
      'CREATE UNIQUE INDEX idx_unique_slug ON announcements (slug)'
    ],
    listRule: '',  // Public read
    viewRule: '',  // Public read
    createRule: null,  // Admin only
    updateRule: null,  // Admin only
    deleteRule: null   // Admin only
  });

  db.collections.save(announcements);

  // Create documents collection
  const documents = new Collection({
    id: 'documents_collection',
    name: 'documents',
    type: 'base',
    system: false,
    schema: [
      {
        name: 'title',
        type: 'text',
        required: true,
        options: {
          min: 1,
          max: 200
        }
      },
      {
        name: 'category',
        type: 'select',
        required: true,
        options: {
          maxSelect: 1,
          values: [
            'Meeting Minutes',
            'Bylaws',
            'Financial Reports',
            'Architectural Guidelines'
          ]
        }
      },
      {
        name: 'year',
        type: 'number',
        required: true,
        options: {
          min: 2000,
          max: 2100
        }
      },
      {
        name: 'file',
        type: 'file',
        required: true,
        options: {
          maxSelect: 1,
          maxSize: 10485760,  // 10MB
          mimeTypes: ['application/pdf']
        }
      },
      {
        name: 'description',
        type: 'text',
        required: false,
        options: {
          max: 500
        }
      }
    ],
    indexes: [
      'CREATE INDEX idx_category ON documents (category)',
      'CREATE INDEX idx_year ON documents (year)'
    ],
    listRule: '',  // Public read
    viewRule: '',  // Public read
    createRule: null,  // Admin only
    updateRule: null,  // Admin only
    deleteRule: null   // Admin only
  });

  db.collections.save(documents);

  return true;
}, (db) => {
  // Rollback
  const announcements = db.findCollectionByNameOrId('announcements_collection');
  if (announcements) {
    db.deleteCollection(announcements);
  }

  const documents = db.findCollectionByNameOrId('documents_collection');
  if (documents) {
    db.deleteCollection(documents);
  }

  return true;
});
