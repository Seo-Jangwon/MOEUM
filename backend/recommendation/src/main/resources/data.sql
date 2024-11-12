-- genre 테이블 데이터
DELETE
FROM genre;
INSERT INTO genre (id, name)
VALUES (1, 'Pop'),
       (2, 'Disco'),
       (3, 'Hiphop'),
       (4, 'Latin'),
       (5, 'Musical'),
       (6, 'Holiday'),
       (7, 'Opera');

-- album 테이블 데이터
DELETE
FROM album;
INSERT INTO album (id, image_name, name, release_date)
VALUES (1, 'http://dummyimage.com/600x600.png/cc0000/ffffff', 'hardware', '2006-08-02'),
       (2, 'http://dummyimage.com/600x600.png/dddddd/000000', 'Virtual', '2017-02-13'),
       (3, 'http://dummyimage.com/600x600.png/cc0000/ffffff', '24/7', '2018-08-29'),
       (4, 'http://dummyimage.com/600x600.png/dddddd/000000', 'system-worthy', '2000-10-30'),
       (5, 'http://dummyimage.com/600x600.png/cc0000/ffffff', 'Business-focused', '2008-04-30'),
       (6, 'http://dummyimage.com/600x600.png/cc0000/ffffff', 'zero defect', '2019-02-27'),
       (7, 'http://dummyimage.com/600x600.png/5fa2dd/ffffff', 'hardware', '2019-10-19'),
       (8, 'http://dummyimage.com/600x600.png/dddddd/000000', 'demand-driven', '2002-06-04'),
       (9, 'http://dummyimage.com/600x600.png/cc0000/ffffff', 'Object-based', '2003-06-14'),
       (10, 'http://dummyimage.com/600x600.png/5fa2dd/ffffff', 'functionalities', '2022-07-21'),
       (11, 'http://dummyimage.com/600x600.png/5fa2dd/ffffff', 'mobile', '2018-06-23'),
       (12, 'http://dummyimage.com/600x600.png/ff4444/ffffff', 'Expanded', '2009-07-24'),
       (13, 'http://dummyimage.com/600x600.png/5fa2dd/ffffff', 'systemic', '2020-04-02'),
       (14, 'http://dummyimage.com/600x600.png/dddddd/000000', 'didactic', '2007-09-09'),
       (15, 'http://dummyimage.com/600x600.png/5fa2dd/ffffff', 'Centralized', '2008-01-30');

-- artist 테이블 데이터
DELETE
FROM artist;
INSERT INTO artist (id, image_name, name)
VALUES (1, 'http://dummyimage.com/713x643.png/ff4444/ffffff', 'Jolynn Horsefield'),
       (2, 'http://dummyimage.com/717x719.png/cc0000/ffffff', 'Polly Dufore'),
       (3, 'http://dummyimage.com/709x646.png/5fa2dd/ffffff', 'Cassius Savatier'),
       (4, 'http://dummyimage.com/651x760.png/5fa2dd/ffffff', 'Dyann Count'),
       (5, 'http://dummyimage.com/693x698.png/5fa2dd/ffffff', 'Vera Wilmington'),
       (6, 'http://dummyimage.com/654x624.png/ff4444/ffffff', 'Olga Chessill'),
       (7, 'http://dummyimage.com/616x695.png/dddddd/000000', 'Sylvan Loveridge'),
       (8, 'http://dummyimage.com/637x625.png/ff4444/ffffff', 'Berte Denton'),
       (9, 'http://dummyimage.com/750x678.png/dddddd/000000', 'Salome Cavalier'),
       (10, 'http://dummyimage.com/609x687.png/5fa2dd/ffffff', 'Flore McColley');

-- music 테이블 데이터
DELETE
FROM music;
INSERT INTO music (id, name, album_id, genre_id, duration, danceability, loudness, mode,
                   speechiness, acousticness, valence, tempo, energy)
VALUES (1, 'Beautiful Sky', 1, 1, 210, 0.75, -5.3, true, 0.06, 0.62, 0.76, 120.5, 0.78),
       (2, 'Vanilla', 1, 2, 190, 0.89, -4.1, false, 0.09, 0.35, 0.82, 128.2, 0.85),
       (3, 'Crimson Horizon', 1, 1, 225, 0.81, -6.1, true, 0.07, 0.58, 0.73, 118.7, 0.74),
       (4, 'Whispers of Wind', 2, 3, 180, 0.42, -8.5, false, 0.04, 0.24, 0.42, 92.3, 0.41),
       (5, 'Ocean Waves', 2, 4, 245, 0.64, -7.2, true, 0.08, 0.72, 0.67, 114.6, 0.63),
       (6, 'Golden Sunrise', 2, 2, 202, 0.78, -5.9, true, 0.05, 0.49, 0.79, 125.4, 0.81),
       (7, 'Silent Dreams', 3, 5, 235, 0.51, -6.8, false, 0.07, 0.29, 0.52, 99.8, 0.57),
       (8, 'Emerald Light', 3, 6, 215, 0.67, -5.4, true, 0.06, 0.68, 0.74, 120.1, 0.76),
       (9, 'Lost Paradise', 3, 1, 218, 0.53, -7.5, false, 0.05, 0.37, 0.65, 112.5, 0.64),
       (10, 'Serenity', 4, 4, 205, 0.76, -4.9, true, 0.07, 0.55, 0.78, 127.8, 0.82);

-- artist_music 테이블 데이터
DELETE
FROM artist_music;
INSERT INTO artist_music (artist_id, music_id)
VALUES (1, 1),
       (1, 2),
       (1, 3),
       (2, 4),
       (2, 5),
       (2, 6),
       (3, 7),
       (3, 8),
       (3, 9),
       (4, 10);