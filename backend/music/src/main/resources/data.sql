/*!40101 SET @OLD_CHARACTER_SET_CLIENT = @@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE = @@TIME_ZONE */;
/*!40103 SET TIME_ZONE = '+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS = @@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS = 0 */;
/*!40101 SET @OLD_SQL_MODE = @@SQL_MODE, SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES = @@SQL_NOTES, SQL_NOTES = 0 */;

-- 1. 데이터 삭제
DELETE
FROM playlist_like;
DELETE
FROM like_music;
DELETE
FROM artist_music;
DELETE
FROM music;
DELETE
FROM artist;
DELETE
FROM album;
DELETE
FROM genre;
delete
from playlist;

-- 2. 데이터 삽입
INSERT INTO genre (id, name)
VALUES (1, 'Pop'),
       (2, 'Disco'),
       (3, 'Hiphop'),
       (4, 'Latin'),
       (5, 'Musical'),
       (6, 'Holiday'),
       (7, 'Opera');

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

INSERT INTO music (id, acousticness, danceability, duration, energy, loudness, mode, name,
                   speechiness, tempo, valence, album_id, genre_id)
VALUES (1, 0.62, 0.75, 210, 0.78, -5.3, b'1', 'Beautiful Sky', 0.06, 120.5, 0.76, 1, 1),
       (2, 0.35, 0.89, 190, 0.85, -4.1, b'0', 'Vanilla', 0.09, 128.2, 0.82, 1, 2),
       (3, 0.58, 0.81, 225, 0.74, -6.1, b'1', 'Crimson Horizon', 0.07, 118.7, 0.73, 1, 1),
       (4, 0.24, 0.42, 180, 0.41, -8.5, b'0', 'Whispers of Wind', 0.04, 92.3, 0.42, 2, 3),
       (5, 0.72, 0.64, 245, 0.63, -7.2, b'1', 'Ocean Waves', 0.08, 114.6, 0.67, 2, 4),
       (6, 0.49, 0.78, 202, 0.81, -5.9, b'1', 'Golden Sunrise', 0.05, 125.4, 0.79, 2, 2),
       (7, 0.29, 0.51, 235, 0.57, -6.8, b'0', 'Silent Dreams', 0.07, 99.8, 0.52, 3, 5),
       (8, 0.68, 0.67, 215, 0.76, -5.4, b'1', 'Emerald Light', 0.06, 120.1, 0.74, 3, 6),
       (9, 0.37, 0.53, 218, 0.64, -7.5, b'0', 'Lost Paradise', 0.05, 112.5, 0.65, 3, 1),
       (10, 0.55, 0.76, 205, 0.82, -4.9, b'1', 'Serenity', 0.07, 127.8, 0.78, 4, 4);

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

INSERT INTO playlist (id, created_at, description, is_public, member_id, name, updated_at)
VALUES (1, '2024-10-29 00:00:00.000000', 'Quisque ut erat. Curabitur gravida nisi at nibh.', b'1',
        1, 'Persistent', '2024-07-19 00:00:00.000000'),
       (2, '2024-06-15 00:00:00.000000', 'Morbi a ipsum. Integer a nibh.', b'1', 1,
        'internet solution', '2024-02-21 00:00:00.000000'),
       (3, '2024-10-17 00:00:00.000000',
        'Aenean fermentum. Donec ut mauris eget massa tempor convallis.', b'1', 1, 'orchestration',
        '2024-01-19 00:00:00.000000'),
       (4, '2024-06-08 00:00:00.000000',
        'Suspendisse potenti. Cras in purus eu magna vulputate luctus.', b'1', 1, 'initiative',
        '2023-11-10 00:00:00.000000'),
       (5, '2024-09-26 00:00:00.000000',
        'Nulla tempus. Vivamus in felis eu sapien cursus vestibulum.', b'1', 1, 'Reactive',
        '2024-07-28 00:00:00.000000');

INSERT INTO like_music (member_id, music_id)
VALUES (3, 1),
       (7, 2),
       (1, 3),
       (14, 3),
       (8, 4),
       (10, 5),
       (6, 6),
       (2, 7),
       (12, 8),
       (3, 9),
       (4, 10);

INSERT INTO playlist_like (id, created_at, member_id, playlist_id)
VALUES (1, '2024-11-02 00:00:00.000000', 15, 1),
       (2, '2023-12-14 00:00:00.000000', 21, 2),
       (3, '2024-10-21 00:00:00.000000', 1, 3),
       (4, '2023-11-15 00:00:00.000000', 16, 4),
       (5, '2023-11-24 00:00:00.000000', 29, 5);

/*!40103 SET TIME_ZONE = IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE = IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS = IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT = @OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES = IFNULL(@OLD_SQL_NOTES, 1) */;
