package migrations

import (
	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/daos"
	m "github.com/pocketbase/pocketbase/migrations"
	"github.com/pocketbase/pocketbase/models"
	"github.com/pocketbase/pocketbase/tools/types"
)

func init() {
	m.Register(func(db dbx.Builder) error {
		dao := daos.New(db)

		// Seed Announcements
		announcements, err := dao.FindCollectionByNameOrId("announcements")
		if err != nil {
			return err
		}

		record1 := models.NewRecord(announcements)
		record1.Set("title", "Welcome to Jackson Trails HOA")
		record1.Set("slug", "welcome-to-jackson-trails-hoa")
		record1.Set("content", "<p>Welcome to the new Jackson Trails Homeowners Association website!</p><p>We are excited to bring you a new way to stay informed about community news and access important documents.</p>")
		
		t1, _ := types.ParseDateTime("2024-01-15 10:00:00.000Z")
		record1.Set("published_date", t1)
		record1.Set("featured", true)
		if err := dao.SaveRecord(record1); err != nil {
			return err
		}

		record2 := models.NewRecord(announcements)
		record2.Set("title", "Annual Meeting Reminder")
		record2.Set("slug", "annual-meeting-reminder")
		record2.Set("content", "<p>A friendly reminder that our annual HOA meeting is scheduled for March 10th at 7 PM in the clubhouse.</p><p>Please plan to attend to discuss important community matters.</p>")
		t2, _ := types.ParseDateTime("2024-02-28 09:00:00.000Z")
		record2.Set("published_date", t2)
		record2.Set("featured", false)
		if err := dao.SaveRecord(record2); err != nil {
			return err
		}

		// Seed Documents
		documents, err := dao.FindCollectionByNameOrId("documents")
		if err != nil {
			return err
		}

		doc1 := models.NewRecord(documents)
		doc1.Set("title", "HOA Bylaws")
		doc1.Set("category", "Bylaws")
		doc1.Set("year", 2023)
		doc1.Set("description", "The official bylaws of the Jackson Trails Homeowners Association.")
		if err := dao.SaveRecord(doc1); err != nil {
			return err
		}

		doc2 := models.NewRecord(documents)
		doc2.Set("title", "2023 Annual Financial Report")
		doc2.Set("category", "Financial Reports")
		doc2.Set("year", 2023)
		doc2.Set("description", "Summary of the HOA's financial activities for the year 2023.")
		if err := dao.SaveRecord(doc2); err != nil {
			return err
		}

		return nil
	}, func(db dbx.Builder) error {
		// Cleanup logic could go here, but for seed data it's often skipped or simple
		return nil
	}, "1733842801_seed_data.go")
}
