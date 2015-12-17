class CreateViReqResource < ActiveRecord::Migration
  def change
    create_table :vi_req_resources do |t|
      t.string :name
      t.string :resource_type
      t.string :endpoint
      t.string :ports
      t.string :mapped_resource

      t.references :vi_req_network
      
      
      t.timestamps null: false
    end
  end
  
  def self.down
    drop_table :vi_req_resources
  end
end
