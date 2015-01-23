package org.opennaas.gui.dao.vi;

import java.util.List;
import javax.persistence.Query;

import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import org.opennaas.gui.dao.JpaDao;
import org.opennaas.gui.entity.ServiceProvider;
import org.opennaas.gui.entity.VI;
import org.opennaas.gui.entity.virtualResource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.transaction.annotation.Transactional;

/**
 * JPA Implementation of a {@link ServiceProviderDao}.
 *
 * @author Josep Batallé <josep.batalle@i2cat.net>
 */
public class JpaVIDao extends JpaDao<VI, Long> implements VIDao {
private final Logger logger = LoggerFactory.getLogger(this.getClass());
    public JpaVIDao() {
        super(VI.class);
    }

    @Override
    @Transactional(readOnly = true)
    public List<VI> findAll() {
        final CriteriaBuilder builder = this.getEntityManager().getCriteriaBuilder();
        final CriteriaQuery<VI> criteriaQuery = builder.createQuery(VI.class);

        Root<VI> root = criteriaQuery.from(VI.class);
        criteriaQuery.orderBy(builder.desc(root.get("date")));

        TypedQuery<VI> typedQuery = this.getEntityManager().createQuery(criteriaQuery);
        return typedQuery.getResultList();
    }
    
    @Override
    @Transactional
    public void add(Long id, String resName, String resType){
        VI entity = this.find(id);
        virtualResource virtRes = new virtualResource(resName, resType);
        entity.getViRes().add(virtRes);
        this.getEntityManager().persist(entity);
//        this.getEntityManager().flush();
    }

    @Override
    public VI findByName(String viName) {
        Query q = this.getEntityManager().createNamedQuery("VI.findByName");
        q.setParameter("name", viName);
        return (VI) q.getSingleResult();
    }
}
