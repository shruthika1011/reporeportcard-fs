package com.reportcard.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.reportcard.backend.entity.ReportCard;

@Repository
public interface ReportCardRepository extends JpaRepository<ReportCard, String> {
    // studentId is now the primary key, so String is used
}
