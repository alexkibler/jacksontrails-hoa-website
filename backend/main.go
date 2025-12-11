package main

import (
    "log"

    "github.com/pocketbase/pocketbase"
    "github.com/pocketbase/pocketbase/plugins/migratecmd"

    // Register the migrations
    _ "jacksontrails/migrations"
)

func main() {
    log.Println("Starting PocketBase with custom migrations...")
    app := pocketbase.New()

    // Register the "migrate" command
    migratecmd.MustRegister(app, app.RootCmd, migratecmd.Config{
        // Auto-run migrations on startup
        Automigrate: true,
    })

    if err := app.Start(); err != nil {
        log.Fatal(err)
    }
}
