-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 12-06-2025 a las 20:09:04
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
-- Base de datos: `longevusdb`
--
CREATE DATABASE IF NOT EXISTS `longevusdb` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `longevusdb`;

DELIMITER $$
--
-- Procedimientos
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `addResident` (IN `p_identification` VARCHAR(50), IN `p_name` VARCHAR(100), IN `p_birthdate` DATE, IN `p_healthStatus` VARCHAR(100), IN `p_numberRoom` INT, IN `p_photo` VARCHAR(255))   BEGIN
	INSERT INTO resident (
        identification,
        name,
        birthdate,
        healthStatus,
        numberRoom,
        photo,
        isActive
    ) VALUES (
        p_identification,
        p_name,
        p_birthdate,
        p_healthStatus,
        p_numberRoom,
        p_photo,
        TRUE
    );
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `addResidentContact` (IN `p_name` VARCHAR(100), IN `p_phoneNumber` VARCHAR(20), IN `p_relationShip` VARCHAR(50), IN `p_idResident` INT)   BEGIN
	INSERT INTO residentContact (
        name,
        phoneNumber,
        relationShip,
        idResident
    ) VALUES (
        p_name,
        p_phoneNumber,
        p_relationShip,
        p_idResident
    );
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `deleteContact` (IN `p_id` INT)   BEGIN
	DELETE FROM residentContact
    WHERE id = p_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `deleteResident` (IN `p_id` INT)   BEGIN
	UPDATE resident
    SET isActive = FALSE
    WHERE id = p_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `delete_inventory_logically_by_id` (IN `inventoryId` INT)   BEGIN
    UPDATE inventory
    SET isActive = 0
    WHERE id = inventoryId;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `delete_product` (IN `p_id` INT)   BEGIN
    UPDATE product
    SET isActive = 0
    WHERE id = p_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `delete_purchase_by_id` (IN `p_purchase_id` VARCHAR(20))   BEGIN
    UPDATE purchase
    SET isActive = 0
    WHERE id = p_purchase_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `delete_purchase_products` (IN `p_idPurchase` VARCHAR(20))   BEGIN
     DELETE FROM purchase_product
    WHERE idPurchase = p_idPurchase;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getContacts` (IN `p_idResident` INT)   BEGIN
	SELECT 
        id,
        name,
        phoneNumber,
        relationShip,
        idResident
    FROM residentContact
    WHERE idResident = p_idResident;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getResidentById` (IN `p_id` INT)   BEGIN
	SELECT 
        id,
        identification,
        name,
        TIMESTAMPDIFF(YEAR, birthdate, CURDATE()) AS age,
        healthStatus,
        numberRoom,
        photo,
        isActive,
        birthdate
    FROM resident
    WHERE id = p_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getResidentByNameOrIdentification` (IN `p_value` VARCHAR(50))   BEGIN
	SELECT id, identification, name, birthdate, 
    TIMESTAMPDIFF(YEAR, birthdate, CURDATE()) AS age,
    healthStatus, numberRoom, photo
    FROM resident
    WHERE LOWER(name) LIKE CONCAT('%', LOWER(p_value), '%')
	OR identification LIKE CONCAT('%', p_value, '%');
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getResidents` ()   BEGIN

    SELECT

        id,

        identification,

        name,

        TIMESTAMPDIFF(YEAR, birthdate, CURDATE())  AS age,

        healthStatus,

        numberRoom,

        photo,

        birthdate

    FROM resident

    WHERE isActive = TRUE;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `get_all_inventory` ()   BEGIN
    SELECT 
        i.id AS inventory_id,
        i.quantity,
        i.category,
        i.photo AS photo_url,
        i.isActive,

        p.id AS product_id,
        p.name AS product_name,
        p.expirationDate AS expiration_date, -- ✅ alias correcto

        s.id AS supplier_id,
        s.name AS supplier_name,

        pu.id AS purchase_id,
        pu.date AS purchase_date

    FROM inventory i
    LEFT JOIN product p ON i.productId = p.id
    LEFT JOIN supplier s ON p.supplierId = s.id
    LEFT JOIN purchase pu ON i.purchaseId = pu.id
    WHERE i.isActive = 1;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `get_all_inventory_full` ()   BEGIN
    SELECT 
        i.id AS inventory_id,
        i.quantity AS total_quantity,
        i.category,
        i.photo AS photo_url,

        p.id AS product_id,
        p.name AS product_name,
        p.expirationDate AS expiration_date,

        s.id AS supplier_id,
        s.name AS supplier_name,

        pu.id AS purchase_id

    FROM 
        inventory i
    JOIN product p ON i.productId = p.id
    JOIN supplier s ON p.supplierId = s.id
    JOIN purchase pu ON i.purchaseId = pu.id
    WHERE 
        pu.isActive = 1;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `get_all_products` ()   BEGIN
    SELECT 
        p.id, p.name,p.price, p.category, p.expirationDate,
        p.photoURL,
        p.unitId,       
        p.supplierId AS supplier_id,
        u.unit_type,
        s.name AS supplier_name,
        s.phoneNumber,
        s.email,
        s.address,
        s.photo AS supplier_photo
    FROM 
        product p
    JOIN unit u ON p.unitId = u.id
    JOIN supplier s ON p.supplierId = s.id
    WHERE 
        p.isActive = 1;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `get_all_purchases` ()   BEGIN
    SELECT 
        pu.id AS purchase_id,              -- ✅ Corrección aquí
        pu.date AS purchase_date,          -- (asumo que es `date`, cámbialo si el nombre es otro)
        pu.amount AS purchase_amount,      -- (asumo que es `amount`)
        pp.idProduct,
        p.name AS product_name,
        pp.quantity,
        p.price AS product_price,
        pp.expirationDate  
    FROM 
        purchase pu
    JOIN purchase_product pp ON pu.id = pp.idPurchase   -- ✅ También aquí
    JOIN product p ON pp.idProduct = p.id
    WHERE pu.isActive = 1;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `get_inventory_by_expiration` (IN `exp_date` DATE)   BEGIN
    SELECT 
        i.id AS inventory_id,
        i.quantity,
        i.category,
        i.photo AS photo_url,
        i.isActive,

        p.id AS product_id,
        p.name AS product_name,
        p.supplierId AS supplier_id, -- ¡IMPORTANTE!
        
        s.name AS supplier_name,     -- ¡IMPORTANTE!
        
        IFNULL(pp.expirationDate, NULL) AS expiration_date,

        pu.id AS purchase_id,
        pu.date AS purchase_date,
        pu.amount
    FROM inventory i
    LEFT JOIN product p ON i.productId = p.id
    LEFT JOIN supplier s ON p.supplierId = s.id  -- ← JOIN necesario
    LEFT JOIN purchase pu ON i.purchaseId = pu.id
    LEFT JOIN purchase_product pp ON pp.idPurchase = pu.id AND pp.idProduct = p.id
    WHERE i.isActive = 1 AND pp.expirationDate = exp_date;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `get_inventory_by_product_unit` ()   BEGIN
    SELECT 
        i.id AS inventory_id,
        i.category,
        i.photo AS photo_url,
        i.quantity,
        
        p.id AS product_id,
        p.name AS product_name,
        pp.expirationDate AS expiration_date,
        
        s.id AS supplier_id,
        s.name AS supplier_name,
        
        pu.id AS purchase_id

 FROM 
        purchase_product pp
    JOIN product p ON pp.idProduct = p.id
    JOIN purchase pu ON pp.idPurchase = pu.id
    JOIN supplier s ON p.supplierId = s.id
    JOIN inventory i ON p.id = i.productId AND pu.id = i.purchaseId
    WHERE pu.isActive = 1;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `get_inventory_by_unit` ()   BEGIN
    SELECT 
        i.id AS inventory_id,
        i.category,
        i.photo AS photo_url,

        p.id AS product_id,
        p.name AS product_name,
        p.expirationDate AS expiration_date,

        s.id AS supplier_id,
        s.name AS supplier_name,

        pu.id AS purchase_id

    FROM 
        inventory i
    JOIN product p ON i.productId = p.id
    JOIN supplier s ON p.supplierId = s.id
    JOIN purchase pu ON i.purchaseId = pu.id
    JOIN (
        -- Esta subconsulta "descompone" por unidad usando RECURSIVE
        SELECT 
            ip.inventory_id,
            ip.product_id,
            ip.purchase_id
        FROM (
            SELECT 
                i.id AS inventory_id,
                i.productId AS product_id,
                i.purchaseId AS purchase_id,
                i.quantity
            FROM inventory i
            JOIN purchase pu ON i.purchaseId = pu.id
            WHERE pu.isActive = 1
        ) AS inv
        JOIN (
            SELECT a.n
            FROM (
                SELECT 1 AS n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL 
                SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL 
                SELECT 9 UNION ALL SELECT 10
            ) a
        ) AS nums
        ON nums.n <= inv.quantity
    ) AS unit_list
    ON i.id = unit_list.inventory_id
    WHERE pu.isActive = 1;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `get_inventory_units` ()   BEGIN
    -- CTE para generar números del 1 al 100 (puedes ampliar según tus cantidades máximas)
    WITH RECURSIVE numbers AS (
        SELECT 1 AS n
        UNION ALL
        SELECT n + 1 FROM numbers WHERE n < 100
    )

    SELECT 
        p.id AS product_id,
        p.name AS product_name,
        p.photo AS photo_url,
        s.name AS supplier_name,
        pp.expirationDate,
        pu.id AS purchase_id
    FROM purchase_product pp
    JOIN product p ON pp.idProduct = p.id
    JOIN supplier s ON p.supplierId = s.id
    JOIN purchase pu ON pp.idPurchase = pu.id
    JOIN numbers n ON n.n <= pp.quantity
    WHERE pu.isActive = 1
    ORDER BY pp.idPurchase, p.name;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `get_product_by_id` (IN `p_id` INT)   BEGIN
    SELECT 
        id,
        name,
        price,
        expirationDate,
        category,
        photoURL AS photo
    FROM 
        product
    WHERE id = p_id AND isActive = 1;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `get_purchase_with_details_by_id` (IN `p_purchase_id` VARCHAR(20))   BEGIN
    SELECT 
        p.id AS purchase_id,
        p.date AS purchase_date,
        p.amount AS purchase_amount,
        pr.id AS idProduct,
        pr.name AS product_name,
        pr.price AS product_price,
        pp.quantity
    FROM 
        purchase p
    INNER JOIN purchase_product pp ON p.id = pp.idPurchase
    INNER JOIN product pr ON pp.idProduct = pr.id
    WHERE 
        p.id = p_purchase_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `insert_inventory` (IN `p_product_id` INT, IN `p_category` VARCHAR(50), IN `p_photo` VARCHAR(255), IN `p_quantity` INT, IN `p_purchase_id` VARCHAR(36))   BEGIN
    INSERT INTO inventory (
        quantity,
        category,
        photo,
        productId,
        purchaseId,
        isActive
    )
    VALUES (
        p_quantity,
        p_category,
        p_photo,
        p_product_id,
        p_purchase_id,
        1
    );
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `insert_product` (IN `p_name` VARCHAR(100), IN `p_price` DECIMAL(10,2), IN `p_expiration` DATE, IN `p_category` VARCHAR(50), IN `p_photoURL` VARCHAR(255), IN `p_unit_id` INT, IN `p_supplier_id` INT)   BEGIN
    INSERT INTO product (
        name, price, expirationDate, category, photoURL,
        unit_id, supplier_id, isActive
    )
    VALUES (
        p_name, p_price, p_expiration, p_category, p_photoURL,
        p_unit_id, p_supplier_id, 1
    );
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `insert_purchase` (IN `p_date` DATE, IN `p_amount` DECIMAL(10,2), IN `p_admin_id` INT)   BEGIN
    DECLARE v_count INT;
    DECLARE v_id VARCHAR(20);
    DECLARE v_date_str VARCHAR(8);

    SET v_date_str = DATE_FORMAT(p_date, '%Y%m%d');

    -- Corregir uso de columna `date` en vez de `purchase_date`
    SELECT COUNT(*) + 1 INTO v_count
    FROM purchase
    WHERE DATE(`date`) = p_date;

    -- Generar ID como '0001-YYYYMMDD'
    SET v_id = CONCAT(LPAD(v_count, 4, '0'), '-', v_date_str);

    -- Corregir nombres de columnas
    INSERT INTO purchase (`id`, `date`, `amount`, `idAdministrator`, `isActive`)
    VALUES (v_id, p_date, p_amount, p_admin_id, 1);

    SELECT v_id AS new_purchase_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `insert_purchase_product` (IN `p_idPurchase` VARCHAR(20), IN `p_idProduct` INT, IN `p_quantity` INT, IN `p_expiration_date` DATE)   BEGIN
    INSERT INTO purchase_product (idPurchase, idProduct, quantity, expirationDate)
    VALUES (p_idPurchase, p_idProduct, p_quantity, p_expiration_date);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spAddAdmin` (`identification` NVARCHAR(20), `name` VARCHAR(100), `salary` DECIMAL(10,2), `email` VARCHAR(100), `password` NVARCHAR(100), `officeContact` VARCHAR(100), `photoUrl` NVARCHAR(255), `scheduleID` INT)   BEGIN

INSERT INTO administrator (identification,name ,salary,email,password ,officeContact, photoUrl ,scheduleID )
VALUES (identification,name ,salary,email,password ,officeContact, photoUrl ,scheduleID );
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spAddCaregiver` (IN `identification` NVARCHAR(20), IN `name` VARCHAR(100), IN `salary` DECIMAL(10,2), IN `email` VARCHAR(100), IN `password` NVARCHAR(100), IN `shift` VARCHAR(50), `photoUrl` NVARCHAR(255), `scheduleID` INT)   BEGIN
INSERT INTO caregiver 	(name,identification, salary,email,password,shift,photoUrl,scheduleID)
VALUES (name,identification, salary,email,password,shift,photoUrl,scheduleID);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spAddSchedule` (IN `days` VARCHAR(20), IN `entryTime1` VARCHAR(20), IN `exitTime1` VARCHAR(20), IN `entryTime2` VARCHAR(20), IN `exitTime2` VARCHAR(20))   BEGIN
	INSERT INTO schedule (days,entryTime1,exitTime1,entryTime2,exitTime2)
    VALUES(days,entryTime1,exitTime1,entryTime2,exitTime2);
    
     SELECT LAST_INSERT_ID() AS scheduleId;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spAddTask` (`caregiverId` INT, `description` TEXT)   BEGIN
	INSERT INTO task (caregiverId, description)
    VALUES (caregiverId, description);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spAdminLogicalDelete` (IN `idA` INT)   BEGIN 

	UPDATE administrator SET isActive = 0 WHERE id=idA;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spCaregiverLogicalDelete` (IN `idC` INT)   BEGIN 

	UPDATE caregiver SET isActive = 0 WHERE id = idC;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spDeleteAdmin` (IN `id` INT)   BEGIN

	DELETE FROM administrator WHERE id=idA;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spDeleteCaregiver` (IN `idC` INT)   BEGIN
	DELETE FROM caregiver WHERE id=idC; 
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spDeleteSchedule` (IN `idS` INT)   BEGIN 

	DELETE FROM schedule WHERE id=idS;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spDeleteTask` (IN `idTask` INT)   BEGIN
	DELETE FROM task WHERE id=idTask;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spGetAdmin` (IN `idA` INT)   BEGIN
SELECT id, identification,name ,salary,email,password ,
        officeContact, photoUrl,scheduleID, isActive
FROM administrator WHERE id=idA;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spGetAdminByEmail` (IN `emailA` VARCHAR(100))   BEGIN
SELECT id, identification,name ,salary,email,password ,
        officeContact, photoUrl,scheduleID, isActive
