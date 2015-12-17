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

ActiveRecord::Schema.define(version: 20151216100835) do

  create_table "vi_networks", force: :cascade do |t|
    t.string   "name"
    t.string   "interval_start"
    t.string   "interval_end"
    t.datetime "created_at",     null: false
    t.datetime "updated_at",     null: false
  end

  create_table "vi_req_networks", force: :cascade do |t|
    t.string   "name"
    t.string   "period_start"
    t.string   "period_end"
    t.datetime "created_at",   null: false
    t.datetime "updated_at",   null: false
  end

  create_table "vi_req_resources", force: :cascade do |t|
    t.string   "name"
    t.string   "resource_type"
    t.string   "ports"
    t.string   "mapped_resource"
    t.integer  "vi_req_network_id"
    t.datetime "created_at",        null: false
    t.datetime "updated_at",        null: false
  end

  create_table "vi_resources", force: :cascade do |t|
    t.string   "name"
    t.string   "type"
    t.string   "endpoint"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

end
