package org.opennaas.gui.dao;

import java.util.ArrayList;
import java.util.List;
import org.opennaas.gui.dao.serviceProvider.ServiceProviderDao;
import org.opennaas.gui.dao.user.UserDao;
import org.opennaas.gui.dao.vi.VIDao;
import org.opennaas.gui.dao.viNet.viNetDao;
import org.opennaas.gui.entity.ServiceProvider;
import org.opennaas.gui.entity.User;
import org.opennaas.gui.entity.VI;
import org.opennaas.gui.entity.viNet;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Initialize the database with some test entries.
 *
 * @author Philip W. Sorst <philip@sorst.net>
 */
public class DataBaseInitializer {

    private ServiceProviderDao serviceProviderDao;

    private VIDao vIDao;
    
    private viNetDao viNetDao;
    
    private UserDao userDao;

    private PasswordEncoder passwordEncoder;

    protected DataBaseInitializer() {
        /* Default constructor for reflection instantiation */
    }

    public DataBaseInitializer(UserDao userDao, ServiceProviderDao serviceProvidersDao, VIDao vIDao, viNetDao viNetDao, PasswordEncoder passwordEncoder) {
        this.userDao = userDao;
        this.serviceProviderDao = serviceProvidersDao;
        this.vIDao = vIDao;
        this.viNetDao = viNetDao;
        this.passwordEncoder = passwordEncoder;
    }

    public void initDataBase() {
        User userUser = new User("sp", this.passwordEncoder.encode("sp"));
        userUser.addRole("user");
        this.userDao.save(userUser);
        
        User adminUser = new User("ip", this.passwordEncoder.encode("ip"));
        adminUser.addRole("user");
        adminUser.addRole("admin");
        this.userDao.save(adminUser);
/*
        viNet viNet = new viNet();
        viNet.setName("TestVI");
        this.viNetDao.save(viNet);
  */      
/*        ServiceProvider sp = new ServiceProvider();
        sp.setName("SP1");
        List<String> vi = new ArrayList<String>();
        vi.add("vi-1");
        sp.setVi(vi);
        this.serviceProviderDao.save(sp);
        
        this.serviceProviderDao.add((long) 1, "vi-2");
   */     
        VI VI = new VI();
    }
}
