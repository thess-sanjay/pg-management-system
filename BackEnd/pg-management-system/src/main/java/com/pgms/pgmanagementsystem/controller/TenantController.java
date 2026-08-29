package com.pgms.pgmanagementsystem.controller;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;
import com.pgms.pgmanagementsystem.entity.Tenant;
import com.pgms.pgmanagementsystem.service.TenantService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.DeleteMapping;

@RestController
@RequestMapping("/api/tenants")
public class TenantController {

    private final TenantService tenantService;

    public TenantController(TenantService tenantService) {
        this.tenantService = tenantService;
    }

    @GetMapping
    public List<Tenant> getAllTenants() {
        return tenantService.getAllTenants();
    }

    @PostMapping
    public Tenant createTenant(@Valid @RequestBody Tenant tenant) {
        return tenantService.saveTenant(tenant);
    }
    @GetMapping("/{id}")
    public Tenant getTenantById(@PathVariable Long id) {
        return tenantService.getTenantById(id);
    }
    
    @PutMapping("/{id}")
    public Tenant updateTenant(
            @PathVariable Long id,
            @Valid @RequestBody Tenant tenant) {

        return tenantService.updateTenant(id, tenant);
    }
    
    @DeleteMapping("/{id}")
    public String deleteTenant(@PathVariable Long id) {

        tenantService.deleteTenant(id);

        return "Tenant deleted successfully";
    }
    
    @GetMapping("/search")
    public List<Tenant> searchTenants(
            @RequestParam String name) {

        return tenantService.searchTenantsByName(name);
    }
}