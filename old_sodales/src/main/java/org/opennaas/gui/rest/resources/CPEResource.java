package org.opennaas.gui.rest.resources;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.logging.Level;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import org.opennaas.gui.services.CPEClient;
import org.opennaas.gui.services.RestServiceException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.ResponseBody;

@Component
@Path("/cpe")
public class CPEResource {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private CPEClient cpeClient;
    
    private String cpeURL = "http://fibratv.dtdns.net:41081";

    @PUT
    @Produces(MediaType.APPLICATION_XML)
    @Path("{res1:.*}")
    public void setUrl(@Context HttpServletRequest request, @Context HttpServletResponse response) throws IOException, RestServiceException, ServletException {
        StringBuilder stringBuilder = new StringBuilder();
        BufferedReader bufferedReader = null;
        try {
            InputStream inputStream = request.getInputStream();
            if (inputStream != null) {
                bufferedReader = new BufferedReader(new InputStreamReader(inputStream));
                char[] charBuffer = new char[128];
                int bytesRead = -1;
                while ((bytesRead = bufferedReader.read(charBuffer)) > 0) {
                    stringBuilder.append(charBuffer, 0, bytesRead);
                }
            } else {
                stringBuilder.append("");
            }
        } catch (IOException ex) {
            throw ex;
        } finally {
            if (bufferedReader != null) {
                try {
                    bufferedReader.close();
                } catch (IOException ex) {
                    throw ex;
                }
            }
        }
        String body = stringBuilder.toString();
        logger.error("SET URL: "+body);
        this.cpeURL = body;
    }
     
    
    @GET
    @Produces(MediaType.APPLICATION_XML)
    @Path("{res1:.*}")
    public @ResponseBody String getData(@Context HttpServletRequest request, @Context HttpServletResponse response) throws IOException, RestServiceException, ServletException {
        this.logger.info("GET data to CPE() ");

        String path = request.getPathInfo();
        if( request.getQueryString() != null ){
            path = path + "?" + request.getQueryString();
        }
        path = path.replace("/cpe", "");
        this.logger.info("GET PATH: "+path);
        String responseData = "";
        try {
            responseData = cpeClient.get(cpeURL, path, request);
        } catch (RestServiceException ex) {
            logger.error("SOme errror");
            java.util.logging.Logger.getLogger(ARNResource.class.getName()).log(Level.SEVERE, null, ex);
        }

        return responseData;
    }
    
    @POST
    @Produces(MediaType.APPLICATION_XML)
    @Path("{res1:.*}")
    public @ResponseBody String postData(@Context HttpServletRequest request, @Context HttpServletResponse response) throws IOException, RestServiceException, ServletException {
        this.logger.info("POST data to ARN() ");

        StringBuilder stringBuilder = new StringBuilder();
        BufferedReader bufferedReader = null;
        try {
            InputStream inputStream = request.getInputStream();
            if (inputStream != null) {
                bufferedReader = new BufferedReader(new InputStreamReader(inputStream));
                char[] charBuffer = new char[128];
                int bytesRead = -1;
                while ((bytesRead = bufferedReader.read(charBuffer)) > 0) {
                    stringBuilder.append(charBuffer, 0, bytesRead);
                }
            } else {
                stringBuilder.append("");
            }
        } catch (IOException ex) {
            throw ex;
        } finally {
            if (bufferedReader != null) {
                try {
                    bufferedReader.close();
                } catch (IOException ex) {
                    throw ex;
                }
            }
        }
        String body = stringBuilder.toString();

        String responseData = "";
        try {
            responseData = cpeClient.post(cpeURL, body);
        } catch (RestServiceException ex) {
            logger.error("SOme errror");
            java.util.logging.Logger.getLogger(ARNResource.class.getName()).log(Level.SEVERE, null, ex);
        }

        return responseData;
    }
}
