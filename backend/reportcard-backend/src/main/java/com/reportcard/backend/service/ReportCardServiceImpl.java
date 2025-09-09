package com.reportcard.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.reportcard.backend.entity.ReportCard;
import com.reportcard.backend.repository.ReportCardRepository;

@Service
public class ReportCardServiceImpl implements ReportCardService {

    @Autowired
    private ReportCardRepository reportCardRepository;

    @Override
    public ReportCard addReportCard(ReportCard reportCard) {
        return reportCardRepository.save(reportCard);
    }

    @Override
    public List<ReportCard> getAllReportCards() {
        return reportCardRepository.findAll();
    }

    @Override
    public ReportCard getReportCardById(int id) {
        Optional<ReportCard> opt = reportCardRepository.findById(id);
        return opt.orElse(null);
    }

    @Override
    public ReportCard updateReportCard(ReportCard reportCard) {
        return reportCardRepository.save(reportCard);
    }

    @Override
    public void deleteReportCardById(int id) {
        reportCardRepository.deleteById(id);
    }
}
