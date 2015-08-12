class CreateVi < ActiveRecord::Migration
  def change
    create_table :vis do |t|
      t.string :name, :unique => true
      t.string :status
    end
  end
end
