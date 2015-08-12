class CreateUser < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :name, :unique => true
      t.string :fullname
      t.string :email, :unique => true
      t.string :password_hash
      t.string :password_salt
      t.integer :active
      t.integer :tenant_id
      
      t.string :language
      
      t.string :password_reset_hash
      t.string :password_reset_timestamp
      
      t.string :last_login_ip
      t.timestamp :last_login_timestamp
      
      t.integer :failed_logins
      t.string :last_failed_login_ip
      t.timestamp :last_failed_login_timestamp
      
      t.integer :logins

      t.string :activation_hash
      
      t.timestamps null: false
    end
  end
  
  def self.down
    drop_table :users
  end
end
