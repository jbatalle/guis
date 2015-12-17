class CreateViResource < ActiveRecord::Migration
  def change
    create_table :vi_resources do |t|
      t.string :name
      t.string :type
      t.string :endpoint
            
      t.timestamps null: false
    end
  end
  
  def self.down
    drop_table :vi_resources
  end
end