FROM administrator WHERE email=emailA;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spGetAdminById` (IN `idA` INT)   BEGIN

SELECT identification, name ,salary,email,password,
officeContact, photoUrl ,scheduleID FROM administrator
WHERE id=IdA;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spGetCaregiver` ()   SELECT id, identification, name, salary, email, password, shift,  photoUrl, isActive, scheduleID 
FROM caregiver$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spGetCaregiverById` (IN `idC` INT)   BEGIN 

SELECT id, identification, name, salary, email, password, shift,  photoUrl,isActive, scheduleID 
FROM caregiver WHERE id=idC;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spGetCaregiverTask` (IN `idC` INT)   BEGIN
    SELECT id, caregiverId, description 
    FROM task 
    WHERE caregiverId = idC
    ORDER BY id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spGetScheduleById` (IN `idS` INT)   BEGIN

SELECT days, entryTime1, exitTime1, 
entryTime2, exitTime2, isActive 
FROM schedule WHERE id = IdS;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spGetTask` ()   BEGIN
	SELECT id, caregiverId, description FROM TASK;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spGetTaskById` (IN `idTask` INT)   BEGIN
	SELECT id, caregiverId, description FROM task WHERE ID=idTask;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spUpdateAdmin` (IN `idA` INT, IN `identificationA` VARCHAR(20), IN `nameA` VARCHAR(100), IN `salaryA` DECIMAL(10,2), IN `emailA` VARCHAR(100), IN `officeContactA` VARCHAR(100), IN `photoUrlA` VARCHAR(255), IN `scheduleIDA` INT)   BEGIN
   
    UPDATE administrator
    SET
        identification = identificationA,
        name = nameA,
        salary = salaryA,
        email = emailA,
        officeContact = officeContactA,
        photoUrl = photoUrlA,
        scheduleID = scheduleIDA
    WHERE
        id = idA;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spUpdateCaregiver` (IN `IdC` INT, IN `nameC` VARCHAR(100), IN `identificationC` VARCHAR(20), IN `salaryC` DECIMAL(10,2), IN `emailC` VARCHAR(100), IN `shiftC` VARCHAR(50), IN `photoUrlC` VARCHAR(255), IN `scheduleIdC` INT)   BEGIN
UPDATE caregiver SET name = nameC, identification = identificationC, 
salary = salaryC,  email = emailC, 
shift = shiftC, photoUrl = photoUrlC,scheduleID = scheduleIdC WHERE id = IdC;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spUpdateSchedule` (IN `idS` INT, IN `daysS` VARCHAR(20), IN `entryTime1S` VARCHAR(20), IN `exitTime1S` VARCHAR(20), IN `entryTime2S` VARCHAR(20), IN `exitTime2S` VARCHAR(20))   BEGIN 

