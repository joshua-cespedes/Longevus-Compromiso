-- =============================================
-- SCRIPT DE PRUEBA: Condiciones Medicas y Priorizacion de Inventario
-- Ejecutar en la BD longevusdb
-- =============================================

-- 1. Condiciones Medicas (5)
INSERT INTO `condition` (name, description, severity, isActive) VALUES
('Diabetes Tipo 2', 'Enfermedad metabolica que afecta la produccion de insulina', 'Grave', 1),
('Hipertension Arterial', 'Presion arterial elevada de forma cronica', 'Grave', 1),
('Artritis', 'Inflamacion de las articulaciones, dolor cronico', 'Moderada', 1),
('Osteoporosis', 'Perdida de densidad osea, fragilidad osea', 'Moderada', 1),
('Insuficiencia Renal Cronica', 'Perdida progresiva de la funcion renal', 'Grave', 1);

-- 2. Residentes nuevos con condiciones (30 residentes activos)
-- Se insertan residentes activos que seran vinculados a condiciones
INSERT INTO resident (identification, name, birthdate, healthStatus, numberRoom, photo, isActive) VALUES
('11111111', 'Maria Fernandez', '1940-03-15', 'Regular', 1, 'photos/resident/default.png', 1),
('22222222', 'Carlos Ramirez', '1938-07-22', 'Malo', 2, 'photos/resident/default.png', 1),
('33333333', 'Ana Guillen', '1945-01-10', 'Regular', 3, 'photos/resident/default.png', 1),
('44444444', 'Jose Herrera', '1942-11-05', 'Bueno', 5, 'photos/resident/default.png', 1),
('55555555', 'Rosa Mendez', '1941-06-18', 'Regular', 6, 'photos/resident/default.png', 1),
('66666666', 'Pedro Alonso', '1939-09-25', 'Malo', 7, 'photos/resident/default.png', 1),
('77777777', 'Lucia Vargas', '1944-02-28', 'Regular', 9, 'photos/resident/default.png', 1),
('88888888', 'Fernando Torres', '1937-12-03', 'Malo', 11, 'photos/resident/default.png', 1),
('99999999', 'Carmen Rojas', '1943-08-14', 'Bueno', 13, 'photos/resident/default.png', 1),
('10101010', 'Ricardo Salazar', '1940-04-07', 'Regular', 14, 'photos/resident/default.png', 1),
('11110011', 'Teresa Campos', '1936-10-20', 'Malo', 15, 'photos/resident/default.png', 1),
('12121212', 'Manuel Duran', '1941-05-12', 'Bueno', 16, 'photos/resident/default.png', 1),
('13131313', 'Gloria Flores', '1944-07-30', 'Regular', 1, 'photos/resident/default.png', 1),
('14141414', 'Jorge Castillo', '1938-02-14', 'Malo', 2, 'photos/resident/default.png', 1),
('15151515', 'Patricia Reyes', '1942-09-08', 'Regular', 3, 'photos/resident/default.png', 1),
('16161616', 'Roberto Luna', '1939-11-27', 'Bueno', 5, 'photos/resident/default.png', 1),
('17171717', 'Sandra Paredes', '1943-03-19', 'Regular', 6, 'photos/resident/default.png', 1),
('18181818', 'Edgar Mora', '1937-06-01', 'Malo', 7, 'photos/resident/default.png', 1),
('19191919', 'Veronica Silva', '1945-08-23', 'Bueno', 9, 'photos/resident/default.png', 1),
('20202020', 'Daniel Acuna', '1940-12-16', 'Regular', 11, 'photos/resident/default.png', 1),
('21212121', 'Laura Molina', '1938-04-09', 'Malo', 13, 'photos/resident/default.png', 1),
('22220022', 'Hugo Cordero', '1941-01-28', 'Bueno', 14, 'photos/resident/default.png', 1),
('23232323', 'Elena Quirós', '1944-10-05', 'Regular', 15, 'photos/resident/default.png', 1),
('24242424', 'Sergio Arias', '1936-07-17', 'Malo', 16, 'photos/resident/default.png', 1),
('25252525', 'Marta Chen', '1942-05-22', 'Bueno', 1, 'photos/resident/default.png', 1),
('26262626', 'Pablo Viqueira', '1939-08-11', 'Regular', 2, 'photos/resident/default.png', 1),
('27272727', 'Isabel Marín', '1943-12-25', 'Malo', 3, 'photos/resident/default.png', 1),
('28282828', 'Andrés Borge', '1940-02-03', 'Bueno', 5, 'photos/resident/default.png', 1),
('29292929', 'Claudia Bogantes', '1937-11-14', 'Regular', 6, 'photos/resident/default.png', 1),
('30303030', 'Ronaldo Calderon', '1941-09-30', 'Malo', 7, 'photos/resident/default.png', 1);

