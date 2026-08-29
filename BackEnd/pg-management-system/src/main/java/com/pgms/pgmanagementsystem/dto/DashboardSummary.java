
package com.pgms.pgmanagementsystem.dto;

public class DashboardSummary {

    private long totalRooms;
    private long totalTenants;

    private long totalBeds;
    private long occupiedBeds;
    private long availableBeds;
    private long fullRooms;

    private long paidTenants;
    private long pendingTenants;
    private long overdueTenants;

    private double totalRentExpected;
    private double totalRentReceived;
    private double totalOutstanding;

    public DashboardSummary() {
    }

    public long getTotalRooms() {
        return totalRooms;
    }

    public void setTotalRooms(long totalRooms) {
        this.totalRooms = totalRooms;
    }

    public long getTotalTenants() {
        return totalTenants;
    }

    public void setTotalTenants(long totalTenants) {
        this.totalTenants = totalTenants;
    }

    public long getTotalBeds() {
        return totalBeds;
    }

    public void setTotalBeds(long totalBeds) {
        this.totalBeds = totalBeds;
    }

    public long getOccupiedBeds() {
        return occupiedBeds;
    }

    public void setOccupiedBeds(long occupiedBeds) {
        this.occupiedBeds = occupiedBeds;
    }

    public long getAvailableBeds() {
        return availableBeds;
    }

    public void setAvailableBeds(long availableBeds) {
        this.availableBeds = availableBeds;
    }

    public long getFullRooms() {
        return fullRooms;
    }

    public void setFullRooms(long fullRooms) {
        this.fullRooms = fullRooms;
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

    public long getOverdueTenants() {
        return overdueTenants;
    }

    public void setOverdueTenants(long overdueTenants) {
        this.overdueTenants = overdueTenants;
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
}

