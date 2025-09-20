package com.reportcard.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "report_card")
public class ReportCard {

    @Id
    @Column(name = "student_id", nullable = false, length = 50)
    private String studentId;  // Primary Key

    @Column(name = "student_name", nullable = false, length = 100)
    private String name;

    @Column(name = "subject", nullable = false, length = 100)
    private String subject;

    @Column(name = "marks", nullable = false)
    private Integer marks;

    // Constructors
    public ReportCard() {}

    public ReportCard(String studentId, String name, String subject, Integer marks) {
        this.studentId = studentId;
        this.name = name;
        this.subject = subject;
        this.marks = marks;
    }

    // Getters & setters
    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public Integer getMarks() { return marks; }
    public void setMarks(Integer marks) { this.marks = marks; }

    @Override
    public String toString() {
        return "ReportCard [studentId=" + studentId + ", name=" + name + ", subject=" + subject + ", marks=" + marks + "]";
    }
}