-- 3. Vincular residentes a condiciones medicas (resident_condition)
-- Diabetes Tipo 2 (conditionId=1): 12 residentes
INSERT INTO resident_condition (residentId, conditionId, diagnosedDate, notes, isActive) VALUES
((SELECT id FROM resident WHERE identification='11111111'), 1, '2020-01-15', 'Controla con Metformina 500mg', 1),
((SELECT id FROM resident WHERE identification='22222222'), 1, '2019-06-20', 'Insulina diaria', 1),
((SELECT id FROM resident WHERE identification='55555555'), 1, '2021-03-10', 'Dieta controlada', 1),
((SELECT id FROM resident WHERE identification='88888888'), 1, '2018-11-05', 'Metformina + Dieta', 1),
((SELECT id FROM resident WHERE identification='11110011'), 1, '2020-07-22', 'Insulina NPH', 1),
((SELECT id FROM resident WHERE identification='14141414'), 1, '2019-09-14', 'Comprimidos orales', 1),
((SELECT id FROM resident WHERE identification='18181818'), 1, '2021-01-28', 'Control estricto', 1),
((SELECT id FROM resident WHERE identification='21212121'), 1, '2020-04-09', 'Metformina 850mg', 1),
((SELECT id FROM resident WHERE identification='24242424'), 1, '2018-12-16', 'Insulina + dieta', 1),
((SELECT id FROM resident WHERE identification='27272727'), 1, '2019-05-22', 'Metformina', 1),
((SELECT id FROM resident WHERE identification='29292929'), 1, '2021-06-11', 'Pastillas', 1),
((SELECT id FROM resident WHERE identification='30303030'), 1, '2020-09-30', 'Insulina NPH', 1);

-- Hipertension Arterial (conditionId=2): 10 residentes
INSERT INTO resident_condition (residentId, conditionId, diagnosedDate, notes, isActive) VALUES
((SELECT id FROM resident WHERE identification='33333333'), 2, '2018-03-10', 'Losartan 50mg diario', 1),
((SELECT id FROM resident WHERE identification='66666666'), 2, '2017-07-25', 'Enalapril 20mg', 1),
((SELECT id FROM resident WHERE identification='77777777'), 2, '2019-11-08', 'Amlodipino 5mg', 1),
((SELECT id FROM resident WHERE identification='10101010'), 2, '2020-01-20', 'Irbesartan', 1),
((SELECT id FROM resident WHERE identification='12121212'), 2, '2018-06-15', 'Hidroclorotiazida', 1),
((SELECT id FROM resident WHERE identification='15151515'), 2, '2019-09-27', 'Losartan + Amlodipino', 1),
((SELECT id FROM resident WHERE identification='17171717'), 2, '2020-03-19', 'Enalapril 10mg', 1),
((SELECT id FROM resident WHERE identification='20202020'), 2, '2018-10-16', 'Control con pastillas', 1),
((SELECT id FROM resident WHERE identification='23232323'), 2, '2019-12-05', 'Irbesartan 150mg', 1),
((SELECT id FROM resident WHERE identification='26262626'), 2, '2020-08-11', 'Amlodipino 10mg', 1);

-- Artritis (conditionId=3): 8 residentes
INSERT INTO resident_condition (residentId, conditionId, diagnosedDate, notes, isActive) VALUES
((SELECT id FROM resident WHERE identification='44444444'), 3, '2019-05-18', 'Ibuprofeno 600mg', 1),
((SELECT id FROM resident WHERE identification='99999999'), 3, '2020-02-14', 'Paracetamol + Fisioterapia', 1),
((SELECT id FROM resident WHERE identification='13131313'), 3, '2018-08-30', 'Naproxeno 500mg', 1),
((SELECT id FROM resident WHERE identification='16161616'), 3, '2019-11-27', 'Diclofenaco topico', 1),
((SELECT id FROM resident WHERE identification='19191919'), 3, '2020-06-23', 'Meloxicam 15mg', 1),
((SELECT id FROM resident WHERE identification='22220022'), 3, '2018-04-09', 'Ibuprofeno gel', 1),
((SELECT id FROM resident WHERE identification='25252525'), 3, '2019-10-22', 'Paracetamol 1g', 1),
((SELECT id FROM resident WHERE identification='28282828'), 3, '2020-12-03', 'Celecoxib 200mg', 1);

