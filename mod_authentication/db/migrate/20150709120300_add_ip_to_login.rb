class AddIpToLogin < ActiveRecord::Migration
  def change
    add_column :logins, :ip, :string
  end
end
