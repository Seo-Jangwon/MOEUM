package com.weseethemusic.member.common.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
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
public class Setting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "member_id")
    private Member member;

    @Column(nullable = false)
    @ColumnDefault("false")
    private boolean vibration;

    @Column(nullable = false)
    @ColumnDefault("false")
    private boolean visualization;

    @Column(nullable = false, columnDefinition = "TINYINT(4) default 0")
    private int blindness;

    @Column(nullable = false)
    @ColumnDefault("0")
    private int eqLow;

    @Column(nullable = false)
    @ColumnDefault("0")
    private int eqMid;

    @Column(nullable = false)
    @ColumnDefault("0")
    private int eqHigh;

}
