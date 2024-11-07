package ru.kata.spring.boot_security.demo.beans.service;

import ru.kata.spring.boot_security.demo.beans.models.Role;

import java.util.List;

public interface RoleService {
    List<Role> findAll();
}
