package com.weseethemusic.model;

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

  @Column(nullable = false, length = 8)
  private String q1;

  @Column(nullable = false, length = 8)
  private String q2;

  @Column(nullable = false, length = 8)
  private String q3;

  @Column(nullable = false, length = 8)
  private String q4;

  @Column(nullable = false, length = 8)
  private String q5;

  @Column(nullable = false, length = 8)
  private String q6;

  @Column(nullable = false, length = 8)
  private String q7;

  @Column(nullable = false, length = 8)
  private String q8;

}