UPDATE schedule SET days = daysS, entryTime1=entryTime1S, 
exitTime1 = exitTime1S, entryTime2 = entryTime2S, exitTime2 = exitTime2S
WHERE id = idS;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spUpdateTask` (IN `idTask` INT, IN `descriptionTask` TEXT)   BEGIN
	UPDATE task SET description = descriptionTask WHERE id=idTask;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_add_supplier` (IN `name` VARCHAR(100), IN `phoneNumber` VARCHAR(50), IN `email` VARCHAR(100), IN `address` VARCHAR(300), IN `photo` TEXT, IN `isActive` BOOLEAN)   BEGIN



	INSERT INTO supplier (name, phoneNumber, email, address, photo, isActive) 

    VALUES (name, phoneNumber, email, address, photo, isActive);



END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_delete_supplier` (IN `s_id` INT)   BEGIN


	UPDATE `longevusdb`.`supplier` SET `isActive` = '0' WHERE `longevusdb`.`supplier`.id=s_id;



END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_all_suppliers` ()   BEGIN

SELECT 
        id, name, phoneNumber, email, address, photo, isActive FROM supplier;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_supplier_by_id` (IN `s_id` INT)   BEGIN



	SELECT id, name, phoneNumber, email, address, photo, isActive 

    FROM supplier 

	WHERE supplier.id = s_id;

    

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_update_supplier` (IN `s_id` INT, IN `name` VARCHAR(100), IN `phoneNumber` VARCHAR(50), IN `email` VARCHAR(100), IN `address` VARCHAR(300), IN `photo` TEXT, IN `isActive` BOOLEAN)   BEGIN

	UPDATE supplier SET name = name, phoneNumber = phoneNumber,

        email = email, address = address, photo = photo, isActive = isActive

    WHERE id = s_id;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `updateContact` (IN `p_id` INT, IN `p_name` VARCHAR(100), IN `p_phoneNumber` VARCHAR(20), IN `p_relationShip` VARCHAR(50))   BEGIN
	UPDATE residentContact
    SET 
        name = p_name,
        phoneNumber = p_phoneNumber,
        relationShip = p_relationShip
    WHERE id = p_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `updateResident` (IN `p_id` INT, IN `p_identification` VARCHAR(50), IN `p_name` VARCHAR(100), IN `p_birthdate` DATE, IN `p_healthStatus` VARCHAR(100), IN `p_numberRoom` INT, IN `p_photo` VARCHAR(255))   BEGIN
	UPDATE resident
    SET
        identification = p_identification,
        name = p_name,
        birthdate = p_birthdate,
        healthStatus = p_healthStatus,
        numberRoom = p_numberRoom,
        photo = p_photo
    WHERE id = p_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `update_inventory` (IN `p_inventory_id` INT, IN `p_quantity` INT, IN `p_category` VARCHAR(50), IN `p_photo` VARCHAR(255))   BEGIN
    UPDATE inventory
    SET quantity = p_quantity,
        category = p_category,
        photo = p_photo
    WHERE inventory_id = p_inventory_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `update_inventory_by_id` (IN `p_inventory_id` INT, IN `p_quantity` INT, IN `p_category` VARCHAR(100))   BEGIN
    UPDATE inventory
    SET 
        quantity = p_quantity,
        category = p_category
    WHERE 
        inventory_id = p_inventory_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `update_product` (IN `p_id` INT, IN `p_name` VARCHAR(100), IN `p_price` DECIMAL(10,2), IN `p_expiration` DATE, IN `p_category` VARCHAR(50), IN `p_photoURL` VARCHAR(255), IN `p_unit_id` INT, IN `p_supplier_id` INT)   BEGIN
    UPDATE product
    SET 
        name = p_name,
        price = p_price,
        expirationDate = p_expiration,
        category = p_category,
        photoURL = p_photoURL,
        unit_id = p_unit_id,
        supplier_id = p_supplier_id
    WHERE id = p_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `update_purchase` (IN `p_purchase_id` VARCHAR(20), IN `p_date` DATE, IN `p_amount` DECIMAL(10,2))   BEGIN
    UPDATE purchase
    SET 
        `date` = p_date,
        amount = p_amount
    WHERE 
        id = p_purchase_id;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `activity`
--

