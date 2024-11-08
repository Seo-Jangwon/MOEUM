package com.weseethemusic.member.repository.member;

import com.weseethemusic.member.common.entity.Member;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {

    Optional<Member> findByEmail(String email);

    // 삭제 예정 시간이 현재보다 이전인 회원들
    @Query("SELECT m FROM Member m WHERE m.deletedAt <= :now AND m.bIsDeleted = false")
    List<Member> findMembersToDelete(@Param("now") Date now);
}
