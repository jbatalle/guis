class CreateSp < ActiveRecord::Migration
  def change
    create_table :sps do |t|
      t.string :name, :unique => true
      t.string :description
      t.string :url
      t.string :active
      
      t.timestamps null: false
    end
  end
end
