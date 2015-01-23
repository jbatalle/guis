package org.opennaas.gui.services;

import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.ClientHandlerException;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.WebResource;
import javax.servlet.http.HttpServletRequest;
import org.apache.log4j.Logger;

/**
 * @author Josep Batallé (josep.batalle@i2cat.net) TODO: Generic Jersey Service
 * Redirect/proxy Unused - TO REMOVE
 */
public class JerseyClient extends GenericRestService {

    private static final Logger log = Logger.getLogger(JerseyClient.class);

    public String get(String path, HttpServletRequest request) throws RestServiceException {
        log.info("Path: " + path);
        ClientResponse response;
        log.info("JerseyClient GET: " + path);
        try {
            log.info("JerseyClient GET: " + path);
//            String url = getURL(path + "/" + data);
            String url = getURL(path);
            Client client = Client.create();
            addHTTPBasicAuthentication(client);
            WebResource webResource = client.resource(url);
            response = webResource.get(ClientResponse.class);
            log.info("Route table: " + response);
        } catch (ClientHandlerException e) {
            log.error(e.getMessage());
            return "OpenNaaS is not started";
//            throw e;
        }
        return checkResponse(response) ? response.getEntity(String.class) : null;
    }

}
