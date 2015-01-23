package org.opennaas.gui.services;

import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.ClientHandlerException;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.WebResource;
import javax.servlet.http.HttpServletRequest;
import org.apache.log4j.Logger;

/**
 * @author Josep Batallé (josep.batalle@i2cat.net)
 * CPE CLIENT
 */
public class CPEClient extends GenericRestService {

    private final Logger log = Logger.getLogger(this.getClass());
    private String cpeURL = "http://fibratv.dtdns.net:41081";

    public String get(String path, HttpServletRequest request) throws RestServiceException {
        log.info("Path: " + path);
        String url;
        ClientResponse response;
        log.info("JerseyClient GET: " + path);
        try {
            log.info("JerseyClient GET: " + path);
//            String url = getURL(path + "/" + data);
            url = cpeURL + path;
            Client client = Client.create();
            addHTTPBasicAuthentication(client);
            WebResource webResource = client.resource(url);
            response = webResource.get(ClientResponse.class);
            log.info("GET CPE: " + response);
        } catch (ClientHandlerException e) {
            log.error(e.getMessage());
            return "OpenNaaS is not started";
//            throw e;
        }
        return checkResponse(response) ? response.getEntity(String.class) : null;
    }
    
    public String post(String content) throws RestServiceException {
        ClientResponse response;
        String url;
        String path = "";
        log.info("JerseyClient POST: ");
        try {
//            String url = getURL(path + "/" + data);
            url = cpeURL + path;
            Client client = Client.create();
            addHTTPBasicAuthentication(client);
            WebResource webResource = client.resource(url);
            response = webResource.post(ClientResponse.class, content);
            log.info("Route table: " + response);
        } catch (ClientHandlerException e) {
            log.error(e.getMessage());
            return "OpenNaaS is not started";
//            throw e;
        }
        return checkResponse(response) ? response.getEntity(String.class) : null;
    }

}
