package com.weseethemusic.common.model;

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
public class Setting {

  @Id
  private Long id;

  @OneToOne
  @MapsId
  @JoinColumn(name = "member_id")
  private Member member;

  @Column(nullable = false)
  @ColumnDefault("false")
  private boolean vibration = false;

  @Column(nullable = false)
  @ColumnDefault("false")
  private boolean visualization = false;

  @Column(nullable = false, columnDefinition = "TINYINT(4) default 0")
  private int blindness = 0;

  @Column(nullable = false)
  @ColumnDefault("0")
  private int eq_low = 0;

  @Column(nullable = false)
  @ColumnDefault("0")
  private int eq_mid = 0;

  @Column(nullable = false)
  @ColumnDefault("0")
  private int eq_high = 0;

}
