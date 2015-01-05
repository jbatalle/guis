package org.opennaas.gui.dao;

import java.util.ArrayList;
import java.util.List;
import org.opennaas.gui.dao.serviceProvider.ServiceProviderDao;
import org.opennaas.gui.dao.user.UserDao;
import org.opennaas.gui.entity.ServiceProvider;
import org.opennaas.gui.entity.User;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Initialize the database with some test entries.
 *
 * @author Philip W. Sorst <philip@sorst.net>
 */
public class DataBaseInitializer {

    private ServiceProviderDao serviceProviderDao;

    private UserDao userDao;

    private PasswordEncoder passwordEncoder;

    protected DataBaseInitializer() {
        /* Default constructor for reflection instantiation */
    }

    public DataBaseInitializer(UserDao userDao, ServiceProviderDao serviceProvidersDao, PasswordEncoder passwordEncoder) {
        this.userDao = userDao;
        this.serviceProviderDao = serviceProvidersDao;
        this.passwordEncoder = passwordEncoder;
    }

    public void initDataBase() {
        User userUser = new User("user", this.passwordEncoder.encode("user"));
        userUser.addRole("user");
        this.userDao.save(userUser);

        User adminUser = new User("admin", this.passwordEncoder.encode("admin"));
        adminUser.addRole("user");
        adminUser.addRole("admin");
        this.userDao.save(adminUser);

        ServiceProvider sp = new ServiceProvider();
        sp.setName("SP1");
        List<String> vi = new ArrayList<String>();
        vi.add("vi-1");
        sp.setVi(vi);
        this.serviceProviderDao.save(sp);
        
        this.serviceProviderDao.add((long) 1, "vi-2");
    }
}
