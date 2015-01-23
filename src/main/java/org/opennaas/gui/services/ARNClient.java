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

    public String get(String path, HttpServletRequest request) throws RestServiceException {
        log.info("Path: " + path);
        ClientResponse response;
        log.info("JerseyClient GET: " + path);
        try {
            log.info("JerseyClient GET: " + path);
            String url = getURL(path);
            Client client = Client.create();
            addHTTPBasicAuthentication(client);
            WebResource webResource = client.resource(url);
            response = webResource.get(ClientResponse.class);
            log.info("Route table: " + response);
        } catch (ClientHandlerException e) {
            log.error(e.getMessage());
            return "OpenNaaS is not started";
        }
        return checkResponse(response) ? response.getEntity(String.class) : null;
    }
    
    public String post(String content) throws RestServiceException {
        ClientResponse response;
        log.info("JerseyClient POST: ");
        try {
            String url = "http://fibratv.dtdns.net:41080/cgi-bin/xml-parser.cgi";
            Client client = Client.create();
            addHTTPBasicAuthentication(client);
            WebResource webResource = client.resource(url);
            response = webResource.post(ClientResponse.class, content);
            log.info("Route table: " + response);
        } catch (ClientHandlerException e) {
            log.error(e.getMessage());
            return "OpenNaaS is not started";
        }
        return checkResponse(response) ? response.getEntity(String.class) : null;
    }
}
