package migrations

import (
	"log"
	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/daos"
	m "github.com/pocketbase/pocketbase/migrations"
	"github.com/pocketbase/pocketbase/models"
	"github.com/pocketbase/pocketbase/models/schema"
)

func init() {
	log.Println("Registering board members migration...")
	m.Register(func(db dbx.Builder) error {
		dao := daos.New(db)

		// Create board_members collection
		boardMembers := &models.Collection{}
		boardMembers.Name = "board_members"
		boardMembers.Type = models.CollectionTypeBase
		boardMembers.System = false
		boardMembers.Schema = schema.NewSchema(
			&schema.SchemaField{
				Name:     "firstname",
				Type:     schema.FieldTypeText,
				Required: true,
				Options: &schema.TextOptions{
					Min: ptr(1), Max: ptr(100),
				},
			},
			&schema.SchemaField{
				Name:     "lastname",
				Type:     schema.FieldTypeText,
				Required: true,
				Options: &schema.TextOptions{
					Min: ptr(1), Max: ptr(100),
				},
			},
			&schema.SchemaField{
				Name:     "email",
				Type:     schema.FieldTypeEmail,
				Required: true,
			},
			&schema.SchemaField{
				Name:     "headshot",
				Type:     schema.FieldTypeFile,
				Required: false,
				Options: &schema.FileOptions{
					MaxSelect: 1,
					MaxSize:   5242880, // 5MB
					MimeTypes: []string{"image/jpeg", "image/png", "image/webp"},
				},
			},
			&schema.SchemaField{
				Name:     "pronouns",
				Type:     schema.FieldTypeText,
				Required: false,
				Options: &schema.TextOptions{
					Max: ptr(50),
				},
			},
			&schema.SchemaField{
				Name:     "position",
				Type:     schema.FieldTypeText,
				Required: false,
				Options: &schema.TextOptions{
					Max: ptr(100),
				},
			},
			&schema.SchemaField{
				Name:     "bio",
				Type:     schema.FieldTypeText,
				Required: false,
				Options: &schema.TextOptions{
					Max: ptr(1000),
				},
			},
			&schema.SchemaField{
				Name:     "order",
				Type:     schema.FieldTypeNumber,
				Required: false,
				Options: &schema.NumberOptions{
					Min: ptr(0.0),
				},
			},
		)
		// Add index for ordering
		boardMembers.Indexes = []string{
			"CREATE INDEX idx_order ON board_members (order)",
		}
		// Public read access
		boardMembers.ListRule = ptr("")
		boardMembers.ViewRule = ptr("")

		if err := dao.SaveCollection(boardMembers); err != nil {
			return err
		}

		return nil
	}, func(db dbx.Builder) error {
		dao := daos.New(db)

		boardMembers, _ := dao.FindCollectionByNameOrId("board_members")
		if boardMembers != nil {
			if err := dao.DeleteCollection(boardMembers); err != nil {
				return err
			}
		}

		return nil
	}, "1733931600_board_members.go")
}
