package org.opennaas.gui.rest.resources;

import java.io.IOException;
import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;

import org.opennaas.gui.JsonViews;
import org.opennaas.gui.dao.vi.VIDao;
import org.opennaas.gui.entity.VI;

import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.map.ObjectWriter;
import org.opennaas.gui.entity.virtualResource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Component
@Path("/vi")
public class VIResource {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private VIDao vIDao;

    @Autowired
    private ObjectMapper mapper;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public String list() throws JsonGenerationException, JsonMappingException, IOException {
        this.logger.info("list()");

        ObjectWriter viewWriter;
        if (this.isAdmin()) {
            viewWriter = this.mapper.writerWithView(JsonViews.Admin.class);
        } else {
            viewWriter = this.mapper.writerWithView(JsonViews.User.class);
        }
        List<VI> allEntries = this.vIDao.findAll();

        return viewWriter.writeValueAsString(allEntries);
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("{id}")
    public VI read(@PathParam("id") Long id) {
        this.logger.info("read(id)");

        VI historyEntry = this.vIDao.find(id);
        if (historyEntry == null) {
            throw new WebApplicationException(404);
        }
        return historyEntry;
    }

    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public VI create(VI historyEntry) {
        this.logger.info("create(): " + historyEntry);

        return this.vIDao.save(historyEntry);
    }

    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    @Path("{id}")
    public VI update(@PathParam("id") Long id, VI historyEntry) {
        this.logger.info("update(): " + historyEntry);

        return this.vIDao.save(historyEntry);
    }

    @DELETE
    @Produces(MediaType.APPLICATION_JSON)
    @Path("{id}")
    public void delete(@PathParam("id") Long id) {
        this.logger.info("delete(id)");

        this.vIDao.delete(id);
    }
    
    @DELETE
    @Path("removeByName/{viName}")
    public void delete(@PathParam("viName") String viName) {
        this.logger.info("delete(id)");

        this.vIDao.delete(this.vIDao.findByName(viName).getId());
    }
    
    @GET
    @Path("{viName}/name/{resName}/type/{resType}")//rest/vi/"+viId+"/name/"+resName+"/type/"+resType
    public void addVI(@PathParam("viName") String viName, @PathParam("resName")String resName, @PathParam("resType")String resType) {
        this.logger.info("add vi(id, viId)");
        this.vIDao.add(this.vIDao.findByName(viName).getId(), resName, resType);
    }
    
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/getVIByName/{viName}")
    public VI getVIByName( @PathParam("viName")String viName) {
        this.logger.info("get vi by Name "+viName);

        return this.vIDao.findByName(viName);
    }
    
    @GET
    @Path("/updateStatus/{viName}/{status}")
    public void updateStatus( @PathParam("viName")String viName, @PathParam("status")String status) {
        this.logger.info("change vi("+viName+") status to "+status);

        this.vIDao.findByName(viName).setStatus(status);
        VI vi = this.vIDao.findByName(viName);
        vi.setStatus(status);
        this.vIDao.save(vi);
        this.logger.info(this.vIDao.findByName(viName).getStatus());
    }
    
    private boolean isAdmin() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();
        if (principal instanceof String && ((String) principal).equals("anonymousUser")) {
            return false;
        }
        UserDetails userDetails = (UserDetails) principal;

        for (GrantedAuthority authority : userDetails.getAuthorities()) {
            if (authority.toString().equals("admin")) {
                return true;
            }
        }

        return false;
    }

}
