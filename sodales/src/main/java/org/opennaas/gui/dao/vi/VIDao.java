package org.opennaas.gui.dao.vi;

import org.opennaas.gui.dao.Dao;
import org.opennaas.gui.entity.VI;

/**
 * Definition of a Data Access Object that can perform CRUD Operations for
 * {@link ServiceProvider}s.
 *
 * @author Josep Batallé <josep.batalle@i2cat.net>
 */
public interface VIDao extends Dao<VI, Long> {

    public void add(Long id, String resName, String resType);
    public VI findByName(String viName);
}
