class CreateLogin < ActiveRecord::Migration
  def change
    create_table :logins do |t|
      t.integer :user_id, :unique => true
      t.boolean :logged
      
      t.timestamps null: false
    end
  end
  
  def self.down
    drop_table :logins
  end
end
