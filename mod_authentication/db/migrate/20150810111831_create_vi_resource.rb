class CreateViResource < ActiveRecord::Migration
  def change
    create_table :vi_resources do |t|
      t.string :name, :unique => true
      t.string :type
    end
  end
end
