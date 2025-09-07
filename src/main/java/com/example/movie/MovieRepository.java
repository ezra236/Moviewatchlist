package com.example.movie;

import org.springframework.data.jpa.repository.JpaRepository;
public interface MovieRepository extends JpaRepository<Movie, Long> {}
