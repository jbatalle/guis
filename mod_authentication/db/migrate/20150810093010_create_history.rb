class CreateHistory < ActiveRecord::Migration
  def change
    create_table :histories do |t|
      t.integer :user_id
      t.string :content
      t.string :status
      
      t.timestamps null: false
    end
  end
  
  def self.down
    drop_table :histories
  end
end
