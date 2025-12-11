package migrations

import (
	"log"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/daos"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	log.Println("Registering board members update migration...")
	m.Register(func(db dbx.Builder) error {
		dao := daos.New(db)

		// Get the existing board_members collection
		boardMembers, err := dao.FindCollectionByNameOrId("board_members")
		if err != nil {
			return err
		}

		// Update email field to be optional
		emailField := boardMembers.Schema.GetFieldByName("email")
		if emailField != nil {
			emailField.Required = false
		}

		// Save the updated collection
		if err := dao.SaveCollection(boardMembers); err != nil {
			return err
		}

		return nil
	}, func(db dbx.Builder) error {
		dao := daos.New(db)

		// Rollback: revert changes
		boardMembers, err := dao.FindCollectionByNameOrId("board_members")
		if err != nil {
			return err
		}

		// Make email required again
		emailField := boardMembers.Schema.GetFieldByName("email")
		if emailField != nil {
			emailField.Required = true
		}

		if err := dao.SaveCollection(boardMembers); err != nil {
			return err
		}

		return nil
	}, "1734000000_update_board_members.go")
}
