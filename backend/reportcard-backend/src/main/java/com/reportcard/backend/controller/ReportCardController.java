package com.reportcard.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.reportcard.backend.entity.ReportCard;
import com.reportcard.backend.service.ReportCardService;

@RestController
@RequestMapping("/reports") 
@CrossOrigin(origins = "http://localhost:5173")
public class ReportCardController {

    @Autowired
    private ReportCardService reportCardService;

    // ✅ Health Check
    @GetMapping("/ping")
    public String ping() {
        return "✅ ReportCard API is running!";
    }

    // ✅ Create ReportCard
    @PostMapping
    public ResponseEntity<ReportCard> addReportCard(@RequestBody ReportCard reportCard) {
        ReportCard saved = reportCardService.addReportCard(reportCard);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    // ✅ Get All ReportCards
    @GetMapping
    public ResponseEntity<List<ReportCard>> getAllReportCards() {
        return ResponseEntity.ok(reportCardService.getAllReportCards());
    }

    // ✅ Get ReportCard by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getReportCardById(@PathVariable int id) {
        ReportCard reportCard = reportCardService.getReportCardById(id);
        if (reportCard != null) {
            return ResponseEntity.ok(reportCard);
        }
        return new ResponseEntity<>("❌ ReportCard with ID " + id + " not found.", HttpStatus.NOT_FOUND);
    }

    // ✅ Update ReportCard
    @PutMapping("/{id}")
    public ResponseEntity<?> updateReportCard(@PathVariable int id, @RequestBody ReportCard reportCard) {
        ReportCard existing = reportCardService.getReportCardById(id);
        if (existing != null) {
            reportCard.setId(id);
            ReportCard updated = reportCardService.updateReportCard(reportCard);
            return ResponseEntity.ok(updated);
        }
        return new ResponseEntity<>("❌ Cannot update. ReportCard with ID " + id + " not found.", HttpStatus.NOT_FOUND);
    }

    // ✅ Delete ReportCard
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteReportCard(@PathVariable int id) {
        ReportCard existing = reportCardService.getReportCardById(id);
        if (existing != null) {
            reportCardService.deleteReportCardById(id);
            return ResponseEntity.ok("✅ ReportCard with ID " + id + " deleted successfully.");
        }
        return new ResponseEntity<>("❌ Cannot delete. ReportCard with ID " + id + " not found.", HttpStatus.NOT_FOUND);
    }
}
