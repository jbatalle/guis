package org.opennaas.gui.dao.viNet;

import java.util.List;
import javax.persistence.Query;

import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import org.opennaas.gui.dao.JpaDao;
import org.opennaas.gui.entity.ServiceProvider;
import org.opennaas.gui.entity.viNet;
import org.opennaas.gui.entity.virtualResource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.transaction.annotation.Transactional;

/**
 * JPA Implementation of a {@link ServiceProviderDao}.
 *
 * @author Josep Batallé <josep.batalle@i2cat.net>
 */
public class JpaviNetDao extends JpaDao<viNet, Long> implements viNetDao {
private final Logger logger = LoggerFactory.getLogger(this.getClass());
    public JpaviNetDao() {
        super(viNet.class);
    }

    @Override
    @Transactional(readOnly = true)
    public List<viNet> findAll() {
        final CriteriaBuilder builder = this.getEntityManager().getCriteriaBuilder();
        final CriteriaQuery<viNet> criteriaQuery = builder.createQuery(viNet.class);

        Root<viNet> root = criteriaQuery.from(viNet.class);
        criteriaQuery.orderBy(builder.desc(root.get("date")));

        TypedQuery<viNet> typedQuery = this.getEntityManager().createQuery(criteriaQuery);
        return typedQuery.getResultList();
    }

    @Override
    @Transactional
    public void add(Long id, String resName, String resType){
        viNet entity = this.find(id);
        virtualResource virtRes = new virtualResource(resName, resType);
        entity.getViRes().add(virtRes);
        this.getEntityManager().persist(entity);
//        this.getEntityManager().flush();
    }

    @Override
    public viNet findByName(String viName) {
        Query q = this.getEntityManager().createNamedQuery("viNet.findByName");
        q.setParameter("name", viName);
        return (viNet) q.getSingleResult();
    }
}

