package ru.kata.spring.boot_security.demo.beans.rest_controllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.beans.models.User;
import ru.kata.spring.boot_security.demo.beans.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class MyRestController {

    private final UserService userService;

    @Autowired
    public MyRestController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<User> getUsers() {
        return userService.getAllUsers();
    }


    @PostMapping
    public User addUser(@RequestBody User user) {
        userService.addUser(user);
        return userService.findByEmail(user.getEmail());
    }


    @PutMapping
    public User updateUser(@RequestBody User user) {
        userService.updateUser(user);
        return userService.findById(user.getId());
    }

    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable("id") int id) {
        userService.deleteUser(id);
        return "User with ID:" + id + " was deleted";
    }

}
