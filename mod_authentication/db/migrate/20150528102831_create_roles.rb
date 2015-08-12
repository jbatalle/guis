class CreateRoles < ActiveRecord::Migration
  def up
    change_table :roles do |t|
      t.remove :roles # irreversible!
    end
  end
  def change
    create_table :roles do |t|
      t.string :name, limit: 40
    end
  end
end