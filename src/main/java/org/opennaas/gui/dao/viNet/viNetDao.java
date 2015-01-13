package org.opennaas.gui.dao.viNet;

import org.opennaas.gui.dao.Dao;
import org.opennaas.gui.entity.viNet;

/**
 * Definition of a Data Access Object that can perform CRUD Operations for
 * {@link ServiceProvider}s.
 *
 * @author Josep Batallé <josep.batalle@i2cat.net>
 */
public interface viNetDao extends Dao<viNet, Long> {

    public void add(Long id, String resName, String resType);
    public viNet findByName(String viName);
}

