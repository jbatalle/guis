package org.opennaas.gui.dao.serviceProvider;

import org.opennaas.gui.dao.Dao;
import org.opennaas.gui.entity.ServiceProvider;


/**
 * Definition of a Data Access Object that can perform CRUD Operations for {@link ServiceProvider}s.
 * 
 * @author Josep Batallé <josep.batalle@i2cat.net>
 */
public interface ServiceProviderDao extends Dao<ServiceProvider, Long>{

    public void add(Long id, String viId);
    public void delete(Long id, String viId);

}