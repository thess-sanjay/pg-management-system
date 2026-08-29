package com.pgms.pgmanagementsystem.service;

import com.pgms.pgmanagementsystem.entity.Activity;
import com.pgms.pgmanagementsystem.repository.ActivityRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ActivityService {

    private final ActivityRepository activityRepository;

    public ActivityService(ActivityRepository activityRepository) {
        this.activityRepository = activityRepository;
    }

    public Activity createActivity(
            String action,
            String message
    ) {

        Activity activity =
                new Activity(action, message);

        return activityRepository.save(activity);
    }

    public List<Activity> getRecentActivities() {

        return activityRepository
                .findTop10ByOrderByCreatedAtDesc();
    }
}