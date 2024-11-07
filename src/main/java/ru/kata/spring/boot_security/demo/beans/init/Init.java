package ru.kata.spring.boot_security.demo.beans.init;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import ru.kata.spring.boot_security.demo.beans.models.Role;
import ru.kata.spring.boot_security.demo.beans.models.User;
import ru.kata.spring.boot_security.demo.beans.repositories.UsersRepository;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;

import javax.transaction.Transactional;
import java.util.Set;


@Component
@Transactional
public class Init {

    private final UsersRepository usersRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    private final User user1 = new User(
            "admin", "admin", 20, "admin@mail.ru",
            passwordEncoder.encode("admin"),
            Set.of(new Role("ROLE_ADMIN"))
    );
    private final User user2 = new User(
            "user", "user", 21, "user@mail.ru",
            passwordEncoder.encode("user"),
            Set.of(new Role("ROLE_USER"))
    );

    @Autowired
    public Init(UsersRepository usersRepository) {
        this.usersRepository = usersRepository;
    }

    @PostConstruct
    public void init() {
        usersRepository.save(user1);
        usersRepository.save(user2);
    }

    @PreDestroy
    public void destroy() {
        usersRepository.delete(user1);
        usersRepository.delete(user2);
    }
}
