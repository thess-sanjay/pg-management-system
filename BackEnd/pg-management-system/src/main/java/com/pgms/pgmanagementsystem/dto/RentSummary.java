package com.pgms.pgmanagementsystem.dto;

import java.util.List;

public class RentSummary {

    private String month;

    private long totalTenants;

    private long paidTenants;

    private long pendingTenants;

    private double totalRentExpected;

    private double totalRentReceived;

    private double totalOutstanding;
    
    private List<String> pendingTenantNames;
    
    private List<String> paidTenantNames;

    public RentSummary() {
    }

    public String getMonth() {
        return month;
    }

    public void setMonth(String month) {
        this.month = month;
    }

    public long getTotalTenants() {
        return totalTenants;
    }

    public void setTotalTenants(long totalTenants) {
        this.totalTenants = totalTenants;
    }

    public long getPaidTenants() {
        return paidTenants;
    }

    public void setPaidTenants(long paidTenants) {
        this.paidTenants = paidTenants;
    }

    public long getPendingTenants() {
        return pendingTenants;
    }

    public void setPendingTenants(long pendingTenants) {
        this.pendingTenants = pendingTenants;
    }

    public double getTotalRentExpected() {
        return totalRentExpected;
    }

    public void setTotalRentExpected(double totalRentExpected) {
        this.totalRentExpected = totalRentExpected;
    }

    public double getTotalRentReceived() {
        return totalRentReceived;
    }

    public void setTotalRentReceived(double totalRentReceived) {
        this.totalRentReceived = totalRentReceived;
    }

    public double getTotalOutstanding() {
        return totalOutstanding;
    }

    public void setTotalOutstanding(double totalOutstanding) {
        this.totalOutstanding = totalOutstanding;
    }
    
    public List<String> getPendingTenantNames() {
        return pendingTenantNames;
    }

    public void setPendingTenantNames(List<String> pendingTenantNames) {
        this.pendingTenantNames = pendingTenantNames;
    }
    
    public List<String> getPaidTenantNames() {
        return paidTenantNames;
    }

    public void setPaidTenantNames(List<String> paidTenantNames) {
        this.paidTenantNames = paidTenantNames;
    }
}