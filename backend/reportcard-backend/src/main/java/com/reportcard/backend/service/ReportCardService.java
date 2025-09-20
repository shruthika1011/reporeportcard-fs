package com.reportcard.backend.service;

import java.util.List;
import com.reportcard.backend.entity.ReportCard;

public interface ReportCardService {
    ReportCard addReportCard(ReportCard reportCard);
    List<ReportCard> getAllReportCards();
    ReportCard getReportCardByStudentId(String studentId);
    ReportCard updateReportCard(ReportCard reportCard);
    void deleteReportCardByStudentId(String studentId);
}
