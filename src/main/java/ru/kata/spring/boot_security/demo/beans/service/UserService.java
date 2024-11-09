package ru.kata.spring.boot_security.demo.beans.service;


import ru.kata.spring.boot_security.demo.beans.models.Role;
import ru.kata.spring.boot_security.demo.beans.models.User;

import java.util.List;
import java.util.Set;

public interface UserService {
    void addUser(User user);

    void deleteUser(int id);

    List<User> getAllUsers();

    void updateUser(User user, Set<Role> roles, String password);

    void updateUser(User user);

    User findByEmail(String email);

    User findById(int id);
}
