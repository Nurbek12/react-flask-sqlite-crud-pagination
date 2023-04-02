import sqlite3 as sql

con = sql.connect('database.db')
cur = con.cursor()

cur.execute('DROP TABLE IF EXISTS users')
sql = '''CREATE TABLE "users" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "userid" TEXT,
    "name" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "email" TEXT,
    "image" TEXT,
    "status" TEXT,
    "description" TEXT)'''
cur.execute(sql)

con.commit()
con.close()