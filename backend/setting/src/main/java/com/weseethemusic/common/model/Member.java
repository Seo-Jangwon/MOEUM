package com.weseethemusic.common.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import java.util.Date;
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
public class Member {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id = 1L;

  @Column(nullable = false)
  private String email;

  @Column(length = 20)
  private String password;

  @Column(nullable = false, length = 12)
  private String nickname;

  @Column
  private String provider;

  @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss.SSS")
  @Column(nullable = false)
  @Temporal(TemporalType.TIMESTAMP)
  private Date createdAt = new Date();

  @Column(nullable = false)
  @ColumnDefault("false")
  private boolean bIsDeleted = false;

  @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss.SSS")
  @Column
  @Temporal(TemporalType.TIMESTAMP)
  private Date deletedAt;

  @Column
  private String profileImage;

}
