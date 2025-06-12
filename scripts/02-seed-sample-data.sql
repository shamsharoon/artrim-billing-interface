-- Insert sample clients
INSERT INTO clients (id, name, email, phone, address) VALUES
('11111111-1111-1111-1111-111111111111', 'Cameron Avenue Project', 'cameron@example.com', '(416) 555-1234', '44 Cameron Ave, North York, ON M2N 1E1'),
('22222222-2222-2222-2222-222222222222', 'Parr Place Project', 'parr@example.com', '(416) 555-5678', '125 Parr Pl, Vaughan, ON L4J 8L1'),
('33333333-3333-3333-3333-333333333333', 'Glass Drive Project', 'glass@example.com', '(416) 555-9012', '57 Glass Dr, Aurora, ON L4G 2E7');

-- Insert sample invoices
INSERT INTO invoices (
    id, client_id, project_name, project_number, invoice_number, 
    date, payment_condition, note, subtotal, discount, 
    tax_rate, tax_amount, total
) VALUES
(
    '44444444-4444-4444-4444-444444444444',
    '11111111-1111-1111-1111-111111111111',
    '44 Cameron Ave, North York, ON M2N 1E1',
    'JOB#346-2517',
    '1747',
    '2024-05-29',
    'According to the percentage of jobs completed',
    'Material not included! Labor only.',
    12600.00,
    0.00,
    13.00,
    1638.00,
    14238.00
),
(
    '55555555-5555-5555-5555-555555555555',
    '22222222-2222-2222-2222-222222222222',
    '125 Parr Pl, Vaughan, ON L4J 8L1',
    'JOB#346-2516',
    '1746',
    '2024-05-25',
    'According to the percentage of jobs completed',
    'Material not included! Labor only.',
    55770.00,
    0.00,
    13.00,
    7250.10,
    63020.10
),
(
    '66666666-6666-6666-6666-666666666666',
    '33333333-3333-3333-3333-333333333333',
    '57 Glass Dr, Aurora, ON L4G 2E7',
    'JOB#346-2518',
    '1748',
    '2024-06-09',
    'According to the percentage of jobs completed',
    'Material not included! Labor only.',
    25720.00,
    1000.00,
    13.00,
    3213.60,
    27933.60
);

-- Insert invoice items for Cameron Avenue (Invoice 1747)
INSERT INTO invoice_items (invoice_id, description, quantity, unit_price, line_total) VALUES
('44444444-4444-4444-4444-444444444444', 'Installation of 18 interior doors with casing, lockset and 4x4 regular hinges', 1, 5000.00, 5000.00),
('44444444-4444-4444-4444-444444444444', 'Installation of casing 16 windows', 1, 1250.00, 1250.00),
('44444444-4444-4444-4444-444444444444', 'Installation of all baseboard and shoe moulds', 1, 6350.00, 6350.00);

-- Insert invoice items for Parr Place (Invoice 1746)
INSERT INTO invoice_items (invoice_id, description, quantity, unit_price, line_total) VALUES
('55555555-5555-5555-5555-555555555555', 'Installation of 49 interior doors with casing backbend and lockset', 1, 17150.00, 17150.00),
('55555555-5555-5555-5555-555555555555', 'Installation of casing and backbend for 31 windows', 1, 3720.00, 3720.00),
('55555555-5555-5555-5555-555555555555', 'Build and installation of 11 arch opening at second floor', 1, 8800.00, 8800.00),
('55555555-5555-5555-5555-555555555555', 'Installation of 2 pocket door with casing, backbend and lockset', 1, 1400.00, 1400.00),
('55555555-5555-5555-5555-555555555555', 'Installation of casing, backend and window extension for family room window', 1, 850.00, 850.00);

-- Insert invoice items for Glass Drive (Invoice 1748)
INSERT INTO invoice_items (invoice_id, description, quantity, unit_price, line_total) VALUES
('66666666-6666-6666-6666-666666666666', 'Installation of 28 interior doors with casing, backend and lockset', 1, 8400.00, 8400.00),
('66666666-6666-6666-6666-666666666666', 'Installation of casing backbend for 22 windows', 1, 1800.00, 1800.00),
('66666666-6666-6666-6666-666666666666', 'Installation of baseboard and shoe mould for main floor', 1, 1850.00, 1850.00),
('66666666-6666-6666-6666-666666666666', 'Installation of baseboard and shoe mould for second floor', 1, 2850.00, 2850.00),
('66666666-6666-6666-6666-666666666666', 'Installation of baseboard and shoe mould for basement', 1, 2350.00, 2350.00);
