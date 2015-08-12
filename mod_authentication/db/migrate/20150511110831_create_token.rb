class CreateToken < ActiveRecord::Migration
  def change
    create_table :tokens, :force => true do |t|
      t.string :user_id
      t.string :token
      t.integer :expiration
    end
  end
end