-- Osteoporosis (conditionId=4): 6 residentes
INSERT INTO resident_condition (residentId, conditionId, diagnosedDate, notes, isActive) VALUES
((SELECT id FROM resident WHERE identification='11111111'), 4, '2020-06-15', 'Calcio + Vitamina D', 1),
((SELECT id FROM resident WHERE identification='55555555'), 4, '2019-03-10', 'Alendronato semanal', 1),
((SELECT id FROM resident WHERE identification='11110011'), 4, '2018-07-22', 'Bifosfonatos', 1),
((SELECT id FROM resident WHERE identification='15151515'), 4, '2020-09-27', 'Calcio 1000mg diario', 1),
((SELECT id FROM resident WHERE identification='21212121'), 4, '2019-01-09', 'Vitamina D3', 1),
((SELECT id FROM resident WHERE identification='27272727'), 4, '2020-05-25', 'Alendronato + Calcio', 1);

-- Insuficiencia Renal (conditionId=5): 5 residentes
INSERT INTO resident_condition (residentId, conditionId, diagnosedDate, notes, isActive) VALUES
((SELECT id FROM resident WHERE identification='88888888'), 5, '2017-12-03', 'Fase 3, dieta baja en proteinas', 1),
((SELECT id FROM resident WHERE identification='18181818'), 5, '2018-06-01', 'Fase 2, control renal', 1),
((SELECT id FROM resident WHERE identification='24242424'), 5, '2019-07-17', 'Fase 3B', 1),
((SELECT id FROM resident WHERE identification='14141414'), 5, '2020-02-14', 'Fase 2, dieta especial', 1),
((SELECT id FROM resident WHERE identification='30303030'), 5, '2018-11-30', 'Fase 4, dialisis programada', 1);

-- 4. Productos medicamentos para las condiciones
INSERT INTO product (name, price, category, expirationDate, photoURL, unitId, supplierId, isActive) VALUES
('Metformina 500mg', 15000.00, 'Salud', '2027-12-31', 'photos/suppliers/default.png', 1, 1, 1),
('Losartan 50mg', 18000.00, 'Salud', '2027-06-30', 'photos/suppliers/default.png', 1, 1, 1),
('Ibuprofeno 600mg', 8000.00, 'Salud', '2027-09-15', 'photos/suppliers/default.png', 1, 1, 1),
('Alendronato 70mg', 25000.00, 'Salud', '2027-03-20', 'photos/suppliers/default.png', 1, 1, 1),
('Eritropoyetina 4000UI', 45000.00, 'Salud', '2026-12-31', 'photos/suppliers/default.png', 2, 1, 1),
('Insulina NPH 100UI/ml', 32000.00, 'Salud', '2026-09-30', 'photos/suppliers/default.png', 2, 1, 1),
('Amlodipino 5mg', 12000.00, 'Salud', '2027-08-15', 'photos/suppliers/default.png', 1, 1, 1),
('Paracetamol 500mg', 5000.00, 'Salud', '2027-11-30', 'photos/suppliers/default.png', 1, 1, 1),
('Enalapril 20mg', 14000.00, 'Salud', '2027-04-20', 'photos/suppliers/default.png', 1, 1, 1),
('Calcio + Vit D3', 10000.00, 'Salud', '2027-07-10', 'photos/suppliers/default.png', 1, 1, 1),
('Irbesartan 150mg', 20000.00, 'Salud', '2027-05-25', 'photos/suppliers/default.png', 1, 1, 1),
('Naproxeno 500mg', 9000.00, 'Salud', '2027-02-28', 'photos/suppliers/default.png', 1, 1, 1);

-- 5. Vincular productos a condiciones (product_condition)
-- Metformina -> Diabetes (Indicado)
INSERT INTO product_condition (productId, conditionId, relationshipType, notes, isActive) VALUES
((SELECT id FROM product WHERE name='Metformina 500mg'), 1, 'Indicado', 'Tratamiento de primera linea para DM2', 1),
((SELECT id FROM product WHERE name='Insulina NPH 100UI/ml'), 1, 'Indicado', 'Para control glucemico avanzado', 1),
((SELECT id FROM product WHERE name='Losartan 50mg'), 2, 'Indicado', 'Control de presion arterial', 1),
((SELECT id FROM product WHERE name='Amlodipino 5mg'), 2, 'Indicado', 'Bloqueador de canales de calcio', 1),
((SELECT id FROM product WHERE name='Enalapril 20mg'), 2, 'Indicado', 'IECA para hipertension', 1),
((SELECT id FROM product WHERE name='Irbesartan 150mg'), 2, 'Indicado', 'ARA II para hipertension', 1),
((SELECT id FROM product WHERE name='Ibuprofeno 600mg'), 3, 'Indicado', 'Antiinflamatorio para artritis', 1),
((SELECT id FROM product WHERE name='Naproxeno 500mg'), 3, 'Indicado', 'AINE para dolor articular', 1),
((SELECT id FROM product WHERE name='Paracetamol 500mg'), 3, 'Indicado', 'Analgesico leve', 1),
((SELECT id FROM product WHERE name='Alendronato 70mg'), 4, 'Indicado', 'Bifosfonato para osteoporosis', 1),
((SELECT id FROM product WHERE name='Calcio + Vit D3'), 4, 'Indicado', 'Suplemento oseo', 1),
((SELECT id FROM product WHERE name='Eritropoyetina 4000UI'), 5, 'Indicado', 'Estimulante de eritropoyesis', 1),
-- Contraindicaciones: Ibuprofeno es contraindicado para Insuficiencia Renal
((SELECT id FROM product WHERE name='Ibuprofeno 600mg'), 5, 'Contraindicado', 'Nefrotoxico, evitar en IR', 1),
((SELECT id FROM product WHERE name='Naproxeno 500mg'), 5, 'Contraindicado', 'AINE contraindicado en IR', 1),
-- Metformina es contraindicado para Insuficiencia Renal avanzada
((SELECT id FROM product WHERE name='Metformina 500mg'), 5, 'Contraindicado', 'Riesgo de acidosis lactica en IR', 1);

