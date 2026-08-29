package com.pgms.pgmanagementsystem.controller;

import com.pgms.pgmanagementsystem.entity.Activity;
import com.pgms.pgmanagementsystem.service.ActivityService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activities")
public class ActivityController {

    private final ActivityService activityService;

    public ActivityController(
            ActivityService activityService
    ) {
        this.activityService = activityService;
    }

    @GetMapping("/recent")
    public List<Activity> getRecentActivities() {

        return activityService
                .getRecentActivities();
    }
}