package org.opennaas.gui.dao.serviceProvider;

import java.util.List;
import javax.persistence.EntityManager;

import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import org.opennaas.gui.dao.JpaDao;
import org.opennaas.gui.entity.ServiceProvider;
import org.springframework.transaction.annotation.Propagation;

import org.springframework.transaction.annotation.Transactional;

/**
 * JPA Implementation of a {@link ServiceProviderDao}.
 *
 * @author Josep Batallé <josep.batalle@i2cat.net>
 */
public class JpaServiceProviderDao extends JpaDao<ServiceProvider, Long> implements ServiceProviderDao {

    public JpaServiceProviderDao() {
        super(ServiceProvider.class);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ServiceProvider> findAll() {
        final CriteriaBuilder builder = this.getEntityManager().getCriteriaBuilder();
        final CriteriaQuery<ServiceProvider> criteriaQuery = builder.createQuery(ServiceProvider.class);

        Root<ServiceProvider> root = criteriaQuery.from(ServiceProvider.class);
        criteriaQuery.orderBy(builder.desc(root.get("date")));

        TypedQuery<ServiceProvider> typedQuery = this.getEntityManager().createQuery(criteriaQuery);
        return typedQuery.getResultList();
    }

    @Override
    @Transactional
    public void add(Long id, String viId) {
        ServiceProvider entity = this.find(id);
        entity.getVi().add(viId);
        this.getEntityManager().persist(entity);
        this.getEntityManager().flush();

    }
    
    @Override
    @Transactional
    public void delete(Long id, String viId) {
        ServiceProvider entity = this.find(id);
        entity.getVi().remove(viId);
        this.getEntityManager().persist(entity);
        this.getEntityManager().flush();

    }

}
