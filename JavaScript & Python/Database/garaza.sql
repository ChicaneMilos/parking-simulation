-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 18, 2024 at 12:22 AM
-- Server version: 10.4.22-MariaDB
-- PHP Version: 8.1.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `garaza`
--

-- --------------------------------------------------------

--
-- Table structure for table `korisnik`
--

CREATE TABLE `korisnik` (
  `id` int(11) NOT NULL,
  `jmbg` int(11) NOT NULL,
  `ime` varchar(100) NOT NULL,
  `prezime` varchar(100) NOT NULL,
  `role` varchar(100) NOT NULL,
  `email` varchar(100) CHARACTER SET utf8 NOT NULL,
  `lozinka` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `korisnik`
--

INSERT INTO `korisnik` (`id`, `jmbg`, `ime`, `prezime`, `role`, `email`, `lozinka`) VALUES
(14, 214748364, 'Petar', 'Petrovic', 'Admin', 'petarpetrovic@gmail.com', 'petar'),
(15, 465115131, 'Nemanja', 'Nikolic', 'User', 'nemanjanikolic@gmail.com', 'nemanja'),
(16, 871654684, 'Nikola', 'Nikolic', 'Guest', 'nikolanikolic@gmail.com', 'nikola');

-- --------------------------------------------------------

--
-- Table structure for table `parking`
--

CREATE TABLE `parking` (
  `id` int(11) NOT NULL,
  `nivo` int(11) NOT NULL,
  `ime` varchar(100) NOT NULL,
  `br_mesta` int(11) NOT NULL,
  `br_slobodnih` int(11) NOT NULL,
  `br_zauzetih` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `parking`
--

INSERT INTO `parking` (`id`, `nivo`, `ime`, `br_mesta`, `br_slobodnih`, `br_zauzetih`) VALUES
(27, 1, 'Nivo 1', 22, 20, 2),
(28, 2, 'Nivo 2', 22, 22, 0);

-- --------------------------------------------------------

--
-- Table structure for table `vozilo`
--

CREATE TABLE `vozilo` (
  `id` int(11) NOT NULL,
  `brand` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  `license` varchar(100) NOT NULL,
  `color` varchar(100) NOT NULL,
  `time` datetime DEFAULT NULL,
  `id_korisnik` int(11) NOT NULL,
  `id_parking` int(11) NOT NULL,
  `mesto` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `vozilo`
--

INSERT INTO `vozilo` (`id`, `brand`, `model`, `license`, `color`, `time`, `id_korisnik`, `id_parking`, `mesto`) VALUES
(50, 'BMW', 'X5', 'BG-2222-NK', 'Plava', '2024-02-23 12:17:53', 14, 27, 12),
(51, 'Citroen', 'C4', 'NI-158-VA', 'Siva', '2024-02-23 12:18:40', 14, 27, 16);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `korisnik`
--
ALTER TABLE `korisnik`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `parking`
--
ALTER TABLE `parking`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `vozilo`
--
ALTER TABLE `vozilo`
  ADD PRIMARY KEY (`id`),
  ADD KEY `vozilo_korisnik` (`id_korisnik`),
  ADD KEY `vozilo_parking` (`id_parking`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `korisnik`
--
ALTER TABLE `korisnik`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `parking`
--
ALTER TABLE `parking`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `vozilo`
--
ALTER TABLE `vozilo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `vozilo`
--
ALTER TABLE `vozilo`
  ADD CONSTRAINT `vozilo_korisnik` FOREIGN KEY (`id_korisnik`) REFERENCES `korisnik` (`id`),
  ADD CONSTRAINT `vozilo_parking` FOREIGN KEY (`id_parking`) REFERENCES `parking` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
