package org.opennaas.gui.services;

import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.filter.HTTPBasicAuthFilter;
import java.util.Locale;
import javax.ws.rs.core.Response.Status.Family;
import org.apache.log4j.Logger;
import org.opennaas.gui.utils.Constants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

/**
 * @author Jordi
 */
public abstract class GenericRestService {

	private static final Logger LOGGER	= Logger.getLogger(GenericRestService.class);

	@Autowired
	private ReloadableResourceBundleMessageSource	configSource;

	/**
	 * @param path
	 * @return the url rest to call
	 */
	protected String getURL(String path) {
		String url = Constants.WS_REST_URL + path;
		LOGGER.info("Web service url: " + url);
		return url;
	}

	/**
	 * Check if response code is between 200 and 299
	 * 
         * @param response
	 * @return true if response code is between 200 and 299
	 * @throws RestServiceException
	 */
	protected Boolean checkResponse(ClientResponse response) throws RestServiceException {
		LOGGER.info("Response: " + response);
		Family family = ClientResponse.Status.fromStatusCode(response.getStatus()).getFamily();
		if (family.equals(Family.SERVER_ERROR)) {
			String message = response.getEntity(String.class);
			throw new RestServiceException((message != null && !message.equals("")) ? message : "message.error.notdetailmessage");
		} else if (!family.equals(Family.SUCCESSFUL)) {
			throw new RestServiceException(response.toString());
		}
		return true;
	}
        
         /**
         * Add HTTP Basic Authentication header to REST call using current Authentication object stored in Spring Security SecurityContextHolder
         * 
         * @param client
         */
        protected void addHTTPBasicAuthentication(Client client) {
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                client.addFilter(new HTTPBasicAuthFilter(authentication.getName(), (String) authentication.getCredentials()));
        }
}
