package ru.kata.spring.boot_security.demo.beans.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.beans.models.Role;
import ru.kata.spring.boot_security.demo.beans.models.User;
import ru.kata.spring.boot_security.demo.beans.service.RoleService;
import ru.kata.spring.boot_security.demo.beans.service.UserService;

import java.security.Principal;
import java.util.Set;

@Controller
public class UsersController {

    private final UserService userService;

    @Autowired
    public UsersController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/admin")
    public String getUsers(Model model, Principal principal) {
        model.addAttribute("user", userService.findByEmail(principal.getName()));
        return "/admin/show";
    }

    @GetMapping("/user")
    public String showUserForm(Model model, Principal principal) {
        model.addAttribute("user", userService.findByEmail(principal.getName()));
        return "/users/userPage";
    }

}
