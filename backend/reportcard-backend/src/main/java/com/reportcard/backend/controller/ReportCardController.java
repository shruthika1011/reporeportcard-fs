package com.reportcard.backend.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.reportcard.backend.entity.ReportCard;
import com.reportcard.backend.service.ReportCardService;

@RestController
@RequestMapping
@CrossOrigin(origins = "http://localhost:5173")
public class ReportCardController {

    @Autowired
    private ReportCardService reportCardService;

    @GetMapping("/")
    public String home() {
        return "ReportCard Backend is working!";
    }

    @GetMapping("/all")
    public ResponseEntity<List<ReportCard>> getAllReportCards() {
        return ResponseEntity.ok(reportCardService.getAllReportCards());
    }

    @GetMapping("/get/{studentId}")
    public ResponseEntity<?> getReportCardByStudentId(@PathVariable String studentId) {
        ReportCard reportCard = reportCardService.getReportCardByStudentId(studentId);
        if (reportCard != null) {
            return ResponseEntity.ok(reportCard);
        }
        return new ResponseEntity<>("ReportCard with Student ID " + studentId + " not found.", HttpStatus.NOT_FOUND);
    }

    @PostMapping("/add")
    public ResponseEntity<ReportCard> addReportCard(@RequestBody ReportCard reportCard) {
        ReportCard saved = reportCardService.addReportCard(reportCard);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @PutMapping("/update/{studentId}")
    public ResponseEntity<?> updateReportCard(@PathVariable String studentId, @RequestBody ReportCard reportCard) {
        ReportCard existing = reportCardService.getReportCardByStudentId(studentId);
        if (existing != null) {
            reportCard.setStudentId(studentId);
            ReportCard updated = reportCardService.updateReportCard(reportCard);
            return ResponseEntity.ok(updated);
        }
        return new ResponseEntity<>("Cannot update. ReportCard with Student ID " + studentId + " not found.", HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/delete/{studentId}")
    public ResponseEntity<String> deleteReportCard(@PathVariable String studentId) {
        ReportCard existing = reportCardService.getReportCardByStudentId(studentId);
        if (existing != null) {
            reportCardService.deleteReportCardByStudentId(studentId);
            return ResponseEntity.ok("ReportCard with Student ID " + studentId + " deleted successfully.");
        }
        return new ResponseEntity<>("Cannot delete. ReportCard with Student ID " + studentId + " not found.", HttpStatus.NOT_FOUND);
    }
}
