package org.opennaas.gui.rest.resources;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.POST;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.ResponseBody;
import org.opennaas.gui.utils.Constants;

@Component
@Path("/endpoint")
public class endPointResource {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    @GET
    @Path("/")
    @Produces(MediaType.TEXT_PLAIN)
    public @ResponseBody String get() throws IOException, ServletException {
        return Constants.WS_REST_URL;
    }
    
    @POST
    @Path("/{ip}/{port}")
    public @ResponseBody void put(@PathParam("ip") String ip, @PathParam("port") String port) throws IOException, ServletException {
        Constants.WS_REST_URL = "http://"+ip+":"+port;
    }
}
