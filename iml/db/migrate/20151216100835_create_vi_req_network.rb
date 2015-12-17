class CreateViReqNetwork < ActiveRecord::Migration
  def change
    create_table :vi_req_networks do |t|
      t.string :name
      t.string :period_start
      t.string :period_end
            
      t.timestamps null: false
    end
  end
  
  def self.down
    drop_table :vi_req_networks
  end
end
