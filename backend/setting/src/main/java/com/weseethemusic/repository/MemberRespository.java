package com.weseethemusic.repository;

import com.weseethemusic.common.model.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MemberRespository extends JpaRepository<Member, Long> {

}
