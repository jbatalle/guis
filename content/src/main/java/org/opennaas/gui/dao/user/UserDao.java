package org.opennaas.gui.dao.user;

import org.opennaas.gui.dao.Dao;
import org.opennaas.gui.entity.User;

import org.springframework.security.core.userdetails.UserDetailsService;

public interface UserDao extends Dao<User, Long>, UserDetailsService {

    User findByName(String name);

}
