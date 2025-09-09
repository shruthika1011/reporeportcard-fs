package com.reportcard.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.reportcard.backend.entity.ReportCard;

@Repository
public interface ReportCardRepository extends JpaRepository<ReportCard, Integer> {
    // we already get CRUD methods like save, findAll, findById, deleteById
    // but we can add custom queries later if needed
}
