-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 26-03-2026 a las 02:38:43
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `movil`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `alumnos_mov`
--

CREATE TABLE `alumnos_mov` (
  `matricula` varchar(10) NOT NULL,
  `aPaterno` varchar(50) NOT NULL,
  `aMaterno` varchar(50) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `sexo` varchar(1) NOT NULL,
  `dCalle` varchar(50) NOT NULL,
  `dNumero` int(11) NOT NULL,
  `dColonia` varchar(50) NOT NULL,
  `dCodigoPostal` int(11) NOT NULL,
  `aTelefono` varchar(12) NOT NULL,
  `aCorreo` varchar(100) NOT NULL,
  `aFacebook` varchar(50) NOT NULL,
  `aInstagram` varchar(50) NOT NULL,
  `tipoSangre` varchar(3) NOT NULL,
  `nombreContacto` varchar(50) NOT NULL,
  `telefonoContacto` varchar(12) NOT NULL,
  `contrasenha` varchar(128) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Proyecto';

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `alumnos_mov`
--
ALTER TABLE `alumnos_mov`
  ADD PRIMARY KEY (`matricula`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
