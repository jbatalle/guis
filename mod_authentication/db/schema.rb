# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20151124111111) do

  create_table "histories", force: :cascade do |t|
    t.integer  "user_id"
    t.string   "content"
    t.string   "status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "logins", force: :cascade do |t|
    t.integer  "user_id"
    t.boolean  "logged"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string   "ip"
  end

  create_table "roles", force: :cascade do |t|
    t.string "name", limit: 40
  end

  create_table "roles_users", id: false, force: :cascade do |t|
    t.integer "role_id"
    t.integer "user_id"
  end

  create_table "sps", force: :cascade do |t|
    t.string   "name"
    t.string   "description"
    t.string   "url"
    t.string   "active"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
  end

  create_table "sps_vis", id: false, force: :cascade do |t|
    t.integer "vi_id"
    t.integer "sp_id"
  end

  create_table "tokens", force: :cascade do |t|
    t.string  "user_id"
    t.string  "token"
    t.integer "expiration"
  end

  create_table "users", force: :cascade do |t|
    t.string   "name"
    t.string   "fullname"
    t.string   "email"
    t.string   "password_hash"
    t.string   "password_salt"
    t.integer  "active"
    t.integer  "sp_id"
    t.string   "language"
    t.string   "password_reset_hash"
    t.string   "password_reset_timestamp"
    t.string   "last_login_ip"
    t.datetime "last_login_timestamp"
    t.integer  "failed_logins"
    t.string   "last_failed_login_ip"
    t.datetime "last_failed_login_timestamp"
    t.integer  "logins"
    t.string   "activation_hash"
    t.datetime "created_at",                  null: false
    t.datetime "updated_at",                  null: false
  end

  create_table "vi_resources", force: :cascade do |t|
    t.string "name"
    t.string "type"
    t.string "uri"
  end

  create_table "vis", force: :cascade do |t|
    t.string "name"
    t.string "status"
  end

end
