package com.pgms.pgmanagementsystem.repository;

import com.pgms.pgmanagementsystem.entity.Activity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ActivityRepository
        extends JpaRepository<Activity, Long> {

    List<Activity> findTop10ByOrderByCreatedAtDesc();
}