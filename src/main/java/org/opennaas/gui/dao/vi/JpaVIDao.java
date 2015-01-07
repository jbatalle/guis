package org.opennaas.gui.dao.vi;

import java.util.List;
import javax.persistence.EntityManager;

import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import org.opennaas.gui.dao.JpaDao;
import org.opennaas.gui.entity.VI;
import org.springframework.transaction.annotation.Propagation;

import org.springframework.transaction.annotation.Transactional;

/**
 * JPA Implementation of a {@link ServiceProviderDao}.
 *
 * @author Josep Batallé <josep.batalle@i2cat.net>
 */
public class JpaVIDao extends JpaDao<VI, Long> implements VIDao {

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
}
