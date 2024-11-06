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
    private final RoleService roleService;

    @Autowired
    public UsersController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }


    @GetMapping("/admin")
    public String getUsers(Model model,Principal principal) {
        model.addAttribute("users", userService.getAllUsers());
        model.addAttribute("user",userService.findByEmail(principal.getName()));
        model.addAttribute("userForForm", new User());
        model.addAttribute("roles", roleService.findAll());
        return "/admin/show";
    }

    @GetMapping("/user")
    public String showUserForm(Model model, Principal principal) {
        model.addAttribute("user", userService.findByEmail(principal.getName()));
        return "/users/userPage";
    }

    @PostMapping("/admin/addNewUser")
    public String addUser(@ModelAttribute User user) {
        userService.addUser(user);
        return "redirect:/admin";
    }

    @PostMapping("/admin/editUser")
    public String editUser(@ModelAttribute User user, @RequestParam(required = false) Set<Role> roles, @RequestParam(name = "newPassword") String newPassword) {
        userService.updateUser(user, roles,newPassword);
        return "redirect:/admin";
    }

    @PostMapping("/admin/deleteUser")
    public String deleteUser(@ModelAttribute User user) {
        userService.deleteUser(user.getId());
        return "redirect:/admin";
    }

}
