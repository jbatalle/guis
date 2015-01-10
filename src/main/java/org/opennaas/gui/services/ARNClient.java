package org.opennaas.gui.services;

import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.ClientHandlerException;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.WebResource;
import javax.servlet.http.HttpServletRequest;
import org.apache.log4j.Logger;

/**
 * @author Josep Batallé (josep.batalle@i2cat.net)
 * ARN CLIENT
 */
public class ARNClient extends GenericRestService {

    private final Logger log = Logger.getLogger(this.getClass());

    public String post(String cpeURL, String content) throws RestServiceException {
        ClientResponse response;
        log.info("JerseyClient POST: ");
        try {
            Client client = Client.create();
            addHTTPBasicAuthentication(client);
            WebResource webResource = client.resource(cpeURL);
            response = webResource.post(ClientResponse.class, content);
            log.info("Route table: " + response);
        } catch (ClientHandlerException e) {
            log.error(e.getMessage());
            return "OpenNaaS is not started";
        }
        return checkResponse(response) ? response.getEntity(String.class) : null;
    }
}
