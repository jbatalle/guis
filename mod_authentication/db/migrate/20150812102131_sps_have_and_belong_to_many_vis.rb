class SpsHaveAndBelongToManyVis < ActiveRecord::Migration
  def self.up
    
    create_table :sps_vis, :id => false do |t|
          t.references :vi, :sp
        end
  end

  def self.down
    drop_table :sps_vis
    
  end
end