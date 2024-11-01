package com.weseethemusic.member.common.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Calibration {

    @Id
    private Long id;

    @OneToOne
    @MapsId
    @JoinColumn(name = "member_id")
    private Member member;

    @ColumnDefault("000000")
    @Column(nullable = false, length = 6)
    private String q1;

    @ColumnDefault("000000")
    @Column(nullable = false, length = 6)
    private String q2;

    @ColumnDefault("000000")
    @Column(nullable = false, length = 6)
    private String q3;

    @ColumnDefault("000000")
    @Column(nullable = false, length = 6)
    private String q4;

    @ColumnDefault("000000")
    @Column(nullable = false, length = 6)
    private String q5;

    @ColumnDefault("000000")
    @Column(nullable = false, length = 6)
    private String q6;

    @ColumnDefault("000000")
    @Column(nullable = false, length = 6)
    private String q7;

    @ColumnDefault("000000")
    @Column(nullable = false, length = 6)
    private String q8;

}
