class CreateViNetwork < ActiveRecord::Migration
  def change
    create_table :vi_networks do |t|
      t.string :name
      t.string :interval_start
      t.string :interval_end
      
      
      
      t.timestamps null: false
    end
  end
  
  def self.down
    drop_table :vi_networks
  end
end