CREATE TABLE IF NOT EXISTS `activity` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `date` varchar(20) DEFAULT NULL,
  `startTime` time DEFAULT NULL,
  `endTime` time DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT NULL,
  `idResponsible` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idResponsible` (`idResponsible`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `activity`
--

INSERT INTO `activity` (`id`, `name`, `description`, `type`, `date`, `startTime`, `endTime`, `location`, `status`, `isActive`, `idResponsible`) VALUES
(1, 'Taller de dibujo', 'Dibujar libre para estimulación cognitiva', 'recreativa', '2025-06-21', '14:00:00', '16:00:00', 'Sala creativa', 'pendiente', 1, 8),
(2, 'Taller de pintura', 'Pintar libre para estimulación cognitiva', 'recreativa', '2025-06-21', '14:00:00', '16:00:00', 'Sala creativa', 'pendiente', 0, 10),
(3, 'Taller de baile', 'Bailar libre para estimulación cognitiva', 'recreativa', '2025-07-21', '14:00:00', '16:00:00', 'Sala creativa', 'pendiente', 1, 10),
(4, 'Zumba', 'prueba', 'Física', '2025-06-15', '11:00:00', '11:30:00', 'area', 'Pendiente', 1, 10),
(5, 'Bingo', 'bingo con premioso', 'Social', '2025-06-09', '13:00:00', '15:00:00', 'area este', 'En progreso', 1, 10),
(6, 'Crucigramas', 'crucigrama con premios', 'Social', '2025-06-09', '10:00:00', '12:00:00', 'area sur', 'En progreso', 0, 10),
(7, 'Crucigramas', 'crucigrama con premios', 'Social', '2025-06-09', '14:00:00', '16:00:00', 'area sur', 'Finalizada', 1, 11),
(8, ' ', 'bingo con premios', 'Física', '2025-06-12', '11:30:00', '13:30:00', 'area sur', 'Pendiente', 0, 9),
(9, 'a', 'a', 'Física', '1111-11-12', '11:11:00', '11:12:00', 'area sur', 'Pendiente', 1, 8),
(10, 'Bingo', 'bingo con premios', 'Recreativa', '2025-06-12', '11:11:00', '11:11:00', 'area sur', 'En progreso', 1, 11),
(11, 'Bingo', 'bingo con premios', 'Recreativa', '2025-06-12', '11:00:00', '11:30:00', 'area sur', 'En progreso', 1, 8),
(12, 'Ana López', 'bingo con premios', 'Recreativa', '2025-06-12', '12:22:00', '12:22:00', 'area sur', 'Pendiente', 0, 11),
(13, 'Bingo', 'bingo con premios', 'Recreativa', '2025-06-09', '10:10:00', '10:10:00', 'area sur', 'Pendiente', 1, 10),
(14, 'Pintar', 'pintar', 'Educativa', '2025-06-11', '19:00:00', '21:00:00', 'area sur', 'Pendiente', 1, 9),
(15, 'Bingo', 'bingo con premios', 'Recreativa', '2025-06-11', '07:00:00', '07:30:00', 'area sur', 'Pendiente', 1, 8),
(16, 'Bingo', 'bingo con premios', 'Recreativa', '2025-06-15', '12:00:00', '14:00:00', 'area sur', 'En progreso', 1, 10),
(17, 'Ana López', 'bingo con premios', 'Recreativa', '2025-06-05', '11:00:00', '12:00:00', 'area sur', 'En progreso', 1, 8),
(18, 'Ana López', 'bingo con premios', 'Recreativa', '2025-06-10', '12:00:00', '13:00:00', 'area sur', 'En progreso', 0, 9),
(19, 'Ana López', 'bingo con premios', 'Física', '2025-05-27', '13:00:00', '15:00:00', 'area sur', 'Pendiente', 1, 9),
(20, 'Entrega proyecto', 'Proyecto lenguajes', 'Educativa', '2025-06-12', '13:00:00', '13:30:00', 'UCR', 'Pendiente', 1, 11),
(21, 'Dormir', 'Siesta porque me desvele', 'Médica', '2025-06-12', '15:00:00', '17:00:00', 'Mi casa', 'Pendiente', 1, 17);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `administrator`
--

CREATE TABLE IF NOT EXISTS `administrator` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `identification` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `salary` double DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `officeContact` varchar(255) DEFAULT NULL,
  `photoUrl` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT 1,
  `scheduleID` int(11) DEFAULT NULL,
  `role_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `scheduleID` (`scheduleID`),
  KEY `role_id` (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `administrator`
--

INSERT INTO `administrator` (`id`, `identification`, `name`, `salary`, `email`, `password`, `officeContact`, `photoUrl`, `isActive`, `scheduleID`, `role_id`) VALUES
(1, '703040588', 'Gabriel Moya', 700000, 'gabrielmoya488@gmail.com', '$2a$10$IrDWkxOzNkhItVgtWQvcpeLgEJquNR1rW9dJq47liaZ4cLr3TPtT', '27567756', 'photos/admin/1747728456729_JoJoGabs.png', 1, 16, 1),
(6, '000000000', 'Gabriel Moya', 700000, 'testAdmin@gmail.com', '$2a$10$Kl/Ek2cqkU5PVvlO6lQb7etKJ2PcQYX8h7tFzHgEknVTS3y.Kux7.', '27517890', 'photos/admin/1747728456729_JoJoGabs.png', 1, 26, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `billing`
--

CREATE TABLE IF NOT EXISTS `billing` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sequence` varchar(50) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `period` varchar(50) DEFAULT NULL,
  `paymentMethod` varchar(50) DEFAULT NULL,
  `administratorId` int(11) DEFAULT NULL,
  `residentId` int(11) DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `administratorId` (`administratorId`),
  KEY `residentId` (`residentId`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `billing`
--

INSERT INTO `billing` (`id`, `sequence`, `date`, `amount`, `period`, `paymentMethod`, `administratorId`, `residentId`, `isActive`) VALUES
(1, '0007-20250608', '2025-06-08', 170000.00, 'Ene-Feb', 'Efectivo', 1, 1, 1),
(2, '0008-20250608', '2025-06-08', 11111111.00, 'Ene-Dic', 'Transferencia', 1, 2, 1),
(3, '0009-20250608', '2025-06-08', 78787.99, 'Nov-Nov', 'Tarjeta', 1, 3, 0),
(4, '0010-20250609', '2025-06-09', 737373.00, 'Ene-Feb', 'Tarjeta', 1, 4, 1),
(5, '0011-20250609', '2025-06-09', 170000.00, 'Feb-Ago', 'Efectivo', 1, 5, 1),
(6, '0012-20250610', '2025-06-10', 120000.00, 'Sep-Mar', 'Efectivo', 1, 6, 1),
(7, '0007-20250611', '2025-06-11', 50000.00, 'Jun-Jul', 'Efectivo', 1, 3, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `caregiver`
--

CREATE TABLE IF NOT EXISTS `caregiver` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `identification` varchar(255) DEFAULT NULL,
  `salary` double DEFAULT NULL,
  `photoUrl` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `shift` varchar(255) DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT 1,
  `scheduleID` int(11) DEFAULT NULL,
  `role_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `scheduleID` (`scheduleID`),
  KEY `role_id` (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `caregiver`
--

INSERT INTO `caregiver` (`id`, `name`, `identification`, `salary`, `photoUrl`, `email`, `password`, `shift`, `isActive`, `scheduleID`, `role_id`) VALUES
(8, 'Krystal Gonzalez Alvarez', '603040566', 12000, 'photos/caregiver/1747768534215_enfermera.png', 'krysgonza@hotmail.com', '1234Krys', 'M', 0, 14, 2),
(9, 'Gabriel Moya', '703040588', 50000, 'photos/caregiver/1747781119528_tiopelon.png', 'gabrielmoya@gmail.com', '1234Todo*', 'M,T', 0, 15, 2),
(10, 'Joshua Cespedes', '201100376', 200000, 'photos/caregiver/1747769525598_deadpool heart.gif', 'josh.cespedez@gmail.com', '12345Josh', 'T,N', 0, 17, 2),
(11, 'Adan Carranza ', '506070899', 400000, 'photos/caregiver/1747770054658_Admin.png', 'adan.carranza@gmail.com', 'Adan.Carranza1234', 'M,N', 0, 18, 2),
(12, 'Angel Dior', '702970336', 350000, 'photos/caregiver/1747770434707_Creeper.png', 'angel.dior@hotmail.com', 'angeldior', 'N,T', 0, 19, 2),
(13, 'Paz', '703210088', 5000000, NULL, 'tio.pelon.arroz@gmail.com', NULL, 'T,N', 0, 20, 2),
(14, 'sfds', '213213113', 5000000, 'photos/caregiver/1748732931848_IMG-20241006-WA0029[1].jpg', 'tio.pelon.arroz@gmail.com', NULL, 'M', 0, 21, 2),
(16, 'An Forger', '703040588', 600000, 'photos/caregiver/1749680759819_scott.jpg', 'gabrielmoya488@gmail.com', '$2a$10$IoQTQDRWrCiul0sz6kyhtO.b7gA3jSr8pKY7i5S5Mg4DFr/v6hQW2', 'M,T', 0, 24, 2),
(17, 'An Forger', '70700707', 600000, 'photos/caregiver/1749443369454_TikiTask.png', 'gabriel.moyacaravaca@gmail.com', '$2a$10$E8QIcp5O24uudyj1az190OE5P4m48IZJM1p/iNEp5J0oCfZRLGg8G', 'M', 1, 25, 2),
(18, 'Maximo Decimo', '203040567', 249999, 'photos/caregiver/1749744837737_Empleado.png', 'maximominimo@gmail.com', '$2a$10$5E9Dknvt0qUTbZxb5x99Leh9hvgpOgn61T0kWRjIC8twWhmhXzKFW', 'M', 1, 27, 2),
(19, 'Ronaldo Nazario ', '304550687', 300000, 'photos/caregiver/1749745264566_ronaldo.jpg', 'naza@gmail.com', '$2a$10$tf/fVNGvzNENxjzbnn.ucuJf58YGN1z3rwSuiE1Kl5rK1Ps6vFv5a', 'M,T', 1, 28, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inventory`
--

CREATE TABLE IF NOT EXISTS `inventory` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `quantity` int(11) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `photo` text DEFAULT NULL,
  `productId` int(11) DEFAULT NULL,
  `purchaseId` varchar(20) DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `productId` (`productId`),
  KEY `purchaseId` (`purchaseId`)
) ENGINE=InnoDB AUTO_INCREMENT=69 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `inventory`
--

INSERT INTO `inventory` (`id`, `quantity`, `category`, `photo`, `productId`, `purchaseId`, `isActive`) VALUES
(1, 1, 'Alimento', 'default.png', 1, '0001-20250520', 0),
(2, 1, 'Alimento', 'default.png', 1, '0001-20250520', 0),
(3, 1, 'Alimento', 'default.png', 2, '0001-20250520', 0),
(4, 1, 'Alimento', 'default.png', 1, '0001-20250519', 0),
(5, 1, 'Alimento', 'default.png', 1, '0001-20250519', 0),
(6, 1, 'Limpieza', 'default.png', 1, '0001-20250519', 0),
(7, 1, 'Limpieza', 'default.png', 1, '0001-20250519', 0),
(8, 1, 'Limpieza', 'default.png', 1, '0001-20250519', 0),
(9, 1, 'Otros', 'default.png', 3, '0001-20250518', 0),
(10, 1, 'Otros', 'default.png', 3, '0001-20250518', 0),
(11, 1, 'Otros', 'default.png', 3, '0001-20250518', 0),
(12, 1, 'Otros', 'default.png', 5, '0002-20250520', 0),
(13, 1, 'Otros', 'default.png', 5, '0002-20250520', 0),
(14, 1, 'Otros', 'default.png', 4, '0002-20250520', 0),
(15, 1, 'Salud', 'default.png', 4, '0002-20250520', 0),
(16, 1, 'Salud', 'default.png', 4, '0002-20250520', 0),
(17, 1, 'Salud', 'default.png', 4, '0002-20250520', 0),
(18, 1, 'Salud', 'default.png', 4, '0003-20250520', 0),
(19, 1, 'Salud', 'default.png', 4, '0003-20250520', 0),
(20, 1, 'Alimento', 'default.png', 1, '0003-20250520', 0),
(21, 1, 'Alimento', 'default.png', 1, '0003-20250520', 0),
(22, 1, 'Alimento', 'default.png', 1, '0003-20250520', 0),
(23, 1, 'Alimento', 'photos/suppliers/1749703900069_sardimar.jpeg', 1, '0001-20250519', 0),
(24, 1, 'Alimento', 'photos/suppliers/1749703900069_sardimar.jpeg', 1, '0001-20250519', 0),
(25, 1, 'Alimento', 'photos/suppliers/1749703900069_sardimar.jpeg', 1, '0001-20250519', 0),
(26, 1, 'Alimento', 'photos/suppliers/1749703900069_sardimar.jpeg', 1, '0001-20250519', 0),
(27, 1, 'Alimento', 'photos/suppliers/1749703900069_sardimar.jpeg', 1, '0001-20250519', 0),
(28, 1, 'Alimento', 'photos/suppliers/1749703900069_sardimar.jpeg', 1, '0001-20250519', 0),
(29, 1, 'Limpieza', 'photo.png', 4, '0006-20250611', 0),
(30, 1, 'Limpieza', 'photo.png', 4, '0006-20250611', 0),
(31, 1, 'Limpieza', 'photo.png', 4, '0006-20250611', 0),
(32, 1, 'Alimento', 'photos/suppliers/1749703900069_sardimar.jpeg', 1, '0007-20250611', 0),
(33, 1, 'Alimento', 'photos/suppliers/1749703900069_sardimar.jpeg', 1, '0007-20250611', 0),
(34, 1, 'Alimento', 'photos/suppliers/1749703900069_sardimar.jpeg', 1, '0007-20250611', 0),
(35, 1, 'Alimento', 'photos/suppliers/1749703900069_sardimar.jpeg', 1, '0007-20250611', 0),
(36, 1, 'Alimento', 'photos/suppliers/1749729131992_candymaiz.jpg', NULL, '0008-20250612', 0),
(37, 1, 'Alimento', 'photos/suppliers/1749729131992_candymaiz.jpg', NULL, '0008-20250612', 0),
(38, 1, 'Alimento', 'photos/suppliers/1749729131992_candymaiz.jpg', NULL, '0008-20250612', 0),
(39, 1, 'Alimento', 'photos/suppliers/1749729131992_candymaiz.jpg', NULL, '0008-20250612', 0),
(40, 1, 'Alimento', 'photos/suppliers/1749729131992_candymaiz.jpg', NULL, '0008-20250612', 0),
(41, 1, 'Alimento', 'photos/suppliers/1749729131992_candymaiz.jpg', NULL, '0008-20250612', 0),
(42, 1, 'Alimento', 'photos/suppliers/1749729131992_candymaiz.jpg', NULL, '0008-20250612', 0),
(43, 1, 'Alimento', 'photos/suppliers/1749729131992_candymaiz.jpg', NULL, '0008-20250612', 0),
(44, 1, 'Alimento', 'photos/suppliers/1749729131992_candymaiz.jpg', NULL, '0008-20250612', 0),
(45, 1, 'Alimento', 'photos/suppliers/1749729131992_candymaiz.jpg', NULL, '0008-20250612', 0),
(46, 1, 'Limpieza', 'photos/suppliers/1749729054272_scott.jpg', NULL, '0008-20250612', 0),
(47, 1, 'Limpieza', 'photos/suppliers/1749729054272_scott.jpg', NULL, '0008-20250612', 0),
(48, 1, 'Limpieza', 'photos/suppliers/1749729054272_scott.jpg', NULL, '0008-20250612', 0),
(49, 1, 'Limpieza', 'photos/suppliers/1749729054272_scott.jpg', NULL, '0008-20250612', 0),
(50, 1, 'Limpieza', 'photos/suppliers/1749729054272_scott.jpg', NULL, '0008-20250612', 0),
(51, 1, 'Limpieza', 'photos/suppliers/1749729054272_scott.jpg', NULL, '0008-20250612', 0),
(52, 1, 'Limpieza', 'photos/suppliers/1749729054272_scott.jpg', NULL, '0008-20250612', 0),
(53, 1, 'Limpieza', 'photos/suppliers/1749729054272_scott.jpg', NULL, '0008-20250612', 0),
(54, 1, 'Alimento', 'photos/suppliers/1749729131992_candymaiz.jpg', NULL, '0008-20250612', 0),
(55, 1, 'Alimento', 'photos/suppliers/1749729131992_candymaiz.jpg', NULL, '0008-20250612', 0),
(56, 1, 'Alimento', 'photos/suppliers/1749729131992_candymaiz.jpg', NULL, '0008-20250612', 0),
(57, 1, 'Alimento', 'photos/suppliers/1749729131992_candymaiz.jpg', NULL, '0008-20250612', 0),
(58, 1, 'Alimento', 'photos/suppliers/1749729131992_candymaiz.jpg', NULL, '0008-20250612', 0),
(59, 1, 'Alimento', 'photos/suppliers/1749729131992_candymaiz.jpg', NULL, '0008-20250612', 0),
(60, 1, 'Alimento', 'photos/suppliers/1749729131992_candymaiz.jpg', NULL, '0009-20250612', 0),
(61, 1, 'Alimento', 'photos/suppliers/1749729131992_candymaiz.jpg', NULL, '0009-20250612', 0),
(62, 1, 'Alimento', 'photos/suppliers/1749729131992_candymaiz.jpg', NULL, '0009-20250612', 0),
(63, 1, 'Alimento', 'photos/suppliers/1749729131992_candymaiz.jpg', NULL, '0009-20250612', 0),
(64, 1, 'Limpieza', 'photos/suppliers/1749729054272_scott.jpg', NULL, '0010-20250612', 0),
(65, 1, 'Limpieza', 'photos/suppliers/1749729054272_scott.jpg', NULL, '0010-20250612', 0),
(66, 1, 'Alimento', 'photos/suppliers/1749729131992_candymaiz.jpg', 9, '0011-20250612', 1),
(67, 1, 'Alimento', 'photos/suppliers/1749729131992_candymaiz.jpg', 9, '0011-20250612', 1),
(68, 1, 'Alimento', 'photos/suppliers/1749729131992_candymaiz.jpg', 9, '0011-20250612', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `product`
--

CREATE TABLE IF NOT EXISTS `product` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `category` varchar(30) DEFAULT NULL,
  `expirationDate` date DEFAULT NULL,
  `photoURL` varchar(200) DEFAULT NULL,
  `unitId` int(11) DEFAULT NULL,
  `supplierId` int(11) DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `unitId` (`unitId`),
  KEY `supplierId` (`supplierId`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `product`
--

INSERT INTO `product` (`id`, `name`, `price`, `category`, `expirationDate`, `photoURL`, `unitId`, `supplierId`, `isActive`) VALUES
(1, 'atun ', 500.00, 'Alimento', '2026-05-20', 'photos/suppliers/1749703900069_sardimar.jpeg', 1, 2, 0),
(2, 'atun vegetal', 700.00, 'Alimento', '2026-05-20', 'photos/suppliers/1749703900069_sardimar.jpeg', 1, 2, 0),
(3, 'Aloe', 1000.00, 'Alimento', '2026-05-13', 'photo.png', 4, 1, 1),
(4, 'papel de baño', 1600.00, 'Limpieza', '2027-05-27', 'photos/suppliers/1749729054272_scott.jpg', 1, 3, 1),
(5, 'Shampoo', 2000.00, 'Limpieza', '2028-05-31', 'photo.png', 2, 5, 1),
(6, 'arroz', 3300.00, 'Alimento', '2028-07-21', 'photo.png', 3, 4, 1),
(7, 'frijoles', 1500.00, 'Alimento', '2027-05-11', 'photo.png', 3, 4, 1),
(8, 'Queso ', 50000.00, 'Alimento', '2025-06-14', 'photos/suppliers/1749708248976_Logo frontal.png', 1, 6, 0),
(9, 'Candy maiz', 500.00, 'Alimento', '2027-11-20', 'photos/suppliers/1749729131992_candymaiz.jpg', 1, 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `purchase`
--

CREATE TABLE IF NOT EXISTS `purchase` (
  `id` varchar(20) NOT NULL,
  `date` date DEFAULT NULL,
  `idAdministrator` int(11) DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idAdministrator` (`idAdministrator`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `purchase`
--

INSERT INTO `purchase` (`id`, `date`, `idAdministrator`, `amount`, `isActive`) VALUES
('0001-20250518', '2025-05-18', 1, 3000.00, 0),
('0001-20250519', '2025-05-19', 1, 3000.00, 1),
('0001-20250520', '2025-05-20', 1, 2400.00, 1),
('0002-20250520', '2025-05-20', 1, 12400.00, 1),
('0003-20250520', '2025-05-20', 1, 5200.00, 0),
('0006-20250611', '2025-06-11', 1, 4800.00, 0),
('0007-20250611', '2025-06-11', 1, 2000.00, 1),
('0008-20250612', '2025-06-12', 1, 11000.00, 1),
('0009-20250612', '2025-06-12', 1, 2000.00, 1),
('0010-20250612', '2025-06-12', 1, 3200.00, 1),
('0011-20250612', '2025-06-12', 1, 1500.00, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `purchase_product`
--

CREATE TABLE IF NOT EXISTS `purchase_product` (
  `idPurchase` varchar(20) NOT NULL,
  `idProduct` int(11) NOT NULL,
  `quantity` int(11) DEFAULT NULL,
  `expirationDate` date DEFAULT NULL,
  PRIMARY KEY (`idPurchase`,`idProduct`),
  KEY `idProduct` (`idProduct`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `purchase_product`
--

INSERT INTO `purchase_product` (`idPurchase`, `idProduct`, `quantity`, `expirationDate`) VALUES
('0001-20250518', 3, 3, '2026-07-20'),
('0001-20250519', 1, 6, '2027-11-18'),
('0001-20250520', 1, 2, '2026-07-22'),
('0001-20250520', 2, 2, '2025-05-25'),
('0002-20250520', 4, 4, '2027-11-30'),
('0002-20250520', 5, 3, '2028-11-20'),
('0003-20250520', 1, 4, '2026-11-30'),
('0003-20250520', 4, 2, '2028-02-29'),
('0006-20250611', 4, 3, '2025-06-20'),
('0007-20250611', 1, 4, '2025-06-13'),
('0008-20250612', 4, 5, '2034-06-12'),
('0008-20250612', 9, 6, '2030-06-13'),
('0009-20250612', 9, 4, '2022-06-15'),
('0010-20250612', 4, 2, '2049-06-09'),
('0011-20250612', 9, 3, '2025-06-20');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `resident`
--

CREATE TABLE IF NOT EXISTS `resident` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `identification` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `name` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `birthdate` date DEFAULT NULL,
  `healthStatus` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `numberRoom` int(11) DEFAULT NULL,
  `photo` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `numberRoom` (`numberRoom`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `resident`
--

INSERT INTO `resident` (`id`, `identification`, `name`, `birthdate`, `healthStatus`, `numberRoom`, `photo`, `isActive`) VALUES
(1, '704030679', 'Pamblo actuv2', '1993-06-06', 'Regular', 4, 'photos/resident/1749093760200_scott.jpg', 0),
(2, '703040588', 'Andrew Moya', '1942-04-20', 'Regular', 2, 'photos/resident/1747726904961_JoJoGabs.png', 1),
(3, '703090468', 'Britany Villalobos', '1964-07-20', 'Bueno', 3, 'photos/resident/1747768808053_adulta-mayor.png', 1),
(4, '603560999', 'Carlos Orozco', '1960-11-03', 'Malo', 2, 'photos/resident/1747768912021_adulto-mayor.png', 1),
(5, '116930789', 'Arelys Caravaca', '1958-09-09', 'Bueno', 4, 'photos/resident/1747769049559_adulta-mayor.png', 1),
(6, '503220045', 'Andrew joestar', '1944-11-30', 'Regular', 15, 'photos/resident/1747769171922_adulto-mayor.png', 1),
(7, 'ID12345', 'JOSHUA CALET CESPEDES GOMEZ', '2004-11-14', 'Regular', 7, 'photos/resident/1749318200726_adulto-mayor.png', 0),
(8, 'ID12345', 'Joshua', '2004-11-14', '', 2, 'photos/resident/1749318967313_adulto-mayor.png', 0),
(9, '12345', 'Joshua', '2004-11-14', 'Bueno', 2, 'photos/resident/1749319768513_adulto-mayor.png', 1),
(10, '1111111111111', 'Anto', '2023-11-29', 'Bueno', 4, 'photos/resident/1749320068120_adulta-mayor.png', 0),
(11, '5234234', 'María Gomez', '1979-08-05', 'Bueno', 4, 'photos/resident/1749321342487_adulta-mayor.png', 1),
(12, '5234234', 'Antonellita', '2023-11-29', 'Bueno', 5, 'photos/resident/1749609729666_adulta-mayor.png', 0),
(13, 'jasd', 'Antonella', '2025-06-24', 'Regular', 7, 'photos/resident/1749625831670_adulta-mayor.png', 0),
(14, 'weqr', 'Ana López', '1939-06-12', 'Malo', 5, 'photos/resident/1749626042544_adulta-mayor.png', 0),
(15, '6-1111-1111', 'Ana López', '1944-11-11', 'Malo', 1, 'photos/resident/1749626503353_adulta-mayor.png', 0),
(16, '1-1111-1111', 'Cristhian Céspedes', '1981-11-12', 'Bueno', 3, 'foto.jpg', 0),
(17, '1-1111-1111', 'Cristhian Céspedes', '1981-11-11', 'Bueno', 4, 'photos/resident/1749627854404_adulto-mayor.png', 0),
(18, '7-1111-1111', 's', '2025-06-06', 'Bueno', 1, 'photos/resident/1749627987404_adulto-mayor.png', 0),
(19, '1-1111-1111', 'Ana López', '2025-06-12', 'Bueno', 1, 'foto.jpg', 0),
(20, '1-1111-1111', 'Ana López', '1111-11-11', 'Regular', 1, 'foto.jpg', 0),
(21, '1-1111-1111', 'Ana López', '1111-11-11', 'Malo', 1, 'photos/resident/1749630547410_adulta-mayor.png', 0),
(22, '887766443', 'Karla Sandoval', '1994-12-12', 'Bueno', 1, 'photos/resident/1749664105243_adulta-mayor.png', 0),
(23, '4387644455', 'maria', '2025-06-19', 'Bueno', 5, 'photos/resident/1749673684322_adulta-mayor.png', 0),
(24, '877876877', 'Ana López', '2025-06-05', 'Bueno', 4, 'photos/resident/1749674347171_adulta-mayor.png', 0),
(29, '4563456456', 'Ana López', '2025-06-11', 'Malo', 1, 'photos/resident/1749681277324_adulta-mayor.png', 1),
(30, '702122223', 'Ana López', '2025-06-10', 'Bueno', 1, 'photos/resident/1749681253670_adulta-mayor.png', 0),
(31, '11111111111', 'Pamblo', '1934-06-12', 'Bueno', 6, 'photos/resident/1749713985011_scott.jpg', 1),
(32, '11111111111', 'Juancho', '1912-07-12', 'Regular', 16, 'photos/resident/1749722734377_WhatsApp Image 2025-05-31 at 13.15.07.jpeg', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `residentcontact`
--

CREATE TABLE IF NOT EXISTS `residentcontact` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `phoneNumber` varchar(20) DEFAULT NULL,
  `relationship` varchar(15) DEFAULT NULL,
  `idResident` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idResident` (`idResident`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `residentcontact`
--

INSERT INTO `residentcontact` (`id`, `name`, `phoneNumber`, `relationship`, `idResident`) VALUES
(1, 'Toño', '88888888', 'Nieto', 1),
(3, 'Maria ', '78654433', 'Hija', 1),
(4, 'Isabella', '65433321', 'Hija', 3),
(5, 'Frank', '888888888', 'Nieto', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `resident_activity`
--

CREATE TABLE IF NOT EXISTS `resident_activity` (
  `activity_id` int(11) NOT NULL,
  `resident_id` int(11) NOT NULL,
  PRIMARY KEY (`activity_id`,`resident_id`),
  KEY `resident_id` (`resident_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `resident_activity`
--

INSERT INTO `resident_activity` (`activity_id`, `resident_id`) VALUES
(1, 4),
(1, 9),
(1, 11),
(4, 2),
(4, 3),
(4, 4),
(4, 9),
(4, 11),
(4, 15),
(4, 29),
(5, 21),
(7, 2),
(7, 3),
(7, 4),
(7, 6),
(7, 9),
(7, 11),
(10, 3),
(21, 2),
(21, 3),
(21, 9),
(21, 31);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE IF NOT EXISTS `roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id`, `name`, `description`, `is_active`) VALUES
(1, 'Admin', 'Acceso total', 1),
(2, 'Cuidador', 'Acceso parcial', 1),
(3, 'QUESO', 'COME QUESO', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `role_module_permissions`
--

CREATE TABLE IF NOT EXISTS `role_module_permissions` (
  `role_id` int(11) NOT NULL,
  `module` varchar(255) NOT NULL,
  `canCreate` tinyint(1) NOT NULL,
  `canDelete` tinyint(1) NOT NULL,
  `canUpdate` tinyint(1) NOT NULL,
  `canView` tinyint(1) NOT NULL,
  PRIMARY KEY (`role_id`,`module`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `role_module_permissions`
--

INSERT INTO `role_module_permissions` (`role_id`, `module`, `canCreate`, `canDelete`, `canUpdate`, `canView`) VALUES
(1, 'Actividades', 1, 1, 1, 1),
(1, 'Administradores', 1, 1, 1, 1),
(1, 'Compras', 1, 1, 1, 1),
(1, 'Contactos', 1, 1, 1, 1),
(1, 'Cuidadores', 1, 1, 1, 1),
(1, 'Facturas', 1, 1, 1, 1),
(1, 'Habitaciones', 1, 1, 1, 1),
(1, 'Horarios', 1, 1, 1, 1),
(1, 'Inventario', 1, 1, 1, 1),
(1, 'Permisos', 1, 1, 1, 1),
(1, 'Productos', 1, 1, 1, 1),
(1, 'Proveedores', 1, 1, 1, 1),
(1, 'Residentes', 1, 1, 1, 1),
(1, 'Roles', 1, 1, 1, 1),
(1, 'Tareas', 1, 1, 1, 1),
(1, 'Unidad', 1, 1, 1, 1),
(1, 'Visitas', 1, 1, 1, 1),
(2, 'Actividades', 1, 1, 1, 1),
(2, 'Administradores', 0, 0, 0, 0),
(2, 'Compras', 0, 0, 0, 0),
(2, 'Contactos', 1, 1, 1, 1),
(2, 'Cuidadores', 0, 0, 0, 0),
(2, 'Facturas', 0, 0, 0, 1),
(2, 'Habitaciones', 1, 1, 1, 1),
(2, 'Horarios', 0, 0, 0, 0),
(2, 'Inventario', 1, 1, 1, 1),
(2, 'Permisos', 0, 0, 0, 0),
(2, 'Productos', 0, 0, 0, 0),
(2, 'Proveedores', 0, 0, 0, 0),
(2, 'Residentes', 1, 1, 1, 1),
(2, 'Roles', 0, 0, 0, 0),
(2, 'Tareas', 1, 1, 1, 1),
(2, 'Unidad', 1, 1, 1, 1),
(2, 'Visitas', 1, 1, 1, 1),
(3, 'Actividades', 0, 0, 0, 0),
(3, 'Administradores', 0, 0, 0, 0),
(3, 'Compras', 0, 0, 0, 0),
(3, 'Contactos', 0, 0, 0, 0),
(3, 'Cuidadores', 0, 0, 0, 0),
(3, 'Facturas', 0, 0, 0, 0),
(3, 'Habitaciones', 0, 0, 0, 0),
(3, 'Horarios', 0, 0, 0, 0),
(3, 'Inventario', 0, 0, 0, 0),
(3, 'Permisos', 0, 0, 0, 0),
(3, 'Productos', 0, 0, 0, 0),
(3, 'Proveedores', 0, 0, 0, 0),
(3, 'Residentes', 0, 0, 0, 0),
(3, 'Roles', 0, 0, 0, 0),
(3, 'Tareas', 0, 0, 0, 0),
(3, 'Unidad', 0, 0, 0, 0),
(3, 'Visitas', 0, 0, 0, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `room`
--

CREATE TABLE IF NOT EXISTS `room` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `statusRoom` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL CHECK (`statusRoom` in ('Disponible','No disponible')),
  `roomType` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL CHECK (`roomType` in ('Individual','Grupal')),
  `bedCount` int(11) DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT NULL,
  `roomNumber` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `room`
--

INSERT INTO `room` (`id`, `statusRoom`, `roomType`, `bedCount`, `isActive`, `roomNumber`) VALUES
(1, 'Disponible', 'Individual', 1, 1, 1),
(2, 'No disponible', 'Individual', 1, 1, 2),
(3, 'Disponible', 'Grupal', 2, 1, 3),
(4, 'Disponible', 'Grupal', 3, 1, 5),
(5, 'No disponible', 'Individual', 1, 0, 4),
(6, 'Disponible', 'Individual', 1, 1, 6),
(7, 'Disponible', 'Grupal', 4, 1, 7),
(8, 'No disponible', 'Grupal', 2, 1, 8),
(9, 'Disponible', 'Individual', 1, 1, 9),
(10, 'Disponible', 'Grupal', 3, 1, 11),
(11, 'No disponible', 'Individual', 1, 1, 12),
(12, 'Disponible', 'Grupal', 2, 1, 13),
(13, 'Disponible', 'Individual', 1, 1, 14),
(14, 'No disponible', 'Grupal', 4, 1, 15),
(15, 'Disponible', 'Grupal', 2, 1, 16),
(16, 'No Disponible', 'Individual', 1, 1, 10);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `schedule`
--

CREATE TABLE IF NOT EXISTS `schedule` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `days` varchar(255) DEFAULT NULL,
  `entryTime1` varchar(255) DEFAULT NULL,
  `exitTime1` varchar(255) DEFAULT NULL,
  `entryTime2` varchar(255) DEFAULT NULL,
  `exitTime2` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `schedule`
--

INSERT INTO `schedule` (`id`, `days`, `entryTime1`, `exitTime1`, `entryTime2`, `exitTime2`) VALUES
(14, 'L,K,M,J,V', '06:00', '12:00', NULL, NULL),
(15, 'L,K,M,J', '08:00', '11:30', NULL, NULL),
(16, 'L,K,M,V,J,S', '08:00', '11:00', '14:00', '17:00'),
(17, NULL, '13:00', '20:30', NULL, NULL),
(18, 'L,K,J,M,V', '06:00', '11:00', '18:30', '22:00'),
(19, 'S,D', '12:00', '16:00', '18:00', '22:30'),
(20, 'D,S,V', '13:00', '17:00', NULL, '23:00'),
(21, 'V,S', '07:00', '11:00', NULL, NULL),
(22, 'J,V', '20:00', '23:00', NULL, NULL),
(23, 'L,K', '07:00', '11:00', '13:00', '17:00'),
(24, 'L,K', '07:00', '11:00', '13:00', '17:00'),
(25, 'K,M,V,J,L', '05:00', '11:00', NULL, NULL),
(26, 'L,K,M,J,V', '08:00', '11:00', '13:00', '15:00'),
(27, 'L,K,M', '05:00', '11:00', NULL, NULL),
(28, 'L,M,V', '08:00', '11:00', '13:00', '16:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `supplier`
--

CREATE TABLE IF NOT EXISTS `supplier` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `phoneNumber` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `address` varchar(300) DEFAULT NULL,
  `photo` text DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `supplier`
--

INSERT INTO `supplier` (`id`, `name`, `phoneNumber`, `email`, `address`, `photo`, `isActive`) VALUES
(1, 'SULI', '63255534', 'suli.enterprise@gmail.com', 'San Pedro, San Jose', 'photos/suppliers/1749728841701_TikiTask.png', 1),
(2, 'Sardimar', '81867940', 'sardimar.sardina@hotmail.com', 'Limon, Limon', 'photos/suppliers/1747727984688_sardimar.jpeg', 0),
(3, 'Scott', '76430990', 'scott.products@gmail.com', 'Heredia, Heredia', 'photos/suppliers/1747770620953_scott.jpg', 1),
(4, 'Tio Pelon', '89034567', 'tio.pelon.arroz@gmail.com', 'La rita, Guapiles', 'photos/suppliers/1747770687392_tiopelon.png', 1),
(5, 'P&G', '649946722', 'pandgcr@gamil.com', 'Santa Ana, San Jose', 'photos/suppliers/1747770880727_pandg.png', 1),
(6, 'SABEMAS', '63255534', 'SABEMAS.enterprise@gmail.com', 'Limon, Limon', 'photos/suppliers/1749708196384_ChatGPT Image 31 mar 2025, 18_20_06.png', 0),
(7, 'Helados Malavasi', '63255534', 'suli.enterprise@gmail.com', 'Limon, Limon', 'photos/suppliers/1749731384458_Helados+Malavasi+y+Los+Paleteros.png', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `task`
--

CREATE TABLE IF NOT EXISTS `task` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `caregiverId` int(11) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`,`caregiverId`),
  KEY `caregiverId` (`caregiverId`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `task`
--

INSERT INTO `task` (`id`, `caregiverId`, `description`) VALUES
(14, 8, 'Alistar pastillas y jugos'),
(16, 9, 'Lavar sabanas'),
(18, 11, 'Dar mas tiempo para la investigacion por favor'),
(19, 11, 'Alistar pastillas'),
(20, 13, 'Queso queso'),
(22, 8, 'Alistar pastillas'),
(23, 17, 'terminar proyecto'),
(25, 16, 'Queso'),
(26, 8, 'Queso'),
(27, 19, 'Almorzar');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `unit`
--

CREATE TABLE IF NOT EXISTS `unit` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `unit_type` varchar(50) DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `unit`
--

INSERT INTO `unit` (`id`, `unit_type`, `isActive`) VALUES
(1, 'g', 1),
(2, 'ml', 1),
(3, 'kg', 1),
(4, 'L', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `visit`
--

CREATE TABLE IF NOT EXISTS `visit` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `visitDate` date NOT NULL DEFAULT current_timestamp(),
  `visitHour` time NOT NULL,
  `phoneNumber` varchar(10) NOT NULL,
  `email` varchar(100) NOT NULL,
  `relationship` varchar(100) NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `residentId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `visit_ibfk_1` (`residentId`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `visit`
--

INSERT INTO `visit` (`id`, `name`, `visitDate`, `visitHour`, `phoneNumber`, `email`, `relationship`, `isActive`, `residentId`) VALUES
(1, 'Toñoño', '2025-06-06', '09:30:00', '89034567', 'tiotoño@gmail.com', 'Tata', 1, 1),
(2, 'Gabriel Moya', '2025-06-09', '11:30:00', '63255534', 'gabrielmoya488@gmail.com', 'Hermanastro', 1, 4),
(3, 'Tio Pelon', '2025-06-10', '14:30:00', '89034567', 'tio.pelon.arroz@gmail.com', 'primo', 1, 1),
(4, 'SULI edit', '2025-06-13', '11:00:00', '63255534', 'suli.enterprise@gmail.com', 'Nieto', 1, 6),
(5, 'Tio Pelon', '2025-06-11', '14:30:00', '89034567', 'tio.pelon.arroz@gmail.com', 'primo', 0, 3),
(6, 'Tio Pelon', '2025-06-12', '09:30:00', '89034567', 'tio.pelon.arroz@gmail.com', 'primo', 0, 2),
(7, 'Nairoby', '2025-06-17', '11:00:00', '87457665', 'nairoby@gmail.com', 'Loquilla', 0, 2),
(8, 'Nairoby', '2025-06-13', '15:00:00', '87457665', 'nairoby@gmail.com', 'Loquilla', 1, 1),
(9, 'Krystal Gonzalez Alvarez', '2025-06-10', '14:30:00', '87457665', 'krysgonza@hotmail.com', 'Madrina', 1, 1),
(10, 'Krystal Gonzalez Alvarez', '2025-06-14', '11:00:00', '81867940', 'krysgonza@hotmail.com', 'Amiga', 1, 4),
(11, 'Krystal Gonzalez Alvarez', '2025-06-14', '11:00:00', '81867940', 'krysgonza@hotmail.com', 'Amiga', 1, 1),
(12, 'Krystal Gonzalez Alvarez', '2025-06-20', '15:00:00', '81867940', 'krysgonza@hotmail.com', 'Amiga', 1, 4),
(13, 'Tio Pelon', '2025-06-16', '11:00:00', '87457665', 'tio.pelon.arroz@gmail.com', 'Loquilla', 1, 5),
(14, 'SABEMAS', '2025-06-19', '14:30:00', '76430990', 'SABEMAS.enterprise@gmail.com', 'Hermana', 1, 1),
(15, 'P&G', '2025-06-11', '11:00:00', '89034567', 'pandgcr@gamil.com', 'Padre', 0, 5),
(16, 'Juanito', '2025-06-24', '15:00:00', '63255534', 'suli.enterprise@gmail.com', 'Juanito', 1, 4),
(17, 'Gabriel Moya', '2025-06-15', '11:00:00', '86874567', 'gabriel.moyacaravaca@gmail.com', 'Hermano', 1, 9);

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `activity`
--
ALTER TABLE `activity`
  ADD CONSTRAINT `activity_ibfk_1` FOREIGN KEY (`idResponsible`) REFERENCES `caregiver` (`id`);

--
-- Filtros para la tabla `administrator`
--
ALTER TABLE `administrator`
  ADD CONSTRAINT `administrator_ibfk_1` FOREIGN KEY (`scheduleID`) REFERENCES `schedule` (`id`),
  ADD CONSTRAINT `administrator_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`);

--
-- Filtros para la tabla `billing`
--
ALTER TABLE `billing`
  ADD CONSTRAINT `billing_ibfk_1` FOREIGN KEY (`administratorId`) REFERENCES `administrator` (`id`),
  ADD CONSTRAINT `billing_ibfk_2` FOREIGN KEY (`residentId`) REFERENCES `resident` (`id`);

--
-- Filtros para la tabla `caregiver`
--
ALTER TABLE `caregiver`
  ADD CONSTRAINT `caregiver_ibfk_1` FOREIGN KEY (`scheduleID`) REFERENCES `schedule` (`id`),
  ADD CONSTRAINT `caregiver_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`);

--
-- Filtros para la tabla `inventory`
--
ALTER TABLE `inventory`
  ADD CONSTRAINT `inventory_ibfk_1` FOREIGN KEY (`productId`) REFERENCES `product` (`id`),
  ADD CONSTRAINT `inventory_ibfk_2` FOREIGN KEY (`purchaseId`) REFERENCES `purchase` (`id`);

--
-- Filtros para la tabla `product`
--
ALTER TABLE `product`
  ADD CONSTRAINT `product_ibfk_1` FOREIGN KEY (`unitId`) REFERENCES `unit` (`id`),
  ADD CONSTRAINT `product_ibfk_2` FOREIGN KEY (`supplierId`) REFERENCES `supplier` (`id`);

--
-- Filtros para la tabla `purchase`
--
ALTER TABLE `purchase`
  ADD CONSTRAINT `purchase_ibfk_1` FOREIGN KEY (`idAdministrator`) REFERENCES `administrator` (`id`);

--
-- Filtros para la tabla `purchase_product`
--
ALTER TABLE `purchase_product`
  ADD CONSTRAINT `purchase_product_ibfk_1` FOREIGN KEY (`idPurchase`) REFERENCES `purchase` (`id`),
  ADD CONSTRAINT `purchase_product_ibfk_2` FOREIGN KEY (`idProduct`) REFERENCES `product` (`id`);

--
-- Filtros para la tabla `resident`
--
ALTER TABLE `resident`
  ADD CONSTRAINT `resident_ibfk_1` FOREIGN KEY (`numberRoom`) REFERENCES `room` (`id`);

--
-- Filtros para la tabla `residentcontact`
--
ALTER TABLE `residentcontact`
  ADD CONSTRAINT `residentcontact_ibfk_1` FOREIGN KEY (`idResident`) REFERENCES `resident` (`id`);

--
-- Filtros para la tabla `role_module_permissions`
--
ALTER TABLE `role_module_permissions`
  ADD CONSTRAINT `role_module_permissions_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`);

--
-- Filtros para la tabla `task`
--
ALTER TABLE `task`
  ADD CONSTRAINT `task_ibfk_1` FOREIGN KEY (`caregiverId`) REFERENCES `caregiver` (`id`);

--
-- Filtros para la tabla `visit`
--
ALTER TABLE `visit`
  ADD CONSTRAINT `visit_ibfk_1` FOREIGN KEY (`residentId`) REFERENCES `resident` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
