package com.weseethemusic.member.common.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.util.Date;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

@Entity
@Getter
@Setter
public class Member {

    public enum Role {
        USER,
        ADMIN
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String email;

    @Column(length = 20)
    private String password;

    @Column(nullable = false, length = 12)
    private String nickname;

    @Column
    private String provider;

    // @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss.SSS")
    @Column(nullable = false)
    // @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt = new Date();

    @Column(nullable = false)
    @ColumnDefault("false")
    private boolean bIsDeleted = false;

    // @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss.SSS")
    @Column
    // @Temporal(TemporalType.TIMESTAMP)
    private Date deletedAt;

    @Column
    private String profileImage;

    @Column(name = "role")
    @Enumerated(EnumType.STRING)
    private Role role;

    public String getRole() {
        return String.valueOf(role);
    }
}