-- 6. Compras de ejemplo para generar inventario con movimiento
INSERT INTO purchase (id, date, idAdministrator, amount, isActive) VALUES
('0001-20260601', '2026-06-01', 1, 250000.00, 1),
('0002-20260605', '2026-06-05', 1, 180000.00, 1),
('0003-20260610', '2026-06-10', 1, 320000.00, 1);

-- Productos de compra 1
INSERT INTO purchase_product (idPurchase, idProduct, quantity, expirationDate) VALUES
('0001-20260601', (SELECT id FROM product WHERE name='Metformina 500mg'), 15, '2027-12-31'),
('0001-20260601', (SELECT id FROM product WHERE name='Losartan 50mg'), 12, '2027-06-30'),
('0001-20260601', (SELECT id FROM product WHERE name='Ibuprofeno 600mg'), 20, '2027-09-15');

-- Productos de compra 2
INSERT INTO purchase_product (idPurchase, idProduct, quantity, expirationDate) VALUES
('0002-20260605', (SELECT id FROM product WHERE name='Insulina NPH 100UI/ml'), 10, '2026-09-30'),
('0002-20260605', (SELECT id FROM product WHERE name='Alendronato 70mg'), 8, '2027-03-20'),
('0002-20260605', (SELECT id FROM product WHERE name='Amlodipino 5mg'), 15, '2027-08-15');

-- Productos de compra 3
INSERT INTO purchase_product (idPurchase, idProduct, quantity, expirationDate) VALUES
('0003-20260610', (SELECT id FROM product WHERE name='Calcio + Vit D3'), 18, '2027-07-10'),
('0003-20260610', (SELECT id FROM product WHERE name='Eritropoyetina 4000UI'), 6, '2026-12-31'),
('0003-20260610', (SELECT id FROM product WHERE name='Paracetamol 500mg'), 25, '2027-11-30');

-- 7. Generar movimientos de inventario (simular consumos de los ultimos 30 dias)
-- Primero obtenemos los IDs de inventario activos para hacer los movimientos
-- Se crean movimientos EXIT para simular consumo historico

INSERT INTO inventory_movement (inventoryId, productId, type, quantity, reason, performedBy, movementDate, isActive)
SELECT
    i.id,
    i.productId,
    'EXIT',
    1,
    CASE
        WHEN p.name LIKE '%Metformina%' THEN 'Consumo residente - Diabetes'
        WHEN p.name LIKE '%Losartan%' OR p.name LIKE '%Amlodipino%' OR p.name LIKE '%Enalapril%' OR p.name LIKE '%Irbesartan%' THEN 'Consumo residente - Hipertension'
        WHEN p.name LIKE '%Ibuprofeno%' OR p.name LIKE '%Naproxeno%' OR p.name LIKE '%Paracetamol%' THEN 'Consumo residente - Artritis'
        WHEN p.name LIKE '%Alendronato%' OR p.name LIKE '%Calcio%' THEN 'Consumo residente - Osteoporosis'
        WHEN p.name LIKE '%Eritropoyetina%' OR p.name LIKE '%Insulina%' THEN 'Consumo residente - Insuficiencia Renal'
        ELSE 'Consumo general'
    END,
    1,
    DATE_SUB(CURDATE(), INTERVAL FLOOR(RAND() * 30) DAY),
    1
FROM inventory i
JOIN product p ON i.productId = p.id
WHERE i.isActive = 1
  AND p.category = 'Salud'
  AND RAND() < 0.6;

-- =============================================
-- RESUMEN DE DATOS INSERTADOS
-- =============================================
-- 5 condiciones medicas
-- 30 residentes nuevos activos
-- 38 vinculos residente-condicion
-- 12 productos medicos
-- 15 vinculos producto-condicion (12 indicados + 3 contraindicados)
-- 3 compras con 9 productos
-- Movimientos de inventario simulados (60% del inventario activo)
-- =============================================
