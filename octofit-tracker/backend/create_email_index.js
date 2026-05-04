# Tworzy unikalny indeks na polu email w kolekcji users
use octofit_db
db.users.createIndex({ "email": 1 }, { unique: true })
