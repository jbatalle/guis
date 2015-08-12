# @see Authentication
class Authentication < Sinatra::Application
  def sp
    @sp = SP.find(params["id"])
    rescue ActiveRecord::RecordNotFound
      halt(404)
  end
end