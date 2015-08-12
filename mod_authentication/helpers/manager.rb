# @see Authentication
class Authentication < Sinatra::Application
	def sendRegistermMail(user_mail)
 	  destination = settings.mail
		mail = Mail.new do
			from	destination
			to      user_mail
			subject	"FOG - You're user is registred correctly."
			body "Thanks for signing up. Please wait for the activation of your account"
		end
		mail.delivery_method :sendmail
		begin
			mail.deliver!
		rescue => ex
			puts "Error #{$!}"
		end
	end

	def sendInformMail(username)
	  destination = settings.mail
    user = User.where(name: "admin").first
		mail = Mail.new do
			from	destination
			to user.email
			subject	"FOG - New user registred."
			body "A new user " + username + " is registred. This user needs to be activated."
		end
		mail.delivery_method :sendmail
		begin
			mail.deliver!
		rescue => ex
			puts "Error #{$!}"
		end
	end
	def recoverPassMail(email, hash)
    destination = settings.mail
		mail = Mail.new do
			from	destination
			to      email
			subject	"FOG - Recovery password."
			body "Go to the following link in order to rewrite your password. http://url/?verification="+hash
		end
		mail.delivery_method :sendmail
		begin
			mail.deliver!
		rescue => ex
			puts "Error #{$!}"
		end
	end
end

