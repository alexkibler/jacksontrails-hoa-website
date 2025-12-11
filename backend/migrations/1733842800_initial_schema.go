package migrations

import (
	"log"
	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/daos"
	m "github.com/pocketbase/pocketbase/migrations"
	"github.com/pocketbase/pocketbase/models"
	"github.com/pocketbase/pocketbase/models/schema"
)

func ptr[T any](v T) *T {
	return &v
}

func init() {
	log.Println("Registering initial schema migration...")
	m.Register(func(db dbx.Builder) error {
		dao := daos.New(db)

		// 1. Create announcements collection
		announcements := &models.Collection{}
		announcements.Name = "announcements"
		announcements.Type = models.CollectionTypeBase
		announcements.System = false
		announcements.Schema = schema.NewSchema(
			&schema.SchemaField{
				Name:     "title",
				Type:     schema.FieldTypeText,
				Required: true,
				Options: &schema.TextOptions{
					Min: ptr(1), Max: ptr(200),
				},
			},
			&schema.SchemaField{
				Name:     "slug",
				Type:     schema.FieldTypeText,
				Required: true,
				Options: &schema.TextOptions{
					Min: ptr(1), Max: ptr(200),
					Pattern: `^[a-z0-9]+(?:-[a-z0-9]+)*$`,
				},
			},
			&schema.SchemaField{
				Name:     "content",
				Type:     schema.FieldTypeEditor,
				Required: true,
				Options: &schema.EditorOptions{
					ConvertUrls: true,
				},
			},
			&schema.SchemaField{
				Name:     "published_date",
				Type:     schema.FieldTypeDate,
				Required: true,
			},
			&schema.SchemaField{
				Name:     "featured",
				Type:     schema.FieldTypeBool,
				Required: false,
			},
		)
		// Add indexes via the Indexes field (requires raw SQL)
		announcements.Indexes = []string{
			"CREATE UNIQUE INDEX idx_unique_slug ON announcements (slug)",
		}
		announcements.ListRule = ptr("")
		announcements.ViewRule = ptr("")
		
		if err := dao.SaveCollection(announcements); err != nil {
			return err
		}

		// 2. Create documents collection
		documents := &models.Collection{}
		documents.Name = "documents"
		documents.Type = models.CollectionTypeBase
		documents.System = false
		documents.Schema = schema.NewSchema(
			&schema.SchemaField{
				Name:     "title",
				Type:     schema.FieldTypeText,
				Required: true,
				Options: &schema.TextOptions{
					Min: ptr(1), Max: ptr(200),
				},
			},
			&schema.SchemaField{
				Name:     "category",
				Type:     schema.FieldTypeSelect,
				Required: true,
				Options: &schema.SelectOptions{
					MaxSelect: 1,
					Values: []string{
						"Meeting Minutes",
						"Bylaws",
						"Financial Reports",
						"Architectural Guidelines",
					},
				},
			},
			&schema.SchemaField{
				Name:     "year",
				Type:     schema.FieldTypeNumber,
				Required: true,
				Options: &schema.NumberOptions{
					Min: ptr(2000.0), Max: ptr(2100.0),
				},
			},
			&schema.SchemaField{
				Name:     "file",
				Type:     schema.FieldTypeFile,
				Required: true,
				Options: &schema.FileOptions{
					MaxSelect: 1,
					MaxSize:   10485760, // 10MB
					MimeTypes: []string{"application/pdf"},
				},
			},
			&schema.SchemaField{
				Name:     "description",
				Type:     schema.FieldTypeText,
				Required: false,
				Options: &schema.TextOptions{
					Max: ptr(500),
				},
			},
		)
		documents.Indexes = []string{
			"CREATE INDEX idx_category ON documents (category)",
			"CREATE INDEX idx_year ON documents (year)",
		}
		documents.ListRule = ptr("")
		documents.ViewRule = ptr("")

		if err := dao.SaveCollection(documents); err != nil {
			return err
		}

		return nil
	}, func(db dbx.Builder) error {
		dao := daos.New(db)

		announcements, _ := dao.FindCollectionByNameOrId("announcements")
		if announcements != nil {
			if err := dao.DeleteCollection(announcements); err != nil {
				return err
			}
		}

		documents, _ := dao.FindCollectionByNameOrId("documents")
		if documents != nil {
			if err := dao.DeleteCollection(documents); err != nil {
				return err
			}
		}

		return nil
	}, "1733842800_initial_schema.go")
}
