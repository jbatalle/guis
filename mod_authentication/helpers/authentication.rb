# @see Authentication
class Authentication < Sinatra::Application
	def logged_in?
		#session[:authed]
	end
	
	def check_expiration(token)
		if Time.now.to_i > token.expiration
			Token.destroy(token.id)
			return false
		end
		return true
	end
	
	def parse_json(message)
                # Check JSON message format
                begin
                        parsed_message = JSON.parse(message) # parse json message
                rescue JSON::ParserError => e
                        # If JSON not valid, return with errors
                        logger.error "JSON parsing: #{e.to_s}"
                        return message, e.to_s + "\n"
                end

                return parsed_message, nil
        end

end
